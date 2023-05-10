export interface ApiResponseDataError {
  statusCode: number
  message: string
}

import axios, { AxiosHeaders, AxiosInstance } from "axios"
export const axiosHeaders = new AxiosHeaders()
import auth from "@react-native-firebase/auth"
import Config from "app/config"

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: Config.API_URL,
})

export function setAuthorizationHeader(value: string) {
  axiosHeaders.setAuthorization(value)
}

axiosInstance.interceptors.request.use(
  async function (config) {
    const accessToken = await auth().currentUser.getIdToken()
    console.log(accessToken)

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return config
  },
  function (error) {
    // router.push({path:"/error"});
    throw error
  },
)
