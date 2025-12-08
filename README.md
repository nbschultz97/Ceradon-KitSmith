# Ceradon KitSmith

KitSmith is a lightweight, browser-based kit and sustainment planner built to align with the Ceradon Architect Stack (Node/UxS/Mesh/Mission/KitSmith). It is a static single-page app that runs on GitHub Pages or any basic static host—no build system or backend required.

## Features
- Define mission constraints (duration, environment, team size, per-operator weight, power strategy, notes).
- Apply a global safety factor to battery/consumable needs and show model vs buffered counts.
- Browse inventory from `data/inventory.json` with category and text filters.
- Build multiple kits (per operator or vehicle), adjust quantities, and see live totals (weight, energy, runtime heuristic).
- Check per-operator weight and highlight overloads with a per-operator rollup.
- Visualize sustainment timelines across 24/48/72h (or mission-defined) windows with battery risk flags.
- Import Node/Platform design JSON and optional Mission metadata to pre-seed kits and constraints.
- Export the current session as JSON or copy a text-based packing checklist.
- Generate printable per-kit checklists with line-item checkboxes.
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

## Presets, imports, and MissionProject integration
To seed example kits, edit `app.js` in `hydrateDefaults()` or extend with a `data/presets.json` loader. The UI and state model are ready for imports from other Ceradon tools (e.g., Mission Architect) by reusing the `kits` and `constraints` objects.

You can now import Node/Platform design JSON (arrays of `nodes`, `platforms`, or `kits` with `name`, `role`, and `items: [{"id","qty"}]`) plus optional `mission` metadata (`durationHours`, `environment`, `teamSize`, `maxWeightPerOperatorKg`, `safetyFactor`). Imported kits replace the working set and immediately refresh summary/power logic. The export payload also includes a `missionProject` block containing kit definitions, operator loads, and sustainment flags so downstream MissionProject JSON can be patched without changing the static front end.

## Export formats
- **JSON:** Download `kitsmith_export.json` containing constraints (including safety factor), kits with totals, operator loads, sustainment flags, and a timestamp. A nested `missionProject` block mirrors the same data for downstream tools.
- **Text checklist:** Builds a plain-text block with mission context and per-kit line items (copy to clipboard).
- **Printable checklists:** Generates per-kit packing lists with multiple checkboxes per line item; use your browser’s print dialog to produce paper copies.

## Notes on sustainment logic
- Safety factor: The `safetyFactor` (default 1.2x) multiplies modeled battery requirements before rounding up. Summary cards show both the raw model need and the buffered requirement so users see the margin.
- Per-person load checking: Each kit is assumed to be carried by one operator. Weight summaries and the per-operator table flag overloads versus the configured `maxWeightPerOperatorKg`.
- Sustainment timeline: Uses the heuristic baseline draw (higher for RF/UxS/Nodes) to estimate Wh required across 24/48/72h and mission-defined durations. Rows flag red when on-hand battery energy cannot satisfy the safety-adjusted need. Logic is coarse by design and ready for replacement with more precise CSI-driven power models.
