import { axiosInstance as axios } from "../api"

export function createBooking(
  identityNumber: string,
  parkingStationId: number,
  hourBooking: number,
) {
  return axios.post("/booking", {
    identityNumber,
    parkingStationId,
    hourBooking,
  })
}
