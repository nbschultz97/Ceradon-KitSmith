# Ceradon KitSmith

KitSmith is a lightweight, browser-based kit and sustainment planner built to align with the Ceradon Architect Stack (Node/UxS/Mesh/Mission/KitSmith). It is a static single-page app that runs on GitHub Pages or any basic static host—no build system or backend required.

## Features
- Define mission constraints (duration, environment, team size, per-operator weight, power strategy, notes).
- Browse inventory from `data/inventory.json` with category and text filters.
- Build multiple kits (per operator or vehicle), adjust quantities, and see live totals (weight, energy, runtime heuristic).
- Export the current session as JSON or copy a text-based packing checklist.
- Dark, panel-based UI styled after Ceradon UxS Architect for quick adoption in the stack.

## Getting started
1. Clone the repository.
2. Serve the files locally with any static server. Examples:
   - Python: `python3 -m http.server 8000`
   - Node: `npx http-server .`
3. Open `http://localhost:8000` in your browser. The app fetches `data/inventory.json` relative to the root.

For GitHub Pages, set the branch to publish the root of this repository (e.g., `work` or `main`) and browse to the published URL, such as https://nbschultz97.github.io/Ceradon-KitSmith/. All assets are static and will run without additional configuration; if `/data/inventory.json` cannot be reached, the app will fall back to an embedded starter catalog so the UI still loads on first visit.

## Extending the catalog
`data/inventory.json` holds the inventory objects. Each item uses:
```json
{
  "id": "unique_id",
  "name": "Item name",
  "category": "Battery | Radio | Node | UxS | Tool | Sustainment | Other",
  "weight_g": 0,
  "energy_wh": null,
  "volume_l": null,
  "tags": ["keywords"],
  "notes": "optional string"
}
```
- `energy_wh` can be `null` when not applicable.
- Add or adjust categories and tags to match your kits; the filters are data-driven.

## Presets and future inputs
To seed example kits, edit `app.js` in `hydrateDefaults()` or extend with a `data/presets.json` loader. The UI and state model are ready for imports from other Ceradon tools (e.g., Mission Architect) by reusing the `kits` and `constraints` objects.

## Export formats
- **JSON:** Download `kitsmith_export.json` containing constraints, kits, and a timestamp.
- **Text checklist:** Builds a plain-text block with mission context and per-kit line items (copy to clipboard).

## Notes on sustainment logic
Runtime coverage is a placeholder heuristic using kit contents (Nodes/UxS/Radio imply higher draw). The function is isolated in `estimateRuntimeCoverage()` so it can later be replaced with detailed sustainment or CSI-driven power models.
