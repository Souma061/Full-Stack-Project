import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [],
  currentVideo: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 20,
  },
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
      state.isLoading = false;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { setVideos, setCurrentVideo, setLoading, setError, setFilters } = videoSlice.actions;
export default videoSlice.reducer;
