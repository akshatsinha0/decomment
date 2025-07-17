# Publishing Guide

This document provides step-by-step instructions for publishing the `00akshatsinha00decomment` package to npm.

## Pre-Publishing Checklist

### 1. Verify Package Configuration
Run the verification script to ensure everything is properly configured:

```bash
npm run verify
```

This will check:
- ✅ Package.json configuration
- ✅ Required files (README, LICENSE, CHANGELOG)
- ✅ Binary file and shebang
- ✅ Dependencies
- ✅ CLI functionality
- ✅ Test suite

### 2. Run Tests
Ensure all tests pass before publishing:

```bash
npm test
```

For coverage report:
```bash
npm run test:coverage
```

### 3. Update Version (if needed)
If this isn't the first release, update the version:

```bash
# For patch releases (bug fixes)
npm version patch

# For minor releases (new features)
npm version minor

# For major releases (breaking changes)
npm version major
```

## Publishing Steps

### Step 1: Check npm Authentication
Verify you're logged into npm:

```bash
npm whoami
```

If not logged in:
```bash
npm login
```

### Step 2: Check Package Name Availability
Verify the package name is available:

```bash
npm view 00akshatsinha00decomment
```

If you get a 404 error, the name is available. If you see package info, the name is taken.

### Step 3: Test Package Locally
Test the package installation locally:

```bash
# Create a test package
npm pack

# This creates a .tgz file you can test with:
# npm install ./00akshatsinha00decomment-1.0.0.tgz
```

### Step 4: Publish to npm
Publish the package:

```bash
npm publish
```

**Note:** The `prepublishOnly` script will automatically run tests before publishing.

### Step 5: Verify Publication
After publishing, verify the package is available:

```bash
# Check package info
npm view 00akshatsinha00decomment

# Test installation
npx 00akshatsinha00decomment --help
```

## Post-Publishing

### 1. Test the Published Package
Test the package works correctly when installed via npm:

```bash
# Test with npx (recommended way)
npx 00akshatsinha00decomment --version
npx 00akshatsinha00decomment --help

# Test actual functionality
echo "// Test comment" > test.js
npx 00akshatsinha00decomment test.js
```

### 2. Update Documentation
If needed, update:
- README.md with any new installation instructions
- CHANGELOG.md with release notes

### 3. Create Git Tag
Tag the release in git:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Troubleshooting

### Package Name Issues
If the package name `00akshatsinha00decomment` is not available:
1. Try variations like `akshatsinha-decomment` or `decomment-cli-akshat`
2. Update the `name` field in package.json
3. Update the `bin` field to match the new name
4. Update README.md with the new command

### Permission Issues
If you get permission errors:
```bash
# Check if you have permission to publish
npm owner ls 00akshatsinha00decomment

# If the package exists and you don't own it, you'll need a different name
```

### Publishing Errors
Common issues and solutions:

1. **Tests failing**: Fix tests before publishing
2. **Missing files**: Check `.npmignore` and `files` field in package.json
3. **Version conflicts**: Update version number
4. **Network issues**: Check internet connection and npm registry status

## Package Information

- **Package Name**: `00akshatsinha00decomment`
- **Command Name**: `00akshatsinha00decomment`
- **Registry**: https://www.npmjs.com/
- **Installation**: `npm install -g 00akshatsinha00decomment` or use with `npx`

## Security Considerations

- The package includes only necessary files (see `files` field in package.json)
- No sensitive information is included
- Dependencies are from trusted sources
- Binary file has proper permissions and shebang

## Support

After publishing, users can:
- View package info: `npm view 00akshatsinha00decomment`
- Report issues: Through npm or your preferred issue tracker
- Get help: `npx 00akshatsinha00decomment --help`