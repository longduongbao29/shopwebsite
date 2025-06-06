import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/types"; // Import the type definition for RootStackParamList
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { loginUser } from "@/lib/api"; // Đảm bảo hàm này hoạt động với môi trường React Native


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleLogin = async () => {
        try {
            const response = await loginUser(email, password);
            await AsyncStorage.setItem("user", JSON.stringify(response.user));
            navigation.replace("Home"); // replace để không quay lại được màn login
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
            Alert.alert("Lỗi đăng nhập", message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.card}>
                <View style={styles.header}>
                    <Image source={require("@/assets/images/logo_only.png")} style={styles.logo} />
                    <Text style={styles.title}>BUYME</Text>
                </View>

                <Text style={styles.subtitle}>Đăng nhập vào tài khoản</Text>

                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    Chưa có tài khoản?{" "}
                    <Text
                        style={styles.linkText}
                        onPress={() => navigation.navigate("Register")}
                    >
                        Đăng ký ngay
                    </Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        width: "90%",
        backgroundColor: "#ffffffee",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        alignItems: "center",
        marginBottom: 12,
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: "contain",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#F97316",
        marginTop: 4,
    },
    subtitle: {
        fontSize: 18,
        textAlign: "center",
        color: "#374151",
        marginBottom: 16,
    },
    inputGroup: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    input: {
        fontSize: 16,
        color: "#111827",
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    footerText: {
        marginTop: 14,
        fontSize: 14,
        textAlign: "center",
        color: "#6B7280",
    },
    linkText: {
        color: "#2563EB",
        fontWeight: "bold",
    },
});
