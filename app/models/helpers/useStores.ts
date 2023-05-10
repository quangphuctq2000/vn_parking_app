import { createContext, useContext, useEffect, useState } from "react"
import { setReactotronRootStore } from "../../services/reactotron"
import { RootStore, RootStoreModel } from "../RootStore"
import { setupRootStore } from "./setupRootStore"

const _rootStore = RootStoreModel.create({})

const RootStoreContext = createContext<RootStore>(_rootStore)

export const RootStoreProvider = RootStoreContext.Provider

export const useStores = () => useContext(RootStoreContext)

export const useInitialRootStore = (callback: () => void | Promise<void>) => {
  const rootStore = useStores()
  const [rehydrated, setRehydrated] = useState(false)

  useEffect(() => {
    let _unsubscribe
    ;(async () => {
      const { restoredState, unsubscribe } = await setupRootStore(rootStore)
      _unsubscribe = unsubscribe

      setReactotronRootStore(rootStore, restoredState)

      setRehydrated(true)

      if (callback) callback()
    })()

    return () => {
      if (_unsubscribe) _unsubscribe()
    }
  }, [])

  return { rootStore, rehydrated }
}
export const rootStore = _rootStore
