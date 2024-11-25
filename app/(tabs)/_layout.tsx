// app/(tabs)/_layout.tsx
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router"; // Import useRouter
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Icon, IconButton, Badge } from "native-base";
import { useGlobalState } from "@/contexts/GlobalProvider";

export default function TabLayout() {
  const { cartItemCount } = useGlobalState();
  const router = useRouter(); // Khởi tạo router để điều hướng

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#3F72AF",
          tabBarInactiveTintColor: "#6C757D",
          tabBarStyle: { height: 60, backgroundColor: "#DBE2EF" },
          headerStyle: { backgroundColor: "#4072AF" },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            headerShown: true,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <Entypo name="home" size={20} color={color} />
              ) : (
                <MaterialCommunityIcons
                  name="home-outline"
                  size={20}
                  color={color}
                />
              ),
          }}
        />
        <Tabs.Screen
          name="ServicePackageScreen"
          options={{
            title: "Tất cả các gói dịch vụ",
            headerShown: true,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome5 name="gift" size={20} color={color} />
              ) : (
                <Feather name="gift" size={20} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="StoreScreen"
          options={{
            title: "Vật Tư Điện Nước",
            headerShown: true,
            headerRight: () => (
              <View style={{ marginRight: 15 }}>
                <IconButton
                  onPress={() => router.push("/CartScreen")} // Thêm sự kiện onPress để điều hướng đến CartScreen
                  icon={
                    <View>
                      <Icon
                        as={FontAwesome5}
                        name="shopping-cart"
                        size="lg"
                        color="#DBE2EF"
                        key="cart-icon"
                      />
                      {cartItemCount > 0 && (
                        <Badge
                          key="cart-badge"
                          rounded="full"
                          position="absolute"
                          top={-12}
                          right={-12}
                          bg="#FF4136"
                          _text={{
                            color: '#FFFFFF',
                            fontSize: 12,
                          }}
                        >
                          {cartItemCount}
                        </Badge>
                      )}
                    </View>
                  }
                />
              </View>
            ),
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome5 name="store" size={15} color={color} />
              ) : (
                <FontAwesome5 name="store-alt" size={15} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="ChatScreen"
          options={{
            title: "Trò chuyện",
            headerShown: true,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome name="comments" size={20} color={color} />
              ) : (
                <FontAwesome name="comments-o" size={20} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="ProfileScreen"
          options={{
            title: "Hồ sơ cá nhân",
            headerShown: true,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome5 name="user-alt" size={18} color={color} />
              ) : (
                <FontAwesome5 name="user" size={18} color={color} />
              ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#4072AF" style="light" />
    </>
  );
}
