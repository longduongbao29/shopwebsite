// layout.tsx
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Header from "./Header"; // Đảm bảo đường dẫn đúng với file Header của bạn
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
// Tạo Stack Navigator nếu ứng dụng của bạn sử dụng Stack Navigation
const Stack = createNativeStackNavigator();

export default function Layout() {
  return (
      <SafeAreaView style={styles.container}>
        {/* Header sẽ hiển thị ở đầu của mọi màn hình */}
        <Header />

        {/* Đây là vùng để render các màn hình của ứng dụng */}
        <View style={styles.content}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false, // Ẩn header mặc định của React Navigation để sử dụng Header tùy chỉnh
            }}
          >
            {/* Ví dụ: Định nghĩa các màn hình */}
            <Stack.Screen name="Home" component={require("./screens/Home").default} />
          <Stack.Screen name="Product" component={require("./screens/Product").default} />
          <Stack.Screen name="Order" component={require("./screens/Order").default} />
          <Stack.Screen name="Cart" component={require("./screens/Cart").default} />
          <Stack.Screen name="Register" component={require("./screens/Register").default} />
          <Stack.Screen name="Login" component={require("./screens/Login").default} />
          </Stack.Navigator>
      </View>
      <Toast
        position="top"
        topOffset={100}
        visibilityTime={1000}
        autoHide={true}
      />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
  },
});
