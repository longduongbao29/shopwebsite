import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import Header from "../components/Header";

export default function RootLayout() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Header sẽ hiển thị ở đầu của mọi màn hình */}
        <Header />

        {/* Expo Router Stack */}
        <Stack
          screenOptions={{
            headerShown: false, // Ẩn header mặc định để sử dụng Header tùy chỉnh
          }}
        />
      </SafeAreaView>

      <Toast
        position="top"
        topOffset={100}
        visibilityTime={1000}
        autoHide={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 0, // Đảm bảo không có padding top thừa
  },
});
