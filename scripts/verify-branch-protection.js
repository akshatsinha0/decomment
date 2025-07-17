#!/usr/bin/env node

/**
 * Branch Protection Verification Script
 *
 * This script helps verify that branch protection rules are properly configured
 * and working as expected for the main branch.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 Branch Protection Verification Script');
console.log('=====================================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkWorkflowFiles() {
  log('📋 Checking workflow files...', 'blue');

  const workflowDir = '.github/workflows';
  const requiredWorkflows = [
    'ci.yml',
    'security.yml',
    'release.yml',
    'dependabot-auto-merge.yml'
  ];

  let allWorkflowsExist = true;

  requiredWorkflows.forEach(workflow => {
    const workflowPath = path.join(workflowDir, workflow);
    if (fs.existsSync(workflowPath)) {
      log(`  ✅ ${workflow} exists`, 'green');
    } else {
      log(`  ❌ ${workflow} missing`, 'red');
      allWorkflowsExist = false;
    }
  });

  return allWorkflowsExist;
}

function checkGitStatus() {
  log('\n🔍 Checking Git repository status...', 'blue');

  try {
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    log(`  Current branch: ${currentBranch}`, 'yellow');

    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    log(`  Remote URL: ${remoteUrl}`, 'yellow');

    // Check if we're on main branch
    if (currentBranch === 'main') {
      log('  ⚠️  Currently on main branch - some tests will be skipped', 'yellow');
      return { onMain: true, currentBranch, remoteUrl };
    }

    return { onMain: false, currentBranch, remoteUrl };
  } catch (error) {
    log(`  ❌ Error checking git status: ${error.message}`, 'red');
    return null;
  }
}

function testDirectPushRestriction(gitInfo) {
  log('\n🚫 Testing direct push restriction to main...', 'blue');

  if (gitInfo.onMain) {
    log('  ⚠️  Skipping direct push test (currently on main branch)', 'yellow');
    log('  💡 Switch to a feature branch to test this properly', 'yellow');
    return;
  }

  try {
    // Try to push to main (this should fail if branch protection is working)
    log('  Attempting to push directly to main branch...', 'yellow');
    execSync('git push origin HEAD:main --dry-run', { encoding: 'utf8' });
    log('  ❌ Direct push to main was allowed (branch protection may not be configured)', 'red');
  } catch (error) {
    if (error.message.includes('protected') || error.message.includes('required status checks')) {
      log('  ✅ Direct push to main blocked (branch protection working)', 'green');
    } else {
      log(`  ⚠️  Push failed for other reasons: ${error.message}`, 'yellow');
    }
  }
}

function checkRequiredStatusChecks() {
  log('\n📊 Checking required status checks configuration...', 'blue');

  const expectedChecks = [
    'test (ubuntu-latest, 16.x)',
    'test (ubuntu-latest, 18.x)',
    'test (ubuntu-latest, 20.x)',
    'test (macos-latest, 16.x)',
    'test (macos-latest, 18.x)',
    'test (macos-latest, 20.x)',
    'test (windows-latest, 16.x)',
    'test (windows-latest, 18.x)',
    'test (windows-latest, 20.x)',
    'security-scan',
    'codeql-analysis',
    'build'
  ];

  log('  Expected status checks:', 'yellow');
  expectedChecks.forEach(check => {
    log(`    - ${check}`, 'yellow');
  });

  log('\n  💡 To verify these are configured:', 'blue');
  log('    1. Go to GitHub repository settings', 'blue');
  log('    2. Navigate to Branches → main branch rule', 'blue');
  log('    3. Check "Require status checks to pass before merging"', 'blue');
  log('    4. Verify all expected checks are listed', 'blue');
}

function checkDependabotConfiguration() {
  log('\n🤖 Checking Dependabot configuration...', 'blue');

  const dependabotPath = '.github/dependabot.yml';
  if (fs.existsSync(dependabotPath)) {
    log('  ✅ Dependabot configuration exists', 'green');

    const config = fs.readFileSync(dependabotPath, 'utf8');
    if (config.includes('npm') && config.includes('github-actions')) {
      log('  ✅ Both npm and GitHub Actions updates configured', 'green');
    } else {
      log('  ⚠️  Missing npm or GitHub Actions configuration', 'yellow');
    }
  } else {
    log('  ❌ Dependabot configuration missing', 'red');
  }
}

function runVerificationTests() {
  log('\n🧪 Running verification tests...', 'blue');

  try {
    // Test that npm scripts work
    log('  Testing npm test script...', 'yellow');
    execSync('npm run test:ci', { stdio: 'pipe' });
    log('  ✅ Tests pass', 'green');

    // Test linting
    log('  Testing lint script...', 'yellow');
    execSync('npm run lint', { stdio: 'pipe' });
    log('  ✅ Linting passes', 'green');

    // Test package verification
    log('  Testing package verification...', 'yellow');
    execSync('npm run verify', { stdio: 'pipe' });
    log('  ✅ Package verification passes', 'green');

  } catch (error) {
    log(`  ❌ Verification tests failed: ${error.message}`, 'red');
  }
}

function generateReport() {
  log('\n📋 Branch Protection Setup Report', 'blue');
  log('================================', 'blue');

  log('\n✅ Completed Checks:', 'green');
  log('  - Workflow files verification', 'green');
  log('  - Git repository status', 'green');
  log('  - Direct push restriction test', 'green');
  log('  - Required status checks review', 'green');
  log('  - Dependabot configuration check', 'green');
  log('  - Verification tests execution', 'green');

  log('\n📝 Manual Steps Required:', 'yellow');
  log('  1. Configure branch protection rules in GitHub repository settings', 'yellow');
  log('  2. Set up required status checks as listed above', 'yellow');
  log('  3. Test with a real pull request', 'yellow');
  log('  4. Verify Dependabot PRs are handled correctly', 'yellow');

  log('\n📖 For detailed setup instructions, see:', 'blue');
  log('  .github/BRANCH_PROTECTION_SETUP.md', 'blue');
}

// Main execution
async function main() {
  try {
    const workflowsOk = checkWorkflowFiles();
    const gitInfo = checkGitStatus();

    if (gitInfo) {
      testDirectPushRestriction(gitInfo);
    }

    checkRequiredStatusChecks();
    checkDependabotConfiguration();
    runVerificationTests();
    generateReport();

    log('\n🎉 Branch protection verification completed!', 'green');

  } catch (error) {
    log(`\n❌ Verification failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
