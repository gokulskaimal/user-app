import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Get all users (admin)
export const getUsers = createAsyncThunk("user/getUsers", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${auth.userInfo.token}`,
      },
    }

    const { data } = await axios.get(`${API_URL}/users`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

// Get user by ID (admin)
export const getUserById = createAsyncThunk("user/getUserById", async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${auth.userInfo.token}`,
      },
    }

    const { data } = await axios.get(`${API_URL}/users/${id}`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

// Update user (admin)
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      }

      const { data } = await axios.put(`${API_URL}/users/${id}`, userData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

// Delete user (admin)
export const deleteUser = createAsyncThunk("user/deleteUser", async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${auth.userInfo.token}`,
      },
    }

    await axios.delete(`${API_URL}/users/${id}`, config)

    return id
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

// Search users (admin)
export const searchUsers = createAsyncThunk("user/searchUsers", async (query, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${auth.userInfo.token}`,
      },
    }

    const { data } = await axios.get(`${API_URL}/users/search?query=${query}`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

const initialState = {
  users: [],
  user: null,
  loading: false,
  error: null,
  success: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    resetUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        // Update user in users array
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove deleted user from users array
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSuccess, resetUser } = userSlice.actions

export default userSlice.reducer

