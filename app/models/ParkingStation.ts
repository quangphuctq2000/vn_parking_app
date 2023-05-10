export interface ParkingStation {
  id: number
  name: string
  latitude: number
  longitude: number
  description: string
  pricePerHour: number
  pricePerMonth: number
  parkingLotNumber: number
  freeParkingLotNumber: number
}

export interface ParkingStationResponseData {}
