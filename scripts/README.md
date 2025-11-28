# Scripts Directory

Utility scripts for the CV project.

## update-version.js

Updates version and date information in `cv.json`.

### Usage

```bash
node scripts/update-version.js <version> <date>
```

### Arguments

- `version` - Semantic version (e.g., `1.0.0`)
- `date` - Release date in YYYY-MM-DD format (e.g., `2025-11-28`)

### Examples

```bash
# Update to version 1.0.0 with current date
node scripts/update-version.js 1.0.0 2025-11-28

# Update to version 2.1.3
node scripts/update-version.js 2.1.3 2025-12-01
```

### What It Does

1. Reads `cv.json`
2. Updates `meta.version` field
3. Updates `meta.touch` field
4. Writes back to `cv.json` with proper formatting

### Used By

- GitHub Actions release workflow (`.github/workflows/release.yml`)
- Automatically runs when you push a version tag

### Error Handling

The script validates:
- Version format (must be X.Y.Z)
- Date format (must be YYYY-MM-DD)
- File existence
- JSON syntax

Exits with code 1 on any error.

## Development

### Testing Locally

```bash
# Test version update
node scripts/update-version.js 0.0.99 2025-11-28

# Check the result
git diff cv.json

# Revert if needed
git checkout cv.json
```

### Adding New Scripts

When adding new scripts:
1. Use Node.js for consistency
2. Add shebang: `#!/usr/bin/env node`
3. Make executable: `chmod +x scripts/your-script.js`
4. Document in this README
5. Add error handling and validation
6. Use clear console output with emojis (✅ ❌ 📝)

