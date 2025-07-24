#!/bin/bash

# Test script for webhook revalidation
echo "🚀 Testing Webhook Revalidation..."

BASE_URL="http://localhost:3000/api/revalidate"
AUTH_TOKEN="buymeshop"

echo ""
echo "1. Testing GET endpoint (info)..."
curl -s $BASE_URL | jq .

echo ""
echo "2. Testing revalidate all products..."
curl -s -X POST $BASE_URL \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "revalidate-all-products"}' | jq .

echo ""
echo "3. Testing revalidate specific product..."
curl -s -X POST $BASE_URL \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "revalidate-product", "productId": 123}' | jq .

echo ""
echo "4. Testing revalidate specific tags..."
curl -s -X POST $BASE_URL \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "revalidate-tags", "tags": ["products", "ratings"]}' | jq .

echo ""
echo "5. Testing revalidate specific paths..."
curl -s -X POST $BASE_URL \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "revalidate-paths", "paths": ["/", "/products"]}' | jq .

echo ""
echo "6. Testing unauthorized request..."
curl -s -X POST $BASE_URL \
  -H "Authorization: Bearer wrong-key" \
  -H "Content-Type: application/json" \
  -d '{"type": "revalidate-all-products"}' | jq .

echo ""
echo "✅ Webhook tests completed!"
