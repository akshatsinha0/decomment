#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying package for npm publishing...\n');

// Check package.json
console.log('✅ Checking package.json configuration...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredFields = ['name', 'version', 'description', 'main', 'bin', 'author', 'license'];
const missingFields = requiredFields.filter(field => !packageJson[field]);

if (missingFields.length > 0) {
    console.error('❌ Missing required fields in package.json:', missingFields);
    process.exit(1);
}

console.log(`   Package name: ${packageJson.name}`);
console.log(`   Version: ${packageJson.version}`);
console.log(`   Description: ${packageJson.description}`);
console.log(`   Author: ${packageJson.author}`);
console.log(`   License: ${packageJson.license}`);

// Check binary configuration
if (!packageJson.bin || !packageJson.bin[packageJson.name]) {
    console.error('❌ Binary configuration missing or incorrect');
    process.exit(1);
}

console.log(`   Binary: ${packageJson.bin[packageJson.name]}`);

// Check if binary file exists and is executable
const binPath = packageJson.bin[packageJson.name];
if (!fs.existsSync(binPath)) {
    console.error(`❌ Binary file not found: ${binPath}`);
    process.exit(1);
}

const binContent = fs.readFileSync(binPath, 'utf8');
if (!binContent.startsWith('#!/usr/bin/env node')) {
    console.error('❌ Binary file missing shebang');
    process.exit(1);
}

console.log('   Binary file exists and has proper shebang');

// Check required files
console.log('\n✅ Checking required files...');
const requiredFiles = ['README.md', 'LICENSE', 'CHANGELOG.md'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles);
    process.exit(1);
}

requiredFiles.forEach(file => {
    const stats = fs.statSync(file);
    console.log(`   ${file}: ${stats.size} bytes`);
});

// Check dependencies
console.log('\n✅ Checking dependencies...');
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

console.log(`   Production dependencies: ${Object.keys(dependencies).length}`);
console.log(`   Development dependencies: ${Object.keys(devDependencies).length}`);

Object.entries(dependencies).forEach(([name, version]) => {
    console.log(`   - ${name}: ${version}`);
});

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.warn('⚠️  node_modules not found. Run "npm install" first.');
}

// Check engines
if (packageJson.engines && packageJson.engines.node) {
    console.log(`   Node.js requirement: ${packageJson.engines.node}`);
}

// Test the CLI
console.log('\n✅ Testing CLI functionality...');
try {
    const helpOutput = execSync(`node ${binPath} --help`, { encoding: 'utf8' });
    if (!helpOutput.includes('Usage:')) {
        throw new Error('Help output invalid');
    }
    console.log('   Help command works');

    const versionOutput = execSync(`node ${binPath} --version`, { encoding: 'utf8' });
    if (!versionOutput.trim().match(/^\d+\.\d+\.\d+$/)) {
        throw new Error('Version output invalid');
    }
    console.log('   Version command works');
} catch (error) {
    console.error('❌ CLI testing failed:', error.message);
    process.exit(1);
}

// Check package size
console.log('\n✅ Checking package size...');
try {
    const packOutput = execSync('npm pack --dry-run', { encoding: 'utf8' });
    console.log('   Package contents preview:');
    console.log(packOutput);
} catch (error) {
    console.warn('⚠️  Could not preview package contents:', error.message);
}

// Final checks
console.log('\n✅ Final verification...');

// Check if tests pass
try {
    console.log('   Running tests...');
    execSync('npm test', { stdio: 'pipe' });
    console.log('   All tests pass');
} catch (error) {
    console.error('❌ Tests failed. Fix tests before publishing.');
    process.exit(1);
}

// Check npm registry connectivity
try {
    execSync('npm ping', { stdio: 'pipe' });
    console.log('   npm registry is accessible');
} catch (error) {
    console.warn('⚠️  Could not ping npm registry. Check internet connection.');
}

console.log('\n🎉 Package verification complete!');
console.log('\n📦 Your package is ready for publishing!');
console.log('\nTo publish:');
console.log('1. Make sure you are logged in: npm whoami');
console.log('2. If not logged in: npm login');
console.log('3. Publish: npm publish');
console.log('\n⚠️  Note: Package names starting with numbers may have special requirements.');
console.log('   Make sure "00akshatsinha00decomment" is available on npm registry.');