import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Product } from '../schemas/product'; // tùy vị trí file của bạn
import { ShoppingCart } from 'lucide-react-native'; // hoặc thay bằng icon trong react-native-vector-icons

type Props = {
    product: Product;
};

export default function AddToCartButton({ product }: Props) {
    const handleAddToCart = async () => {
        try {
            const cartData = await AsyncStorage.getItem('cart');
            const cart = cartData ? JSON.parse(cartData) : [];

            const existingIndex = cart.findIndex((item: Product) => item.id === product.id);

            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            await AsyncStorage.setItem('cart', JSON.stringify(cart));

            Toast.show({
                type: 'success',
                text1: '🎉 Sản phẩm đã được thêm vào giỏ hàng!',
                visibilityTime: 2000,
            });
        } catch (error) {
            console.error('Lỗi thêm giỏ hàng:', error);
        }
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
            <ShoppingCart size={20} color="#fff" />
            <Text style={styles.text}>Thêm vào giỏ</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563eb',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
