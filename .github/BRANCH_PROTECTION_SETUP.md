# Branch Protection Rules Setup Guide

This document provides instructions for setting up comprehensive branch protection rules for the main branch to ensure code quality and security.

## Required Branch Protection Rules

### Main Branch Protection

Navigate to: `Settings` → `Branches` → `Add rule` for `main` branch

#### Required Settings:

1. **Restrict pushes that create files**
   - ✅ Require a pull request before merging
   - ✅ Require approvals: **1**
   - ✅ Dismiss stale reviews when new commits are pushed
   - ✅ Require review from code owners (if CODEOWNERS file exists)

2. **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - **Required status checks:**
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

3. **Additional Restrictions**
   - ✅ Restrict pushes that create files
   - ✅ Do not allow bypassing the above settings
   - ✅ Allow force pushes: **Disabled**
   - ✅ Allow deletions: **Disabled**

## Verification

After setting up the branch protection rules, you can verify them by:

1. **Testing Direct Push Restriction:**
   ```bash
   # This should be rejected
   git push origin main
   ```

2. **Testing PR Requirements:**
   - Create a test branch
   - Make a small change
   - Create a pull request
   - Verify that all status checks are required
   - Verify that approval is required

3. **Testing Status Check Requirements:**
   - Create a PR with failing tests
   - Verify that merge is blocked until tests pass

## Current Status Checks

The following workflows provide status checks:

- **CI/CD Pipeline** (`ci.yml`): Provides multi-platform testing
- **Security Analysis** (`security.yml`): Provides security scanning
- **Dependabot Auto-merge** (`dependabot-auto-merge.yml`): Handles dependency updates

## Troubleshooting

### Common Issues:

1. **Status checks not appearing:**
   - Ensure workflows have run at least once
   - Check workflow names match exactly
   - Verify branch names in workflow triggers

2. **Unable to merge despite passing checks:**
   - Verify branch is up to date with main
   - Check if all required reviewers have approved
   - Ensure no new commits were pushed after approval

3. **Dependabot PRs blocked:**
   - Dependabot PRs should automatically run CI checks
   - Auto-merge workflow handles patch updates
   - Manual review required for minor/major updates

## Repository Settings Checklist

- [ ] Branch protection rule created for `main` branch
- [ ] Pull request reviews required (minimum 1)
- [ ] Status checks required and configured
- [ ] Branch must be up to date before merging
- [ ] Direct pushes to main branch restricted
- [ ] Force pushes disabled
- [ ] Branch deletions disabled
- [ ] Settings cannot be bypassed by administrators

## Testing the Setup

Run the verification script to test the branch protection:

```bash
node scripts/verify-branch-protection.js
```

This script will:
- Check if branch protection rules are active
- Verify required status checks are configured
- Test that direct pushes are blocked
- Validate PR workflow requirements
