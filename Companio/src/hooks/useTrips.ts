// src/hooks/useTrips.ts

import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { Trip, ApiResponse } from "../types";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface TripsParams {
  status: "upcoming" | "past";
}

const fetchTrips = async (userId: string, status: string): Promise<Trip[]> => {
  const response = await api.get<ApiResponse<Trip[]>>("/trips", {
    params: { userId, status },
  });
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(
      response.data.message || `Failed to fetch ${status} trips.`
    );
  }
};

export const useTrips = (status: "upcoming" | "past") => {
  const { user } = useContext(AuthContext);

  return useQuery<Trip[], Error>(
    ["trips", status],
    () => fetchTrips(user!.id, status),
    {
      enabled: !!user,
      staleTime: 5 * 60 * 1000,
    }
  );
};
