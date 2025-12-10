# MissionProject JSON schema (KitSmith integration)

KitSmith reads and writes a shared **MissionProject** JSON envelope that matches the Ceradon Architect Stack (Node/UxS/Mesh/Mission/KitSmith). The schema is intentionally permissive and tolerant of partial data; unknown fields are preserved.

- Reference JSON Schema: `schema/mission_project_kits_v2.json`
- Version constant: `KITSMITH_SCHEMA_VERSION` in `mission_project.js` (exported to the window for UI and import/export flows).

## Top-level fields
- `schemaVersion` (number): Current version `2`.
- `id` (string): Stable mission/project id. Generated if missing.
- `name` (string): Human-readable mission name.
- `origin_tool` (string): Producing tool (`kit`, `node`, `uxs`, `mesh`, `mission`, etc.).
- `mission` (object): Narrative summary.
- `environment` (object): Environmental context and notes.
- `constraints` (object): Mission/time/team constraints.
- `nodes[]` (array): Individual nodes (compute, mesh, sensors, relays).
- `platforms[]` (array): Vehicles or host platforms.
- `mesh_links[]` (array): Mesh/radio link hints.
- `kits` (object): Kit definitions and assignments.

### Mission
- `summary` (string)
- `commander_intent` (string)
- `ao` (string): Area of operations name/descriptor.
- `time_window` (string)

### Environment
- `terrain` (string): Urban/Rural/Mountain/Arctic/etc.
- `altitude_m` (number|null)
- `temperature_c` (number|null)
- `weather` (string)
- `notes` (string)

### Constraints
- `duration_hours` (number|null)
- `team_size` (number|null)
- `max_weight_per_operator_kg` (number|null)
- `safety_factor` (number): Default `1`.
- `power_strategy` (object):
  - `power_external` (bool)
  - `power_generator` (bool)
  - `power_battery_only` (bool)

### Nodes
Each node should keep a **stable id**; KitSmith will generate one if it is absent.
- `id` (string)
- `name` (string)
- `role` (string)
- `origin_tool` (string)
- `platform_ref` (string|null): Platform id when mounted.
- `rf_bands` (array|string|null): e.g., `"UHF"`, `"L-band"`.
- `power` (object): `battery_wh` (number|null), `runtime_hours` (number|null)
- `geo` (object): `{ "lat": number, "lon": number, "elevation": number }` (all optional)
- `notes` (string)

### Platforms
- `id` (string)
- `name` (string)
- `type` (string)
- `role` (string)
- `origin_tool` (string)
- `rf_bands` (array|string|null)
- `power` (object): `battery_wh` (number|null), `fuel_hours` (number|null)
- `geo` (object): `{ "lat": number, "lon": number, "elevation": number }`

### Mesh links
- `id` (string)
- `name` (string)
- `from` (string): Node id
- `to` (string): Node id
- `band`/`rf_band` (string)
- `range_km` (number|null)
- `origin_tool` (string)

### Kits
- `origin_tool` (string)
- `definitions[]`
  - `id` (string)
  - `name` (string)
  - `role` | `intended_role` (string)
  - `assigned_element` (string): operator/team hint used in packing lists
  - `origin_tool` (string)
  - `items` (object): `{ "item_id": qty }` (arrays with `{id, qty}` also accepted on import)
  - `total_weight_kg` (number|null): auto-computed on export
  - `total_energy_wh` (number|null): auto-computed on export
  - `spares` (object): optional spare parts/power notes
- `assignments[]`
  - `id` (string)
  - `operator` (string)
  - `role` (string)
  - `team` (string)
  - `kitIds[]` (array of kit ids)
  - `origin_tool` (string)
  - `max_weight_kg` (number|null): optional per-operator override
  - `power_margin_hours` (number|null): optional sustainment buffer

## Import/export behavior
- KitSmith auto-generates ids for any node/platform/link/kit without one.
- Unknown fields are kept when re-saved to keep cross-tool metadata intact.
- Partial data is accepted: empty `kits`, placeholder `mesh_links`, or platforms without kits will not error.
- All persisted entities are tagged with `origin_tool` (default `"kit"`).

## Example: WHITEFROST demo (truncated)
```json
{
  "schemaVersion": 2,
  "origin_tool": "kit",
  "name": "WHITEFROST Demo",
  "environment": { "terrain": "Arctic Mountain", "altitude_m": 2600, "temperature_c": -15 },
  "constraints": { "duration_hours": 72, "team_size": 5, "safety_factor": 1.35 },
  "nodes": [
    { "id": "wf_mesh_1", "name": "WHITEFROST Mesh Relay", "role": "Mesh Relay", "rf_bands": ["UHF"], "power": { "battery_wh": 180 }, "geo": { "lat": 64.12, "lon": -21.8, "elevation": 2280 }, "origin_tool": "mesh" }
  ],
  "platforms": [
    { "id": "wf_quad", "name": "WHITEFROST Recon Quad", "type": "Quadcopter", "role": "ISR", "rf_bands": ["2.4GHz", "L-band"], "power": { "battery_wh": 120 }, "geo": { "lat": 64.13, "lon": -21.81, "elevation": 2300 }, "origin_tool": "uxs" }
  ],
  "kits": { "definitions": [ { "id": "wf_tl", "name": "WHITEFROST TL", "items": { "bat_98wh_brick": 2 } } ] }
}
```
