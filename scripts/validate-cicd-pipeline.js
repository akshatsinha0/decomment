#!/usr/bin/env node

/**
 * CI/CD Pipeline Validation Script
 *
 * This script validates the complete CI/CD pipeline setup including:
 * - Workflow files and configuration
 * - Multi-platform testing capabilities
 * - Security scanning setup
 * - Release workflow configuration
 * - Dependabot integration
 * - Branch protection readiness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(`🔍 ${title}`, 'blue');
  log(`${'='.repeat(60)}`, 'blue');
}

function subsection(title) {
  log(`\n📋 ${title}`, 'cyan');
  log(`${'-'.repeat(40)}`, 'cyan');
}

class PipelineValidator {
  constructor() {
    this.results = {
      workflows: {},
      security: {},
      dependencies: {},
      testing: {},
      monitoring: {},
      overall: { passed: 0, failed: 0, warnings: 0 }
    };
  }

  validateWorkflowFiles() {
    subsection('Workflow Files Validation');

    const workflowsDir = '.github/workflows';
    const requiredWorkflows = {
      'ci.yml': 'Main CI/CD Pipeline',
      'security.yml': 'Security Analysis',
      'release.yml': 'Release and Publishing',
      'dependabot-auto-merge.yml': 'Dependabot Auto-merge'
    };

    Object.entries(requiredWorkflows).forEach(([file, description]) => {
      const filePath = path.join(workflowsDir, file);
      if (fs.existsSync(filePath)) {
        log(`  ✅ ${description} (${file})`, 'green');
        this.results.workflows[file] = 'passed';
        this.results.overall.passed++;
      } else {
        log(`  ❌ ${description} (${file}) - MISSING`, 'red');
        this.results.workflows[file] = 'failed';
        this.results.overall.failed++;
      }
    });
  }

  validateCIWorkflow() {
    subsection('CI Workflow Configuration');

    const ciPath = '.github/workflows/ci.yml';
    if (!fs.existsSync(ciPath)) {
      log('  ❌ CI workflow file not found', 'red');
      return;
    }

    const ciContent = fs.readFileSync(ciPath, 'utf8');

    // Check for multi-platform testing
    const platforms = ['ubuntu-latest', 'windows-latest', 'macos-latest'];
    const nodeVersions = ['16.x', '18.x', '20.x'];

    platforms.forEach(platform => {
      if (ciContent.includes(platform)) {
        log(`  ✅ ${platform} testing configured`, 'green');
        this.results.overall.passed++;
      } else {
        log(`  ❌ ${platform} testing missing`, 'red');
        this.results.overall.failed++;
      }
    });

    nodeVersions.forEach(version => {
      if (ciContent.includes(version)) {
        log(`  ✅ Node.js ${version} testing configured`, 'green');
        this.results.overall.passed++;
      } else {
        log(`  ❌ Node.js ${version} testing missing`, 'red');
        this.results.overall.failed++;
      }
    });

    // Check for essential steps
    const essentialSteps = [
      { pattern: 'npm ci', description: 'Dependency installation' },
      { pattern: 'npm run test', description: 'Test execution' },
      { pattern: 'npm run lint', description: 'Linting' },
      { pattern: 'codecov', description: 'Code coverage reporting' },
      { pattern: 'timeout-minutes', description: 'Timeout configuration' }
    ];

    essentialSteps.forEach(({ pattern, description }) => {
      if (ciContent.includes(pattern)) {
        log(`  ✅ ${description} configured`, 'green');
        this.results.overall.passed++;
      } else {
        log(`  ⚠️  ${description} not found`, 'yellow');
        this.results.overall.warnings++;
      }
    });
  }

  validateSecurityWorkflow() {
    subsection('Security Workflow Configuration');

    const securityPath = '.github/workflows/security.yml';
    if (!fs.existsSync(securityPath)) {
      log('  ❌ Security workflow file not found', 'red');
      return;
    }

    const securityContent = fs.readFileSync(securityPath, 'utf8');

    const securityFeatures = [
      { pattern: 'npm audit', description: 'NPM vulnerability scanning' },
      { pattern: 'codeql', description: 'CodeQL security analysis' },
      { pattern: 'dependency-review', description: 'Dependency review' },
      { pattern: 'schedule:', description: 'Scheduled security scans' }
    ];

    securityFeatures.forEach(({ pattern, description }) => {
      if (securityContent.toLowerCase().includes(pattern.toLowerCase())) {
        log(`  ✅ ${description} configured`, 'green');
        this.results.overall.passed++;
      } else {
        log(`  ❌ ${description} missing`, 'red');
        this.results.overall.failed++;
      }
    });
  }

  validateReleaseWorkflow() {
    subsection('Release Workflow Configuration');

    const releasePath = '.github/workflows/release.yml';
    if (!fs.existsSync(releasePath)) {
      log('  ❌ Release workflow file not found', 'red');
      return;
    }

    const releaseContent = fs.readFileSync(releasePath, 'utf8');

    const releaseFeatures = [
      { pattern: 'tags:', description: 'Tag-triggered releases' },
      { pattern: 'npm publish', description: 'NPM publishing' },
      { pattern: 'release-notes', description: 'Release notes generation' },
      { pattern: 'version-check', description: 'Version conflict detection' },
      { pattern: 'notify-failure', description: 'Failure notifications' }
    ];

    releaseFeatures.forEach(({ pattern, description }) => {
      if (releaseContent.includes(pattern)) {
        log(`  ✅ ${description} configured`, 'green');
        this.results.overall.passed++;
      } else {
        log(`  ❌ ${description} missing`, 'red');
        this.results.overall.failed++;
      }
    });
  }

  validateDependabotConfiguration() {
    subsection('Dependabot Configuration');

    // Check dependabot.yml
    const dependabotPath = '.github/dependabot.yml';
    if (fs.existsSync(dependabotPath)) {
      log('  ✅ Dependabot configuration file exists', 'green');

      const dependabotContent = fs.readFileSync(dependabotPath, 'utf8');

      if (dependabotContent.includes('npm') && dependabotContent.includes('github-actions')) {
        log('  ✅ Both npm and GitHub Actions updates configured', 'green');
        this.results.overall.passed++;
      } else {
        log('  ⚠️  Missing npm or GitHub Actions configuration', 'yellow');
        this.results.overall.warnings++;
      }
    } else {
      log('  ❌ Dependabot configuration missing', 'red');
      this.results.overall.failed++;
    }

    // Check auto-merge workflow
    const autoMergePath = '.github/workflows/dependabot-auto-merge.yml';
    if (fs.existsSync(autoMergePath)) {
      log('  ✅ Dependabot auto-merge workflow exists', 'green');

      const autoMergeContent = fs.readFileSync(autoMergePath, 'utf8');

      const autoMergeFeatures = [
        'patch',
        'minor',
        'major',
        'security audit',
        'auto-approve'
      ];

      autoMergeFeatures.forEach(feature => {
        if (autoMergeContent.toLowerCase().includes(feature)) {
          log(`  ✅ ${feature} handling configured`, 'green');
          this.results.overall.passed++;
        } else {
          log(`  ⚠️  ${feature} handling not found`, 'yellow');
          this.results.overall.warnings++;
        }
      });
    } else {
      log('  ❌ Dependabot auto-merge workflow missing', 'red');
      this.results.overall.failed++;
    }
  }

  validatePackageConfiguration() {
    subsection('Package Configuration');

    if (!fs.existsSync('package.json')) {
      log('  ❌ package.json not found', 'red');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // Check required scripts
    const requiredScripts = [
      'test',
      'test:ci',
      'test:coverage',
      'lint',
      'verify'
    ];

    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        log(`  ✅ Script "${script}" configured`, 'green');
        this.results.overall.passed++;
      } else {
        log(`  ❌ Script "${script}" missing`, 'red');
        this.results.overall.failed++;
      }
    });

    // Check engines
    if (packageJson.engines && packageJson.engines.node) {
      log(`  ✅ Node.js version requirement: ${packageJson.engines.node}`, 'green');
      this.results.overall.passed++;
    } else {
      log('  ⚠️  Node.js version requirement not specified', 'yellow');
      this.results.overall.warnings++;
    }
  }

  validateDocumentation() {
    subsection('Documentation and Monitoring');

    const docFiles = [
      { path: 'README.md', description: 'Main documentation' },
      { path: '.github/BRANCH_PROTECTION_SETUP.md', description: 'Branch protection guide' },
      { path: 'scripts/verify-branch-protection.js', description: 'Branch protection verification' },
      { path: 'scripts/validate-cicd-pipeline.js', description: 'Pipeline validation script' }
    ];

    docFiles.forEach(({ path: filePath, description }) => {
      if (fs.existsSync(filePath)) {
        log(`  ✅ ${description} exists`, 'green');
        this.results.overall.passed++;
      } else {
        log(`  ❌ ${description} missing`, 'red');
        this.results.overall.failed++;
      }
    });

    // Check README badges
    if (fs.existsSync('README.md')) {
      const readmeContent = fs.readFileSync('README.md', 'utf8');
      const badges = [
        'CI/CD Pipeline',
        'Security Analysis',
        'Release',
        'codecov',
        'npm version'
      ];

      badges.forEach(badge => {
        if (readmeContent.includes(badge)) {
          log(`  ✅ ${badge} badge present`, 'green');
          this.results.overall.passed++;
        } else {
          log(`  ⚠️  ${badge} badge missing`, 'yellow');
          this.results.overall.warnings++;
        }
      });
    }
  }

  runFunctionalTests() {
    subsection('Functional Tests');

    try {
      // Test npm scripts
      log('  Testing npm scripts...', 'yellow');

      execSync('npm run test:ci', { stdio: 'pipe' });
      log('  ✅ Test suite passes', 'green');
      this.results.overall.passed++;

      execSync('npm run lint', { stdio: 'pipe' });
      log('  ✅ Linting passes', 'green');
      this.results.overall.passed++;

      execSync('npm run verify', { stdio: 'pipe' });
      log('  ✅ Package verification passes', 'green');
      this.results.overall.passed++;

    } catch (error) {
      log(`  ❌ Functional tests failed: ${error.message}`, 'red');
      this.results.overall.failed++;
    }
  }

  generateReport() {
    section('Validation Report');

    const { passed, failed, warnings } = this.results.overall;
    const total = passed + failed + warnings;

    log(`📊 Overall Results:`, 'cyan');
    log(`  ✅ Passed: ${passed}`, 'green');
    log(`  ❌ Failed: ${failed}`, 'red');
    log(`  ⚠️  Warnings: ${warnings}`, 'yellow');
    log(`  📈 Total Checks: ${total}`, 'blue');

    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    log(`  🎯 Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');

    log(`\n📋 Recommendations:`, 'cyan');

    if (failed > 0) {
      log(`  🔧 Fix ${failed} failed checks before deploying to production`, 'red');
    }

    if (warnings > 0) {
      log(`  ⚠️  Address ${warnings} warnings to improve pipeline robustness`, 'yellow');
    }

    if (failed === 0 && warnings === 0) {
      log(`  🎉 Pipeline is fully configured and ready for production!`, 'green');
    }

    log(`\n📖 Next Steps:`, 'cyan');
    log(`  1. Configure branch protection rules (see .github/BRANCH_PROTECTION_SETUP.md)`, 'blue');
    log(`  2. Set up NPM_TOKEN secret for publishing`, 'blue');
    log(`  3. Test with a real pull request`, 'blue');
    log(`  4. Create a test release tag to validate publishing`, 'blue');
    log(`  5. Monitor workflow runs and adjust as needed`, 'blue');
  }

  async validate() {
    log('🚀 CI/CD Pipeline Validation Starting...', 'green');

    this.validateWorkflowFiles();
    this.validateCIWorkflow();
    this.validateSecurityWorkflow();
    this.validateReleaseWorkflow();
    this.validateDependabotConfiguration();
    this.validatePackageConfiguration();
    this.validateDocumentation();
    this.runFunctionalTests();
    this.generateReport();

    log('\n✨ Validation completed!', 'green');

    return this.results.overall.failed === 0;
  }
}

// Main execution
async function main() {
  try {
    const validator = new PipelineValidator();
    const success = await validator.validate();

    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`\n❌ Validation failed with error: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PipelineValidator;
