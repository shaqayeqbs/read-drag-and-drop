import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import type { MockedFunction } from "vitest";
import i18n from "../i18n";
import MapPage from "../pages/MapPage";

// Mock react-leaflet
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
  useMap: () => ({}),
}));

// Mock the station service
vi.mock("../services/stationService", () => ({
  fetchStations: vi.fn(),
}));

import { fetchStations } from "../services/stationService";

const mockStations = [
  {
    id: 1,
    name: "Berlin Hbf",
    city: "Berlin",
    country: "Germany",
    lat: 52.5251,
    lng: 13.3694,
  },
  {
    id: 2,
    name: "Hamburg Hbf",
    city: "Hamburg",
    country: "Germany",
    lat: 53.553,
    lng: 10.0067,
  },
  {
    id: 1001,
    name: "Paris Gare du Nord",
    city: "Paris",
    country: "France",
    lat: 48.8809,
    lng: 2.3553,
  },
];

describe("MapPage", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders loading state initially", () => {
    (fetchStations as MockedFunction<typeof fetchStations>).mockResolvedValue(
      mockStations,
    );

    render(<MapPage />);

    expect(screen.getByText(i18n.t("map.loading"))).toBeInTheDocument();
  });

  it("renders stations after loading", async () => {
    (fetchStations as MockedFunction<typeof fetchStations>).mockResolvedValue(
      mockStations,
    );

    render(<MapPage />);

    await waitFor(() => {
      expect(screen.getByText(i18n.t("map.title"))).toBeInTheDocument();
    });

    expect(screen.getAllByText("Berlin Hbf").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Hamburg Hbf").length).toBeGreaterThan(0);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("filters stations by city", async () => {
    (fetchStations as MockedFunction<typeof fetchStations>).mockResolvedValue(
      mockStations,
    );

    render(<MapPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Berlin Hbf").length).toBeGreaterThan(0);
    });

    // Select city
    const citySelect = screen.getByLabelText(/filter by city/i);
    fireEvent.change(citySelect, { target: { value: "Berlin" } });

    await waitFor(() => {
      expect(screen.getAllByText("Berlin Hbf").length).toBeGreaterThan(0);
      expect(screen.queryByText("Hamburg Hbf")).not.toBeInTheDocument();
    });
  });
});
