# Build & Release Scripts

> **Note**: Releases are automated via GitHub Actions. These scripts are primarily for the CI/CD pipeline and local testing.

## update-version.js

Automatically updates the `version` and `touch` (date) fields in the `meta` section of all resume JSON files.

### Usage

```bash
# Use version from package.json and current date
npm run update:version

# Or run directly with custom parameters
node scripts/update-version.js [version] [date]
```

### Parameters

- `version` (optional): Version string to use. Defaults to version from `package.json`
- `date` (optional): Date in YYYY-MM-DD format. Defaults to current date

### Examples

```bash
# Update all resume files with package.json version and today's date
npm run update:version

# Custom version and date
node scripts/update-version.js 2.0.0 2025-12-31

# Custom version, current date
node scripts/update-version.js 2.0.0
```

### How It Works

1. Reads all `*.json` files from the `resume/` directory
2. For each file:
   - Parses the JSON content
   - Updates `meta.version` and `meta.touch` fields
   - Preserves all other content and formatting
3. Reports success/failure for each file

### Multi-Language Support

The script automatically processes all JSON files in the `resume/` directory, making it easy to add new language versions without modifying the script.

Currently supported:
- `eng.json` - English
- `rus.json` - Russian

To add a new language, simply add a new JSON file (e.g., `spa.json` for Spanish) to the `resume/` directory with the same structure.

## Integration with GitHub Actions

The version update script is used by the GitHub Actions release workflow:

1. Developer creates a version tag (e.g., `v1.0.0`)
2. GitHub Actions workflow is triggered
3. Script extracts version from tag
4. Runs `update-version.js` with version and current date
5. Builds PDFs for all languages
6. Commits updated resume files back to repository
7. Creates GitHub Release with all artifacts

See `.github/workflows/release.yml` for the complete workflow.

### Local Testing

For local development and testing:
```bash
# Test version update
npm run update:version

# Build PDFs locally
npm run build:pdf
```

**Note**: Production releases should always be done via GitHub Actions by pushing version tags.

