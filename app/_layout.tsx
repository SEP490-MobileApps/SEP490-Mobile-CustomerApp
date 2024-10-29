// app/_layout.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router"; // Sử dụng useRouter từ expo-router
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import "react-native-reanimated";
import { NativeBaseProvider, IconButton } from "native-base";
import { useColorScheme } from "../components/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalProvider } from "../contexts/GlobalProvider";
import { FontAwesome as FontAwesomeIcon } from "@expo/vector-icons";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
  const router = useRouter(); // Sử dụng router từ expo-router

  return (
    <GlobalProvider>
      <NativeBaseProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack initialRouteName="(tabs)">
              <Stack.Screen
                name="(auth)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ServicePackage/[id]"
                options={{
                  title: "Chi tiết gói dịch vụ",
                  headerStyle: { backgroundColor: "#3F72AF" },
                  headerTintColor: "#FFF",
                }}
              />
              <Stack.Screen
                name="ServicePackageContract"
                options={{
                  title: "Chỉnh sửa chi tiết hợp đồng",
                  headerStyle: { backgroundColor: "#3F72AF" },
                  headerTintColor: "#FFF",
                }}
              />
              <Stack.Screen
                name="ProductDetail/[id]"
                options={{
                  title: "Chi tiết sản phẩm",
                  headerStyle: { backgroundColor: "#3F72AF" },
                  headerTintColor: "#FFF",
                }}
              />
              <Stack.Screen
                name="CartScreen"
                options={{
                  title: "Giỏ hàng",
                  headerStyle: { backgroundColor: "#3F72AF" },
                  headerTintColor: "#FFF",
                  headerTitleAlign: "center",
                }}
              />
              <Stack.Screen
                name="ProfileDetailScreen"
                options={{
                  title: "Thông tin cá nhân chi tiết",
                  headerStyle: { backgroundColor: "#3F72AF" },
                  headerTintColor: "#FFF",
                  headerRight: () => (
                    <IconButton
                      icon={<FontAwesomeIcon name="edit" size={24} color="white" />}
                      onPress={() => router.setParams({ isEdit: "true" })}
                    />
                  ),
                }}
              />
            </Stack>
          </GestureHandlerRootView>
        </ThemeProvider>
      </NativeBaseProvider>
    </GlobalProvider>
  );
}
