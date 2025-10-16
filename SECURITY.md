# Security Policy

## Supported Versions

We actively support the following versions of this project with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@example.com**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

## Security Considerations

### File System Access

This CLI tool:
- Reads files from the file system based on user-provided glob patterns
- Writes files to the file system when using `-w` or `-o` options
- Creates directories when necessary for output

### Input Validation

- Glob patterns are validated using the `glob` library
- File paths are sanitized to prevent directory traversal
- Input files are read with UTF-8 encoding

### Dependencies

We regularly monitor our dependencies for security vulnerabilities:
- `commander`: CLI argument parsing
- `glob`: File pattern matching
- `strip-comments`: Comment removal engine

### Best Practices

When using this tool:
- Always backup your files before using the `-w` (write) option
- Be cautious with glob patterns that might match unintended files
- Verify the output directory when using the `-o` option
- Run the tool in a controlled environment first

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 1.0.1, 1.0.2)
- Documented in the CHANGELOG.md
- Announced through GitHub releases
- Tagged with security labels

## Vulnerability Disclosure Timeline

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Initial response and acknowledgment
3. **Day 3-7**: Investigation and assessment
4. **Day 8-14**: Fix development and testing
5. **Day 15-21**: Release preparation
6. **Day 22**: Public disclosure and release

This timeline may vary depending on the complexity of the vulnerability.

## Security Best Practices for Contributors

### Code Review

- All code changes require review
- Security-sensitive changes require additional scrutiny
- Automated security scanning is performed on all commits

### Dependencies

- Keep dependencies up to date
- Monitor for security advisories
- Use `npm audit` to check for vulnerabilities
- Pin dependency versions in package-lock.json

### Testing

- Include security test cases
- Test with malicious input
- Verify file system access controls
- Test cross-platform compatibility

## Scope

This security policy applies to:
- The main CLI tool (`bin/document.js`)
- All supporting scripts and utilities
- Dependencies and their usage
- Documentation and examples

## Out of Scope

The following are generally not considered security vulnerabilities:
- Issues requiring physical access to the machine
- Social engineering attacks
- Issues in dependencies that don't affect this tool
- Performance issues without security implications

## Recognition

We appreciate the security research community's efforts to improve the security of open source software. Security researchers who responsibly disclose vulnerabilities will be:

- Credited in the security advisory (unless they prefer to remain anonymous)
- Listed in our hall of fame (if they consent)
- Thanked in the release notes

## Contact

For security-related questions or concerns:
- Email: akshatsinhasramhardy@gmail.com
- For non-security issues: Use GitHub issues

## Additional Resources

- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Guidelines](https://docs.npmjs.com/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

This security policy is based on industry best practices and will be updated as needed to reflect changes in the threat landscape and our security posture.
