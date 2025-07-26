// HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { getProducts } from '@/lib/api';
import ProductList from '@/components/ProductList';
import { Product } from '@/schemas/product';
import { Chatbot, ChatbotFloatingButton } from '@/components/Chatbot';

export default function HomeScreen() {
    const [activeProductId, setActiveProductId] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);
    const [chatbotVisible, setChatbotVisible] = useState(false);

    useEffect(() => {
        setMounted(true);
        getProducts()
            .then((data) => {
                setProducts(data);
            })
            .catch((err) => {
                console.error("Lỗi lấy sản phẩm:", err.message);
            });
    }, []);

    const handleAddToCart = async (product: Product) => {
        try {
            const cartData = await AsyncStorage.getItem("cart");
            let cart = cartData ? JSON.parse(cartData) : [];

            const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);

            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            await AsyncStorage.setItem("cart", JSON.stringify(cart));

            Toast.show({
                type: 'success',
                text1: 'Sản phẩm đã được thêm vào giỏ hàng!'
            });

            setActiveProductId(product.id);
            setTimeout(() => setActiveProductId(null), 400);
        } catch (err: any) {
            console.error("Lỗi xử lý giỏ hàng:", err.message);
        }
    };

    if (!mounted) {
        return <ActivityIndicator size="large" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Sản phẩm mới</Text>
                <ProductList
                    products={products}
                    handleAddToCart={handleAddToCart}
                    activeProductId={activeProductId}
                />
            </ScrollView>

            {/* Chatbot */}
            <ChatbotFloatingButton onPress={() => setChatbotVisible(true)} />
            <Chatbot
                visible={chatbotVisible}
                onClose={() => setChatbotVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFF6FF', // Màu nền nhẹ, tương tự gradient từ trắng đến xanh nhẹ
    },
    content: {
        paddingHorizontal: 8, // Giảm padding horizontal
        paddingVertical: 8, // Giảm padding vertical
        paddingBottom: 20, // Thêm padding bottom
    },
    title: {
        fontSize: 22, // Giảm font size
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12, // Giảm margin bottom
        paddingHorizontal: 8, // Thêm padding để căn với ProductList
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
