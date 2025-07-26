import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { router } from 'expo-router';
import { registerUser, loginUser } from "@/lib/api";
import { UserRegister } from "@/schemas/user";
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<{ email: string; password: string }>({ email: "", password: "" });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    const handleRegister = async () => {
        setIsLoading(true);
        setError("");

        if (user.password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            setIsLoading(false);
            return;
        }

        try {
            await registerUser(user);
            Toast.show({
                type: 'success',
                text1: 'Đăng ký thành công!'
            });

            try {
                await loginUser(user.email, user.password);
            } catch (loginError) {
                Toast.show({
                    type: 'error',
                    text1: 'Đăng nhập tự động thất bại. Vui lòng đăng nhập lại thủ công.'
                });
            }

            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Image
                            source={require("@/assets/images/logo_only.png")}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>BUYME</Text>
                    </View>

                    <Text style={styles.subtitle}>Đăng ký tài khoản mới</Text>

                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={user.email}
                            onChangeText={(val) => setUser({ ...user, email: val })}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry
                            value={user.password}
                            onChangeText={(val) => setUser({ ...user, password: val })}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Xác nhận mật khẩu"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            editable={!isLoading}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Đăng ký</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        Đã có tài khoản? <Text
                            style={styles.linkText}
                            onPress={() => router.push("/login")}
                        >
                            Đăng nhập
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFF6FF', // gradient from blue-100 via white to pink-100
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "rgba(255, 255, 255, 0.7)", // white/70 backdrop-blur-md
        padding: 32,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    logo: {
        width: 64,
        height: 64,
        resizeMode: "contain",
    },
    title: {
        fontSize: 28,
        fontWeight: "800", // extrabold
        color: "#F97316", // orange-500
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "600", // semibold
        color: "#374151", // gray-700
        textAlign: "center",
        marginBottom: 24,
    },
    errorText: {
        color: "#DC2626", // red-600
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB', // border
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'white',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#374151", // gray-700
        paddingVertical: 4,
    },
    button: {
        backgroundColor: "#2563EB", // blue-600
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: "#93C5FD", // blue-400
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600", // semibold
    },
    footerText: {
        textAlign: "center",
        fontSize: 14,
        color: "#6B7280", // gray-600
    },
    linkText: {
        color: "#2563EB", // blue-600
        fontWeight: "500",
    },
});
