"""
Webhook utility for revalidating Next.js cache when data changes.
"""
import requests
from typing import Optional, List
import os


class WebhookRevalidator:
    def __init__(self):
        # URL của Next.js app (từ container perspective)
        self.webhook_url = os.getenv("NEXTJS_WEBHOOK_URL", "http://web:3000/api/revalidate")
        self.webhook_secret = os.getenv("WEBHOOK_SECRET", "buymeshop")
        
    def _make_request(self, payload: dict) -> Optional[dict]:
        """
        Gửi webhook request để revalidate cache
        """
        headers = {
            "Authorization": f"Bearer {self.webhook_secret}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(
                self.webhook_url, 
                json=payload, 
                headers=headers,
                timeout=5  # 5 second timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return None
    
    def revalidate_all_products(self) -> bool:
        """
        Revalidate tất cả product cache
        Sử dụng khi: tạo/xóa/cập nhật bulk products
        """
        payload = {"type": "revalidate-all-products"}
        result = self._make_request(payload)
        
        if result:
            print("Successfully revalidated all product caches")
            return True
        return False
    
    def revalidate_product(self, product_id: int) -> bool:
        """
        Revalidate cache cho một product cụ thể
        Sử dụng khi: cập nhật thông tin product, thêm rating
        """
        payload = {
            "type": "revalidate-product",
            "productId": product_id
        }
        result = self._make_request(payload)
        
        if result:
            print(f"Successfully revalidated product {product_id} cache")
            return True
        return False
    
    def revalidate_tags(self, tags: List[str]) -> bool:
        """
        Revalidate specific cache tags
        """
        payload = {
            "type": "revalidate-tags", 
            "tags": tags
        }
        result = self._make_request(payload)
        
        if result:
            print(f"Successfully revalidated tags: {', '.join(tags)}")
            return True
        return False
    
    def revalidate_paths(self, paths: List[str]) -> bool:
        """
        Revalidate specific paths
        """
        payload = {
            "type": "revalidate-paths",
            "paths": paths
        }
        result = self._make_request(payload)
        
        if result:
            print(f"Successfully revalidated paths: {', '.join(paths)}")
            return True
        return False

# Singleton instance
webhook_revalidator = WebhookRevalidator()

# Convenience functions
def revalidate_all_products():
    """Revalidate tất cả product cache"""
    return webhook_revalidator.revalidate_all_products()

def revalidate_product(product_id: int):
    """Revalidate cache cho một product cụ thể"""
    return webhook_revalidator.revalidate_product(product_id)

def revalidate_tags(tags: List[str]):
    """Revalidate specific cache tags"""
    return webhook_revalidator.revalidate_tags(tags)

def revalidate_paths(paths: List[str]):
    """Revalidate specific paths"""
    return webhook_revalidator.revalidate_paths(paths)
