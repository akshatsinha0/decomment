# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-17

### Added
- Initial release of 00akshatsinha00decomment CLI tool
- Support for removing comments from JavaScript, TypeScript, CSS, HTML, and other file types
- Command-line interface with Commander.js
- In-place file modification with `-w, --write` option
- Output directory support with `-o, --out <dir>` option
- Glob pattern matching for flexible file selection
- Comprehensive error handling and user feedback
- Progress reporting during file processing
- Support for multiple file types and formats
- Cross-platform compatibility (Windows, macOS, Linux)
- Proper exit codes for scripting integration
- Preview mode for testing changes before applying them

### Features
- Removes single-line comments (`//`)
- Removes multi-line comments (`/* */`)
- Removes JSDoc comments (`/** */`)
- Removes HTML comments (`<!-- -->`)
- Removes CSS comments (`/* */`)
- Preserves code functionality and structure
- Handles file permission errors gracefully
- Supports recursive directory processing
- Filters duplicate files automatically
- Creates output directories as needed

### Dependencies
- commander: ^14.0.0 (CLI argument parsing)
- glob: ^11.0.3 (File pattern matching)
- strip-comments: ^2.0.1 (Comment removal engine)

### Requirements
- Node.js >= 14.0.0
- npm (for installation)