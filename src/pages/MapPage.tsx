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
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [mapKey, setMapKey] = useState(0);

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

  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(stations.map((s) => s.country))];
    return uniqueCountries.sort();
  }, [stations]);

  const cities = useMemo(() => {
    const filteredByCountry = selectedCountry
      ? stations.filter((s) => s.country === selectedCountry)
      : stations;
    const uniqueCities = [...new Set(filteredByCountry.map((s) => s.city))];
    return uniqueCities.sort();
  }, [stations, selectedCountry]);

  const filteredStations = useMemo(() => {
    let filtered = stations;
    if (selectedCountry) {
      filtered = filtered.filter((s) => s.country === selectedCountry);
    }
    if (selectedCity) {
      filtered = filtered.filter((s) => s.city === selectedCity);
    }
    return filtered;
  }, [stations, selectedCountry, selectedCity]);

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity("");
    setSelectedStation(null);
    setMapKey((prev) => prev + 1);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedStation(null);
    setMapKey((prev) => prev + 1);
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

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="country-filter"
            className="block text-sm font-medium mb-2 dark:text-gray-200"
          >
            {t("map.filterByCountry")}
          </label>
          <select
            id="country-filter"
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">{t("map.allCountries")}</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div>
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
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={!selectedCountry && cities.length > 20}
          >
            <option value="">{t("map.allCities")}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  {station.city}, {station.country}
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
              key={mapKey}
              center={DEFAULT_CENTER}
              zoom={4}
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
                      {station.city}, {station.country}
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
