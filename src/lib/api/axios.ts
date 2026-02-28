import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

import { clearAccessToken, getAccessToken } from '@/lib/auth/tokenStore'

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ??
	(import.meta.env.DEV
		? '/api'
		: 'https://talaba-hub-backend-1013a4d5cf14.herokuapp.com')

export const baseClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
})

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = getAccessToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

apiClient.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		if (error.response?.status === 401) {
			clearAccessToken()
		}

		return Promise.reject(error)
	},
)

export default apiClient
