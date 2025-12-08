# ATAK / tactical-app export stubs

KitSmith ships an ATAK-friendly export package to keep offline workflows aligned with the MissionProject JSON schema.

## Files included in the `.zip`
- `kitsmith/kit_<timestamp>.json`: Full KitSmith export (constraints, kits, assignments, sustainment rollups, MissionProject block).
- `kitsmith/mission_project_<timestamp>.json`: MissionProject JSON matching `docs/mission_project_schema.md`.
- `kitsmith/mission_<timestamp>.geojson`: GeoJSON `FeatureCollection` describing nodes, platforms, and mesh links when coordinates are present.
- `kitsmith/mission_<timestamp>_cot.json`: Lightweight CoT-style stub with units and positions (JSON, not XML) for tactical app bridges.
- `MANIFEST/manifest.xml`: Simple manifest to satisfy TAK importer expectations.

## GeoJSON fields
- **Feature properties**
  - `id`, `name`, `role`, `kind` (`node` | `platform` | `mesh_link`),
  - `origin_tool`,
  - `rf_bands` (array|string),
  - `power_wh` (node/platform battery estimate),
  - `band`/`range_km` for mesh links.
- **Geometry**
  - Points for nodes/platforms using `geo.lat`, `geo.lon`, and optional `geo.elevation`.
  - LineStrings for mesh links when both endpoints have coordinates.

## CoT-style JSON stub
```json
{
  "name": "Mission name",
  "summary": "Commander intent or notes",
  "time": "2024-03-21T14:00:00Z",
  "units": [
    { "uid": "wf_mesh_1", "type": "node", "name": "WHITEFROST Mesh Relay", "role": "Mesh Relay", "lat": 64.12, "lon": -21.8, "alt": 2280, "rf_bands": ["UHF"], "origin_tool": "mesh" }
  ]
}
```

## Usage
1. Build or load a mission inside KitSmith (import MissionProject JSON or the WHITEFROST demo).
2. Click **Download ATAK Mission Package (.zip)** under **Export**.
3. Drop the zip into a TAK/ATAK data package import folder or send it over a tactical companion app. TAK will recognize the manifest and keep JSON payloads intact for downstream plugins.

The export flow is offline-first and never calls external APIs. Errors surface as inline banners instead of silent failures.
