import React, { FC, useEffect, useState } from "react"
import { DemoTabScreenProps, TabParamList } from "../navigators/Navigator"
import { useHeader } from "app/utils/useHeader"
import { useStores } from "app/models"
import { View, Text, Button, Modal, TextField } from "react-native-ui-lib"
import MapView, { Marker } from "react-native-maps"
import { Alert, PermissionsAndroid, ScrollView } from "react-native"
import { ParkingStation } from "app/models/ParkingStation"
import { api } from "app/services/api"
import Geolocation from "@react-native-community/geolocation"
import MapViewDirections from "react-native-maps-directions"
import { Picker } from "@react-native-picker/picker"
import { Vehicle } from "app/models/Vehicle"

interface LatLng {
  latitude: number
  longitude: number
}
const image = {
  uri: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
}
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
export const HomeScreen: FC<DemoTabScreenProps<"HomeScreen">> = (_props) => {
  const {
    authenticationStore: { logout, setAuthToken },
  } = useStores()
  useHeader({
    leftText: "Home",
    rightText: "Log out",
    onRightPress: logout,
  })
  const [parkingStations, setParkingStations] = useState<ParkingStation[]>([])
  const [parkingStation, setParkingStation] = useState<ParkingStation>()
  const [currentLocation, setCurrentLocation] = useState<LatLng>()
  const [destinationLocation, setDestinationLocation] = useState<LatLng>()
  const [isFindRoute, setIsFindRoute] = useState<boolean>(false)
  const [isShowParkingStation, setIsShowParkingStation] = useState<boolean>(false)
  const [isShowBooking, setIsShowBooking] = useState<boolean>(false)
  const [bookingType, setBookingType] = useState<"month" | "normal">()
  const [vehicle, setVehicle] = useState()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedMonth, setSelectedMonth] = useState()
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
          console.log(result)
          setVehicles([...result.data] as Vehicle[])
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
            if (parkingStation) {
              setIsShowParkingStation(true)
            } else Alert.alert("Bạn chưa chọn Parking Station")
          }}
          flex
        />
        <Button
          label="Booking"
          onPress={() => {
            if (parkingStation) setIsShowBooking(true)
            else Alert.alert("Bạn chưa chọn Parking Station")
          }}
          flex
        />
      </View>

      <Modal
        visible={isShowParkingStation}
        onBackgroundPress={() => console.log("background pressed")}
      >
        <Modal.TopBar
          title={"Parking Station"}
          cancelIcon
          onCancel={() => setIsShowParkingStation(false)}
        />
        <View paddingH-10>
          {parkingStation ? (
            <>
              <View row paddingB-10>
                <Text text60 flex>
                  Tên bãi đỗ xe:
                </Text>
                <Text flex center text60>
                  {parkingStation.name}
                </Text>
              </View>
              <View row spread paddingB-10>
                <Text text60 flex>
                  Thông tin chi tiết:
                </Text>
                <Text flex center text60>
                  {parkingStation.description}
                </Text>
              </View>
              <View row spread paddingB-10>
                <Text text60 flex>
                  Số chỗ đỗ xe mặc định:
                </Text>
                <Text flex center text60>
                  {"parkingStation"}
                </Text>
              </View>
              <View row spread paddingB-10>
                <Text text60 flex>
                  Phí đỗ xe theo giờ(vnd):
                </Text>
                <Text flex center text60>
                  {parkingStation.pricePerHour}
                </Text>
              </View>
              <View row spread>
                <Text text60 flex>
                  Phí đỗ xe theo tháng(vnd):
                </Text>
                <Text flex center text60>
                  {parkingStation.pricePerMonth}
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </Modal>

      <Modal visible={isShowBooking} onBackgroundPress={() => console.log("background pressed")}>
        <Modal.TopBar title={"Booking"} cancelIcon onCancel={() => setIsShowBooking(false)} />
        {parkingStation ? (
          <>
            <View row paddingH-10>
              <Text flex>Parking Station:</Text>
              <Text flex>{parkingStation.name}</Text>
            </View>
            <Picker
              selectedValue={bookingType}
              onValueChange={(itemValue) => setBookingType(itemValue)}
            >
              <Picker.Item label="Normal" value="normal" />
              <Picker.Item label="Month" value="month" />
            </Picker>
            <Picker selectedValue={vehicle} onValueChange={(itemValue) => setVehicle(itemValue)}>
              {vehicles.length > 0
                ? vehicles.map((vehicle, index) => (
                    <Picker.Item label={vehicle.identityNumber} value={vehicle} key={index} />
                  ))
                : null}
            </Picker>
            {bookingType == "month" ? (
              <>
                <TextField
                  value={selectedMonth}
                  placeholder={"Chọn tháng"}
                  paddingH-10
                  paddingB-10
                ></TextField>
                <Button label="Đăng ký" onPress={() => {}} />
              </>
            ) : (
              <>
                <TextField
                  value={selectedMonth}
                  placeholder={"Chọn số giờ muốn đặt trước"}
                  paddingH-10
                  paddingB-10
                ></TextField>
                <Button label="Đăng ký" onPress={() => {}} />
              </>
            )}
          </>
        ) : null}
      </Modal>
    </ScrollView>
  )
}
