import React, { useLayoutEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { Header, HeaderProps } from "../components"

export function useHeader(headerProps: HeaderProps, deps: any[] = []) {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <Header {...headerProps} />,
    })
  }, deps)
}
