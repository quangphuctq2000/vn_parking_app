import React, { FC, useEffect, useRef, useState } from "react"
import { DemoTabScreenProps } from "../../navigators/Navigator"
import { useHeader } from "app/utils/useHeader"
import { useStores } from "app/models"
import { View, Text, Button } from "react-native-ui-lib"
import MapView, { Marker } from "react-native-maps"
import { Alert, PermissionsAndroid, ScrollView } from "react-native"
import { ParkingStation } from "app/models/ParkingStation"
import { api } from "app/services/api"
import Geolocation from "@react-native-community/geolocation"
import MapViewDirections from "react-native-maps-directions"
import { Vehicle } from "app/models/Vehicle"
import { ParkingStationModal, ParkingStationModalType } from "./ParkingStationModal"
import { getParkingStation } from "app/utils/api/parkingStation"
import { BookingModal, BookingModalType } from "./BookingModal"
interface LatLng {
  latitude: number
  longitude: number
}
const image = {
  uri: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
}
export const HomeScreen: FC<DemoTabScreenProps<"HomeScreen">> = (_props) => {
  const {
    authenticationStore: { logout, setAuthToken },
  } = useStores()
  useHeader({
    leftText: "Home",
    rightText: "Log out",
    onRightPress: logout,
  })
  const parkingStationModalRef = useRef<ParkingStationModalType>()
  const bookingModalRef = useRef<BookingModalType>()

  const [parkingStations, setParkingStations] = useState<ParkingStation[]>([])
  const [parkingStation, setParkingStation] = useState<ParkingStation>()
  const [currentLocation, setCurrentLocation] = useState<LatLng>()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  useEffect(() => {
    ;(async () => {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: "Cool Photo App Camera Permission",
        message: "",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      })
      ;(async () => {
        try {
          const result = await api.apisauce.get("/vehicle")
          if (result.status == 401) {
            setAuthToken(undefined)
          }
          setVehicles(result.data as Vehicle[])
        } catch (error) {
          console.log("error", error)
        }
      })()

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
            origin={currentLocation}
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
      <View row center paddingB-20>
        <Text text60>Parking Station:</Text>
        <Text flex center>
          {parkingStation ? parkingStation.name : "none"}
        </Text>
      </View>
      <View row>
        <Button
          label="Checking"
          onPress={async () => {
            console.log("asdfasdfasdfasdf")

            if (parkingStation) {
              const parkingStationInfo = await getParkingStation(parkingStation.id)
              console.log(parkingStationInfo.data)

              parkingStationModalRef.current.openModal(parkingStationInfo.data)
            } else Alert.alert("Bạn chưa chọn Parking Station")
          }}
          flex
        />
        <Button
          label="Booking"
          onPress={() => {
            if (parkingStation) bookingModalRef.current.open()
            else Alert.alert("Bạn chưa chọn Parking Station")
          }}
          flex
        />
      </View>

      <ParkingStationModal id={1} ref={parkingStationModalRef} />
      <BookingModal vehicles={vehicles} parkingStation={parkingStation} ref={bookingModalRef} />
    </ScrollView>
  )
}
