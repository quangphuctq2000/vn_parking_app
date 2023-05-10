import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Linking } from "react-native"
import { DemoTabScreenProps } from "../navigators/Navigator"
import { useStores } from "app/models"
import { useHeader } from "app/utils/useHeader"
import { useRoute } from "@react-navigation/core"
import { Button, Modal, Text, TextField, TouchableOpacity, View } from "react-native-ui-lib"
import { ParkingStation } from "app/models/ParkingStation"
import { api } from "app/services/api"
import { Vehicle } from "app/models/Vehicle"
import { Alert } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

export const VehicleScreen: FC<DemoTabScreenProps<"ParkingScreen">> = observer((_props) => {
  const {
    authenticationStore: { logout },
  } = useStores()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [checkingVehicle, setCheckingVehicle] = useState<Vehicle>()
  const [checkingVehicleState, setCheckingVehicleState] = useState<"Free" | "Parking">()
  const [parkingStation, setParkingStation] = useState<ParkingStation | undefined>()
  const [showAddVehicleModel, setShowAddVehicleModel] = useState(false)
  const [vehicleIdentity, setVehicleIdentity] = useState<string>()
  const [vehicleDescription, setVehicleDescription] = useState<string>()

  async function getVehicle(id: number) {
    try {
      const result = await api.apisauce.get(`/vehicle/${id}`)
      console.log(result.data)

      if (result.data) {
        if (result.data.parkings.length > 0) {
          setCheckingVehicleState("Parking")

          setParkingStation(result.data.parkings[0].parkingStation)
        } else setCheckingVehicleState("Free")
      } else {
        setCheckingVehicleState("Free")
        setParkingStation(undefined)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function checkout() {
    try {
      const result = await api.apisauce.post("/parking/checkOut", {
        parkingStationId: parkingStation.id,
        vehicleIdentity: checkingVehicle.identityNumber,
      })
      console.log(result)
      console.log(result.status)

      return result.data
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const result = await api.apisauce.get("/vehicle")
        console.log(result.data)
        setVehicles(result.data as Vehicle[])
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  const [isShowVehicleDetail, setIsShowVehicleDetail] = useState<boolean>(false)

  useHeader({
    rightTx: "common.logOut",
    leftText: "Vehicle",
    onRightPress: logout,
  })
  return (
    <View>
      <Button
        label="Add vehicle"
        small
        marginH-10
        marginB-10
        onPress={() => setShowAddVehicleModel(true)}
      />
      <View marginH-10 style={{ borderColor: "black", borderWidth: 1 }} marginB-10>
        <View row paddingV-5>
          <Text flex center>
            id
          </Text>
          <Text flex center>
            identityNumber
          </Text>
          <Text flex center>
            description
          </Text>
        </View>
        {vehicles.length > 0
          ? vehicles.map((vehicle, index) => (
              <TouchableOpacity
                key={index}
                row
                paddingV-5
                style={{ borderTopWidth: 1 }}
                onPress={async () => {
                  await getVehicle(vehicle.id)
                  setCheckingVehicle(vehicle)
                  setIsShowVehicleDetail(true)
                }}
              >
                <Text flex center>
                  {vehicle.id}
                </Text>
                <Text flex center>
                  {vehicle.identityNumber}
                </Text>
                <Text flex center>
                  {vehicle.description}
                </Text>
              </TouchableOpacity>
            ))
          : null}
        <Modal
          visible={isShowVehicleDetail}
          onBackgroundPress={() => console.log("background pressed")}
        >
          <Modal.TopBar
            title={"Vehicle Detail"}
            cancelIcon
            onCancel={() => setIsShowVehicleDetail(false)}
          />

          {checkingVehicle ? (
            <>
              <View row padding-10>
                <Text flex>Id</Text>
                <Text flex>{checkingVehicle.id}</Text>
              </View>
              <View row padding-10>
                <Text flex>Identity Number</Text>
                <Text flex>{checkingVehicle.identityNumber}</Text>
              </View>
              <View row padding-10>
                <Text flex>Description</Text>
                <Text flex>{checkingVehicle.description}</Text>
              </View>
              <View row padding-10>
                <Text flex>State</Text>
                <Text flex>{checkingVehicleState}</Text>
              </View>
              {parkingStation ? (
                <>
                  <View row padding-10>
                    <Text flex>Parking Station</Text>
                    <Text flex>{parkingStation.name}</Text>
                  </View>
                </>
              ) : null}
            </>
          ) : null}
          {checkingVehicleState == "Parking" ? (
            <Button
              label="Checkout"
              onPress={async () => {
                const checkoutUrl = await checkout()
                Linking.openURL(checkoutUrl as string)
              }}
            />
          ) : null}
        </Modal>
        <Modal visible={showAddVehicleModel}>
          <Modal.TopBar
            title={"Add Vehicle"}
            cancelIcon
            onCancel={() => setShowAddVehicleModel(false)}
          />
          <View paddingH-10>
            <View centerV row>
              <Text centerV marginR-20>
                Biển số xe:{" "}
              </Text>
              <TextField flex placeholder="Biển số xe" onChangeText={setVehicleIdentity} />
            </View>
            <View centerV row>
              <Text centerV marginR-20>
                Mô tả:{" "}
              </Text>
              <TextField flex placeholder="Mô tả" onChangeText={setVehicleDescription} />
            </View>
            <View row>
              <Button
                label="Thêm phương tiện"
                br10
                onPress={async () => {
                  try {
                    console.log(vehicleDescription)

                    const result = await api.apisauce.post("/vehicle", {
                      identityNumber: vehicleIdentity,
                      description: vehicleDescription,
                    })
                    const getVehicles = await api.apisauce.get("/vehicle")
                    setVehicles(getVehicles.data as Vehicle[])
                    console.log(vehicles.length)

                    console.log(result)
                  } catch (error) {
                    Alert.alert("Thêm phương tiện không thành công")
                  }
                }}
              />
              <View flex />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
})
