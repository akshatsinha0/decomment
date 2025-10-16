const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('CLI Commands Integration Tests', () => {
    const cliPath = path.join(__dirname, '..', '..', 'bin', 'document.js');
    let tempDir;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-commands-test-'));
    });

    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    describe('Version Command', () => {
        test('should display version with --version flag', () => {
            const result = execSync(`node "${cliPath}" --version`, { encoding: 'utf8' });
            expect(result.trim()).toMatch(/^\d+\.\d+\.\d+$/);
        });

        test('should display version with -V flag', () => {
            const result = execSync(`node "${cliPath}" -V`, { encoding: 'utf8' });
            expect(result.trim()).toMatch(/^\d+\.\d+\.\d+$/);
        });

        test('version should match package.json', () => {
            const packageJson = require('../../package.json');
            const result = execSync(`node "${cliPath}" --version`, { encoding: 'utf8' });
            expect(result.trim()).toBe(packageJson.version);
        });
    });

    describe('Help Command', () => {
        test('should display help with --help flag', () => {
            const result = execSync(`node "${cliPath}" --help`, { encoding: 'utf8' });
            expect(result).toContain('Usage:');
            expect(result).toContain('00akshatsinha00decomment');
            expect(result).toContain('Options:');
            expect(result).toContain('-V, --version');
            expect(result).toContain('-w, --write');
            expect(result).toContain('-o, --out <dir>');
            expect(result).toContain('-h, --help');
        });

        test('should display help with -h flag', () => {
            const result = execSync(`node "${cliPath}" -h`, { encoding: 'utf8' });
            expect(result).toContain('Usage:');
            expect(result).toContain('00akshatsinha00decomment');
        });

        test('help should include argument description', () => {
            const result = execSync(`node "${cliPath}" --help`, { encoding: 'utf8' });
            expect(result).toContain('glob');
            expect(result).toContain('pattern');
        });

        test('help should include option descriptions', () => {
            const result = execSync(`node "${cliPath}" --help`, { encoding: 'utf8' });
            expect(result).toContain('overwrite files in-place');
            expect(result).toContain('write cleaned files to specified directory');
        });
    });

    describe('Write Mode (-w flag)', () => {
        test('should modify single file in-place', () => {
            const testFile = path.join(tempDir, 'test.js');
            fs.writeFileSync(testFile, '// Comment\nconsole.log("test");');

            execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(testFile, 'utf8');
            expect(content).not.toContain('// Comment');
            expect(content).toContain('console.log("test")');
        });

        test('should modify multiple files in-place', () => {
            const file1 = path.join(tempDir, 'test1.js');
            const file2 = path.join(tempDir, 'test2.js');
            fs.writeFileSync(file1, '// Comment 1\nconsole.log("test1");');
            fs.writeFileSync(file2, '// Comment 2\nconsole.log("test2");');

            execSync(`node "${cliPath}" -w "${file1}" "${file2}"`, { encoding: 'utf8' });

            const content1 = fs.readFileSync(file1, 'utf8');
            const content2 = fs.readFileSync(file2, 'utf8');
            expect(content1).not.toContain('// Comment 1');
            expect(content2).not.toContain('// Comment 2');
        });

        test.skip('should work with glob patterns', () => {
            fs.writeFileSync(path.join(tempDir, 'file1.js'), '// Comment\ncode1();');
            fs.writeFileSync(path.join(tempDir, 'file2.js'), '// Comment\ncode2();');

            execSync(`node "${cliPath}" -w "${path.join(tempDir, '*.js')}"`, { encoding: 'utf8' });

            const content1 = fs.readFileSync(path.join(tempDir, 'file1.js'), 'utf8');
            const content2 = fs.readFileSync(path.join(tempDir, 'file2.js'), 'utf8');
            expect(content1).not.toContain('// Comment');
            expect(content2).not.toContain('// Comment');
        });

        test('should preserve file permissions', () => {
            if (process.platform !== 'win32') {
                const testFile = path.join(tempDir, 'test.js');
                fs.writeFileSync(testFile, '// Comment\nconsole.log("test");');
                fs.chmodSync(testFile, 0o755);

                const statsBefore = fs.statSync(testFile);
                execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });
                const statsAfter = fs.statSync(testFile);

                expect(statsAfter.mode).toBe(statsBefore.mode);
            }
        });

        test.skip('should report success count', () => {
            fs.writeFileSync(path.join(tempDir, 'test1.js'), '// Comment\ncode();');
            fs.writeFileSync(path.join(tempDir, 'test2.js'), '// Comment\ncode();');

            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '*.js')}"`, {
                encoding: 'utf8'
            });

            expect(result).toContain('2 files processed successfully');
        });
    });

    describe('Output Directory Mode (-o flag)', () => {
        test('should create output directory if not exists', () => {
            const testFile = path.join(tempDir, 'test.js');
            const outputDir = path.join(tempDir, 'output');
            fs.writeFileSync(testFile, '// Comment\nconsole.log("test");');

            execSync(`node "${cliPath}" -o "${outputDir}" "${testFile}"`, { encoding: 'utf8' });

            expect(fs.existsSync(outputDir)).toBe(true);
            expect(fs.statSync(outputDir).isDirectory()).toBe(true);
        });

        test('should write cleaned files to output directory', () => {
            const testFile = path.join(tempDir, 'test.js');
            const outputDir = path.join(tempDir, 'output');
            fs.writeFileSync(testFile, '// Comment\nconsole.log("test");');

            execSync(`node "${cliPath}" -o "${outputDir}" "${testFile}"`, { encoding: 'utf8' });

            const outputFile = path.join(outputDir, 'test.js');
            expect(fs.existsSync(outputFile)).toBe(true);
            const content = fs.readFileSync(outputFile, 'utf8');
            expect(content).not.toContain('// Comment');
            expect(content).toContain('console.log("test")');
        });

        test('should preserve original files', () => {
            const testFile = path.join(tempDir, 'test.js');
            const outputDir = path.join(tempDir, 'output');
            const originalContent = '// Comment\nconsole.log("test");';
            fs.writeFileSync(testFile, originalContent);

            execSync(`node "${cliPath}" -o "${outputDir}" "${testFile}"`, { encoding: 'utf8' });

            const originalFileContent = fs.readFileSync(testFile, 'utf8');
            expect(originalFileContent).toBe(originalContent);
        });

        test('should handle multiple files to output directory', () => {
            const file1 = path.join(tempDir, 'test1.js');
            const file2 = path.join(tempDir, 'test2.js');
            const outputDir = path.join(tempDir, 'output');
            fs.writeFileSync(file1, '// Comment 1\ncode1();');
            fs.writeFileSync(file2, '// Comment 2\ncode2();');

            execSync(`node "${cliPath}" -o "${outputDir}" "${file1}" "${file2}"`, {
                encoding: 'utf8'
            });

            expect(fs.existsSync(path.join(outputDir, 'test1.js'))).toBe(true);
            expect(fs.existsSync(path.join(outputDir, 'test2.js'))).toBe(true);
        });

        test('should create nested output directories', () => {
            const testFile = path.join(tempDir, 'test.js');
            const outputDir = path.join(tempDir, 'output', 'nested', 'deep');
            fs.writeFileSync(testFile, '// Comment\nconsole.log("test");');

            execSync(`node "${cliPath}" -o "${outputDir}" "${testFile}"`, { encoding: 'utf8' });

            expect(fs.existsSync(outputDir)).toBe(true);
            expect(fs.existsSync(path.join(outputDir, 'test.js'))).toBe(true);
        });

        test('should overwrite existing files in output directory', () => {
            const testFile = path.join(tempDir, 'test.js');
            const outputDir = path.join(tempDir, 'output');
            fs.mkdirSync(outputDir);
            fs.writeFileSync(path.join(outputDir, 'test.js'), 'old content');
            fs.writeFileSync(testFile, '// Comment\nconsole.log("new");');

            execSync(`node "${cliPath}" -o "${outputDir}" "${testFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(path.join(outputDir, 'test.js'), 'utf8');
            expect(content).toContain('console.log("new")');
            expect(content).not.toContain('old content');
        });
    });

    describe('Preview Mode (no flags)', () => {
        test('should output to stdout without modifying file', () => {
            const testFile = path.join(tempDir, 'test.js');
            const originalContent = '// Comment\nconsole.log("test");';
            fs.writeFileSync(testFile, originalContent);

            const result = execSync(`node "${cliPath}" "${testFile}"`, { encoding: 'utf8' });

            expect(result).toContain('console.log("test")');
            expect(result).not.toContain('// Comment');

            const fileContent = fs.readFileSync(testFile, 'utf8');
            expect(fileContent).toBe(originalContent);
        });

        test('should handle multiple files in preview mode', () => {
            const file1 = path.join(tempDir, 'test1.js');
            const file2 = path.join(tempDir, 'test2.js');
            fs.writeFileSync(file1, '// Comment 1\nconsole.log("test1");');
            fs.writeFileSync(file2, '// Comment 2\nconsole.log("test2");');

            const result = execSync(`node "${cliPath}" "${file1}" "${file2}"`, {
                encoding: 'utf8'
            });

            expect(result).toContain('console.log("test1")');
            expect(result).toContain('console.log("test2")');
        });

        test('should not create any files in preview mode', () => {
            const testFile = path.join(tempDir, 'test.js');
            fs.writeFileSync(testFile, '// Comment\nconsole.log("test");');

            const filesBefore = fs.readdirSync(tempDir);
            execSync(`node "${cliPath}" "${testFile}"`, { encoding: 'utf8' });
            const filesAfter = fs.readdirSync(tempDir);

            expect(filesAfter).toEqual(filesBefore);
        });
    });

    describe.skip('Glob Pattern Support', () => {
        beforeEach(() => {
            fs.writeFileSync(path.join(tempDir, 'file1.js'), '// Comment\ncode1();');
            fs.writeFileSync(path.join(tempDir, 'file2.js'), '// Comment\ncode2();');
            fs.writeFileSync(path.join(tempDir, 'style.css'), '/* Comment */\nbody {}');
            fs.writeFileSync(path.join(tempDir, 'readme.txt'), 'text file');
        });

        test('should match all files with wildcard', () => {
            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '*')}"`, {
                encoding: 'utf8'
            });
            expect(result).toContain('Processing');
        });

        test('should match specific extension', () => {
            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '*.js')}"`, {
                encoding: 'utf8'
            });
            expect(result).toContain('2 files processed successfully');
        });

        test('should match multiple extensions', () => {
            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '*.{js,css}')}"`, {
                encoding: 'utf8',
                shell: true
            });
            expect(result).toContain('Processing');
        });

        test('should handle recursive patterns', () => {
            const subDir = path.join(tempDir, 'src');
            fs.mkdirSync(subDir);
            fs.writeFileSync(path.join(subDir, 'module.js'), '// Comment\nmodule();');

            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '**', '*.js')}"`, {
                encoding: 'utf8',
                shell: true
            });
            expect(result).toContain('Processing');
        });
    });

    describe('Multiple File Processing', () => {
        test('should process multiple individual files', () => {
            const file1 = path.join(tempDir, 'test1.js');
            const file2 = path.join(tempDir, 'test2.js');
            const file3 = path.join(tempDir, 'test3.js');
            fs.writeFileSync(file1, '// Comment\ncode1();');
            fs.writeFileSync(file2, '// Comment\ncode2();');
            fs.writeFileSync(file3, '// Comment\ncode3();');

            const result = execSync(`node "${cliPath}" -w "${file1}" "${file2}" "${file3}"`, {
                encoding: 'utf8'
            });

            expect(result).toContain('3 files processed successfully');
        });

        test('should process mixed patterns and files', () => {
            fs.writeFileSync(path.join(tempDir, 'file1.js'), '// Comment\ncode();');
            fs.writeFileSync(path.join(tempDir, 'file2.js'), '// Comment\ncode();');
            const specificFile = path.join(tempDir, 'specific.css');
            fs.writeFileSync(specificFile, '/* Comment */\nbody {}');

            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '*.js')}" "${specificFile}"`, {
                encoding: 'utf8'
            });

            expect(result).toContain('Processing');
        });

        test('should deduplicate files from overlapping patterns', () => {
            const testFile = path.join(tempDir, 'test.js');
            fs.writeFileSync(testFile, '// Comment\ncode();');

            const result = execSync(`node "${cliPath}" -w "${testFile}" "${path.join(tempDir, '*.js')}"`, {
                encoding: 'utf8'
            });

            expect(result).toContain('1 file');
        });
    });

    describe('File Type Support', () => {
        test('should process JavaScript files', () => {
            const jsFile = path.join(tempDir, 'test.js');
            fs.writeFileSync(jsFile, '// JS comment\nconsole.log("test");');

            execSync(`node "${cliPath}" -w "${jsFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(jsFile, 'utf8');
            expect(content).not.toContain('// JS comment');
        });

        test('should process CSS files', () => {
            const cssFile = path.join(tempDir, 'test.css');
            fs.writeFileSync(cssFile, '/* CSS comment */\nbody { margin: 0; }');

            execSync(`node "${cliPath}" -w "${cssFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(cssFile, 'utf8');
            expect(content).not.toContain('/* CSS comment */');
        });

        test('should process HTML files', () => {
            const htmlFile = path.join(tempDir, 'test.html');
            fs.writeFileSync(htmlFile, '<!-- HTML comment -->\n<div>Content</div>');

            execSync(`node "${cliPath}" -w "${htmlFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(htmlFile, 'utf8');
            expect(content).toContain('<div>Content</div>');
        });

        test('should process TypeScript files', () => {
            const tsFile = path.join(tempDir, 'test.ts');
            fs.writeFileSync(tsFile, '// TS comment\nconst x: number = 5;');

            execSync(`node "${cliPath}" -w "${tsFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(tsFile, 'utf8');
            expect(content).not.toContain('// TS comment');
        });

        test('should process JSON files', () => {
            const jsonFile = path.join(tempDir, 'test.json');
            fs.writeFileSync(jsonFile, '{\n  "key": "value"\n}');

            execSync(`node "${cliPath}" -w "${jsonFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(jsonFile, 'utf8');
            expect(content).toContain('"key"');
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle non-existent files gracefully', () => {
            const result = execSync(`node "${cliPath}" "${path.join(tempDir, 'nonexistent.js')}"`, {
                encoding: 'utf8'
            });
            expect(result).toContain('No files found');
        });

        test('should handle empty glob patterns', () => {
            const result = execSync(`node "${cliPath}" "${path.join(tempDir, '*.nonexistent')}"`, {
                encoding: 'utf8'
            });
            expect(result).toContain('No files found');
        });

        test('should handle files with no comments', () => {
            const testFile = path.join(tempDir, 'test.js');
            fs.writeFileSync(testFile, 'console.log("test");');

            execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(testFile, 'utf8');
            expect(content).toContain('console.log("test")');
        });

        test('should handle empty files', () => {
            const testFile = path.join(tempDir, 'empty.js');
            fs.writeFileSync(testFile, '');

            execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(testFile, 'utf8');
            expect(content).toBe('');
        });

        test('should handle files with only comments', () => {
            const testFile = path.join(tempDir, 'comments-only.js');
            fs.writeFileSync(testFile, '// Only comments\n/* More comments */');

            execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(testFile, 'utf8');
            expect(content.trim()).toBe('');
        });

        test('should handle large files', () => {
            const testFile = path.join(tempDir, 'large.js');
            let content = '';
            for (let i = 0; i < 1000; i++) {
                content += `// Comment ${i}\nconst var${i} = ${i};\n`;
            }
            fs.writeFileSync(testFile, content);

            execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });

            const result = fs.readFileSync(testFile, 'utf8');
            expect(result).not.toContain('// Comment');
            expect(result).toContain('const var999 = 999;');
        });

        test('should handle special characters in filenames', () => {
            const testFile = path.join(tempDir, 'test-file_123.js');
            fs.writeFileSync(testFile, '// Comment\ncode();');

            execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(testFile, 'utf8');
            expect(content).not.toContain('// Comment');
        });

        test('should handle UTF-8 encoded files', () => {
            const testFile = path.join(tempDir, 'utf8.js');
            fs.writeFileSync(testFile, '// Comment with emoji 🚀\nconsole.log("Hello 世界");', 'utf8');

            execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });

            const content = fs.readFileSync(testFile, 'utf8');
            expect(content).toContain('console.log("Hello 世界")');
            expect(content).not.toContain('emoji 🚀');
        });
    });

    describe('Exit Codes', () => {
        test('should exit with code 0 on successful processing', () => {
            const testFile = path.join(tempDir, 'test.js');
            fs.writeFileSync(testFile, '// Comment\ncode();');

            const result = execSync(`node "${cliPath}" "${testFile}"`, { encoding: 'utf8' });
            expect(result).toBeDefined();
        });

        test('should exit with code 0 when no files found', () => {
            const result = execSync(`node "${cliPath}" "${path.join(tempDir, '*.nonexistent')}"`, {
                encoding: 'utf8'
            });
            expect(result).toContain('No files found');
        });
    });

    describe.skip('Output Messages', () => {
        test('should display processing count', () => {
            fs.writeFileSync(path.join(tempDir, 'test1.js'), '// Comment\ncode();');
            fs.writeFileSync(path.join(tempDir, 'test2.js'), '// Comment\ncode();');

            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '*.js')}"`, {
                encoding: 'utf8'
            });

            expect(result).toContain('Processing 2 file(s)');
        });

        test('should display success message for each file', () => {
            const testFile = path.join(tempDir, 'test.js');
            fs.writeFileSync(testFile, '// Comment\ncode();');

            const result = execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });

            expect(result).toContain('Processed: test.js');
        });

        test('should display completion summary', () => {
            fs.writeFileSync(path.join(tempDir, 'test.js'), '// Comment\ncode();');

            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '*.js')}"`, {
                encoding: 'utf8'
            });

            expect(result).toContain('Completed:');
            expect(result).toContain('files processed successfully');
        });
    });
});
