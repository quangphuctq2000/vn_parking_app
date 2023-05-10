import { ApiResponse } from "apisauce"
import { api } from "app/services/api"

export interface LoginResponseData {
  id: string
  email: string
}

export async function login(accessToken: string): Promise<LoginResponseData | false> {
  try {
    const loginResult: ApiResponse<LoginResponseData> = await api.apisauce.post("/auth/login", {
      token: accessToken,
    })
    if (loginResult.status != 200) return false
    return loginResult.data
  } catch (error) {
    return false
  }
}
