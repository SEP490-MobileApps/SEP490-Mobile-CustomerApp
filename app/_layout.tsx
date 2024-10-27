// app/_layout.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import "react-native-reanimated";

import { NativeBaseProvider } from "native-base";
import { useColorScheme } from "../components/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalProvider } from "../context/GlobalProvider";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Ngăn splash screen biến mất trước khi các asset được tải
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Tải font
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    onLayoutRootView();
  }, []);

  // Hàm ẩn splash screen khi các asset đã tải xong
  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GlobalProvider>
      <NativeBaseProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack initialRouteName="(auth)">
              <Stack.Screen
                name="(auth)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ServicePackage/[id]" // Thay đổi đường dẫn tại đây
                options={{
                  title: 'Chi tiết gói dịch vụ',
                  headerStyle: { backgroundColor: '#3F72AF' },
                  headerTintColor: '#FFF',
                }}
              />
              <Stack.Screen
                name="ServicePackageContract"
                options={{
                  title: 'Chỉnh sửa chi tiết hợp đồng',
                  headerStyle: { backgroundColor: '#3F72AF' },
                  headerTintColor: '#FFF',
                }}
              />
            </Stack>
          </GestureHandlerRootView>
        </ThemeProvider>
      </NativeBaseProvider>
    </GlobalProvider>
  );
}
