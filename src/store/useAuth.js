// stores/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = 'http://192.168.29.92:3001'

const useAuth = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      redirectPath: '/',
      isNewUser: false,

      setRedirectPath: (path) => {
        set({ redirectPath: path });
      },

      initialize: async () => {
        const token = localStorage.getItem('token')
        if (token) {
          try {
            set({ loading: true })
            const response = await axios.get(`${API_URL}/auth_user/user/getprofile`, {
              headers: { accessToken: token }
            })
            if (response.data.success) {
              set({
                token,
                user: response.data.data,
                isAuthenticated: true,
                loading: false
              })
            } else {
              localStorage.removeItem('token')
              set({
                token: null,
                user: null,
                isAuthenticated: false,
                loading: false
              })
            }
          } catch (error) {
            localStorage.removeItem('token')
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              loading: false
            })
          }
        }
      },

      login: async (phoneNumber, isResend = false) => {
        try {
          set({ loading: true, error: null })
          const response = await axios.post(`${API_URL}/auth_user/auth/send_otp`, {
            phoneNumber,
            isResend
          })
          if (response.data.success) {
            return true
          } else {
            set({ error: response.data.message })
            return false
          }
        } catch (error) {
          set({ error: error.response?.data?.message || 'Failed to send OTP' })
          return false
        } finally {
          set({ loading: false })
        }
      },

      verifyOTP: async (phoneNumber, otp) => {
        try {
          set({ loading: true, error: null })
          const response = await axios.post(`${API_URL}/auth_user/auth/verify_otp`, {
            phoneNumber,
            otp
          })

          if (response.data.success) {
            const { token, user, isNewUser } = response.data.data
            localStorage.setItem('token', token)
            set({
              token,
              user,
              isAuthenticated: true,
              isNewUser,
              error: null
            })
            return true
          } else {
            set({ error: response.data.message })
            return false
          }
        } catch (error) {
          set({ error: error.response?.data?.message || 'Failed to verify OTP' })
          return false
        } finally {
          set({ loading: false })
        }
      },

      logout: async () => {
        try {
          const token = get().token
          if (token) {
            await axios.post(`${API_URL}/auth/logout`, {}, {
              headers: { accessToken: token }
            })
          }
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          localStorage.removeItem('token')
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            redirectPath: '/',
            isNewUser: false
          })
        }
      },

      getUser: async () => {
        try {
          set({ loading: true, error: null })
          const token = get().token
          if (!token) {
            throw new Error('No token found')
          }

          const response = await axios.get(`${API_URL}/auth_user/user/getprofile`, {
            headers: {
              accessToken: token
            }
          })

          set({
            user: response.data.data,
            error: null
          })
          return { success: true, data: response.data.data }
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to fetch user data'
          set({ error: message, isAuthenticated: false, token: null, user: null })
          localStorage.removeItem('token')
          return { success: false, message }
        } finally {
          set({ loading: false })
        }
      },

      updateProfile: async (data) => {
        try {
          set({ loading: true, error: null })
          const token = localStorage.getItem('token')
          
          if (!token) {
            set({ loading: false, error: 'No authentication token found' })
            return false
          }

          const response = await axios.put(`${API_URL}/auth_user/user/update_profile`, data, {
            headers: {
              'accessToken': token
            }
          })

          if (response.data.success) {
            set({ 
              user: response.data.data,
              loading: false,
              error: null
            })
            return true
          }
          set({ 
            error: response.data.message || 'Failed to update profile',
            loading: false 
          })
          return false
        } catch (error) {
          console.error('Profile update error:', error)
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to update profile',
            loading: false 
          })
          return false
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        redirectPath: state.redirectPath
      })
    }
  )
)

export default useAuth;
