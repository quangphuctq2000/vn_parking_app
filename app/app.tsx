import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { useInitialRootStore, useStores } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import { setupReactotron } from "./services/reactotron"
import { api } from "./services/api"
import auth from "@react-native-firebase/auth"

setupReactotron({
  clearOnLoad: true,
  host: "localhost",
  useAsyncStorage: true,
  logInitialState: true,
  logSnapshots: false,
})

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

const prefix = Linking.createURL("/")
const config = {
  screens: {
    Login: {
      path: "",
    },
    Welcome: "welcome",
    Demo: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        DemoDebug: "debug",
        DemoPodcastList: "podcast",
        DemoCommunity: "community",
      },
    },
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)
  const {
    authenticationStore: { authToken, setAuthToken },
  } = useStores()
  api.apisauce.setHeader("Authorization", `Bearer ${authToken}`)

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  const { rehydrated } = useInitialRootStore(async () => {
    auth().onAuthStateChanged(async (user) => {
      hideSplashScreen()
      if (!user) setAuthToken(undefined)
      else {
        const accessToken = await user.getIdToken()
        console.log("accessToken", accessToken)
        setAuthToken(accessToken)
      }
    })
  })
  if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppNavigator
        // linking={linking}
        // initialState={initialNavigationState}
        onStateChange={onNavigationStateChange}
      />
    </SafeAreaProvider>
  )
}

export default App
