import React, { FC, useEffect, useState } from "react"
import { DemoTabScreenProps, TabParamList } from "../navigators/Navigator"
import { useHeader } from "app/utils/useHeader"
import { useStores } from "app/models"
import { View, Text, Button } from "react-native-ui-lib"
import MapView, { Marker } from "react-native-maps"
import { PermissionsAndroid, ScrollView } from "react-native"
import { ParkingStation } from "app/models/ParkingStation"
import { api } from "app/services/api"
import Geolocation from "@react-native-community/geolocation"
import MapViewDirections from "react-native-maps-directions"
import { useNavigation } from "@react-navigation/core"

interface LatLng {
  latitude: number
  longitude: number
}
const image = {
  uri: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
}

export const HomeScreen: FC<DemoTabScreenProps<"HomeScreen">> = (_props) => {
  const {
    authenticationStore: { logout },
  } = useStores()
  useHeader({
    leftText: "Home",
    rightText: "Log out",
    onRightPress: logout,
  })
  const navigation = useNavigation()
  const [parkingStations, setParkingStations] = useState<ParkingStation[]>([])
  const [parkingStation, setParkingStation] = useState<ParkingStation>()
  const [currentLocation, setCurrentLocation] = useState<LatLng>()
  const [destinationLocation, setDestinationLocation] = useState<LatLng>()
  const [isFindRoute, setIsFindRoute] = useState<boolean>(false)
  useEffect(() => {
    ;(async () => {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: "Cool Photo App Camera Permission",
        message: "",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      })

      Geolocation.getCurrentPosition(
        (position: {
          coords: {
            latitude: number
            longitude: number
            altitude: number | null
            accuracy: number
            altitudeAccuracy: number | null
            heading: number | null
            speed: number | null
          }
          timestamp: number
        }) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          console.log(position)
        },
      )
    })()
    ;(async () => {
      try {
        const result = await api.apisauce.get("/parking-stations")
        setParkingStations(result.data as ParkingStation[])
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <ScrollView>
      <View style={{ height: 500, paddingBottom: 20, paddingHorizontal: 5 }}>
        <MapView
          initialRegion={{
            latitude: 21.028,
            longitude: 105.83991,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsMyLocationButton={true}
          showsUserLocation={true}
          style={{ flex: 1 }}
        >
          <MapViewDirections
            v-if={isFindRoute}
            origin={currentLocation}
            destination={destinationLocation}
            apikey="AIzaSyDHCQpXknRoseXEoq8vEfVfbnhtkvP3jPg"
          />
          {parkingStations.length > 0
            ? parkingStations.map((parkingStation, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: parkingStation.latitude,
                    longitude: parkingStation.longitude,
                  }}
                  title={parkingStation.name}
                  description={parkingStation.description}
                  image={image}
                  onPress={() => {
                    console.log(parkingStation.name)
                    setParkingStation(parkingStation)
                  }}
                />
              ))
            : null}
        </MapView>
      </View>
      <View row center>
        <Text>Parking Station:</Text>
        <Text flex center>
          {parkingStation ? parkingStation.name : "none"}
        </Text>
        <Button
          label="checking"
          onPress={() => {
            navigation.navigate("ParkingStationScreen", { id: parkingStation.id })
          }}
        ></Button>
      </View>
    </ScrollView>
  )
}
