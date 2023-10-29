import { createSlice } from "@reduxjs/toolkit";

// Create a new Slice for device state management
const deviceSlice = createSlice({
  name: "lifeLog", // Name of the Slice

  initialState: {
    // Initial state with database, token, and authentication status
    database: {},
    token: "",
    isAuthenticated: false,
  },
  reducers: {
    // Reducer function to set data in the state
    setData: (state, action) => {
      state.database = { ...state.database, ...action.payload.data };
    },
    deleteData: (state, action) => {
      state.database = {};
    },
    // Reducer function to handle authentication
    authenticated: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    // Reducer function to handle logout
    logout: (state, action) => {
      state.isAuthenticated = null;
      state.database = {};
    },
    addCategory: (state, action) => {
      if (!state.database.userCategories) {
        state.database.userCategories = {};
      }
      state.database.userCategories[action.payload.uid] = action.payload.data;
    },
    addNote: (state, action) => {
      if (!state.database.userNotes) {
        state.database.userNotes = {};
      }
      state.database.userNotes[action.payload.uid] = action.payload.data;
    },
    updateSum: (state, action) => {
      state.database.userCategories[action.payload.id].notesNum =
        action.payload.sum;
    },
    addNoteToCategory: (state, action) => {
      if (!state.database.userCategories[action.payload.id].notes) {
        state.database.userCategories[action.payload.id].notes = {};
      }
      state.database.userCategories[action.payload.id].notes = {
        ...state.database.userCategories[action.payload.id].notes,
        ...action.payload.data,
      };
    },
    removeNoteToCategory: (state, action) => {
      delete state.database.userCategories[action.payload.id].notes[
        action.payload.idN
      ];
    },
    removeNote: (state, action) => {
      delete state.database.userNotes[action.payload.id];
    },
    removeCategory: (state, action) => {
      delete state.database.userCategories[action.payload.id];
    },
    updateFavorite: (state, action) => {
      state.database.userNotes[action.payload.id].favorite = action.payload.num;
    },
    addFavorite: (state, action) => {
      if (!state.database.userFavorites) {
        state.database.userFavorites = {};
      }
      state.database.userFavorites[action.payload.id] = action.payload.idValue;
    },
    removeFavorite: (state, action) => {
      delete state.database.userFavorites[action.payload.id];
    },
  },
});

// Export the action creators

export const addCategory = deviceSlice.actions.addCategory;
export const addNote = deviceSlice.actions.addNote;
export const updateSum = deviceSlice.actions.updateSum;
export const addNoteToCategory = deviceSlice.actions.addNoteToCategory;
export const removeNoteToCategory = deviceSlice.actions.removeNoteToCategory;
export const removeNote = deviceSlice.actions.removeNote;
export const updateFavorite = deviceSlice.actions.updateFavorite;
export const addFavorite = deviceSlice.actions.addFavorite;
export const removeFavorite = deviceSlice.actions.removeFavorite;
export const removeCategory = deviceSlice.actions.removeCategory;
export const authenticated = deviceSlice.actions.authenticated;
export const logout = deviceSlice.actions.logout;
export const setData = deviceSlice.actions.setData;
export const deleteData = deviceSlice.actions.deleteData;

// Export the reducer
export default deviceSlice.reducer;
