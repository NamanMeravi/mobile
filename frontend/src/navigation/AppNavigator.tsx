import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/book/HomeScreen";
import AddBookScreen from "../screens/book/AddBookScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import colors from "../styles/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Book Feed" }}
      />
    </Stack.Navigator>
  );
}

function AddBookStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddBookScreen"
        component={AddBookScreen}
        options={{ title: "Add Book" }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.white,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="AddBook"
        component={AddBookStack}
        options={{
          tabBarLabel: "Add Book",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}
