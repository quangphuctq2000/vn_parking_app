import { axiosInstance as axios } from "../api"
export function signup(token: string) {
  return axios.post("/auth/signup", {
    token,
    role: 2,
  })
}

export function login(token: string) {
  return axios.post("/auth/login", {
    token,
  })
}

export function authWithGoogle(token: string) {
  return axios.post("/auth/google-auth", {
    token,
    role: 2,
  })
}

export function updateUserInfo(displayName: string, phoneNumber: string) {
  return axios.put("/auth/user-info", {
    displayName,
    phoneNumber,
  })
}

export function updateUserEmailPassword(email: string, password: string) {
  return axios.put("/auth/user-auth-info", {
    email,
    password,
  })
}

export function updateUser(
  email: string,
  password: string,
  phoneNumber: string,
  displayName: string,
) {
  return axios.put("/auth/user", {
    email,
    password,
    phoneNumber,
    displayName,
  })
}
