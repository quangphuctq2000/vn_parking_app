import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/Navigator"
import { useStores } from "app/models"
import { useHeader } from "app/utils/useHeader"
import { useRoute } from "@react-navigation/core"
import axios from "axios"
import { TextField } from "react-native-ui-lib"
import { ParkingStation } from "app/models/ParkingStation"
import { api } from "app/services/api"

export const ParkingScreen: FC<DemoTabScreenProps<"ParkingScreen">> = observer((_props) => {
  const {
    authenticationStore: { logout },
  } = useStores()
  const route = useRoute()
  useEffect(() => {
    ;(async () => {
      try {
        const result = await api.apisauce.get(`/parking-stations/${route.params.id}`)
        setParkingStation(result.data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [route])
  // wat
  const [parkingStation, setParkingStation] = useState<ParkingStation>()

  useHeader({
    rightTx: "common.logOut",
    onRightPress: logout,
  })
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <Text>this is parking screen</Text>
      {parkingStation ? (
        <>
          <TextField label="name" value={parkingStation.name} readonly />
          <TextField label="description" value={parkingStation.description} readonly />
          <TextField label="longitude" value={parkingStation.description} readonly />
          <TextField label="latitude" value={parkingStation.description} readonly />
          <TextField label="pricePerHour" value={parkingStation.description} readonly />
          <TextField label="pricePerMonth" value={parkingStation.description} readonly />
        </>
      ) : null}
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  flex: 1,
}
