import { db } from '@renderer/firebase'
import axios from 'axios'
import { addDoc, collection } from 'firebase/firestore'

export const apiPost = async (url: string, data: any) => {
  try {
    const response = await axios.post(url, data)
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

export const triggerFirebase = async () => {
  await addDoc(collection(db, 'chat'), { message: 'success' })
}
