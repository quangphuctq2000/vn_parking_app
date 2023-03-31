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

interface SignupScreenProps extends AppStackScreenProps<"Signup"> {}
GoogleSignin.configure({
  webClientId: "1012590666606-mimme0eesrjidp9dqrk0r3qi2aeg0k65.apps.googleusercontent.com",
})

export const SignupScreen: FC<SignupScreenProps> = observer((_props) => {
  const [authPassword, setAuthPassword] = useState("")
  const [authEmail, setAuthEmail] = useState("")

  const {
    authenticationStore: { setAuthToken },
  } = useStores()

  async function signup() {
    try {
      const result = await auth().createUserWithEmailAndPassword(authEmail, authPassword)
      console.log(result)

      const idToken = await result.user.getIdToken()

      const signupResult = await api.apisauce.post("/auth/signup", {
        token: idToken,
        role: 2,
      })
      console.log(signupResult)

      api.apisauce.setHeader("Authorization", `Bearer ${idToken}`)
      setAuthToken(idToken)
    } catch (error) {
      console.log(error.message)

      Alert.alert(error.message)
    }
  }

  async function continuteWithGoogle() {
    try {
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      const result = await auth().signInWithCredential(googleCredential)
      const accessToken = await result.user.getIdToken()
      const signupResult = await api.apisauce.post("/auth/signup", {
        token: accessToken,
        role: 2,
      })
      console.log(signupResult)

      if (signupResult.data.statusCode == 400) throw new Error()
      api.apisauce.setHeader("Authorization", `Bearer ${accessToken}`)
      setAuthToken(accessToken)
    } catch (error) {
      GoogleSignin.signOut()
      Alert.alert("signup failed")
      console.log(error)
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

      <Button onPress={signup} label={"Tap to sign up"} marginB-10 />

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
