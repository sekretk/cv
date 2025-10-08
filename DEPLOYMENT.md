# CV Deployment Guide

## Overview

This project uses GitHub Actions for automated releases and deployments to Kubernetes.

## Prerequisites

1. **GitHub Container Registry Access**: Docker images are pushed to `ghcr.io`
2. **Kubernetes Cluster**: With kubeconfig file for access
3. **Helm 3**: Kubernetes package manager

## Setup

### 1. Configure GitHub Secrets

Add `KUBE_CONFIG` secret for Kubernetes deployment:

```bash
# Encode your kubeconfig
cat ~/.kube/config | base64 | pbcopy

# Add to GitHub:
# Settings → Secrets and variables → Actions → New repository secret
# Name: KUBE_CONFIG
# Value: <paste from clipboard>
```

### 2. Make Docker Image Public (First Release Only)

After the first release, the Docker image will be private by default. Make it public:

1. Go to: https://github.com/sekretk?tab=packages
2. Click on `cv` package
3. Click "Package settings" (right sidebar)
4. Scroll to "Danger Zone"
5. Click "Change visibility"
6. Select "Public"
7. Confirm

Alternatively, add `imagePullSecrets` to your Kubernetes cluster.

## Creating a Release

### 1. Update Version

Edit `package.json`:
```json
{
  "version": "1.0.0"
}
```

### 2. Commit and Push

```bash
git add package.json
git commit -m "chore: bump version to 1.0.0"
git push
```

### 3. Create and Push Tag

```bash
# Create tag (without 'v' prefix)
git tag 1.0.0

# Push tag to trigger release
git push origin 1.0.0
```

### 4. Monitor Release

GitHub Actions will automatically:
- ✅ Update all resume JSON files with version and date
- ✅ Build PDF files for all languages
- ✅ Build and push Docker image to GHCR
- ✅ Create GitHub Release with artifacts
- ✅ Deploy to Kubernetes (if KUBE_CONFIG is configured)

**Monitor progress:**
- Workflow: https://github.com/sekretk/cv/actions
- Releases: https://github.com/sekretk/cv/releases

## Deployment Details

### Kubernetes Configuration

- **Namespace:** `cv`
- **Chart:** `helm/cv/`
- **Image:** `ghcr.io/sekretk/cv:{version}`
- **Services:**
  - English CV: Port 6002
  - Russian CV: Port 6003
  - PDF Files: Port 6001

### Live URLs

After successful deployment:
- 🌐 English: https://cv.boysthings.top/
- 🌐 Russian: https://cv.boysthings.top/rus
- 📄 PDFs: https://cv.boysthings.top/pdf

## Manual Deployment

If you need to deploy manually:

```bash
# 1. Build Docker image locally
docker build -t ghcr.io/sekretk/cv:1.0.0 .

# 2. Push to registry (requires authentication)
docker push ghcr.io/sekretk/cv:1.0.0

# 3. Deploy with Helm
helm upgrade --install cv ./helm/cv \
  --namespace cv \
  --create-namespace \
  --set image.tag=1.0.0

# 4. Check deployment
kubectl get pods -n cv
helm status cv -n cv
```

## Troubleshooting

### Workflow Not Triggering

- Verify tag format: `1.0.0` (no "v" prefix)
- Check you pushed the tag: `git push origin 1.0.0`
- View workflow runs: https://github.com/sekretk/cv/actions

### Docker Build Fails

- Check Dockerfile syntax
- Verify all files exist (resume/, pdf/, etc.)
- Review build logs in Actions workflow

### Deployment Fails

**ImagePullBackOff (Image not found):**
```bash
# Check if image exists
docker pull ghcr.io/sekretk/cv:1.0.0

# Make package public (see setup section above)
```

**Pods not starting:**
```bash
# Check pod logs
kubectl logs -n cv <pod-name>

# Describe pod for events
kubectl describe pod -n cv <pod-name>

# Check deployment status
kubectl get deployment -n cv
```

**Helm errors:**
```bash
# Validate chart
helm lint ./helm/cv

# Check existing release
helm list -n cv

# Get release history
helm history cv -n cv

# Rollback if needed
helm rollback cv -n cv
```

### Permission Issues

**GitHub Container Registry:**
- Ensure `packages: write` permission in workflow
- Check GitHub token has package access
- Verify repository settings allow package creation

**Kubernetes:**
- Test cluster connectivity: `kubectl cluster-info`
- Verify kubeconfig is valid
- Check RBAC permissions for namespace

## Rollback

### Rollback Kubernetes Deployment

```bash
# List releases
helm list -n cv

# View history
helm history cv -n cv

# Rollback to previous version
helm rollback cv -n cv

# Or rollback to specific revision
helm rollback cv 2 -n cv
```

### Rollback via Git

```bash
# Revert to previous version
git revert <commit-hash>
git push

# Create new release with old version
git tag 1.0.0
git push origin 1.0.0
```

## Monitoring

### Check Deployment Status

```bash
# Pods
kubectl get pods -n cv -w

# Deployment
kubectl get deployment cv -n cv

# Services
kubectl get svc -n cv

# Ingress
kubectl get ingress -n cv

# Events
kubectl get events -n cv --sort-by='.lastTimestamp'
```

### View Logs

```bash
# Current logs
kubectl logs -n cv deployment/cv --tail=100 -f

# Previous logs
kubectl logs -n cv <pod-name> --previous
```

### Helm Status

```bash
# Current status
helm status cv -n cv

# List all releases
helm list -n cv

# Release history
helm history cv -n cv
```

## Cleanup

### Remove Deployment

```bash
# Uninstall Helm release
helm uninstall cv -n cv

# Delete namespace (optional)
kubectl delete namespace cv
```

### Remove Docker Images

```bash
# Via GitHub UI
# Go to: https://github.com/sekretk?tab=packages
# Click on package → Settings → Delete package

# Via Docker CLI (local only)
docker rmi ghcr.io/sekretk/cv:1.0.0
```

## Support

For issues:
1. Check GitHub Actions logs
2. Review Kubernetes events and logs
3. Validate Helm chart: `helm lint ./helm/cv`
4. Test locally: `npm run serve:eng:watch`

GitHub Issues: https://github.com/sekretk/cv/issues

