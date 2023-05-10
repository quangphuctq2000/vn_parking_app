import { useNavigation } from "@react-navigation/native"
import { api } from "app/services/api"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Modal, View, Text } from "react-native-ui-lib"

interface ParkingStation {
  name: string
  description: string
  parkingLotNumber: number
  freeParkingLotNumber: number
  pricePerHour: number
  pricePerMonth: number
}

export type ParkingStationModalType = {
  openModal: Function
}

export const ParkingStationModal = forwardRef(
  (_props: { id: number }, ref: ForwardedRef<ParkingStationModalType>) => {
    useImperativeHandle(ref, () => {
      return {
        openModal,
      }
    })
    const [showModal, setShowModal] = useState<boolean>(false)
    const [parkingStation, setParkingStation] = useState<ParkingStation>()

    async function openModal(parkingStation: ParkingStation) {
      try {
        setParkingStation(parkingStation)
      } catch (error) {
        console.log(error)
      }
      console.log("_props.id", _props.id)
      setShowModal(true)
    }

    return (
      <Modal visible={showModal} onBackgroundPress={() => console.log("background pressed")}>
        <Modal.TopBar title={"Parking Station"} cancelIcon onCancel={() => setShowModal(false)} />
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
                  {/* {parkingStation.description} */}
                  Hoạt động 24/7
                </Text>
              </View>
              <View row spread paddingB-10>
                <Text text60 flex>
                  Số chỗ đỗ xe mặc định:
                </Text>
                <Text flex center text60>
                  {parkingStation.parkingLotNumber}
                </Text>
              </View>
              <View row spread paddingB-10>
                <Text text60 flex>
                  Số chỗ đỗ xe còn trống:
                </Text>
                <Text flex center text60>
                  {parkingStation.freeParkingLotNumber}
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
    )
  },
)
