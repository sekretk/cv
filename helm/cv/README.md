# CV Helm Chart

A Helm chart for deploying the CV Resume Application to Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- Traefik ingress controller
- Let's Encrypt certificate resolver configured

## Installation

### Add the chart repository (if published)
```bash
helm repo add cv https://sekretk.github.io/cv
helm repo update
```

### Install the chart
```bash
# Install with default values
helm install cv ./helm/cv

# Install with custom values
helm install cv ./helm/cv -f custom-values.yaml

# Install in a specific namespace
helm install cv ./helm/cv --namespace cv --create-namespace
```

### Upgrade the chart
```bash
helm upgrade cv ./helm/cv
```

### Uninstall the chart
```bash
helm uninstall cv
```

## Configuration

### Key Configuration Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `image.repository` | Container image repository | `ghcr.io/sekretk/cv` |
| `image.tag` | Container image tag | `""` (uses Chart.AppVersion) |
| `replicaCount` | Number of replicas | `1` |
| `service.type` | Service type | `ClusterIP` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.hosts[0].host` | Domain name | `cv.boysthings.top` |
| `persistence.enabled` | Enable persistent storage | `true` |
| `persistence.size` | Storage size | `1Gi` |
| `env.GENERATE_PDF` | Enable PDF generation | `"true"` |

### Traefik Ingress Configuration

The chart is pre-configured for Traefik with:
- TLS enabled
- Let's Encrypt certificate resolver: `letsencrypt-boysthings`
- Entry point: `websecure`

### Example Custom Values

```yaml
# custom-values.yaml
replicaCount: 2

image:
  tag: "v1.0.0"

ingress:
  hosts:
    - host: cv.example.com
      paths:
        - path: /
          pathType: Prefix

persistence:
  size: 2Gi
  storageClass: "fast-ssd"

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

## Features

- **Automatic PDF Generation**: PDFs are generated on startup
- **Persistent Storage**: PDFs are stored in persistent volumes
- **Health Checks**: Liveness and readiness probes
- **Security**: Non-root user, read-only filesystem options
- **Auto-scaling**: Horizontal Pod Autoscaler support
- **TLS**: Automatic Let's Encrypt certificates via Traefik

## Troubleshooting

### Check pod status
```bash
kubectl get pods -l app.kubernetes.io/name=cv
```

### View logs
```bash
kubectl logs -l app.kubernetes.io/name=cv
```

### Check ingress
```bash
kubectl get ingress
kubectl describe ingress cv
```

### Access the application
```bash
# Port forward for local access
kubectl port-forward svc/cv 8080:80
```

## Development

### Lint the chart
```bash
helm lint ./helm/cv
```

### Test the chart
```bash
helm template cv ./helm/cv
```

### Dry run installation
```bash
helm install cv ./helm/cv --dry-run --debug
```
