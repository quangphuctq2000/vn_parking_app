import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"
import { Button, TextField } from "react-native-ui-lib"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { api } from "app/services/api"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}
GoogleSignin.configure({
  webClientId: "1012590666606-mimme0eesrjidp9dqrk0r3qi2aeg0k65.apps.googleusercontent.com",
})

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const [authPassword, setAuthPassword] = useState("")
  const [authEmail, setAuthEmail] = useState("")

  const {
    authenticationStore: { setAuthToken },
  } = useStores()

  function login() {}

  async function continuteWithGoogle() {
    const { idToken } = await GoogleSignin.signIn()
    const googleCredential = auth.GoogleAuthProvider.credential(idToken)
    const result = await auth().signInWithCredential(googleCredential)
    const accessToken = await result.user.getIdToken()

    api.apisauce.setHeader("Authorization", `Bearer ${accessToken}`)
    setAuthToken(accessToken)
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />

      <TextField placeholder={"Email"} onChangeText={setAuthEmail} value={authEmail} marginB-10 />

      <TextField
        placeholder={"Password"}
        onChangeText={setAuthPassword}
        maxLength={30}
        secureTextEntry
        value={authPassword}
        marginB-10
      />

      <Button onPress={login} label={"Tap to sign in"} marginB-10 />

      <Button onPress={login} label={"Tap to sign up"} marginB-10 />

      <Button onPress={continuteWithGoogle} label={"Continute with google"} marginB-10 />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $signIn: TextStyle = {
  marginBottom: spacing.small,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}
