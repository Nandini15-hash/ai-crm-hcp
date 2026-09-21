import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Async thunks: each one does the API call, and the slice below updates
// state once the call resolves. Every component reads from this same
// store instead of keeping its own local copy, so logging an interaction
// in one place (the form, or the AI chat) is immediately reflected
// everywhere else (History, Dashboard) without a manual page refresh.

export const fetchInteractions = createAsyncThunk(
  "interaction/fetchInteractions",
  async () => {
    const res = await api.get("/interactions");
    return res.data;
  }
);

export const createInteraction = createAsyncThunk(
  "interaction/createInteraction",
  async (formData) => {
    const res = await api.post("/interaction", formData);
    return { ...formData, id: res.data.id };
  }
);

export const updateInteraction = createAsyncThunk(
  "interaction/updateInteraction",
  async ({ id, updates }) => {
    await api.put("/interaction", { interaction_id: id, updates });
    return { id, updates };
  }
);

export const deleteInteraction = createAsyncThunk(
  "interaction/deleteInteraction",
  async (id) => {
    await api.delete(`/interaction/${id}`);
    return id;
  }
);

const initialState = {
  interactions: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    // Kept for any local-only, non-persisted addition (not currently used,
    // but harmless to leave available).
    addInteraction: (state, action) => {
      state.interactions.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.interactions = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.interactions.unshift(action.payload);
      })
      .addCase(updateInteraction.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const existing = state.interactions.find((item) => item.id === id);
        if (existing) {
          Object.assign(existing, updates);
        }
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.interactions = state.interactions.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const { addInteraction } = interactionSlice.actions;

export default interactionSlice.reducer;
