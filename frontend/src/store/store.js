import { configureStore } from "@reduxjs/toolkit"; //This function is used to create a Redux store, which manages the application's state.   
import jobReducer from "./slices/jobSlice";
import userReducer from "./slices/userSlice";
import applicationReducer from "./slices/applicationSlice";
import updateProfileReducer from "./slices/updateProfileSlice";

const store = configureStore({
  reducer: { //The reducer property is used to define the reducers that will handle state updates in your application
    user: userReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    updateProfile: updateProfileReducer
  },
});

export default store;