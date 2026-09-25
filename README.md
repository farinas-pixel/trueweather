# TRUEWEATHER

**Live Demo:** https://trueweather.ai.studio

> **Real Weather. Real Data. Real-Time Intelligence.**

TRUEWEATHER is an intelligent real-time weather intelligence platform and 3D atmospheric world experience built for the **Asynchronous JavaScript & RESTful APIs** curriculum. The platform demonstrates production-grade asynchronous JavaScript patterns, live REST API consumption, nested JSON data transformation, request lifecycle management, accessible DOM manipulation, and interactive 3D atmospheric canvas projection.

---

## 1. Project Purpose

Most tutorial weather applications display static mock data or basic cards with arbitrary numbers. TRUEWEATHER is engineered as a **verified data product** that connects directly to the public **Open-Meteo REST API suite** without synthetic simulation or fake loading bars.

It demonstrates mastery of:
- **Asynchronous JavaScript (`async`/`await`)** and the native **Fetch API**.
- **RESTful API consumption** using modern query string construction (`URLSearchParams`).
- **Request Lifecycle Management & Cancellation** using `AbortController` to eliminate race conditions.
- **Data Transformation Architecture**: isolating raw API payloads from clean, normalized UI data models.
- **Rule-Derived Weather Intelligence**: algorithmic insights regarding heat fatigue, rain windows, wind resistance, and outdoor suitability.
- **3D Atmospheric Projection Engine**: a lightweight, dependency-free HTML5 canvas 3D simulation driven by real meteorological variables (WMO weather codes, wind speed/direction, cloud cover, and day/night transitions).
- **Accessibility & Inclusive Design**: WCAG AA compliant contrast, semantic structure, screen reader labels, keyboard navigation, and `prefers-reduced-motion` compliance.

---

## 2. Key Features

- **Live City Search & Autocomplete**: Real-time geocoding resolution for worldwide cities, administrative regions, and countries.
- **Location Disambiguation**: When queries return multiple matching places (e.g., Chennai in Tamil Nadu vs. Andhra Pradesh), users are presented with a compact selection UI rather than guessing.
- **Real Current Weather Focal Card**: High-contrast focal temperature display, human-readable WMO condition descriptions, apparent temperature, relative humidity, wind vectors, and precise API response timestamps.
- **Weather Intelligence Section**: Algorithmic observations for Heat Stress, Rain Windows, Wind Resistance, Humidity Comfort, and Outdoor Recreation Suitability.
- **Today At A Glance**: 3–5 concise observations synthesized directly from verified forecast data.
- **Atmospheric Dimensions Grid**: 8 dedicated metric cards displaying sustained winds, gusts, humidity, cloud cover, solar transit (sunrise/sunset duration), and UV Index with tabular numerals.
- **24-Hour Forecast & Atmosphere Timeline**: Horizontally scrollable hourly strip with an integrated SVG temperature trend chart. Scrubbing or clicking an hour immediately updates the 3D sky to reflect that hour's forecast!
- **7-Day Synoptic Forecast**: Daily forecast cards showing high/low temperature spans, proportional visual range bars, and precipitation probability.
- **Geographic & Real-World Map View**: Interactive OpenStreetMap cartographic embed centered on verified coordinates, complete with coordinate clipboard copying and elevation metrics.
- **Multi-Location Comparison Mode**: Query and benchmark up to 3 global cities side-by-side (e.g., Chennai vs. London vs. Tokyo).
- **3D Atmospheric World Experience**:
  - Volumetric 3D drifting cloud clusters with perspective depth scaling ($1/z$).
  - 3D rain particles aligned directionally with real `wind_direction_10m` and velocity influenced by `wind_speed_10m`.
  - 3D snow flutter physics for winter conditions.
  - Dynamic celestial bodies: Sun with atmospheric corona halo during daytime, Moon with crater curve and twinkling starfield during nighttime.
  - Controlled, low-frequency lightning flashes for thunderstorms (respectful of accessibility).
  - Performance modes: Auto Detect, High Fidelity, and Power Saver.
  - Graceful 2D atmospheric gradient fallback if WebGL/Canvas is disabled.
- **Developer / Research Data Inspector**: Modal displaying formatted, copyable JSON of the normalized state, with real roundtrip network latency in milliseconds.
- **Interactive REST API Flow Walkthrough**: Step-by-step pipeline diagram demonstrating how asynchronous requests transition into user interfaces.
- **Client-Side Persistence (LocalStorage)**:
  - Saved Favorite Locations (up to 10 cities with 1-click retrieval).
  - Recent Search History (up to 6 deduplicated items with single-item removal and clear-all).
  - Unit settings (°C / °F and km/h / mph).
  - 3D atmosphere fidelity preferences.

---

## 3. Technology Stack

- **Runtime & Language**: Modern JavaScript (ES2022+), TypeScript 5.8
- **UI Framework & Architecture**: React 19 (modular functional components, hooks, custom state management)
- **Styling & Design Tokens**: Tailwind CSS v4 with custom CSS variables (`--bg`, `--surface`, `--primary`, `--border`)
- **Graphics & 3D Simulation**: Native HTML5 Canvas 2D/3D perspective projection engine (zero external 3D bundle bloat, 60fps on mobile)
- **Icons**: Lucide React with accessible SVG wrapping
- **REST APIs**: Open-Meteo Geocoding API & Open-Meteo Weather Forecast API
- **Cartography**: OpenStreetMap Embed

---

## 4. REST APIs Used

### A. Geocoding API
- **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
- **Documentation**: [https://open-meteo.com/en/docs/geocoding-api](https://open-meteo.com/en/docs/geocoding-api)
- **Parameters**:
  - `name`: City/place query string
  - `count`: 8
  - `language`: `en`
  - `format`: `json`
- **Returns**: Location name, latitude, longitude, country, country code, administrative region (`admin1`), timezone.

### B. Weather Forecast API
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Documentation**: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)
- **Parameters**:
  - `latitude`: Selected city latitude
  - `longitude`: Selected city longitude
  - `timezone`: Selected city timezone
  - `current`: `temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,is_day`
  - `hourly`: `temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,is_day`
  - `daily`: `weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,uv_index_max,sunrise,sunset`
  - `forecast_days`: 7

---

## 5. Project Architecture

```
trueweather/
├── index.html                   # HTML5 entry with meta, og-tags, & fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies & scripts
├── src/
│   ├── types/
│   │   └── weather.ts           # Clean TypeScript domain interfaces
│   ├── services/
│   │   ├── api.ts               # Asynchronous Fetch, AbortController, error handling
│   │   ├── transformer.ts       # Normalization, WMO code mapping, weather intelligence
│   │   └── storage.ts           # LocalStorage wrapper (favorites, history, settings)
│   ├── utils/
│   │   └── visualMapper.ts      # Real weather -> 3D atmosphere parameters
│   ├── components/
│   │   ├── Header.tsx           # 3-Zone Top Bar Contract
│   │   ├── SearchHero.tsx       # Search bar, location selector, example triggers
│   │   ├── AtmosphereCanvas.tsx # 3D Canvas perspective projection engine
│   │   ├── CurrentWeatherCard.tsx # Focal card with temperature, condition, actions
│   │   ├── WeatherIntelligenceSection.tsx # Rule-derived insights & glance strip
│   │   ├── MetricsGrid.tsx      # 8 Atmospheric dimension cards
│   │   ├── HourlyTimeline.tsx   # 24h scrubbable timeline & SVG temp chart
│   │   ├── DailyForecast.tsx    # 7-day forecast with proportional range bars
│   │   ├── LocationDetails.tsx  # Geographic details & OpenStreetMap embed
│   │   ├── ComparisonMode.tsx   # Multi-location side-by-side comparison
│   │   ├── DataInspectorModal.tsx # Developer formatted JSON inspector
│   │   ├── ApiFlowModal.tsx     # Architecture pipeline visualizer
│   │   ├── FavoritesDrawer.tsx  # Saved locations drawer
│   │   ├── AtmosphereSettingsModal.tsx # 3D simulation & units configuration
│   │   ├── Footer.tsx           # Attribution & documentation links
│   │   └── WeatherIcon.tsx      # Accessible WMO SVG icon mapping
│   ├── App.tsx                  # Main state container & lifecycle coordinator
│   ├── index.css                # CSS variables, typography, & scrollbars
│   └── main.tsx                 # React entry point
└── README.md
```

---

## 6. How the Data Pipeline Operates

```
User Input ("Chennai")
       │
       ▼
Input Validation & Trim
       │
       ▼
Abort Prior In-Flight Request (AbortController.abort())
       │
       ▼
Geocoding API Request (GET geocoding-api.open-meteo.com)
       │
       ▼
Check response.ok & Parse JSON
       │
       ├─ Multiple cities found? ──► Render Location Disambiguation Selector
       │
       ▼
Extract Verified Coordinates (Latitude: 13.0827, Longitude: 80.2707, Timezone: "Asia/Kolkata")
       │
       ▼
Forecast API Request (GET api.open-meteo.com/v1/forecast)
       │
       ▼
Check response.ok & Validate current/hourly/daily payloads
       │
       ▼
Data Transformation (normalizeWeatherData):
  ├── Map WMO numeric codes to condition metadata (e.g. 0 -> "Clear Sky")
  ├── Convert temperature/wind units (°C/°F, km/h/mph)
  ├── Calculate solar duration (sunset - sunrise)
  └── Algorithmic Weather Intelligence Generation
       │
       ▼
Derive 3D Visualization Parameters (deriveVisualState):
  ├── Cloud density (0.0 – 1.0)
  ├── Rain droplet count & wind angle vectors
  ├── Day/Night celestial rendering (Sun vs. Moon & Stars)
  └── Atmospheric sky gradient interpolation
       │
       ▼
Accessible DOM Rendering & LocalStorage History Sync
```

---

## 7. Error Handling Strategy

All asynchronous boundaries are protected by `try/catch` blocks and specific custom error classes:
- `LocationNotFoundError`: Triggered when geocoding returns an empty array. User is prompted to check spelling without exposing raw HTTP codes.
- `WeatherApiError`: Catches HTTP 4xx/5xx responses from Open-Meteo with endpoint context.
- `NetworkError`: Triggered when offline or when connection times out.
- `AbortError`: Handled silently to allow smooth debouncing and rapid consecutive searches without race conditions.
- **User-Friendly Error UI**: Displays a prominent retry banner (`"Try Again"`) with a clear explanation rather than crashing or showing a blank page.

---

## 8. Accessibility Features (WCAG AA)

- **Semantic HTML5 Elements**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`, and `<button>`.
- **Screen Reader Labels**: Every weather icon includes `aria-hidden="true"` accompanied by descriptive hidden text (`sr-only`) or accessible names.
- **Visible Focus Rings**: All interactive controls feature distinct `focus-visible:ring-2` indicators for keyboard-only navigation.
- **Tabular Figures**: Metric numbers utilize `tabular-nums` / `font-mono` to ensure numeric stability without visual layout jitter.
- **Reduced Motion Compliance**: Respects `@media (prefers-reduced-motion: reduce)`. Particle movement is frozen, lightning flashes are disabled, and CSS transitions settle immediately.
- **High Contrast**: Dark theme colors maintain contrast ratios well above the WCAG AA minimum of 4.5:1 for standard body copy.

---

## 9. Testing Checklist

- [x] Search Chennai — resolves to Tamil Nadu, India, and displays live temperature.
- [x] Search Bengaluru — updates 3D atmosphere, metrics, and timeline.
- [x] Search London — displays real London conditions, cloud cover, and British timezone.
- [x] Search an invalid query (e.g. `"xyzinvalidplace123"`) — displays user-friendly "Location not found" error.
- [x] Submit empty search — prevented gracefully without triggering API calls.
- [x] Press Enter key inside search field — triggers search immediately.
- [x] Disconnect network test — displays network error with "Try Again" recovery action.
- [x] Rapid consecutive searches — prior request aborted cleanly with `AbortController`.
- [x] Scrub 24-hour timeline — clicking an hour previews that hour's condition and updates the 3D sky.
- [x] Toggle °C / °F — recalculates all cards, trend chart, and daily forecast bars accurately.
- [x] Add/remove favorite locations — persists across page reloads in `localStorage`.
- [x] Add/clear recent searches — maintains up to 6 deduplicated recent searches.
- [x] Mobile responsiveness — single-column reflow, touch-scrollable timeline, no horizontal overflow.
- [x] Keyboard navigation — tab through all links, buttons, and inputs with visible focus rings.
- [x] Developer JSON Inspector — inspects normalized state and copies formatted payload to clipboard.
- [x] Multi-location comparison — compares up to 3 locations side-by-side with real data.

---

## 10. Known Limitations & Future Improvements

- **Known Limitations**:
  - The public Open-Meteo API does not require an API key, but is subject to standard non-commercial rate limits (up to 10,000 requests/day).
  - Reverse geocoding from GPS coordinates uses browser geolocation. If the user declines permission, city name search remains the standard input path.
- **Future Improvements**:
  - Offline ServiceWorker caching for viewing previously fetched cities when offline.
  - Air Quality Index (AQI) integration using Open-Meteo Air Quality API.
  - Historical weather comparisons (e.g., today's temperature compared to the 30-year climate normal).

---

## 11. Attribution & Licenses

- **Weather Data**: Powered by [Open-Meteo](https://open-meteo.com/) under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
- **Maps**: Cartography by [OpenStreetMap](https://www.openstreetmap.org/) contributors under ODbL.
- **Project**: TRUEWEATHER internship demonstration project for **Asynchronous JavaScript & RESTful APIs**.
