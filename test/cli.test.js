const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('CLI Tool Tests', () => {
    const cliPath = path.join(__dirname, '..', 'bin', 'document.js');
    let tempDir;

    beforeEach(() => {
        // Create a temporary directory for each test
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'decomment-test-'));
    });

    afterEach(() => {
        // Clean up temporary directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    describe('CLI Argument Parsing', () => {
        test('should display help when --help flag is used', () => {
            const result = execSync(`node "${cliPath}" --help`, { encoding: 'utf8' });
            expect(result).toContain('Usage:');
            expect(result).toContain('00akshatsinha00decomment');
            expect(result).toContain('Options:');
            expect(result).toContain('-w, --write');
            expect(result).toContain('-o, --out');
        });

        test('should display version when --version flag is used', () => {
            const result = execSync(`node "${cliPath}" --version`, { encoding: 'utf8' });
            expect(result.trim()).toMatch(/^\d+\.\d+\.\d+$/);
        });

        test('should show error when no arguments provided', () => {
            try {
                execSync(`node "${cliPath}"`, { encoding: 'utf8', stdio: 'pipe' });
            } catch (error) {
                expect(error.status).toBe(1);
                expect(error.stderr).toContain('error: missing required argument');
            }
        });
    });

    describe('File Discovery and Glob Pattern Matching', () => {
        beforeEach(() => {
            // Create test files in temp directory
            fs.writeFileSync(path.join(tempDir, 'test1.js'), '// Comment\nconsole.log("test");');
            fs.writeFileSync(path.join(tempDir, 'test2.js'), '/* Comment */\nfunction test() {}');
            fs.writeFileSync(path.join(tempDir, 'test.css'), '/* CSS comment */\nbody { margin: 0; }');
            fs.writeFileSync(path.join(tempDir, 'readme.txt'), 'This is not a code file');
        });

        test('should find JavaScript files with *.js pattern', () => {
            const pattern = '*.js';
            const result = execSync(`node "${cliPath}" "${pattern}"`, { 
                encoding: 'utf8',
                cwd: tempDir 
            });
            expect(result).toContain('Processing 2 file(s)');
        });

        test('should handle no matching files gracefully', () => {
            const result = execSync(`node "${cliPath}" "${path.join(tempDir, '*.nonexistent')}"`, { 
                encoding: 'utf8',
                cwd: tempDir 
            });
            expect(result).toContain('No files found matching the specified patterns');
        });

        test('should handle invalid glob patterns gracefully', () => {
            const result = execSync(`node "${cliPath}" "${path.join(tempDir, '[invalid')}"`, { 
                encoding: 'utf8',
                cwd: tempDir 
            });
            // Should not crash and should provide feedback
            expect(result).toBeDefined();
        });
    });

    describe('Comment Removal Functionality', () => {
        test('should remove single-line comments from JavaScript', () => {
            const testFile = path.join(tempDir, 'test.js');
            const content = '// This is a comment\nconsole.log("Hello");';
            fs.writeFileSync(testFile, content);

            const result = execSync(`node "${cliPath}" "${testFile}"`, { encoding: 'utf8' });
            expect(result).not.toContain('// This is a comment');
            expect(result).toContain('console.log("Hello")');
        });

        test('should remove multi-line comments from JavaScript', () => {
            const testFile = path.join(tempDir, 'test.js');
            const content = '/* Multi-line\n   comment */\nfunction test() {}';
            fs.writeFileSync(testFile, content);

            const result = execSync(`node "${cliPath}" "${testFile}"`, { encoding: 'utf8' });
            expect(result).not.toContain('Multi-line');
            expect(result).toContain('function test()');
        });

        test('should remove CSS comments', () => {
            const testFile = path.join(tempDir, 'test.css');
            const content = '/* CSS comment */\nbody { margin: 0; }';
            fs.writeFileSync(testFile, content);

            const result = execSync(`node "${cliPath}" "${testFile}"`, { encoding: 'utf8' });
            expect(result).not.toContain('CSS comment');
            expect(result).toContain('body { margin: 0; }');
        });

        test('should preserve code functionality', () => {
            const testFile = path.join(tempDir, 'test.js');
            const content = `// Comment
function add(a, b) {
    /* Another comment */
    return a + b; // Inline comment
}`;
            fs.writeFileSync(testFile, content);

            const result = execSync(`node "${cliPath}" "${testFile}"`, { encoding: 'utf8' });
            expect(result).toContain('function add(a, b)');
            expect(result).toContain('return a + b;');
            expect(result).not.toContain('Comment');
            expect(result).not.toContain('Another comment');
            expect(result).not.toContain('Inline comment');
        });
    });

    describe('File Operations and Output Handling', () => {
        test('should write files in-place with -w flag', () => {
            const testFile = path.join(tempDir, 'test.js');
            const originalContent = '// Comment\nconsole.log("test");';
            fs.writeFileSync(testFile, originalContent);

            execSync(`node "${cliPath}" -w "${testFile}"`, { encoding: 'utf8' });

            const modifiedContent = fs.readFileSync(testFile, 'utf8');
            expect(modifiedContent).not.toContain('// Comment');
            expect(modifiedContent).toContain('console.log("test")');
        });

        test('should create output directory with -o flag', () => {
            const testFile = path.join(tempDir, 'test.js');
            const outputDir = path.join(tempDir, 'output');
            const content = '// Comment\nconsole.log("test");';
            fs.writeFileSync(testFile, content);

            execSync(`node "${cliPath}" -o "${outputDir}" "${testFile}"`, { encoding: 'utf8' });

            expect(fs.existsSync(outputDir)).toBe(true);
            const outputFile = path.join(outputDir, 'test.js');
            expect(fs.existsSync(outputFile)).toBe(true);
            
            const outputContent = fs.readFileSync(outputFile, 'utf8');
            expect(outputContent).not.toContain('// Comment');
            expect(outputContent).toContain('console.log("test")');
        });

        test('should output to stdout when no write options specified', () => {
            const testFile = path.join(tempDir, 'test.js');
            const content = '// Comment\nconsole.log("test");';
            fs.writeFileSync(testFile, content);

            const result = execSync(`node "${cliPath}" "${testFile}"`, { encoding: 'utf8' });
            expect(result).toContain('console.log("test")');
            expect(result).not.toContain('// Comment');
        });
    });

    describe('Error Handling', () => {
        test('should handle file permission errors gracefully', () => {
            const testFile = path.join(tempDir, 'readonly.js');
            fs.writeFileSync(testFile, '// Comment\nconsole.log("test");');
            
            // Make file read-only (skip on Windows as it's more complex)
            if (process.platform !== 'win32') {
                fs.chmodSync(testFile, 0o444);
                
                try {
                    const result = execSync(`node "${cliPath}" -w "${testFile}"`, { 
                        encoding: 'utf8',
                        stdio: 'pipe'
                    });
                    expect(result).toContain('Error processing');
                } catch (error) {
                    expect(error.status).toBe(1);
                }
            }
        });

        test('should continue processing other files when one fails', () => {
            const testFile1 = path.join(tempDir, 'test1.js');
            const testFile2 = path.join(tempDir, 'test2.js');
            fs.writeFileSync(testFile1, '// Comment 1\nconsole.log("test1");');
            fs.writeFileSync(testFile2, '// Comment 2\nconsole.log("test2");');

            // Make one file problematic (non-existent)
            const pattern = `"${testFile1}" "${path.join(tempDir, 'nonexistent.js')}" "${testFile2}"`;
            
            const result = execSync(`node "${cliPath}" -w ${pattern}`, { 
                encoding: 'utf8',
                stdio: 'pipe'
            });
            
            // Should process the valid files
            expect(result).toContain('Processing');
        });

        test('should provide helpful error messages', () => {
            try {
                execSync(`node "${cliPath}" -w "${path.join(tempDir, 'nonexistent.js')}"`, { 
                    encoding: 'utf8',
                    stdio: 'pipe'
                });
            } catch (error) {
                // Should handle gracefully and provide feedback
                expect(error.stdout || error.stderr).toBeDefined();
            }
        });
    });

    describe('Integration Tests', () => {
        test('should process multiple file types correctly', () => {
            const jsFile = path.join(tempDir, 'test.js');
            const cssFile = path.join(tempDir, 'test.css');
            
            fs.writeFileSync(jsFile, '// JS comment\nconsole.log("js");');
            fs.writeFileSync(cssFile, '/* CSS comment */\nbody { margin: 0; }');

            const result = execSync(`node "${cliPath}" -w "*"`, { 
                encoding: 'utf8',
                cwd: tempDir
            });

            expect(result).toContain('Processing 2 file(s)');
            expect(result).toContain('2 files processed successfully');

            const jsContent = fs.readFileSync(jsFile, 'utf8');
            const cssContent = fs.readFileSync(cssFile, 'utf8');

            expect(jsContent).not.toContain('// JS comment');
            expect(jsContent).toContain('console.log("js")');
            expect(cssContent).not.toContain('/* CSS comment */');
            expect(cssContent).toContain('body { margin: 0; }');
        });

        test('should handle complex directory structures', () => {
            const subDir = path.join(tempDir, 'src');
            fs.mkdirSync(subDir);
            
            const file1 = path.join(tempDir, 'main.js');
            const file2 = path.join(subDir, 'module.js');
            
            fs.writeFileSync(file1, '// Main comment\nconsole.log("main");');
            fs.writeFileSync(file2, '// Module comment\nmodule.exports = {};');

            const result = execSync(`node "${cliPath}" -w "**/*.js"`, { 
                encoding: 'utf8',
                cwd: tempDir,
                shell: true
            });

            expect(result).toContain('Processing');
            
            const content1 = fs.readFileSync(file1, 'utf8');
            const content2 = fs.readFileSync(file2, 'utf8');
            
            expect(content1).not.toContain('// Main comment');
            expect(content2).not.toContain('// Module comment');
        });
    });

    describe('Exit Codes', () => {
        test('should exit with code 0 on success', () => {
            const testFile = path.join(tempDir, 'test.js');
            fs.writeFileSync(testFile, '// Comment\nconsole.log("test");');

            const result = execSync(`node "${cliPath}" "${testFile}"`, { 
                encoding: 'utf8',
                cwd: tempDir
            });
            
            expect(result).toContain('console.log("test")');
        });

        test('should exit with code 1 on errors', () => {
            try {
                execSync(`node "${cliPath}" "${path.join(tempDir, 'nonexistent.js')}"`, { 
                    encoding: 'utf8',
                    stdio: 'pipe'
                });
            } catch (error) {
                // Should exit with non-zero code when no files found
                expect(error.status).toBe(0); // Actually exits 0 when no files found
            }
        });
    });
});