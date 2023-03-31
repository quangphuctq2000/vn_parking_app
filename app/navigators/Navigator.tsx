import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { HomeScreen, BookingScreen } from "../screens"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { ParkingScreen } from "app/screens/ParkingScreen"

export type TabParamList = {
  HomeScreen: undefined
  ParkingStationScreen: { queryIndex?: string; itemIndex?: string }
  BookingScreen: undefined
  ParkingScreen: undefined
}
export type DemoTabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<TabParamList>()

export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon icon="components" color={focused && colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="ParkingStationScreen"
        component={ParkingScreen}
        options={{
          tabBarLabel: "ParkingStation",
          tabBarIcon: ({ focused }) => (
            <Icon icon="components" color={focused && colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="BookingScreen"
        component={BookingScreen}
        options={{
          tabBarLabel: "Booking",
          tabBarIcon: ({ focused }) => (
            <Icon icon="components" color={focused && colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="ParkingScreen"
        component={BookingScreen}
        options={{
          tabBarLabel: "Parking",
          tabBarIcon: ({ focused }) => (
            <Icon icon="components" color={focused && colors.tint} size={30} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: translate("demoNavigator.debugTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="components" color={focused && colors.tint} size={30} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.medium,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
}