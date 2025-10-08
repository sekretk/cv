#!/bin/bash

# Script to diagnose pod issues in cv namespace

NAMESPACE="cv"

echo "🔍 Diagnosing CV deployment issues..."
echo "======================================"
echo ""

echo "1️⃣ Pod Status:"
kubectl get pods -n "$NAMESPACE" -o wide
echo ""

echo "2️⃣ Pod Details:"
POD_NAME=$(kubectl get pods -n "$NAMESPACE" -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

if [ -n "$POD_NAME" ]; then
  echo "Found pod: $POD_NAME"
  echo ""
  
  echo "3️⃣ Pod Status Reason:"
  kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.status.containerStatuses[0].state}' | jq '.'
  echo ""
  
  echo "4️⃣ Pod Events (last 10):"
  kubectl describe pod "$POD_NAME" -n "$NAMESPACE" | grep -A 20 "Events:" | tail -20
  echo ""
  
  echo "5️⃣ Pod Logs (if available):"
  kubectl logs "$POD_NAME" -n "$NAMESPACE" --tail=50 2>&1 || echo "❌ Logs not available"
  echo ""
  
  echo "6️⃣ Image being pulled:"
  kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.containers[0].image}'
  echo ""
  echo ""
  
  echo "7️⃣ Full Pod Description:"
  kubectl describe pod "$POD_NAME" -n "$NAMESPACE"
else
  echo "❌ No pods found in namespace $NAMESPACE"
fi

echo ""
echo "8️⃣ Deployment Status:"
kubectl get deployment cv -n "$NAMESPACE" -o yaml 2>/dev/null | grep -A 5 "conditions:" || echo "No deployment found"

echo ""
echo "9️⃣ All Events in namespace:"
kubectl get events -n "$NAMESPACE" --sort-by='.lastTimestamp' | tail -20

