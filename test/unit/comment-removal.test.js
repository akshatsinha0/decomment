const strip = require('strip-comments');
const fs = require('fs');
const path = require('path');

describe('Comment Removal Unit Tests', () => {
    describe('JavaScript Comment Removal', () => {
        test('should remove single-line comments', () => {
            const input = '// This is a comment\nconsole.log("Hello");';
            const result = strip(input);
            
            expect(result).not.toContain('// This is a comment');
            expect(result).toContain('console.log("Hello")');
        });

        test('should remove multi-line comments', () => {
            const input = '/* This is a\n   multi-line comment */\nfunction test() {}';
            const result = strip(input);
            
            expect(result).not.toContain('This is a');
            expect(result).not.toContain('multi-line comment');
            expect(result).toContain('function test()');
        });

        test('should remove JSDoc comments', () => {
            const input = `/**
 * This is a JSDoc comment
 * @param {string} name
 * @returns {string}
 */
function greet(name) {
    return "Hello " + name;
}`;
            const result = strip(input);
            
            expect(result).not.toContain('JSDoc comment');
            expect(result).not.toContain('@param');
            expect(result).not.toContain('@returns');
            expect(result).toContain('function greet(name)');
            expect(result).toContain('return "Hello " + name');
        });

        test('should preserve strings that look like comments', () => {
            const input = 'const message = "This // is not a comment";';
            const result = strip(input);
            
            expect(result).toContain('This // is not a comment');
        });

        test('should preserve regex patterns', () => {
            const input = 'const regex = /\\/\\*.*?\\*\\//g; // Remove comments regex';
            const result = strip(input);
            
            expect(result).toContain('/\\/\\*.*?\\*\\//g');
            expect(result).not.toContain('Remove comments regex');
        });

        test('should handle mixed comment types', () => {
            const input = `// Single line comment
/* Multi-line comment */
function test() {
    // Another single line
    return true; /* Inline comment */
}`;
            const result = strip(input);
            
            expect(result).not.toContain('Single line comment');
            expect(result).not.toContain('Multi-line comment');
            expect(result).not.toContain('Another single line');
            expect(result).not.toContain('Inline comment');
            expect(result).toContain('function test()');
            expect(result).toContain('return true;');
        });
    });

    describe('CSS Comment Removal', () => {
        test('should remove CSS comments', () => {
            const input = `/* Header styles */
body {
    margin: 0; /* Remove default margin */
    padding: 0;
}`;
            const result = strip(input);
            
            expect(result).not.toContain('Header styles');
            expect(result).not.toContain('Remove default margin');
            expect(result).toContain('body {');
            expect(result).toContain('margin: 0;');
            expect(result).toContain('padding: 0;');
        });

        test('should handle multi-line CSS comments', () => {
            const input = `/*
 * This is a multi-line
 * CSS comment block
 */
.container {
    width: 100%;
}`;
            const result = strip(input);
            
            expect(result).not.toContain('multi-line');
            expect(result).not.toContain('CSS comment block');
            expect(result).toContain('.container {');
            expect(result).toContain('width: 100%;');
        });
    });

    describe('HTML Comment Removal', () => {
        test('should handle HTML-like content', () => {
            const input = `<div class="container">
    <p>Content</p>
</div>`;
            const result = strip(input);
            
            expect(result).toContain('<div class="container">');
            expect(result).toContain('<p>Content</p>');
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty input', () => {
            const input = '';
            const result = strip(input);
            
            expect(result).toBe('');
        });

        test('should handle input with only comments', () => {
            const input = '// Only comment\n/* Another comment */';
            const result = strip(input);
            
            expect(result.trim()).toBe('');
        });

        test('should handle input with no comments', () => {
            const input = 'function test() {\n    return true;\n}';
            const result = strip(input);
            
            expect(result).toContain('function test()');
            expect(result).toContain('return true;');
        });

        test('should preserve whitespace structure', () => {
            const input = `function test() {
    // Comment here
    const a = 1;
    
    // Another comment
    return a;
}`;
            const result = strip(input);
            
            expect(result).toContain('function test() {');
            expect(result).toContain('    const a = 1;');
            expect(result).toContain('    return a;');
            expect(result).not.toContain('Comment here');
            expect(result).not.toContain('Another comment');
        });
    });

    describe('File Type Detection', () => {
        test('should work with different file extensions', () => {
            const jsContent = '// JS comment\nconsole.log("test");';
            const cssContent = '/* CSS comment */\nbody { margin: 0; }';
            
            const jsResult = strip(jsContent);
            const cssResult = strip(cssContent);
            
            expect(jsResult).not.toContain('JS comment');
            expect(jsResult).toContain('console.log("test")');
            
            expect(cssResult).not.toContain('CSS comment');
            expect(cssResult).toContain('body { margin: 0; }');
        });
    });
});