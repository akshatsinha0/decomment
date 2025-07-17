# Contributing to 00akshatsinha00decomment

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a new branch for your changes
5. Make your changes
6. Test your changes
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 14.0.0
- npm (comes with Node.js)

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/00akshatsinha00decomment.git
cd 00akshatsinha00decomment

# Install dependencies
npm install

# Run tests to ensure everything works
npm test

# Verify the CLI tool works
npm run verify
```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-new-file-type-support`
- `fix/windows-path-handling`
- `docs/update-readme-examples`
- `test/improve-coverage`

### Commit Messages

Follow conventional commit format:
- `feat: add support for TypeScript files`
- `fix: resolve Windows path handling issue`
- `docs: update installation instructions`
- `test: add unit tests for glob patterns`
- `refactor: improve error handling logic`

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run CI tests
npm run test:ci
```

### Writing Tests

- Write unit tests for new functions
- Write integration tests for CLI functionality
- Ensure tests work on Windows, macOS, and Linux
- Aim for high test coverage
- Use descriptive test names

### Test Structure

```javascript
describe('Feature Name', () => {
    describe('Specific Functionality', () => {
        test('should do something specific', () => {
            // Test implementation
        });
    });
});
```

## Submitting Changes

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add or update tests for your changes
4. Update CHANGELOG.md if applicable
5. Create a pull request with a clear description

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## Style Guidelines

### Code Style

- Use 4 spaces for indentation
- No spaces around equals signs: `const files=patterns`
- No space before opening braces: `if(condition){`
- No space after `if`, `for`, `while`: `if(condition)`
- Remove comments from code files
- Use meaningful variable names
- Keep functions focused and small

### File Organization

```
project/
├── bin/                 # Executable files
├── test/               # Test files
│   ├── fixtures/       # Test data
│   ├── unit/          # Unit tests
│   └── cli.test.js    # CLI integration tests
├── scripts/           # Build and utility scripts
├── docs/              # Documentation
└── README.md          # Main documentation
```

### Documentation Style

- Use clear, concise language
- Include code examples
- Keep examples up to date
- Use proper markdown formatting
- Include table of contents for long documents

## Issue Reporting

### Bug Reports

Include:
- Operating system and version
- Node.js version
- Command that caused the issue
- Expected behavior
- Actual behavior
- Error messages
- Steps to reproduce

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Examples of usage

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to docs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed

## Development Guidelines

### Adding New File Type Support

1. Update the comment removal logic
2. Add test fixtures for the new file type
3. Write unit tests
4. Update documentation
5. Test on multiple platforms

### Performance Considerations

- Test with large files and many files
- Consider memory usage
- Optimize glob patterns
- Use streaming for large files when possible

### Error Handling

- Provide clear, actionable error messages
- Continue processing other files when one fails
- Use appropriate exit codes
- Log errors appropriately

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Run full test suite
4. Create git tag
5. Publish to npm
6. Create GitHub release

## Getting Help

- Check existing issues and documentation
- Ask questions in issues with `question` label
- Be specific about your problem
- Include relevant code and error messages

## Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- README.md contributors section
- GitHub contributors page

Thank you for contributing to make this tool better for everyone!