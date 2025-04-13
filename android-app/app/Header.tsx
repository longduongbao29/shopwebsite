// Header.tsx (Expo / React Native)
import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// Ví dụ sử dụng icon từ react-native-heroicons (hoặc thay thế bằng thư viện icon khác nếu cần)
import { HomeIcon, ShoppingCartIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from "react-native-heroicons/outline";
import { RootStackParamList } from '@/navigation/types';

export default function Header() {
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    // Lấy đối tượng navigation với kiểu cụ thể từ NativeStackNavigationProp
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        // Tải thông tin user từ AsyncStorage
        (async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Error loading user:", error);
            }
        })();
    }, []);

    const handleSearchSubmit = () => {
        const query = searchText.trim();
        if (query !== "") {
            // Chuyển đến màn hình Search với tham số query
            // navigation.navigate("Search", { query });
            setIsMenuOpen(false);
            // Nếu muốn reset ô tìm kiếm, uncomment dòng dưới:
            // setSearchText("");
        }
    };

    const handleLogout = async () => {
        setIsMenuOpen(false);
        try {
            await AsyncStorage.removeItem("user");
            setUser(null);
            // Chuyển hướng về màn hình Home sau khi logout
            navigation.navigate("Home");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <View style={styles.headerContainer}>
            {/* Dòng trên: Logo - ô tìm kiếm - nút menu */}
            <View style={styles.topRow}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Image
                        source={require("../assets/images/logo_slogan.png")} // Đảm bảo file logo có trong thư mục assets
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm sản phẩm..."
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                />

                <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? (
                        <XMarkIcon size={24} color="#2563EB" />
                    ) : (
                        <Bars3Icon size={24} color="#2563EB" />
                    )}
                </TouchableOpacity>
            </View>

            {/* Menu điều hướng (hiển thị khi isMenuOpen === true) */}
            {isMenuOpen && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setIsMenuOpen(false);
                            navigation.navigate("Home");
                        }}
                    >
                        <HomeIcon size={20} color="#1F2937" />
                        <Text style={styles.menuText}>Trang chủ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setIsMenuOpen(false);
                            navigation.navigate("Cart");
                        }}
                    >
                        <ShoppingCartIcon size={20} color="#1F2937" />
                        <Text style={styles.menuText}>Giỏ hàng</Text>
                    </TouchableOpacity>

                    {user ? (
                        <>
                            <View style={[styles.menuItem, { alignItems: "center" }]}>
                                <UserCircleIcon size={20} color="#2563EB" />
                                <Text style={styles.menuText}>{user.name}</Text>
                            </View>
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <ArrowRightOnRectangleIcon size={20} color="red" />
                                <Text style={[styles.menuText, { color: "red" }]}>Đăng xuất</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setIsMenuOpen(false);
                                navigation.navigate("Login");
                            }}
                        >
                            <Text style={styles.menuText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#F97316", // Màu cam
        paddingVertical: 10,
        paddingHorizontal: 16,
        // Thiết lập shadow cho iOS và elevation cho Android
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    logo: {
        width: 120,
        height: 50,
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        fontSize: 14,
    },
    menuContainer: {
        marginTop: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    menuText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#1F2937",
    },
});
