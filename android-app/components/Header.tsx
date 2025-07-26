// Header.tsx (Expo / React Native)
import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
// Use Expo's vector icons instead of react-native-heroicons
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Header() {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

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
        if (searchText.trim()) {
            console.log("Searching for:", searchText);
            // Implement search logic here
            Toast.show({
                type: 'info',
                text1: `Tìm kiếm: ${searchText}`
            });
        }
    };

    const handleLogout = async () => {
        setIsMenuOpen(false);
        try {
            await AsyncStorage.removeItem("user");
            setUser(null);
            // Chuyển hướng về màn hình Home sau khi logout
            router.push("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#F97316" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    {/* Dòng trên: Logo - ô tìm kiếm - nút menu */}
                    <View style={styles.topRow}>
                        <TouchableOpacity onPress={() => router.push("/")}>
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

                        <TouchableOpacity onPress={() => {
                            setIsMenuOpen(!isMenuOpen);
                        }}>
                            {isMenuOpen ? (
                                <Ionicons name="close" size={24} color="#2563EB" />
                            ) : (
                                <Ionicons name="menu" size={24} color="#2563EB" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* Menu điều hướng (hiển thị khi isMenuOpen === true) */}
            {isMenuOpen && (
                <View style={styles.dropdownOverlay}>
                    <TouchableOpacity
                        style={styles.overlayBackground}
                        onPress={() => setIsMenuOpen(false)}
                        activeOpacity={1}
                    />
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setIsMenuOpen(false);
                                router.push("/");
                            }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="home-outline" size={20} color="#374151" />
                            <Text style={styles.menuText}>Trang chủ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setIsMenuOpen(false);
                                router.push("/cart");
                            }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="cart-outline" size={20} color="#374151" />
                            <Text style={styles.menuText}>Giỏ hàng</Text>
                        </TouchableOpacity>

                        {user ? (
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleLogout}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="log-out-outline" size={20} color="#374151" />
                                <Text style={styles.menuText}>Đăng xuất</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setIsMenuOpen(false);
                                    router.push("/login");
                                }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="person-outline" size={20} color="#374151" />
                                <Text style={styles.menuText}>Đăng nhập</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#F97316", // Màu cam giống header
    },
    headerContainer: {
        backgroundColor: "#F97316", // Màu cam
        paddingVertical: 8, // Giảm padding vertical
        paddingHorizontal: 12, // Giảm padding horizontal
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
        width: 100, // Giảm kích thước logo
        height: 40,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    dropdownOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    overlayBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    menuContainer: {
        position: 'absolute',
        top: 60, // Điều chỉnh theo chiều cao header
        right: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        minWidth: 160,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    menuText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
});
