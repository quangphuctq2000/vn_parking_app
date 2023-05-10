import { useState } from "react"
import { View, Text, Modal } from "react-native-ui-lib"
import WebView from "react-native-webview"

export const PaymentScreen = function () {
  const [showModal, setShowModal] = useState<boolean>(true)
  return (
    <View>
      {showModal ? (
        <Modal visible={showModal} onBackgroundPress={() => console.log("background pressed")}>
          <Modal.TopBar title={"Booking"} cancelIcon onCancel={() => setShowModal(false)} />
          <WebView
            source={{
              uri: "https://mtf.onepay.vn/vpcpay/vpcpay.op?AgainLink=http%3A%2F%2Flocalhost%3A3000&Title=%7B%22parkingStationId%22%3A8%2C%22month%22%3A5%2C%22vehicleIdentityNumber%22%3A%2222H7%22%2C%22price%22%3A100000%7D&vpc_AccessCode=6BEB2546&vpc_Amount=10000000&vpc_Command=pay&vpc_Locale=vn&vpc_MerchTxnRef=215750&vpc_Merchant=TESTONEPAY&vpc_OrderInfo=215750&vpc_ReturnURL=http%3A%2F%2Flocalhost%3A3000%2Fmonth-parking%2Fsuccess&vpc_TicketNo=127.0.0.1&vpc_Version=2&vpc_SecureHash=2C63F3B824B286304868CE9234CC3ADB300B794CF48563BAE61237FCDB54E211",
            }}
            style={{ height: 50 }}
          />
        </Modal>
      ) : null}
    </View>
  )
}
