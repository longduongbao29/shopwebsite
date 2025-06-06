import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerUser } from "@/lib/api"; // Tùy thuộc vào backend
import { UserRegister } from "@/schemas/user"; // Kiểm tra schema phù hợp RN
import { RootStackParamList } from '@/navigation/types';
type UserRegisterWithPassword = UserRegister & {
    password: string;
};

export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [user, setUser] = useState<UserRegister>({
        name: "",
        email: "",
        phone: "",
    });

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
            // const response = await registerUser({ ...user, password } as UserRegisterWithPassword);
        }

        try {
            const response = await registerUser({ ...user, password } as UserRegisterWithPassword);
            await AsyncStorage.setItem("user", JSON.stringify(response));
            navigation.replace("Home");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
            Alert.alert("Lỗi đăng ký", message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#F3F4F6" }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
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
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        value={user.email}
                        onChangeText={(val) => setUser({ ...user, email: val })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Xác nhận mật khẩu"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Đăng ký</Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        Đã có tài khoản?{" "}
                        <Text
                            style={styles.linkText}
                            onPress={() => navigation.navigate("Login")}
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
        flexGrow: 1,
        paddingVertical: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
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
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 12,
        color: "#111827",
    },
    button: {
        backgroundColor: "#10B981",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 4,
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
