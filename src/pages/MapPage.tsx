import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Station } from "../types/types";
import { fetchStations } from "../services/stationService";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";
delete (
  L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => void }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DEFAULT_CENTER: [number, number] = [51.1657, 10.4515]; // Center of Germany

interface MapControllerProps {
  selectedStation: Station | null;
}

const MapController: React.FC<MapControllerProps> = ({ selectedStation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedStation) {
      map.flyTo([selectedStation.lat, selectedStation.lng], 13, {
        duration: 1,
      });
    }
  }, [selectedStation, map]);

  return null;
};

const MapPage: React.FC = () => {
  const { t } = useTranslation();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await fetchStations();
        setStations(data);
      } catch {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(stations.map((s) => s.city))];
    return uniqueCities.sort();
  }, [stations]);

  const filteredStations = useMemo(() => {
    if (selectedCity) {
      return stations.filter((s) => s.city === selectedCity);
    }
    return stations;
  }, [stations, selectedCity]);

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedStation(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">{t("map.loading")}</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{t("map.loadError")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
        {t("map.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <label
            htmlFor="city-filter"
            className="block text-sm font-medium mb-2 dark:text-gray-200"
          >
            {t("map.filterByCity")}
          </label>
          <select
            id="city-filter"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded pl-3 pr-10 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none bg-no-repeat bg-[length:1.5em_1.5em] bg-[right_0.5rem_center]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            }}
          >
            <option value="">{t("map.allCities")}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden lg:block lg:col-span-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Stations List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            {t("map.stationsCount", { count: filteredStations.length })}
          </h2>
          <div className="max-h-96 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded p-4 bg-white dark:bg-gray-800">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className={`p-3 mb-2 rounded cursor-pointer transition-colors ${
                  selectedStation?.id === station.id
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleStationClick(station)}
              >
                <div className="font-medium dark:text-white">
                  {station.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {station.city}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div
            className="h-[500px] lg:h-full border border-gray-300 dark:border-gray-600 rounded overflow-hidden"
            style={{ minHeight: "500px" }}
          >
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredStations.map((station) => (
                <Marker
                  key={`marker-${station.id}`}
                  position={[station.lat, station.lng]}
                  eventHandlers={{
                    click: () => setSelectedStation(station),
                  }}
                >
                  <Popup>
                    <div>
                      <strong>{station.name}</strong>
                      <br />
                      {station.city}
                    </div>
                  </Popup>
                </Marker>
              ))}
              <MapController selectedStation={selectedStation} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
