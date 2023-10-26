import { configureStore } from "@reduxjs/toolkit";
import logsReducer from "./logs";
export const store = configureStore({
  reducer: {
    //   initialize Reducer
    lifeLog: logsReducer,
  },
});
