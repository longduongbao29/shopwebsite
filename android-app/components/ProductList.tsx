// ProductList.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ShoppingCartIcon } from 'react-native-heroicons/outline'; // Sử dụng thư viện icon tương ứng
import { Product } from '../schemas/product';

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
   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Render từng sản phẩm
  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('Product', { id: item.id.toString() })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceAndCart}>
          <Text style={styles.productPrice}>
            {item.price.toLocaleString()} đ
          </Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={(e) => {
              // Chặn sự kiện bọc ngoài không kích hoạt khi nhấn vào nút giỏ hàng
              e.stopPropagation();
              handleAddToCart(item);
            }}
          >
            <ShoppingCartIcon
              size={24}
              color="#2563EB"
              style={activeProductId === item.id ? styles.activeIcon : undefined}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Nếu chưa có sản phẩm, hiển thị Skeleton (dạng placeholder)
  const renderSkeleton = (_: any, index: number) => (
    <View key={index} style={styles.skeletonContainer}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonText} />
      <View style={[styles.skeletonText, { width: '50%' }]} />
    </View>
  );

  return products.length > 0 ? (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContainer}
    />
  ) : (
    <View style={styles.listContainer}>
      {Array.from({ length: 10 }).map(renderSkeleton)}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#eee',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  priceAndCart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  cartButton: {
    padding: 8,
  },
  activeIcon: {
    transform: [{ scale: 1.2 }],
  },
  skeletonContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  skeletonImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonText: {
    height: 16,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    marginBottom: 4,
    width: '75%',
  },
});

export default ProductList;
