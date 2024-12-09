// src/slices/actionQueueSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QueuedAction {
  type: string;
  payload: any;
}

interface ActionQueueState {
  queue: QueuedAction[];
}

const initialState: ActionQueueState = {
  queue: [],
};

const actionQueueSlice = createSlice({
  name: "actionQueue",
  initialState,
  reducers: {
    enqueueAction(state, action: PayloadAction<QueuedAction>) {
      state.queue.push(action.payload);
    },
    dequeueAction(state) {
      state.queue.shift();
    },
    clearQueue(state) {
      state.queue = [];
    },
  },
});

export const { enqueueAction, dequeueAction, clearQueue } =
  actionQueueSlice.actions;
export default actionQueueSlice.reducer;
