import { axiosInstance as axios } from "../api"

export function createMonthParking(
  parkingStationId: number,
  vehicleIdentityNumber: string,
  month: number,
) {
  return axios.post("/month-parking", {
    parkingStationId,
    vehicleIdentityNumber,
    month,
  })
}
