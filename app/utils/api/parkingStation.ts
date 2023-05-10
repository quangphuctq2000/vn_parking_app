import { axiosInstance } from "../api"

export function getParkingStation(id: number) {
  return axiosInstance.get(`parking-stations/${id}`)
}
