const glob = require('glob');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Glob Pattern Unit Tests', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'glob-test-'));
        
        // Create test file structure
        fs.writeFileSync(path.join(tempDir, 'file1.js'), 'content');
        fs.writeFileSync(path.join(tempDir, 'file2.js'), 'content');
        fs.writeFileSync(path.join(tempDir, 'file1.css'), 'content');
        fs.writeFileSync(path.join(tempDir, 'readme.txt'), 'content');
        
        const subDir = path.join(tempDir, 'src');
        fs.mkdirSync(subDir);
        fs.writeFileSync(path.join(subDir, 'module.js'), 'content');
        fs.writeFileSync(path.join(subDir, 'styles.css'), 'content');
        
        const deepDir = path.join(subDir, 'components');
        fs.mkdirSync(deepDir);
        fs.writeFileSync(path.join(deepDir, 'component.js'), 'content');
    });

    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    describe('Basic Glob Patterns', () => {
        test('should match all JavaScript files with *.js', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), '*.js');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files).toHaveLength(2);
            expect(files.some(f => f.includes('file1.js'))).toBe(true);
            expect(files.some(f => f.includes('file2.js'))).toBe(true);
        });

        test('should match all files with *', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), '*');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files).toHaveLength(4); // file1.js, file2.js, file1.css, readme.txt
        });

        test('should match specific file extension with *.css', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), '*.css');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files).toHaveLength(1);
            expect(files[0]).toContain('file1.css');
        });
    });

    describe('Recursive Glob Patterns', () => {
        test('should match files recursively with **/*.js', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), '**/*.js');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files).toHaveLength(4); // file1.js, file2.js, src/module.js, src/components/component.js
            expect(files.some(f => f.includes('file1.js'))).toBe(true);
            expect(files.some(f => f.includes('module.js'))).toBe(true);
            expect(files.some(f => f.includes('component.js'))).toBe(true);
        });

        test('should match all files recursively with **/*', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), '**/*');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files.length).toBeGreaterThan(4);
            expect(files.some(f => f.includes('styles.css'))).toBe(true);
            expect(files.some(f => f.includes('component.js'))).toBe(true);
        });
    });

    describe('Multiple File Type Patterns', () => {
        test('should match multiple extensions with {js,css}', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), '*.{js,css}');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files).toHaveLength(3); // file1.js, file2.js, file1.css
            expect(files.some(f => f.includes('.js'))).toBe(true);
            expect(files.some(f => f.includes('.css'))).toBe(true);
            expect(files.every(f => !f.includes('.txt'))).toBe(true);
        });

        test('should match multiple extensions recursively', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), '**/*.{js,css}');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files.length).toBeGreaterThanOrEqual(5); // All JS and CSS files
            expect(files.some(f => f.includes('styles.css'))).toBe(true);
            expect(files.some(f => f.includes('component.js'))).toBe(true);
        });
    });

    describe('Character Matching Patterns', () => {
        test('should match single character with ?', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), 'file?.js');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files).toHaveLength(2); // file1.js, file2.js
        });

        test('should match character ranges with [1-2]', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), 'file[1-2].js');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files).toHaveLength(2); // file1.js, file2.js
        });
    });

    describe('Directory Filtering', () => {
        test('should exclude directories with nodir option', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), '*');
            const filesWithDirs = glob.sync(pattern);
            const filesOnly = glob.sync(pattern, { nodir: true });
            
            expect(filesWithDirs.length).toBeGreaterThan(filesOnly.length);
            expect(filesOnly.every(f => fs.statSync(f).isFile())).toBe(true);
        });

        test('should include directories without nodir option', () => {
            const pattern = path.posix.join(tempDir.replace(/\\/g, '/'), '*');
            const files = glob.sync(pattern);
            
            expect(files.some(f => fs.statSync(f).isDirectory())).toBe(true);
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid patterns gracefully', () => {
            const invalidPattern = path.join(tempDir, '[invalid');
            
            expect(() => {
                glob.sync(invalidPattern, { nodir: true });
            }).not.toThrow();
        });

        test('should return empty array for non-matching patterns', () => {
            const pattern = path.join(tempDir, '*.nonexistent');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files).toHaveLength(0);
        });

        test('should handle non-existent directories', () => {
            const pattern = path.join(tempDir, 'nonexistent', '*.js');
            const files = glob.sync(pattern, { nodir: true });
            
            expect(files).toHaveLength(0);
        });
    });

    describe('Pattern Combinations', () => {
        test('should handle multiple patterns', () => {
            const pattern1 = path.posix.join(tempDir.replace(/\\/g, '/'), '*.js');
            const pattern2 = path.posix.join(tempDir.replace(/\\/g, '/'), '*.css');
            
            const files1 = glob.sync(pattern1, { nodir: true });
            const files2 = glob.sync(pattern2, { nodir: true });
            const combined = [...files1, ...files2];
            
            expect(combined).toHaveLength(3); // 2 JS + 1 CSS
        });

        test('should remove duplicates when patterns overlap', () => {
            const pattern1 = path.posix.join(tempDir.replace(/\\/g, '/'), '*.js');
            const pattern2 = path.posix.join(tempDir.replace(/\\/g, '/'), 'file1.*');
            
            const files1 = glob.sync(pattern1, { nodir: true });
            const files2 = glob.sync(pattern2, { nodir: true });
            const combined = [...files1, ...files2];
            const unique = combined.filter((file, index, arr) => arr.indexOf(file) === index);
            
            expect(unique.length).toBeLessThan(combined.length);
        });
    });
});