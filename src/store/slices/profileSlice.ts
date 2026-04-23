import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserProfile, updateUpiId, UserProfile } from '../../api/user';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserProfile();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfileUpiId = createAsyncThunk(
  'profile/updateUpiId',
  async (upiId: string, { rejectWithValue }) => {
    try {
      const data = await updateUpiId(upiId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update UPI ID');
    }
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update UPI ID
      .addCase(updateProfileUpiId.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProfileUpiId.fulfilled, (state, action: PayloadAction<{ upiId: string }>) => {
        if (state.profile) {
          state.profile.upiId = action.payload.upiId;
        }
        state.error = null;
      })
      .addCase(updateProfileUpiId.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
