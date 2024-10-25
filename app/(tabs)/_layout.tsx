import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
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
          name="index" // Tệp index.tsx trong (tabs) sẽ đại diện cho tab Home
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
          name="StoreScreen" // Tệp StoreScreen.tsx đại diện cho tab Store
          options={{
            title: "Cửa hàng",
            headerShown: true,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome5 name="store" size={15} color={color} />
              ) : (
                <FontAwesome5 name="store-alt" size={15} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="ChatScreen" // Tệp ChatScreen.tsx đại diện cho tab Chat
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
          name="ProfileScreen" // Tệp ProfileScreen.tsx đại diện cho tab Profile
          options={{
            title: "Hồ sơ",
            headerShown: true,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome5 name="user-alt" size={20} color={color} />
              ) : (
                <FontAwesome5 name="user" size={20} color={color} />
              ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#4072AF" style="light" />
    </>
  );
}
