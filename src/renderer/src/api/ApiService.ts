import axios from 'axios'

export const apiPost = async (url: string, data: any) => {
  try {
    const response = await axios.post(url, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.error)
  }
}

export const apiPostWithUserIdHeader = async (url: string, data: any, userId: string) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        'X-User-Id': userId
      }
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.error)
  }
}

export const apiGet = async (url: string) => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.error)
  }
}

export const apiGetWithUserIdHeader = async (url: string, userId: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'X-User-Id': userId
      }
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response.data.error)
  }
}
