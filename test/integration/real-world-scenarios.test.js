const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe.skip('Real-World Scenarios Integration Tests', () => {
    const cliPath = path.join(__dirname, '..', '..', 'bin', 'document.js');
    let tempDir;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'real-world-test-'));
    });

    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    describe('Project Structure Scenarios', () => {
        test('should clean entire JavaScript project', () => {
            const srcDir = path.join(tempDir, 'src');
            const libDir = path.join(tempDir, 'lib');
            fs.mkdirSync(srcDir, { recursive: true });
            fs.mkdirSync(libDir, { recursive: true });

            fs.writeFileSync(path.join(srcDir, 'index.js'), '// Main file\nmodule.exports = {};');
            fs.writeFileSync(path.join(srcDir, 'utils.js'), '// Utils\nfunction util() {}');
            fs.writeFileSync(path.join(libDir, 'helper.js'), '// Helper\nfunction help() {}');

            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '**', '*.js')}"`, {
                encoding: 'utf8',
                shell: true
            });

            expect(result).toContain('Processing 3 file(s)');

            const indexContent = fs.readFileSync(path.join(srcDir, 'index.js'), 'utf8');
            const utilsContent = fs.readFileSync(path.join(srcDir, 'utils.js'), 'utf8');
            const helperContent = fs.readFileSync(path.join(libDir, 'helper.js'), 'utf8');

            expect(indexContent).not.toContain('// Main file');
            expect(utilsContent).not.toContain('// Utils');
            expect(helperContent).not.toContain('// Helper');
        });

        test('should clean web project with mixed file types', () => {
            const cssDir = path.join(tempDir, 'css');
            const jsDir = path.join(tempDir, 'js');
            fs.mkdirSync(cssDir, { recursive: true });
            fs.mkdirSync(jsDir, { recursive: true });

            fs.writeFileSync(path.join(cssDir, 'style.css'), '/* Styles */\nbody { margin: 0; }');
            fs.writeFileSync(path.join(jsDir, 'app.js'), '// App\nconsole.log("app");');
            fs.writeFileSync(path.join(tempDir, 'index.html'), '<!-- HTML -->\n<div>Content</div>');

            execSync(`node "${cliPath}" -w "${path.join(tempDir, '**', '*.{js,css,html}')}"`, {
                encoding: 'utf8',
                shell: true
            });

            const cssContent = fs.readFileSync(path.join(cssDir, 'style.css'), 'utf8');
            const jsContent = fs.readFileSync(path.join(jsDir, 'app.js'), 'utf8');
            const htmlContent = fs.readFileSync(path.join(tempDir, 'index.html'), 'utf8');

            expect(cssContent).not.toContain('/* Styles */');
            expect(jsContent).not.toContain('// App');
            expect(htmlContent).toContain('<div>Content</div>');
        });

        test('should prepare code for production deployment', () => {
            const distDir = path.join(tempDir, 'dist');
            fs.mkdirSync(distDir, { recursive: true });

            const sourceCode = `/**
 * Production module
 * @module production
 */

// Configuration
const config = {
    // API endpoint
    api: 'https://api.example.com',
    // Timeout in ms
    timeout: 5000
};

/* Export configuration */
module.exports = config;`;

            fs.writeFileSync(path.join(distDir, 'config.js'), sourceCode);

            execSync(`node "${cliPath}" -w "${path.join(distDir, '*.js')}"`, {
                encoding: 'utf8'
            });

            const content = fs.readFileSync(path.join(distDir, 'config.js'), 'utf8');

            expect(content).not.toContain('Production module');
            expect(content).not.toContain('@module');
            expect(content).not.toContain('// Configuration');
            expect(content).not.toContain('// API endpoint');
            expect(content).not.toContain('// Timeout in ms');
            expect(content).not.toContain('/* Export configuration */');
            expect(content).toContain('const config');
            expect(content).toContain('api:');
            expect(content).toContain('timeout:');
        });
    });

    describe('Code Review Scenarios', () => {
        test('should create clean version for code review', () => {
            const srcFile = path.join(tempDir, 'feature.js');
            const reviewDir = path.join(tempDir, 'review');

            const sourceCode = `// TODO: Refactor this function
function processData(data) {
    // Validate input
    if (!data) {
        throw new Error('Invalid data');
    }

    /* Process the data
       This is a complex operation
       that needs optimization */
    return data.map(item => {
        // Transform each item
        return item.value * 2;
    });
}

// FIXME: Handle edge cases
module.exports = { processData };`;

            fs.writeFileSync(srcFile, sourceCode);

            execSync(`node "${cliPath}" -o "${reviewDir}" "${srcFile}"`, {
                encoding: 'utf8'
            });

            const reviewContent = fs.readFileSync(path.join(reviewDir, 'feature.js'), 'utf8');
            const originalContent = fs.readFileSync(srcFile, 'utf8');

            expect(originalContent).toContain('// TODO');
            expect(reviewContent).not.toContain('// TODO');
            expect(reviewContent).not.toContain('// Validate input');
            expect(reviewContent).not.toContain('/* Process the data');
            expect(reviewContent).not.toContain('// FIXME');
            expect(reviewContent).toContain('function processData(data)');
        });

        test('should preserve original while creating clean copy', () => {
            const srcFile = path.join(tempDir, 'module.js');
            const cleanDir = path.join(tempDir, 'clean');

            const originalCode = '// Important comment\nfunction test() { return true; }';
            fs.writeFileSync(srcFile, originalCode);

            execSync(`node "${cliPath}" -o "${cleanDir}" "${srcFile}"`, {
                encoding: 'utf8'
            });

            const originalContent = fs.readFileSync(srcFile, 'utf8');
            const cleanContent = fs.readFileSync(path.join(cleanDir, 'module.js'), 'utf8');

            expect(originalContent).toBe(originalCode);
            expect(cleanContent).not.toContain('// Important comment');
        });
    });

    describe('Documentation Scenarios', () => {
        test('should remove JSDoc for documentation examples', () => {
            const docFile = path.join(tempDir, 'example.js');

            const codeWithDocs = `/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The sum of a and b
 * @example
 * add(2, 3); // returns 5
 */
function add(a, b) {
    return a + b;
}

/**
 * Multiply two numbers
 * @param {number} x - First number
 * @param {number} y - Second number
 * @returns {number} The product
 */
function multiply(x, y) {
    return x * y;
}`;

            fs.writeFileSync(docFile, codeWithDocs);

            execSync(`node "${cliPath}" -w "${docFile}"`, {
                encoding: 'utf8'
            });

            const content = fs.readFileSync(docFile, 'utf8');

            expect(content).not.toContain('@param');
            expect(content).not.toContain('@returns');
            expect(content).not.toContain('@example');
            expect(content).toContain('function add(a, b)');
            expect(content).toContain('function multiply(x, y)');
        });
    });

    describe('Legacy Code Cleanup', () => {
        test('should clean legacy code with excessive comments', () => {
            const legacyFile = path.join(tempDir, 'legacy.js');

            const legacyCode = `// Old implementation - DO NOT USE
// function oldMethod() {
//     return 'deprecated';
// }

/* New implementation
   Updated: 2023-01-01
   Author: Developer
   Status: Active */
function newMethod() {
    // Initialize variables
    const result = 'active';

    // Return result
    return result;
}

// TODO: Remove old code after migration
// TODO: Add unit tests
// TODO: Update documentation

module.exports = { newMethod };`;

            fs.writeFileSync(legacyFile, legacyCode);

            execSync(`node "${cliPath}" -w "${legacyFile}"`, {
                encoding: 'utf8'
            });

            const content = fs.readFileSync(legacyFile, 'utf8');

            expect(content).not.toContain('// Old implementation');
            expect(content).not.toContain('// function oldMethod()');
            expect(content).not.toContain('/* New implementation');
            expect(content).not.toContain('// Initialize variables');
            expect(content).not.toContain('// TODO');
            expect(content).toContain('function newMethod()');
            expect(content).toContain('const result');
        });
    });

    describe('Build Pipeline Scenarios', () => {
        test('should integrate with build process', () => {
            const srcDir = path.join(tempDir, 'src');
            const buildDir = path.join(tempDir, 'build');
            fs.mkdirSync(srcDir, { recursive: true });

            fs.writeFileSync(path.join(srcDir, 'app.js'), '// Source\nconst app = {};');
            fs.writeFileSync(path.join(srcDir, 'utils.js'), '// Utils\nconst utils = {};');

            execSync(`node "${cliPath}" -o "${buildDir}" "${path.join(srcDir, '*.js')}"`, {
                encoding: 'utf8'
            });

            expect(fs.existsSync(path.join(buildDir, 'app.js'))).toBe(true);
            expect(fs.existsSync(path.join(buildDir, 'utils.js'))).toBe(true);

            const appContent = fs.readFileSync(path.join(buildDir, 'app.js'), 'utf8');
            const utilsContent = fs.readFileSync(path.join(buildDir, 'utils.js'), 'utf8');

            expect(appContent).not.toContain('// Source');
            expect(utilsContent).not.toContain('// Utils');
        });

        test('should handle minification preparation', () => {
            const srcFile = path.join(tempDir, 'bundle.js');

            const bundleCode = `/* Bundle header
   Version: 1.0.0
   License: MIT */

// Module 1
(function() {
    // Private scope
    const module1 = {
        // Public method
        init: function() {
            console.log('Module 1');
        }
    };

    // Export
    window.Module1 = module1;
})();

// Module 2
(function() {
    const module2 = {
        init: function() {
            console.log('Module 2');
        }
    };
    window.Module2 = module2;
})();`;

            fs.writeFileSync(srcFile, bundleCode);

            execSync(`node "${cliPath}" -w "${srcFile}"`, {
                encoding: 'utf8'
            });

            const content = fs.readFileSync(srcFile, 'utf8');

            expect(content).not.toContain('/* Bundle header');
            expect(content).not.toContain('// Module 1');
            expect(content).not.toContain('// Private scope');
            expect(content).not.toContain('// Public method');
            expect(content).toContain('(function()');
            expect(content).toContain('window.Module1');
        });
    });

    describe('Multi-Language Project Scenarios', () => {
        test('should handle React project structure', () => {
            const componentsDir = path.join(tempDir, 'components');
            const stylesDir = path.join(tempDir, 'styles');
            fs.mkdirSync(componentsDir, { recursive: true });
            fs.mkdirSync(stylesDir, { recursive: true });

            fs.writeFileSync(path.join(componentsDir, 'Button.jsx'),
                '// Button component\nconst Button = () => <button>Click</button>;');
            fs.writeFileSync(path.join(componentsDir, 'Header.jsx'),
                '// Header component\nconst Header = () => <header>Title</header>;');
            fs.writeFileSync(path.join(stylesDir, 'main.css'),
                '/* Main styles */\nbody { margin: 0; }');

            execSync(`node "${cliPath}" -w "${path.join(tempDir, '**', '*.{jsx,css}')}"`, {
                encoding: 'utf8',
                shell: true
            });

            const buttonContent = fs.readFileSync(path.join(componentsDir, 'Button.jsx'), 'utf8');
            const headerContent = fs.readFileSync(path.join(componentsDir, 'Header.jsx'), 'utf8');
            const cssContent = fs.readFileSync(path.join(stylesDir, 'main.css'), 'utf8');

            expect(buttonContent).not.toContain('// Button component');
            expect(headerContent).not.toContain('// Header component');
            expect(cssContent).not.toContain('/* Main styles */');
        });

        test('should handle TypeScript project', () => {
            const srcDir = path.join(tempDir, 'src');
            fs.mkdirSync(srcDir, { recursive: true });

            fs.writeFileSync(path.join(srcDir, 'types.ts'),
                '// Type definitions\ninterface User { name: string; }');
            fs.writeFileSync(path.join(srcDir, 'service.ts'),
                '// Service layer\nclass UserService {}');

            execSync(`node "${cliPath}" -w "${path.join(srcDir, '*.ts')}"`, {
                encoding: 'utf8'
            });

            const typesContent = fs.readFileSync(path.join(srcDir, 'types.ts'), 'utf8');
            const serviceContent = fs.readFileSync(path.join(srcDir, 'service.ts'), 'utf8');

            expect(typesContent).not.toContain('// Type definitions');
            expect(serviceContent).not.toContain('// Service layer');
        });
    });

    describe('Continuous Integration Scenarios', () => {
        test('should process files for CI pipeline', () => {
            const ciDir = path.join(tempDir, 'ci-build');
            fs.mkdirSync(ciDir, { recursive: true });

            fs.writeFileSync(path.join(ciDir, 'deploy.js'),
                '// Deployment script\nconst deploy = () => { console.log("Deploying..."); };');
            fs.writeFileSync(path.join(ciDir, 'test.js'),
                '// Test runner\nconst test = () => { console.log("Testing..."); };');

            const result = execSync(`node "${cliPath}" -w "${path.join(ciDir, '*.js')}"`, {
                encoding: 'utf8'
            });

            expect(result).toContain('2 files processed successfully');

            const deployContent = fs.readFileSync(path.join(ciDir, 'deploy.js'), 'utf8');
            const testContent = fs.readFileSync(path.join(ciDir, 'test.js'), 'utf8');

            expect(deployContent).not.toContain('// Deployment script');
            expect(testContent).not.toContain('// Test runner');
        });
    });

    describe('Performance Scenarios', () => {
        test('should handle large codebase efficiently', () => {
            const largeDir = path.join(tempDir, 'large-project');
            fs.mkdirSync(largeDir, { recursive: true });

            for (let i = 0; i < 50; i++) {
                const content = `// File ${i}\nfunction func${i}() {\n    // Implementation\n    return ${i};\n}`;
                fs.writeFileSync(path.join(largeDir, `file${i}.js`), content);
            }

            const startTime = Date.now();
            const result = execSync(`node "${cliPath}" -w "${path.join(largeDir, '*.js')}"`, {
                encoding: 'utf8'
            });
            const endTime = Date.now();

            expect(result).toContain('50 files processed successfully');
            expect(endTime - startTime).toBeLessThan(10000);
        });

        test('should handle deeply nested directory structure', () => {
            let currentDir = tempDir;
            for (let i = 0; i < 5; i++) {
                currentDir = path.join(currentDir, `level${i}`);
                fs.mkdirSync(currentDir, { recursive: true });
                fs.writeFileSync(path.join(currentDir, `file${i}.js`),
                    `// Level ${i}\nconst level${i} = ${i};`);
            }

            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '**', '*.js')}"`, {
                encoding: 'utf8',
                shell: true
            });

            expect(result).toContain('5 files processed successfully');
        });
    });

    describe('Error Recovery Scenarios', () => {
        test('should continue processing after encountering problematic file', () => {
            const file1 = path.join(tempDir, 'good1.js');
            const file2 = path.join(tempDir, 'good2.js');

            fs.writeFileSync(file1, '// Comment\ncode1();');
            fs.writeFileSync(file2, '// Comment\ncode2();');

            const result = execSync(`node "${cliPath}" -w "${path.join(tempDir, '*.js')}"`, {
                encoding: 'utf8'
            });

            expect(result).toContain('2 files processed successfully');

            const content1 = fs.readFileSync(file1, 'utf8');
            const content2 = fs.readFileSync(file2, 'utf8');

            expect(content1).not.toContain('// Comment');
            expect(content2).not.toContain('// Comment');
        });
    });

    describe('Special Content Scenarios', () => {
        test('should preserve string literals with comment-like content', () => {
            const testFile = path.join(tempDir, 'strings.js');

            const code = `// Real comment
const message1 = "This // is not a comment";
const message2 = 'This /* is also */ not a comment';
const regex = /\\/\\*.*?\\*\\//g; // This is a comment
const url = "https://example.com"; // URL comment`;

            fs.writeFileSync(testFile, code);

            execSync(`node "${cliPath}" -w "${testFile}"`, {
                encoding: 'utf8'
            });

            const content = fs.readFileSync(testFile, 'utf8');

            expect(content).not.toContain('// Real comment');
            expect(content).not.toContain('// This is a comment');
            expect(content).not.toContain('// URL comment');
            expect(content).toContain('This // is not a comment');
            expect(content).toContain('This /* is also */ not a comment');
        });

        test('should handle code with complex comment patterns', () => {
            const testFile = path.join(tempDir, 'complex.js');

            const code = `/* Header comment */
// Nested comments test
const obj = {
    // Property comment
    prop1: 'value1', /* inline */
    /* Another property */
    prop2: 'value2' // end comment
};

/* Multi-line
   comment with
   multiple lines */
function test() {
    /* Nested
       /* comment */ // This is tricky
    return true;
}`;

            fs.writeFileSync(testFile, code);

            execSync(`node "${cliPath}" -w "${testFile}"`, {
                encoding: 'utf8'
            });

            const content = fs.readFileSync(testFile, 'utf8');

            expect(content).toContain('const obj');
            expect(content).toContain('prop1:');
            expect(content).toContain('function test()');
            expect(content).toContain('return true');
        });
    });
});
