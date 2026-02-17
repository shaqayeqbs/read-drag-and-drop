import type { Station } from "../types/types";

const STATIONS_API_URL = import.meta.env.VITE_STATIONS_API_URL;

export const fetchStations = async (): Promise<Station[]> => {
  try {
    const response = await fetch(STATIONS_API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch stations");
    }
    const germanStations: Station[] = await response.json();

    // Add country field to German stations
    const stationsWithCountry = germanStations.map((station) => ({
      ...station,
      country: "Germany",
    }));

    // Combine German stations with additional stations
    return [...stationsWithCountry];
  } catch (error) {
    console.error("Error fetching stations:", error);
    // If API fails, return only additional stations
    return [];
  }
};
