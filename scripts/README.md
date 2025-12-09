# Scripts Directory

Utility scripts for the CV project.

## build-resume.js

Builds resume JSON files by applying Mustache templating with i18n data.

### Usage

```bash
node scripts/build-resume.js <lang>
node scripts/build-resume.js all
```

### Arguments

- `lang` - Language code (e.g., `eng`, `rus`) or `all` for all languages

### Examples

```bash
# Build English resume
node scripts/build-resume.js eng

# Build Russian resume
node scripts/build-resume.js rus

# Build all languages
node scripts/build-resume.js all
```

### What It Does

1. Reads `cv.json` template
2. Loads i18n data from `i18n/<lang>.json`
3. Applies Mustache templating
4. Outputs to `out/<lang>.json`

### Used By

- `npm run build:all` - Builds all language versions
- GitHub Actions workflows
- Docker build process

## Development

### Adding New Scripts

When adding new scripts:
1. Use Node.js for consistency
2. Add shebang: `#!/usr/bin/env node`
3. Make executable: `chmod +x scripts/your-script.js`
4. Document in this README
5. Add error handling and validation
6. Use clear console output with emojis (✅ ❌ 📝)
