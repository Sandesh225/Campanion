// src/middlewares/loggerMiddleware.ts

import { Middleware } from "@reduxjs/toolkit";

const loggerMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  console.log("Dispatching Action:", action);
  const result = next(action);
  console.log("Next State:", storeAPI.getState());
  return result;
};

export default loggerMiddleware;
