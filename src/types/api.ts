export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
export interface UserInfo {
  id: string
  nickname: string
  phone: string
}
export interface Session {
  token: string
  user: UserInfo
}
export interface LoginInput {
  phone: string
  password: string
}
