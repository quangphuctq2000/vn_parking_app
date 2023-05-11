import { ParkingStation } from "app/models/ParkingStation"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Modal, View, Text, TextField, Button } from "react-native-ui-lib"
import { Picker } from "@react-native-picker/picker"
import { Vehicle } from "app/models/Vehicle"
import { createMonthParking } from "app/utils/api/monthBooking"
import { Linking } from "react-native"
import { createBooking } from "app/utils/api/booking"

export type BookingModalType = {
  open: Function
}

interface Props {
  parkingStation: ParkingStation
  vehicles: Vehicle[]
}

export const BookingModal = forwardRef((_props: Props, ref: ForwardedRef<BookingModalType>) => {
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [bookingType, setBookingType] = useState<"month" | "normal">()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [vehicle, setVehicle] = useState<Vehicle>()
  const [vehicles, setVehicles] = useState<Vehicle[]>()
  useEffect(() => {
    setVehicle(_props.vehicles[0])
    setVehicles(_props.vehicles)
  }, [_props.vehicles])
  const [selectedMonth, setSelectedMonth] = useState()
  const [hoursBooking, setHoursBooking] = useState()
  const parkingStation = _props.parkingStation

  function open() {
    setShowModal(true)
  }

  return (
    <Modal visible={showModal} onBackgroundPress={() => console.log("background pressed")}>
      <Modal.TopBar title={"Booking"} cancelIcon onCancel={() => setShowModal(false)} />
      {_props.parkingStation ? (
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
              ? vehicles.map((_vehicle, index) => (
                  <Picker.Item label={_vehicle.identityNumber} value={_vehicle} key={index} />
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
                onChangeText={(value) => {
                  setSelectedMonth(value as any)
                }}
              />
              <Button
                label="Đăng ký"
                onPress={async () => {
                  try {
                    console.log(vehicle)

                    const result = await createMonthParking(
                      Number(parkingStation.id),
                      vehicle.identityNumber,
                      Number(selectedMonth),
                    )
                    Linking.openURL(result.data as string)
                    console.log(result)
                  } catch (error) {
                    console.log(error)
                  }
                }}
              />
            </>
          ) : (
            <>
              <TextField
                value={hoursBooking}
                placeholder={"Chọn số giờ muốn đặt trước"}
                paddingH-10
                paddingB-10
                onChangeText={(value) => {
                  setHoursBooking(value as any)
                }}
              />
              <Button
                label="Đăng ký"
                onPress={async () => {
                  try {
                    const result = await createBooking(
                      vehicle.identityNumber,
                      Number(parkingStation.id),
                      Number(hoursBooking),
                    )
                    Linking.openURL(result.data as string)
                    console.log(result)
                  } catch (error) {
                    console.log(error)
                  }
                }}
              />
            </>
          )}
        </>
      ) : null}
    </Modal>
  )
})
