import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { showToast } from "../../components/Message";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Get user from localStorage
const userInfoFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null

// Login user
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const { data } = await axios.post(`${API_URL}/auth/login`, { email, password }, config)

    // Store user info in localStorage
    localStorage.setItem("userInfo", JSON.stringify(data))

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const { data } = await axios.post(`${API_URL}/auth/register`, { username, email, password }, config)

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data))

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("userInfo")
  return null
})

// Get user profile
export const getUserProfile = createAsyncThunk("auth/getUserProfile", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${auth.userInfo.token}`,
      },
    }

    const { data } = await axios.get(`${API_URL}/auth/profile`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

// Upload profile image
export const uploadProfileImage = createAsyncThunk(
  "auth/uploadProfileImage",
  async (imageData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      }

      const { data } = await axios.post(`${API_URL}/users/upload`, { image: imageData }, config)

      // Update user info in localStorage with new profile image
      const updatedUserInfo = {
        ...auth.userInfo,
        profileImage: data.profileImage,
      }
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo))

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
  success: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetSuccess: (state) => {
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.success = true
        showToast("Login successful", "success");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
        state.success = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null
      })
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = { ...state.userInfo, ...action.payload }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Upload profile image
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = {
          ...state.userInfo,
          profileImage: action.payload.profileImage,
        }
        state.success = true
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, resetSuccess } = authSlice.actions

export default authSlice.reducer

