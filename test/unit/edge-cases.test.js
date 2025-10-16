const strip = require('strip-comments');

describe('Edget Tests', () => {
    describe('String Preservation', () => {
        test('should preserve double-quoted strings with comment syntax', () => {
            const input = 'const str = "This // looks like a comment";';
            const result = strip(input);
            expect(result).toContain('This // looks like a comment');
        });

        test('should preserve single-quoted strings with comment syntax', () => {
            const input = "const str = 'This /* looks */ like a comment';";
            const result = strip(input);
            expect(result).toContain('This /* looks */ like a comment');
        });

        test('should preserve template literals with comment syntax', () => {
            const input = 'const str = `This // is ${value} not a comment`;';
            const result = strip(input);
            expect(result).toContain('This // is');
        });

        test('should preserve escaped quotes in strings', () => {
            const input = 'const str = "She said \\"Hello\\""; // Comment';
            const result = strip(input);
            expect(result).toContain('She said \\"Hello\\"');
            expect(result).not.toContain('// Comment');
        });
    });

    describe('Regular Expression Preservation', () => {
        test('should preserve regex with comment-like patterns', () => {
            const input = 'const regex = /\\/\\*.*?\\*\\//g;';
            const result = strip(input);
            expect(result).toContain('/\\/\\*.*?\\*\\//g');
        });

        test('should preserve regex with forward slashes', () => {
            const input = 'const regex = /https?:\\/\\//;';
            const result = strip(input);
            expect(result).toContain('/https?:\\/\\//');
        });

        test('should handle regex followed by comment', () => {
            const input = 'const regex = /test/g; // This is a comment';
            const result = strip(input);
            expect(result).toContain('/test/g');
            expect(result).not.toContain('// This is a comment');
        });
    });

    describe('Whitespace Handling', () => {
        test('should preserve indentation', () => {
            const input = `function test() {
    // Comment
    const x = 1;
        // Nested comment
        const y = 2;
}`;
            const result = strip(input);
            expect(result).toContain('    const x = 1;');
            expect(result).toContain('        const y = 2;');
        });

        test('should handle tabs', () => {
            const input = 'function test() {\n\t// Comment\n\tconst x = 1;\n}';
            const result = strip(input);
            expect(result).toContain('\tconst x = 1;');
        });

        test('should handle mixed spaces and tabs', () => {
            const input = 'function test() {\n  \t// Comment\n  \tconst x = 1;\n}';
            const result = strip(input);
            expect(result).toContain('  \tconst x = 1;');
        });

        test('should preserve blank lines', () => {
            const input = 'const a = 1;\n\n// Comment\n\nconst b = 2;';
            const result = strip(input);
            expect(result).toContain('const a = 1;');
            expect(result).toContain('const b = 2;');
        });
    });

    describe('Comment Variations', () => {
        test('should remove inline comments at end of line', () => {
            const input = 'const x = 1; // Inline comment';
            const result = strip(input);
            expect(result).toContain('const x = 1;');
            expect(result).not.toContain('// Inline comment');
        });

        test('should remove multiple inline comments', () => {
            const input = `const x = 1; // Comment 1
const y = 2; // Comment 2
const z = 3; // Comment 3`;
            const result = strip(input);
            expect(result).not.toContain('// Comment');
            expect(result).toContain('const x = 1;');
            expect(result).toContain('const y = 2;');
            expect(result).toContain('const z = 3;');
        });

        test('should remove block comments on same line as code', () => {
            const input = 'const x = /* comment */ 1;';
            const result = strip(input);
            expect(result).toContain('const x =');
            expect(result).toContain('1;');
            expect(result).not.toContain('/* comment */');
        });

        test('should handle nested comment-like syntax', () => {
            const input = '/* Outer /* inner */ comment */\nconst x = 1;';
            const result = strip(input);
            expect(result).toContain('const x = 1;');
        });

        test('should remove comments with special characters', () => {
            const input = '// Comment with special chars: @#$%^&*()\nconst x = 1;';
            const result = strip(input);
            expect(result).not.toContain('special chars');
            expect(result).toContain('const x = 1;');
        });

        test('should remove comments with unicode characters', () => {
            const input = '// Comment with unicode: 你好 世界 🚀\nconst x = 1;';
            const result = strip(input);
            expect(result).not.toContain('你好');
            expect(result).toContain('const x = 1;');
        });
    });

    describe('Empty and Minimal Input', () => {
        test('should handle empty string', () => {
            const input = '';
            const result = strip(input);
            expect(result).toBe('');
        });

        test('should handle only whitespace', () => {
            const input = '   \n\t\n   ';
            const result = strip(input);
            expect(result.trim()).toBe('');
        });

        test('should handle only comments', () => {
            const input = '// Only comment\n/* Another comment */';
            const result = strip(input);
            expect(result.trim()).toBe('');
        });

        test('should handle single line of code', () => {
            const input = 'const x = 1;';
            const result = strip(input);
            expect(result).toBe('const x = 1;');
        });

        test('should handle single comment line', () => {
            const input = '// Single comment';
            const result = strip(input);
            expect(result.trim()).toBe('');
        });
    });

    describe('Complex Code Structures', () => {
        test('should handle arrow functions', () => {
            const input = '// Comment\nconst fn = () => { return true; };';
            const result = strip(input);
            expect(result).not.toContain('// Comment');
            expect(result).toContain('const fn = () =>');
        });

        test('should handle async/await', () => {
            const input = '// Async function\nasync function test() { await promise; }';
            const result = strip(input);
            expect(result).not.toContain('// Async function');
            expect(result).toContain('async function test()');
        });

        test('should handle destructuring', () => {
            const input = '// Destructure\nconst { a, b } = obj;';
            const result = strip(input);
            expect(result).not.toContain('// Destructure');
            expect(result).toContain('const { a, b }');
        });

        test('should handle spread operator', () => {
            const input = '// Spread\nconst arr = [...items];';
            const result = strip(input);
            expect(result).not.toContain('// Spread');
            expect(result).toContain('const arr = [...items]');
        });

        test('should handle template literals', () => {
            const input = '// Template\nconst str = `Hello ${name}`;';
            const result = strip(input);
            expect(result).not.toContain('// Template');
            expect(result).toContain('const str = `Hello ${name}`');
        });

        test('should handle class definitions', () => {
            const input = `// Class definition
class MyClass {
    // Constructor
    constructor() {
        // Initialize
        this.value = 0;
    }
}`;
            const result = strip(input);
            expect(result).not.toContain('// Class definition');
            expect(result).not.toContain('// Constructor');
            expect(result).not.toContain('// Initialize');
            expect(result).toContain('class MyClass');
            expect(result).toContain('constructor()');
        });
    });

    describe('JSDoc Variations', () => {
        test('should remove JSDoc with multiple tags', () => {
            const input = `/**
 * Function description
 * @param {string} name - Name parameter
 * @param {number} age - Age parameter
 * @returns {object} User object
 * @throws {Error} If invalid input
 * @example
 * createUser('John', 30)
 */
function createUser(name, age) {}`;
            const result = strip(input);
            expect(result).not.toContain('@param');
            expect(result).not.toContain('@returns');
            expect(result).not.toContain('@throws');
            expect(result).not.toContain('@example');
            expect(result).toContain('function createUser');
        });

        test('should remove JSDoc with complex types', () => {
            const input = `/**
 * @param {Array<string|number>} items
 * @param {{name: string, age: number}} user
 * @returns {Promise<void>}
 */
function process(items, user) {}`;
            const result = strip(input);
            expect(result).not.toContain('@param');
            expect(result).not.toContain('Array<string|number>');
            expect(result).toContain('function process');
        });
    });

    describe('CSS-Specific Cases', () => {
        test('should handle CSS with multiple comment styles', () => {
            const input = `/* Header */
body {
    /* Property comment */
    margin: 0; /* Inline */
}
/* Footer */`;
            const result = strip(input);
            expect(result).not.toContain('/* Header */');
            expect(result).not.toContain('/* Property comment */');
            expect(result).not.toContain('/* Inline */');
            expect(result).not.toContain('/* Footer */');
            expect(result).toContain('body {');
            expect(result).toContain('margin: 0;');
        });

        test('should preserve CSS values that look like comments', () => {
            const input = 'content: "/* not a comment */";';
            const result = strip(input);
            expect(result).toContain('content: "/* not a comment */";');
        });

        test('should handle CSS media queries with comments', () => {
            const input = `/* Mobile styles */
@media (max-width: 768px) {
    /* Responsive layout */
    .container { width: 100%; }
}`;
            const result = strip(input);
            expect(result).not.toContain('/* Mobile styles */');
            expect(result).not.toContain('/* Responsive layout */');
            expect(result).toContain('@media');
            expect(result).toContain('.container');
        });
    });

    describe('Line Ending Variations', () => {
        test('should handle Unix line endings (LF)', () => {
            const input = '// Comment\nconst x = 1;\n// Another\nconst y = 2;';
            const result = strip(input);
            expect(result).not.toContain('// Comment');
            expect(result).not.toContain('// Another');
            expect(result).toContain('const x = 1;');
            expect(result).toContain('const y = 2;');
        });

        test('should handle Windows line endings (CRLF)', () => {
            const input = '// Comment\r\nconst x = 1;\r\n// Another\r\nconst y = 2;';
            const result = strip(input);
            expect(result).not.toContain('// Comment');
            expect(result).not.toContain('// Another');
            expect(result).toContain('const x = 1;');
            expect(result).toContain('const y = 2;');
        });

        test('should handle mixed line endings', () => {
            const input = '// Comment\nconst x = 1;\r\n// Another\rconst y = 2;';
            const result = strip(input);
            expect(result).not.toContain('// Comment');
            expect(result).not.toContain('// Another');
        });
    });

    describe('Special Syntax Cases', () => {
        test('should handle division operator vs comment', () => {
            const input = 'const result = a / b; // Division';
            const result = strip(input);
            expect(result).toContain('a / b');
            expect(result).not.toContain('// Division');
        });

        test('should handle multiple divisions', () => {
            const input = 'const result = a / b / c; // Multiple divisions';
            const result = strip(input);
            expect(result).toContain('a / b / c');
            expect(result).not.toContain('// Multiple divisions');
        });

        test('should handle URL in strings', () => {
            const input = 'const url = "https://example.com"; // URL';
            const result = strip(input);
            expect(result).toContain('https://example.com');
            expect(result).not.toContain('// URL');
        });

        test('should handle file paths in strings', () => {
            const input = 'const path = "C://Users//file.txt"; // Path';
            const result = strip(input);
            expect(result).toContain('C://Users//file.txt');
            expect(result).not.toContain('// Path');
        });
    });

    describe('Malformed Comment Handling', () => {
        test('should handle unclosed block comment gracefully', () => {
            const input = '/* Unclosed comment\nconst x = 1;';
            const result = strip(input);
            expect(result).toBeDefined();
        });

        test('should handle multiple asterisks', () => {
            const input = '/*** Comment ***/\nconst x = 1;';
            const result = strip(input);
            expect(result).toContain('const x = 1;');
        });

        test('should handle comment-like syntax in unusual places', () => {
            const input = 'const x = 1 /* comment */ + /* another */ 2;';
            const result = strip(input);
            expect(result).toContain('const x = 1');
            expect(result).toContain('+ ');
            expect(result).toContain('2;');
        });
    });

    describe('Performance Edge Cases', () => {
        test('should handle very long single line', () => {
            const longLine = 'const x = ' + '"a"'.repeat(1000) + '; // Comment';
            const result = strip(longLine);
            expect(result).not.toContain('// Comment');
            expect(result).toContain('const x =');
        });

        test('should handle many consecutive comments', () => {
            let input = '';
            for (let i = 0; i < 100; i++) {
                input += `// Comment ${i}\n`;
            }
            input += 'const x = 1;';
            const result = strip(input);
            expect(result).not.toContain('// Comment');
            expect(result).toContain('const x = 1;');
        });

        test('should handle deeply nested structures', () => {
            let input = '// Comment\n';
            for (let i = 0; i < 50; i++) {
                input += '{\n';
            }
            input += 'const x = 1;\n';
            for (let i = 0; i < 50; i++) {
                input += '}\n';
            }
            const result = strip(input);
            expect(result).not.toContain('// Comment');
            expect(result).toContain('const x = 1;');
        });
    });

    describe('Real-World Code Patterns', () => {
        test('should handle shebang lines', () => {
            const input = '#!/usr/bin/env node\n// Comment\nconst x = 1;';
            const result = strip(input);
            expect(result).toContain('#!/usr/bin/env node');
            expect(result).not.toContain('// Comment');
        });

        test('should handle use strict directive', () => {
            const input = '"use strict";\n// Comment\nconst x = 1;';
            const result = strip(input);
            expect(result).toContain('"use strict"');
            expect(result).not.toContain('// Comment');
        });

        test('should handle module exports', () => {
            const input = '// Export\nmodule.exports = { x: 1 };';
            const result = strip(input);
            expect(result).not.toContain('// Export');
            expect(result).toContain('module.exports');
        });

        test('should handle ES6 imports', () => {
            const input = '// Import\nimport { x } from "module";';
            const result = strip(input);
            expect(result).not.toContain('// Import');
            expect(result).toContain('import { x }');
        });

        test('should handle CommonJS requires', () => {
            const input = '// Require\nconst fs = require("fs");';
            const result = strip(input);
            expect(result).not.toContain('// Require');
            expect(result).toContain('const fs = require');
        });
    });
});
