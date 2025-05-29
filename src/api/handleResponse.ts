import axios, { isAxiosError } from 'axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = (error: any) => {
  if (isAxiosError(error)) {
    if (error.status === 401) {
      try {
        axios.get('/oauth/logout', {
          method: 'GET',
          withCredentials: true,
        })
      } finally {
        window.location.reload()
      }
    }
    throw new Error(`Request failed with status ${error.status}: ${error.message}`)
  } else {
    throw new Error('Non axios error')
  }
}
