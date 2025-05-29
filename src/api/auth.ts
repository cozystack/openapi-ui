import axios, { AxiosResponse } from 'axios'
import { TAuthResponse } from 'localTypes/auth'
import { handleError } from './handleResponse'

export const login = async (): Promise<TAuthResponse | undefined> => {
  let response: AxiosResponse<TAuthResponse> | undefined

  try {
    response = await axios.get<TAuthResponse>('/oauth/token', { withCredentials: true })
  } catch (error) {
    handleError(error)
  }

  return response?.data
}

export const logout = async (): Promise<TAuthResponse | undefined> => {
  let response: AxiosResponse<TAuthResponse> | undefined

  try {
    response = await axios.get<TAuthResponse>('/oauth/logout', { withCredentials: true })
  } catch (error) {
    handleError(error)
  } finally {
    window.location.reload()
  }

  return response?.data
}
