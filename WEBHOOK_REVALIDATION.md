# Webhook Revalidation Guide

## Overview
Webhook endpoint được tạo để cho phép backend gọi để revalidate cache của Next.js khi dữ liệu thay đổi.

## Endpoint
```
POST /api/revalidate
```

## Authentication
Sử dụng Bearer token trong Authorization header:
```
Authorization: Bearer YOUR_WEBHOOK_SECRET
```

Set environment variable `WEBHOOK_SECRET` trong `.env.local`:
```
WEBHOOK_SECRET=buymeshop
```

## Usage Examples

### 1. Revalidate tất cả products
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer buymeshop" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "revalidate-all-products"
  }'
```

### 2. Revalidate một product cụ thể
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer buymeshop" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "revalidate-product",
    "productId": 123
  }'
```

### 3. Revalidate specific cache tags
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer buymeshop" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "revalidate-tags",
    "tags": ["products", "product-123", "ratings"]
  }'
```

### 4. Revalidate specific paths
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer buymeshop" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "revalidate-paths",
    "paths": ["/", "/products", "/products/123"]
  }'
```

## Backend Integration

### Python/Django Example
```python
import requests
import json

def revalidate_product_cache(product_id=None):
    webhook_url = "http://web:3000/api/revalidate"  # Internal Docker URL
    webhook_secret = "buymeshop"
    
    headers = {
        "Authorization": f"Bearer {webhook_secret}",
        "Content-Type": "application/json"
    }
    
    if product_id:
        payload = {
            "type": "revalidate-product",
            "productId": product_id
        }
    else:
        payload = {
            "type": "revalidate-all-products"
        }
    
    try:
        response = requests.post(webhook_url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error revalidating cache: {e}")
        return None

# Usage examples:
# revalidate_product_cache()  # Revalidate all products
# revalidate_product_cache(123)  # Revalidate specific product
```

### Node.js/Express Example
```javascript
const axios = require('axios');

async function revalidateProductCache(productId = null) {
    const webhookUrl = 'http://web:3000/api/revalidate';
    const webhookSecret = 'buymeshop';
    
    const headers = {
        'Authorization': `Bearer ${webhookSecret}`,
        'Content-Type': 'application/json'
    };
    
    const payload = productId 
        ? { type: 'revalidate-product', productId }
        : { type: 'revalidate-all-products' };
    
    try {
        const response = await axios.post(webhookUrl, payload, { headers });
        return response.data;
    } catch (error) {
        console.error('Error revalidating cache:', error);
        return null;
    }
}
```

## Cache Tags Used

### Product API Cache Tags:
- `products` - Tất cả products list
- `product` - Individual products 
- `product-{id}` - Specific product by ID
- `ratings` - Tất cả ratings
- `rating-{id}` - Specific rating by product ID

## When to Trigger Revalidation

1. **Product Created/Updated/Deleted**: Call `revalidate-all-products`
2. **Specific Product Updated**: Call `revalidate-product` with productId
3. **Rating Added/Updated**: Call `revalidate-product` with productId
4. **Bulk Operations**: Call `revalidate-all-products`

## Response Format

### Success Response:
```json
{
    "message": "Revalidated all product caches",
    "revalidated": true,
    "now": 1642762800000
}
```

### Error Response:
```json
{
    "error": "Unauthorized"
}
```

## Testing

Test endpoint availability:
```bash
curl http://localhost:3000/api/revalidate
```

This will return information about available endpoints and usage.
