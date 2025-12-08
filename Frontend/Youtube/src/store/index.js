import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice';
import videoReducer from './slices/videoSlice';

const store = configureStore({
  reducer: {
    video: videoReducer,
    user: userReducer,
  },
});

export default store;
