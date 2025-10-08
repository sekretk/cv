# GitHub Actions Workflows

## Release Workflow

**File**: [release.yml](mdc:release.yml)

### Purpose

Automates the entire release process for the CV project, including:
- Version management for all resume JSON files
- PDF generation for all languages
- Creating GitHub Releases with artifacts

### Trigger

The workflow is triggered when you push a version tag:

```bash
git tag 1.0.0
git push origin 1.0.0
```

Tag format: `\d.\d.\d` (e.g., 1.0.0, 2.1.3)

### Workflow Steps

**Job 1: Release**
1. **Checkout code** - Fetches the repository
2. **Setup Node.js** - Installs Node.js 18
3. **Install dependencies** - Runs `npm ci`
4. **Extract version** - Gets version from tag (1.0.0)
5. **Get release date** - Gets current date in YYYY-MM-DD format
6. **Update resume files** - Runs `scripts/update-version.js` with version and date
7. **Build PDFs** - Generates PDF files for all languages
8. **Commit changes** - Commits updated resume JSON files back to main branch
9. **Push changes** - Pushes commits to repository
10. **Create Release** - Creates GitHub Release with PDFs and JSON files

**Job 2: Deploy** (runs after successful release)
1. **Checkout code** - Fetches the repository
2. **Install kubectl** - Installs Kubernetes CLI
3. **Install Helm** - Installs Helm 3
4. **Setup cluster access** - Configures kubectl with KUBE_CONFIG secret
5. **Pre-deployment inspection** - Checks existing cluster state
6. **Validate Helm chart** - Runs `helm lint`
7. **Deploy with Helm** - Deploys to `cv` namespace with version tag
8. **Monitor progress** - Watches deployment status and pods
9. **Post-deployment inspection** - Verifies deployment health
10. **Create summary** - Generates deployment report with live URLs

### Artifacts

Each release includes:
- `resume.eng.pdf` - English resume PDF
- `resume.rus.pdf` - Russian resume PDF
- `eng.json` - English resume JSON (with updated version/date)
- `rus.json` - Russian resume JSON (with updated version/date)

### Multi-Language Support

The workflow automatically handles all JSON files in the `resume/` directory:
- No hardcoded file list
- Adding new languages (e.g., `spa.json`) requires no workflow changes
- All language PDFs are automatically built and included in releases

### Creating a Release

```bash
# 1. Update version in package.json
# Edit package.json: "version": "1.2.0"

# 2. Commit and push
git add package.json
git commit -m "chore: bump version to 1.2.0"
git push

# 3. Create and push tag
git tag 1.2.0
git push origin 1.2.0

# 4. GitHub Actions does the rest!
# Check: https://github.com/sekretk/cv/actions
```

### Secrets

**Required for Kubernetes deployment:**
- `KUBE_CONFIG` - Base64-encoded Kubernetes configuration file

**How to add:**
```bash
# 1. Encode your kubeconfig
cat ~/.kube/config | base64

# 2. Go to repository Settings → Secrets and variables → Actions
# 3. Click "New repository secret"
# 4. Name: KUBE_CONFIG
# 5. Value: <paste base64 output>
```

**Workflow behavior:**
- If `KUBE_CONFIG` is set: Full deployment to Kubernetes
- If not set: Release only (deployment skipped gracefully)

### Permissions

The workflow requires:
- **Release job:** `contents: write` - To push commits and create releases
- **Deploy job:** `contents: read` - For Kubernetes deployment
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

### Monitoring

- View workflow runs: `https://github.com/sekretk/cv/actions`
- Check release status: `https://github.com/sekretk/cv/releases`
- Review workflow logs for debugging

### Troubleshooting

**Workflow doesn't trigger**:
- Ensure tag follows `\d.\d.\d` format (e.g., 1.0.0)
- Check that tag was pushed: `git push origin 1.0.0`

**PDF generation fails**:
- Check resume JSON files are valid
- Verify `resume-cli` is in dependencies

**Commit fails**:
- Workflow uses GitHub Actions bot account
- Commits are pushed to `main` branch

**Release creation fails**:
- Check `GITHUB_TOKEN` permissions
- Verify PDF files were generated successfully

**Deployment skipped**:
- Verify `KUBE_CONFIG` secret is configured
- Check secret is base64-encoded correctly
- Test cluster connectivity: `kubectl cluster-info`

**Helm deployment fails**:
- Validate chart: `helm lint ./helm/cv`
- Check namespace exists or can be created
- Review logs in Actions workflow output
- Verify image tag matches release version

