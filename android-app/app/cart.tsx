import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Trash2, ShoppingCart } from "lucide-react-native";
import { RootStackParamList } from "@/navigation/types";
type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
};


export default function CartScreen() {
    const [cart, setCart] = useState<Product[]>([]);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const loadCart = async () => {
            const storedCart = await AsyncStorage.getItem("cart");
            setCart(storedCart ? JSON.parse(storedCart) : []);
        };
        loadCart();
    }, []);

    const updateCart = async (newCart: Product[]) => {
        setCart(newCart);
        await AsyncStorage.setItem("cart", JSON.stringify(newCart));
    };

    const handleRemoveFromCart = (productId: number) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        updateCart(updatedCart);
    };

    const handleIncreaseQuantity = (productId: number) => {
        const updatedCart = cart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updatedCart);
    };

    const handleDecreaseQuantity = (productId: number) => {
        const updatedCart = cart.map((item) =>
            item.id === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        updateCart(updatedCart);
    };

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        onPress={() => handleDecreaseQuantity(item.id)}
                        style={styles.qtyButton}
                    >
                        <Text style={styles.qtySymbol}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNumber}>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => handleIncreaseQuantity(item.id)}
                        style={styles.qtyButton}
                    >
                        <Text style={styles.qtySymbol}>+</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.price}>
                    {item.price.toLocaleString()} đ x {item.quantity} ={" "}
                    {(item.price * item.quantity).toLocaleString()} đ
                </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)}>
                <Trash2 color="#DC2626" size={24} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Giỏ hàng của bạn</Text>
            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <ShoppingCart size={64} color="#9CA3AF" />
                    <Text style={styles.emptyText}>
                        Giỏ hàng trống. Hãy thêm sản phẩm!
                    </Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.totalText}>Tổng tiền:</Text>
                        <Text style={styles.totalAmount}>
                            {totalPrice.toLocaleString()} đ
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={() => navigation.navigate({ name: "Order", params: { productId: "null" } })}
                    >
                        <Text style={styles.checkoutText}>Đặt hàng</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#1F2937",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6B7280",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    image: {
        width: 72,
        height: 72,
        borderRadius: 8,
        backgroundColor: "#E5E7EB",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 6,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    qtyButton: {
        borderWidth: 1,
        borderColor: "#3B82F6",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginHorizontal: 6,
    },
    qtySymbol: {
        fontSize: 16,
        color: "#3B82F6",
    },
    qtyNumber: {
        fontSize: 16,
        color: "#111827",
    },
    price: {
        fontSize: 14,
        color: "#3B82F6",
        fontWeight: "600",
    },
    footer: {
        marginTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
    totalText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2563EB",
    },
    checkoutButton: {
        marginTop: 12,
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    checkoutText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
