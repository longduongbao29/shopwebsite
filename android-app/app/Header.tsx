// Header.tsx (Expo / React Native)
import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
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
        const loadUser = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                if (storedToken) {
                    try {
                        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
                        setUser(decodedToken);
                    } catch (error) {
                        console.error("Failed to decode token:", error);
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Error loading user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleSearchSubmit = () => {
        const query = searchText.trim();
        if (query !== "") {
            // Chuyển đến màn hình Search với tham số query
            // router.push(`/search?query=${encodeURIComponent(query)}`);
            setIsMenuOpen(false);
            // Nếu muốn reset ô tìm kiếm, uncomment dòng dưới:
            // setSearchText("");
        }
    };

    const handleLogout = async () => {
        setIsMenuOpen(false);
        try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
            setUser(null);

            Toast.show({
                type: 'success',
                text1: 'Đăng xuất thành công!',
            });

            // Chuyển hướng về màn hình Home sau khi logout
            router.push("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                    <Text style={styles.loadingText}>BuyMe Shop</Text>
                </View>
                <View style={styles.searchContainer}>
                    <View style={styles.loadingSearchBox} />
                </View>
                <View style={styles.navContainer}>
                    <View style={styles.loadingIcon} />
                    <View style={styles.loadingIcon} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.headerContainer}>
            {/* Logo ở giữa trên mobile */}
            <View style={styles.logoContainer}>
                <TouchableOpacity onPress={() => router.push("/")}>
                    <Image
                        source={require("../assets/images/logo_slogan.png")} // Đảm bảo file logo có trong thư mục assets
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm sản phẩm..."
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={handleSearchSubmit}
                        returnKeyType="search"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            {/* Navigation Icons */}
            <View style={styles.navContainer}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => router.push("/")}
                >
                    <Ionicons name="home" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => router.push("/cart")}
                >
                    <Ionicons name="bag" size={24} color="white" />
                </TouchableOpacity>

                {user ? (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Ionicons name="person-circle" size={24} color="white" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => router.push("/login")}
                    >
                        <Ionicons name="person-circle" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* User Menu Dropdown */}
            {isMenuOpen && user && (
                <View style={styles.dropdown}>
                    <Text style={styles.userName}>Xin chào, {user.name}</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setIsMenuOpen(false);
                            router.push("/order");
                        }}
                    >
                        <Text style={styles.menuText}>Đơn hàng của tôi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleLogout}
                    >
                        <MaterialIcons name="logout" size={16} color="#EF4444" />
                        <Text style={[styles.menuText, { color: '#EF4444' }]}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#F97316', // Orange-500
        paddingHorizontal: 16,
        paddingVertical: 12,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        elevation: 5,
        position: 'relative',
        zIndex: 50,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    logo: {
        height: 64,
        width: 256,
    },
    loadingText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        marginHorizontal: 0,
        marginBottom: 8,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
    },
    loadingSearchBox: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navButton: {
        padding: 8,
    },
    loadingIcon: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 16,
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        right: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        elevation: 8,
        padding: 8,
        minWidth: 200,
        zIndex: 100,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    menuText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 8,
    },
});
