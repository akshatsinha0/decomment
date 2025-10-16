# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2025-01-18

### Fixed
- CI/CD pipeline compatibility with Jest by updating Node.js requirement to 18.0.0+
- Resolved os.availableParallelism() compatibility issue with older Node.js versions
- Updated test matrix to use Node.js 18.x, 20.x, and 22.x

### Changed
- Minimum Node.js version requirement: 14.0.0 → 18.0.0
- Updated CI/CD workflow to test on Node.js 18.x, 20.x, and 22.x
- Updated documentation to reflect new Node.js requirements

## [1.1.1] - 2025-01-18

### Fixed
- Security workflow vulnerability detection logic to prevent false positives
- Critical vulnerability check now correctly parses JSON output count
- Improved error handling in security audit steps

### Added
- Comprehensive test suite with 164 test cases
- Integration tests for real-world scenarios
- Edge case tests for comment removal
- Performance tests for large codebases
- Tests for all CLI commands and options
- Tests for multiple file types and encodings

### Changed
- Enhanced security workflow logging and status messages
- Improved test coverage across all modules

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
- Node.js >= 18.0.0
- npm (for installation)
