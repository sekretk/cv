#!/bin/bash

# Script to fix stuck Helm release in cv namespace

NAMESPACE="cv"
RELEASE="cv"

echo "🔧 Fixing stuck Helm release..."
echo "================================"

# Check if release exists
if ! helm list -n "$NAMESPACE" -q | grep -q "^$RELEASE$"; then
  echo "✅ No release found - nothing to fix"
  exit 0
fi

echo "📋 Current release status:"
helm status "$RELEASE" -n "$NAMESPACE" || true

echo ""
echo "🧹 Attempting to fix..."

# Try rollback first (gentler approach)
if helm rollback "$RELEASE" -n "$NAMESPACE" 2>/dev/null; then
  echo "✅ Successfully rolled back to previous version"
  exit 0
fi

echo "⚠️ Rollback failed, will remove stuck release..."

# If rollback fails, uninstall
if helm uninstall "$RELEASE" -n "$NAMESPACE" --wait; then
  echo "✅ Successfully removed stuck release"
  echo ""
  echo "You can now retry the deployment:"
  echo "  git tag 1.0.2"
  echo "  git push origin 1.0.2"
else
  echo "❌ Failed to remove release"
  echo ""
  echo "Manual cleanup may be required:"
  echo "  kubectl get all -n $NAMESPACE"
  echo "  kubectl delete deployment $RELEASE -n $NAMESPACE"
  exit 1
fi

