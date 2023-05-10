import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { TextStyle, ViewStyle, Alert } from "react-native"
import { Screen, Text } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"
import { Button, TextField } from "react-native-ui-lib"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { api } from "app/services/api"
import { useFocusEffect } from "@react-navigation/native"
import { authWithGoogle, signup } from "app/utils/api/auth"

interface SignupScreenProps extends AppStackScreenProps<"Signup"> {}
GoogleSignin.configure({
  webClientId: "1012590666606-mimme0eesrjidp9dqrk0r3qi2aeg0k65.apps.googleusercontent.com",
})

export const SignupScreen: FC<SignupScreenProps> = observer((_props) => {
  const [authPassword, setAuthPassword] = useState<string>()
  const [authEmail, setAuthEmail] = useState<string>()

  const {
    authenticationStore: { setAuthToken },
  } = useStores()

  useFocusEffect(() => {
    console.log("this is signup screen")
  })

  async function signupUser() {
    try {
      const result = await auth().createUserWithEmailAndPassword(authEmail, authPassword)
      const idToken = await result.user.getIdToken()
      await signup(idToken)
      api.apisauce.setHeader("Authorization", `Bearer ${idToken}`)
      setAuthToken(idToken)
    } catch (error) {
      console.log("error", error)

      Alert.alert(error.message)
    }
  }

  async function continuteWithGoogle() {
    try {
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      await auth().signInWithCredential(googleCredential)
      const accessToken = await auth().currentUser.getIdToken()
      const loginResponseData = await authWithGoogle(accessToken)
      if (!loginResponseData) throw new Error()
      api.apisauce.setHeader("Authorization", `Bearer ${accessToken}`)
      setAuthToken(accessToken)
    } catch (error) {
      GoogleSignin.signOut()
      Alert.alert("login failed")
    }
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" text="Signup" preset="heading" style={$signIn} />

      <TextField placeholder={"Email"} onChangeText={setAuthEmail} value={authEmail} marginB-10 />

      <TextField
        placeholder={"Password"}
        onChangeText={setAuthPassword}
        secureTextEntry
        value={authPassword}
        marginB-10
      />

      <Button onPress={() => signupUser()} label={"Tap to sign up"} marginB-10 />

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
