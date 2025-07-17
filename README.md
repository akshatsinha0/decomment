# 00akshatsinha00decomment

A powerful command-line tool that removes comments from your source code files while preserving the functionality of your code. Perfect for cleaning up codebases, preparing code for production, or creating comment-free versions of your files.

## Installation

You can use this tool directly with npx without installing it globally:

```bash
npx 00akshatsinha00decomment -w .
```

Or install it globally if you prefer:

```bash
npm install -g 00akshatsinha00decomment
```

## Quick Start

Remove comments from all files in the current directory:

```bash
npx 00akshatsinha00decomment -w .
```

Remove comments from specific JavaScript files:

```bash
npx 00akshatsinha00decomment -w *.js
```

Preview changes without modifying files:

```bash
npx 00akshatsinha00decomment myfile.js
```

## Usage

```
00akshatsinha00decomment [options] <glob...>

Arguments:
  glob                    glob pattern(s) of files to decomment

Options:
  -V, --version          output the version number
  -w, --write            overwrite files in-place
  -o, --out <dir>        write cleaned files to specified directory
  -h, --help             display help for command
```

## Options Explained

### `-w, --write`
Modifies your files directly by removing comments and saving the changes back to the original files.

**Example:**
```bash
npx 00akshatsinha00decomment -w src/**/*.js
```

**Warning:** This permanently modifies your files. Make sure you have backups or version control in place.

### `-o, --out <directory>`
Creates cleaned versions of your files in a specified output directory while keeping your original files unchanged.

**Example:**
```bash
npx 00akshatsinha00decomment -o cleaned-code src/**/*.js
```

This creates a `cleaned-code` directory with comment-free versions of your files.

### No Options (Preview Mode)
When you don't specify `-w` or `-o`, the tool displays the cleaned content in your terminal without modifying any files.

**Example:**
```bash
npx 00akshatsinha00decomment myfile.js
```

## Supported File Types

This tool works with all major programming languages and file types:

- **JavaScript** (.js, .jsx)
- **TypeScript** (.ts, .tsx)
- **CSS** (.css, .scss, .sass, .less)
- **HTML** (.html, .htm)
- **JSON** (.json)
- **And many more**

The tool automatically detects the file type and uses the appropriate comment removal strategy.

## Examples

### Clean All Files in Current Directory
```bash
npx 00akshatsinha00decomment -w .
```

### Clean Specific File Types
```bash
# Only JavaScript files
npx 00akshatsinha00decomment -w "**/*.js"

# Only CSS files
npx 00akshatsinha00decomment -w "**/*.css"

# Multiple file types
npx 00akshatsinha00decomment -w "**/*.{js,css,html}"
```

### Clean Files in Specific Directories
```bash
# Clean files in src directory
npx 00akshatsinha00decomment -w "src/**/*"

# Clean files in multiple directories
npx 00akshatsinha00decomment -w "src/**/*" "lib/**/*"
```

### Output to Different Directory
```bash
# Create cleaned versions in 'dist' folder
npx 00akshatsinha00decomment -o dist "src/**/*.js"
```

### Preview Changes First
```bash
# See what changes would be made without modifying files
npx 00akshatsinha00decomment "src/myfile.js"
```

## What Gets Removed

The tool removes various types of comments while preserving your code's functionality:

- **Single-line comments**: `// This is a comment`
- **Multi-line comments**: `/* This is a comment */`
- **JSDoc comments**: `/** Documentation comment */`
- **CSS comments**: `/* CSS comment */`
- **HTML comments**: `<!-- HTML comment -->`

## What Stays Intact

Your code functionality remains completely unchanged:

- All executable code
- String literals (even if they contain comment-like text)
- Regular expressions
- Code structure and formatting
- Variable names and values

## Error Handling

The tool handles errors gracefully and provides helpful feedback:

- **File permission errors**: Clear messages about access issues
- **Invalid patterns**: Helpful suggestions for correct glob patterns
- **No matching files**: Informative message when no files are found
- **Processing errors**: Continues with other files if one file fails

## Glob Patterns

You can use powerful glob patterns to specify which files to process:

| Pattern | Description | Example |
|---------|-------------|---------|
| `*` | Match any file in current directory | `*.js` |
| `**` | Match files in any subdirectory | `**/*.js` |
| `?` | Match single character | `file?.js` |
| `{a,b}` | Match either a or b | `*.{js,css}` |
| `[abc]` | Match any character in brackets | `file[123].js` |

## Safety Features

- **Backup recommendation**: Always use version control or create backups before using `-w`
- **Preview mode**: Test patterns without the `-w` flag first
- **Error recovery**: Processing continues even if individual files fail
- **Clear feedback**: Detailed success and error messages
- **Exit codes**: Proper exit codes for scripting (0 for success, 1 for errors)

## Common Use Cases

### Before Code Review
```bash
npx 00akshatsinha00decomment -o review-ready "src/**/*.js"
```

### Preparing Production Code
```bash
npx 00akshatsinha00decomment -w "dist/**/*.js"
```

### Cleaning Legacy Code
```bash
npx 00akshatsinha00decomment -w "legacy/**/*.{js,css,html}"
```

### Creating Documentation Examples
```bash
npx 00akshatsinha00decomment -o examples "src/components/*.js"
```

## Troubleshooting

### No Files Found
If you see "No files found matching the specified patterns":
- Check your glob pattern syntax
- Ensure the files exist in the specified locations
- Try using quotes around your patterns: `"**/*.js"`

### Permission Errors
If you encounter permission errors:
- Ensure you have write access to the target files
- Check if files are currently open in other applications
- Run with appropriate permissions if needed

### Unexpected Results
If the output isn't what you expected:
- Test with preview mode first (without `-w` or `-o`)
- Check that your files are in a supported format
- Verify your glob patterns match the intended files

### Pattern Not Working
If your glob pattern isn't matching files:
- Use quotes around patterns with special characters
- Test patterns with simple examples first
- Remember that `**` is needed for subdirectories

## Requirements

- **Node.js**: Version 14.0.0 or higher
- **Operating Systems**: Windows, macOS, Linux

## License

ISC License - see LICENSE file for details.

## Support

If you encounter issues or have questions:
1. Check the troubleshooting section above
2. Verify your Node.js version meets requirements
3. Test with simple examples first
4. Ensure your glob patterns are correct

## Version History

- **1.0.0**: Initial release with core functionality