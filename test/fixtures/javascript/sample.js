// This is a single line comment
function hello() {
    /* This is a multi-line comment
       that spans multiple lines */
    console.log('Hello World!'); // Inline comment
    return true;
}

/**
 * JSDoc comment block
 * @param {string} name - The name parameter
 * @returns {string} Greeting message
 */
function greet(name) {
    // Another single line comment
    return `Hello, ${name}!`;
}

// Final comment
const test = 'value'; /* End comment */