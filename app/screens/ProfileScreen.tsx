import { useEffect, useState } from "react"
import { View, TextField, Button } from "react-native-ui-lib"
import auth from "@react-native-firebase/auth"
import { updateUser } from "app/utils/api/auth"

export function ProfileScreen() {
  const [email, setEmail] = useState<string>()
  const [displayName, setDisplayName] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [phoneNumber, setPhoneNumber] = useState<string>()
  useEffect(() => {
    setEmail(auth().currentUser.email)
    setDisplayName(auth().currentUser.displayName)
    setPhoneNumber(auth().currentUser.phoneNumber)
  }, [])

  async function update() {
    try {
      await updateUser(email, password, phoneNumber, displayName)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View marginH-10>
      <TextField
        label="Email"
        placeholder="Email"
        onChangeText={setEmail}
        h1
        marginV-10
        labelColor="blue"
        value={email}
      />
      <TextField
        label="Password"
        placeholder="Password"
        onChangeText={setPassword}
        marginV-10
        labelColor="blue"
        value={password}
        secureTextEntry
      />
      <TextField
        label="Display Name"
        placeholder="Display Name"
        onChangeText={setDisplayName}
        marginV-10
        labelColor="blue"
        value={displayName}
      />
      <TextField
        label="Phone Number"
        placeholder="Phone Number"
        onChangeText={setPhoneNumber}
        labelColor="blue"
        marginV-10
        value={phoneNumber}
      />
      <Button label={"Update User"} size={Button.sizes.medium} onPress={update} />
    </View>
  )
}
