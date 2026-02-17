import type { Station } from "../types/types";

const STATIONS_API_URL = import.meta.env.VITE_STATIONS_API_URL;

export const fetchStations = async (): Promise<Station[]> => {
  try {
    const response = await fetch(STATIONS_API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch stations");
    }
    const stations: Station[] = await response.json();
    return stations;
  } catch (error) {
    console.error("Error fetching stations:", error);
    return [];
  }
};
