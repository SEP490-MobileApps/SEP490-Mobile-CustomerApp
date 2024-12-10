import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef } from "react";
import { NativeBaseProvider, IconButton } from "native-base";
import { useColorScheme } from "@/components/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalProvider, useGlobalState } from "@/contexts/GlobalProvider";
import { FontAwesome as FontAwesomeIcon } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/PushNotification";
import Ionicons from '@expo/vector-icons/Ionicons';


export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(auth)",
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

  return (
    <GlobalProvider>
      <RootLayoutNav />
    </GlobalProvider>
  )

}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const { setIsActionSheetOpen } = useGlobalState();

  const setupPushNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      console.log("Current token: ", token);
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {

          console.log("Current notification: ", notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
    } catch (error) {
    }
  };
  const detachPushNotifications = () => {
    notificationListener.current &&
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    responseListener.current &&
      Notifications.removeNotificationSubscription(responseListener.current);
  };
  useEffect(() => {
    setupPushNotifications();
    return () => {
      detachPushNotifications();
    };
  }, []);

  return (

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
              name="ServicePackage/[id]"
              options={{
                title: "Chi tiết gói dịch vụ",
                headerStyle: { backgroundColor: "#3F72AF" },
                headerTintColor: "#FFF",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="ServicePackageContract"
              options={{
                title: "Chi tiết hợp đồng",
                headerStyle: { backgroundColor: "#3F72AF" },
                headerTintColor: "#FFF",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="ProductDetail/[id]"
              options={{
                title: "Chi tiết sản phẩm",
                headerStyle: { backgroundColor: "#3F72AF" },
                headerTintColor: "#FFF",
                headerTitleAlign: "center",
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
                headerTitleAlign: "center",
                headerRight: () => (
                  <IconButton
                    icon={<FontAwesomeIcon name="edit" size={24} color="white" />}
                    onPress={() => router.setParams({ isEdit: "true" })}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="LeaderDetailScreen"
              options={{
                title: "Chi tiết Leader",
                headerStyle: { backgroundColor: "#3F72AF" },
                headerTintColor: "#FFF",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="HistoryScreen"
              options={{
                title: "Lịch sử",
                headerStyle: { backgroundColor: "#3F72AF" },
                headerTintColor: "#FFF",
                headerTitleAlign: "center",
                headerLeft: () => (
                  <IconButton
                    icon={<Ionicons name="arrow-back-outline" size={24} color="white" />}
                    onPress={() => router.replace('/(tabs)/ProfileScreen')}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="RequestListScreen"
              options={{
                title: "Các lần yêu cầu",
                headerStyle: { backgroundColor: "#3F72AF" },
                headerTintColor: "#FFF",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="PendingContractScreen"
              options={{
                title: "Hợp đồng chờ duyệt",
                headerStyle: { backgroundColor: "#3F72AF" },
                headerTintColor: "#FFF",
                headerTitleAlign: "center",
                headerLeft: () => (
                  <IconButton
                    icon={<Ionicons name="arrow-back-outline" size={24} color="white" />}
                    onPress={() => router.replace('/(tabs)/ProfileScreen')}
                  />
                ),
              }}
            />
            <Stack.Screen
              name="OrderDetailScreen"
              options={{
                title: "Chi tiết đơn hàng",
                headerStyle: { backgroundColor: "#3F72AF" },
                headerTintColor: "#FFF",
                headerTitleAlign: "center",
                headerRight: () => (
                  <IconButton
                    icon={<Ionicons name="information-circle-outline" size={28} color="white" />}
                    onPress={() => setIsActionSheetOpen(true)}
                  />
                ),
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </NativeBaseProvider>
  );
}
