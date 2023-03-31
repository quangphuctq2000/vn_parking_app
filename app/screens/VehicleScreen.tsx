import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { ViewStyle, Linking } from "react-native"
import { DemoTabScreenProps } from "../navigators/Navigator"
import { useStores } from "app/models"
import { useHeader } from "app/utils/useHeader"
import { useRoute } from "@react-navigation/core"
import axios from "axios"
import { Button, Modal, Text, TouchableOpacity, View } from "react-native-ui-lib"
import { ParkingStation } from "app/models/ParkingStation"
import { api } from "app/services/api"
import { Vehicle } from "app/models/Vehicle"

export const VehicleScreen: FC<DemoTabScreenProps<"ParkingScreen">> = observer((_props) => {
  const {
    authenticationStore: { logout },
  } = useStores()
  const route = useRoute()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [checkingVehicle, setCheckingVehicle] = useState<Vehicle>()
  const [checkingVehicleState, setCheckingVehicleState] = useState<"Free" | "Parking">("Free")
  const [parkingStation, setParkingStation] = useState<ParkingStation | undefined>()
  async function getVehicle(id: number) {
    try {
      const result = await api.apisauce.get(`/vehicle/${id}`)
      console.log(result.data)

      if (result.data) {
        setCheckingVehicleState("Parking")
        setParkingStation(result.data.parkings[0].parkingStation)
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
      return result.data
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    ;(async () => {
      const result = await api.apisauce.get("/vehicle")
      console.log(result)
      setVehicles(result.data as Vehicle[])
      console.log(vehicles.length)

      try {
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
    <View marginH-10 style={{ borderColor: "black", borderWidth: 1 }}>
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
      {/* <Button
        label='open'
        onPress={() =>
          Linking.openURL(
            "https://mtf.onepay.vn/vpcpay/vpcpay.op?AgainLink=http%3A%2F%2Flocalhost%3A3000&Title=%7B%22parkingId%22%3A9%2C%22checkOut%22%3A%222023-03-30T16%3A36%3A04.850Z%22%2C%22price%22%3A5000%7D&vpc_AccessCode=6BEB2546&vpc_Amount=500000&vpc_Command=pay&vpc_Locale=vn&vpc_MerchTxnRef=233604&vpc_Merchant=TESTONEPAY&vpc_OrderInfo=233604&vpc_ReturnURL=http%3A%2F%2Flocalhost%3A3000%2Fparking%2FcheckoutSuccess&vpc_TicketNo=%3A%3A1&vpc_Version=2&vpc_SecureHash=BD5B32E521EF0350063141868AB79903FE53BE4E25CEC2130933907955F5A472",
          )
        }
      > */}

      {/* </Button> */}
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
    </View>
  )
})
