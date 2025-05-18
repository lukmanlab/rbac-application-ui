import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';

interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

export const loadingSlice = createAppSlice({
  name: 'loading',
  initialState,
  reducers: create => ({
    setLoading: create.reducer((state, action: PayloadAction<LoadingState>) => {
      state.isLoading = action.payload.isLoading
    }),
  }),
  selectors: {
    selectLoading: loading => loading.isLoading
  }
});

export const { setLoading } = loadingSlice.actions;
export const { selectLoading } = loadingSlice.selectors
