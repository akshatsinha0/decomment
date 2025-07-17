# CI/CD Pipeline Guide

This document provides a comprehensive guide to the CI/CD pipeline setup for the decomment CLI tool project.

## Pipeline Overview

The CI/CD pipeline consists of four main workflows:

1. **CI/CD Pipeline** (`ci.yml`) - Main testing and quality checks
2. **Security Analysis** (`security.yml`) - Security scanning and vulnerability detection
3. **Release and Publish** (`release.yml`) - Automated releases and NPM publishing
4. **Dependabot Auto-merge** (`dependabot-auto-merge.yml`) - Automated dependency management

## Workflow Details

### 1. CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Release events

**Jobs:**

#### Test Job
- **Matrix Testing**: Runs on Ubuntu, Windows, and macOS
- **Node.js Versions**: Tests with 16.x, 18.x, and 20.x
- **Steps**:
  1. Checkout code
  2. Setup Node.js with caching
  3. Install dependencies (`npm ci`)
  4. Run linting (`npm run lint`)
  5. Run tests with coverage (`npm run test:ci`)
  6. Check coverage threshold (80%)
  7. Upload coverage to Codecov
  8. Report coverage status on PRs
  9. Verify package integrity
  10. Generate test summary

#### Security Job
- **Purpose**: Basic security audit
- **Steps**:
  1. Run `npm audit` at moderate level
  2. Check for high-level vulnerabilities in production dependencies
  3. Generate security summary

#### Build Job
- **Purpose**: Create and test package
- **Dependencies**: Requires test and security jobs to pass
- **Steps**:
  1. Create NPM package (`npm pack`)
  2. Upload package as artifact

#### Publish Job
- **Purpose**: Publish to NPM on releases
- **Trigger**: Only on release events
- **Dependencies**: Requires test, security, and build jobs
- **Steps**:
  1. Run tests again
  2. Publish to NPM with authentication

#### Integration Test Job
- **Purpose**: Test the actual CLI functionality
- **Dependencies**: Requires build job
- **Matrix**: Tests on all platforms
- **Steps**:
  1. Download built package
  2. Install globally
  3. Test CLI commands and functionality

### 2. Security Analysis (`security.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Weekly schedule (Mondays at 9 AM UTC)

**Jobs:**

#### Security Scan
- NPM audit at multiple levels
- Critical vulnerability detection
- Blocks on critical issues

#### CodeQL Analysis
- Static codnalysis for JavaScript
- Security vulnerability detection
- SARIF report generation

#### Dependency Review
- Reviews dependency changes in PRs
- Checks for license compliance
- Fails on moderate+ severity issues

### 3. Release and Publish (`release.yml`)

**Triggers:**
- Tag push matching `v*.*.*` pattern

**Jobs:**

#### Release Job
- **Purpose**: Create GitHub release
- **Steps**:
  1. Generate release notes from git history
  2. Create GitHub release with notes
  3. Output release information

#### Publish Job
- **Purpose**: Publish to NPM
- **Dependencies**: Requires release job
- **Steps**:
  1. Check if version already exists on NPM
  2. Publish if new version
  3. Skip if version exists (no error)
  4. Create success notification

#### Notify Failure Job
- **Purpose**: Create GitHub issue on failure
- **Trigger**: Only if other jobs fail
- **Creates**: Detailed failure issue with troubleshooting info

### 4. Dependabot Auto-merge (`dependabot-auto-merge.yml`)

**Triggers:**
- Pull requests from Dependabot
- Workflow completion events

**Job: Auto-merge**
- **Purpose**: Automatically handle dependency updates
- **Steps**:
  1. Run security audit
  2. Check for critical vulnerabilities
  3. Run full test suite
  4. Determine update type (patch/minor/major)
  5. Auto-approve and merge patch updates
  6. Comment on minor updates (manual review required)
  7. Comment on major updates (careful review required)

## Branch Protection Requirements

The pipeline is designed to work with these branch protection rules:

### Required Status Checks
- `test (ubuntu-latest, 16.x)`
- `test (ubuntu-latest, 18.x)`
- `test (ubuntu-latest, 20.x)`
- `test (macos-latest, 16.x)`
- `test (macos-latest, 18.x)`
- `test (macos-latest, 20.x)`
- `test (windows-latest, 16.x)`
- `test (windows-latest, 18.x)`
- `test (windows-latest, 20.x)`
- `security-scan`
- `codeql-analysis`
- `build`

### Protection Rules
- Require pull request reviews (minimum 1)
- Require status checks to pass
- Require branches to be up to date
- Restrict direct pushes to main
- No force pushes allowed
- No branch deletions allowed

## Secrets Configuration

The following secrets need to be configured in repository settings:

### Required Secrets
- `NPM_TOKEN`: NPM authentication token for publishing
- `CODECOV_TOKEN`: Codecov token for coverage reporting (optional)

### Secret Setup
1. Go to repository Settings → Secrets and variables → Actions
2. Add `NPM_TOKEN`:
   - Generate token at https://www.npmjs.com/settings/tokens
   - Use "Automation" token type
   - Scope: Publish packages
3. Add `CODECOV_TOKEN` (optional):
   - Get token from https://codecov.io/
   - Used for enhanced coverage reporting

## Monitoring and Notifications

### Status Badges
The README includes status badges for:
- CI/CD Pipeline status
- Security Analysis status
- Release workflow status
- Code coverage percentage
- NPM package version
- Node.js version compatibility

### Workflow Summaries
Each workflow generates detailed summaries including:
- Test results by platform and Node.js version
- Security scan results and vulnerability counts
- Coverage reports and threshold status
- Build and deployment status

### Failure Notifications
- Release failures create GitHub issues automatically
- Security issues block PRs and deployments
- Test failures prevent merging
- Coverage drops below 80% create warnings

## Testing the Pipeline

### Validation Script
Run the comprehensive validation:
```bash
node scripts/validate-cicd-pipeline.js
```

### Branch Protection Verification
Test branch protection setup:
```bash
node scripts/verify-branch-protection.js
```

### Manual Testing Steps

1. **Test CI Pipeline:**
   ```bash
   # Create feature branch
   git checkout -b test-ci-pipeline

   # Make a small change
   echo "// Test comment" >> test-file.js

   # Commit and push
   git add test-file.js
   git commit -m "test: validate CI pipeline"
   git push origin test-ci-pipeline

   # Create PR and verify all checks run
   ```

2. **Test Security Scanning:**
   ```bash
   # Add a package with known vulnerabilities (for testing)
   npm install --save-dev old-vulnerable-package

   # Push and verify security workflow catches it
   ```

3. **Test Release Workflow:**
   ```bash
   # Create and push a test tag
   git tag v1.0.1-test
   git push origin v1.0.1-test

   # Verify release workflow runs
   # Check NPM for published package
   ```

4. **Test Dependabot Integration:**
   - Wait for Dependabot PRs or manually trigger
   - Verify auto-merge works for patch updates
   - Verify manual review required for major updates

## Troubleshooting

### Common Issues

#### 1. Tests Failing on Specific Platforms
**Symptoms:** Tests pass locally but fail on Windows/macOS
**Solutions:**
- Check file path separators
- Verify line ending handling
- Test platform-specific dependencies

#### 2. Security Scan False Positives
**Symptoms:** Security workflow blocks valid changes
**Solutions:**
- Review audit results carefully
- Update dependencies if needed
- Use `npm audit fix` for automatic fixes
- Consider audit exceptions for false positives

#### 3. Coverage Threshold Issues
**Symptoms:** Coverage drops below 80%
**Solutions:**
- Add tests for uncovered code
- Review coverage report in workflow logs
- Adjust threshold if appropriate
- Exclude non-testable files

#### 4. NPM Publishing Failures
**Symptoms:** Release workflow fails at publish step
**Solutions:**
- Verify NPM_TOKEN is valid and has publish permissions
- Check if version already exists on NPM
- Ensure package.json version is updated
- Review NPM registry status

#### 5. Dependabot Auto-merge Issues
**Symptoms:** Dependabot PRs not auto-merging
**Solutions:**
- Verify PR title format matches patterns
- Check if all CI checks are passing
- Review security audit results
- Ensure no critical vulnerabilities

### Debug Information

#### Workflow Logs
- Access via GitHub Actions tab
- Check individual job logs
- Look for error messages and stack traces
- Review artifact uploads/downloads

#### Local Testing
```bash
# Run the same commands locally
npm ci
npm run lint
npm run test:ci
npm run verify
npm audit --audit-level=high --production
```

#### Coverage Analysis
```bash
# Generate detailed coverage report
npm run test:coverage
open coverage/lcov-report/index.html
```

## Performance Optimization

### Caching Strategy
- Node.js setup uses built-in caching
- Dependencies cached between runs
- Artifacts shared between jobs

### Parallel Execution
- Matrix jobs run in parallel
- Independent workflows run concurrently
- Fail-fast disabled for comprehensive testing

### Timeout Management
- 10-minute timeout for most jobs
- Prevents hanging workflows
- Balances thoroughness with speed

## Maintenance

### Regular Tasks
1. **Monthly**: Review and update Node.js versions in matrix
2. **Quarterly**: Update GitHub Actions versions
3. **As Needed**: Adjust security thresholds
4. **Weekly**: Review Dependabot PRs and auto-merge effectiveness

### Monitoring
- Watch for workflow failure trends
- Monitor test execution times
- Track security scan results
- Review coverage trends

### Updates
- Keep GitHub Actions up to date
- Monitor for new security scanning tools
- Update Node.js versions as they're released
- Adjust thresholds based on project needs

## Best Practices

1. **Always test changes in feature branches first**
2. **Keep workflows simple and focused**
3. **Use meaningful commit messages for better release notes**
4. **Monitor workflow execution times and optimize as needed**
5. **Regularly review and update security configurations**
6. **Document any custom configurations or exceptions**
7. **Test the complete pipeline periodically**
8. **Keep secrets secure and rotate regularly**

## Support

For issues with the CI/CD pipeline:
1. Check this documentation first
2. Review workflow logs in GitHub Actions
3. Run validation scripts locally
4. Check GitHub Actions status page for service issues
5. Review recent changes that might have affected the pipeline
