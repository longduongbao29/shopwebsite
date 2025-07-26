import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../schemas/product';
import { RatingStars } from './RatingStars';

const { width } = Dimensions.get('window');

interface ProductListProps {
  products: Product[];
  handleAddToCart: (product: Product) => void;
  activeProductId: number | null;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  handleAddToCart,
  activeProductId,
}) => {

  // Skeleton component
  const ProductSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonText, { width: '75%', height: 16 }]} />
        <View style={[styles.skeletonText, { width: '50%', height: 12, marginTop: 8 }]} />
      </View>
    </View>
  );

  // Render từng sản phẩm
  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      activeOpacity={0.8}
      onPress={() =>
        router.push(`/product?id=${item.id}`)
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name || item.name}
        </Text>

        <RatingStars rating={item.average_rating || item.rating || 0} />

        <View style={styles.ratingInfo}>
          <Text style={styles.ratingText}>{item.average_rating || item.rating || 0} đánh giá</Text>
        </View>

        <View style={styles.priceAndCart}>
          <Text style={styles.productPrice}>
            {item.price.toLocaleString()} đ
          </Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToCart(item);
            }}
          >
            <Ionicons
              name="bag-add"
              size={24}
              color="#2563EB"
              style={[
                styles.cartIcon,
                activeProductId === item.id && styles.activeIcon
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!products) {
    return (
      <View style={styles.noProductsContainer}>
        <Text style={styles.noProductsText}>No products available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products.length > 0 ? products : Array.from({ length: 10 }, (_, i) => null)}
      keyExtractor={(item, index) => item ? item.id.toString() : `skeleton-${index}`}
      renderItem={({ item }) => item ? renderItem({ item, index: 0, separators: {} as any }) : <ProductSkeleton />}
      numColumns={2}
      columnWrapperStyle={products.length > 0 ? styles.columnWrapper : undefined}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 8, // Giảm padding tổng thể
    paddingBottom: 20, // Thêm padding bottom để tránh bị cắt
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12, // Giảm gap giữa các cột
    marginBottom: 16, // Thêm margin bottom giữa các hàng
  },
  productContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    overflow: 'hidden',
    flexDirection: 'column',
    maxWidth: (width - 32) / 2, // Đảm bảo không vượt quá chiều rộng màn hình
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productInfo: {
    padding: 12, // Giảm padding
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16, // Giảm font size
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6, // Giảm margin bottom
    lineHeight: 20, // Điều chỉnh line height
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  priceAndCart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB',
  },
  cartButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  cartIcon: {},
  activeIcon: {
    transform: [{ scale: 1.2 }, { rotate: '10deg' }],
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 192,
  },
  noProductsText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
  },
  skeletonContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skeletonImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonText: {
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
  },
});

export default ProductList;
