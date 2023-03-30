import React, { FC } from "react"
import { Linking, Platform, TextStyle, View, ViewStyle } from "react-native"
import { Button, ListItem, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/Navigator"
import { colors, spacing } from "../theme"
import { useStores } from "../models"
import { useHeader } from "app/utils/useHeader"

function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}

export const BookingScreen: FC<DemoTabScreenProps<"BookingScreen">> = (_props) => {
  const {
    authenticationStore: { logout },
  } = useStores()
  useHeader({
    rightTx: "common.logOut",
    onRightPress: logout,
  })

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text>this is booking screen</Text>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.huge,
  paddingHorizontal: spacing.large,
}
