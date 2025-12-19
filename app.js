const APP_VERSION = "KitSmith Web v1.3";
const MISSIONPROJECT_SCHEMA_VERSION = "2.0.0";
const STORAGE_KEY = 'kitsmith_state_v1';
const CHANGE_LOG = [
  {
    version: "v1.3.0",
    date: "2024-07-15",
    changes: [
      "Hardened access gate with localStorage unlock flag and optional demo request CTA",
      "Added demo sustainment bootstrapper seeded from MissionProject WHITEFROST baseline",
      "Introduced sustainment risk visualization and mesh-aware kit suggestions",
      "Tagged C-UAS/EW sustainment items with filters and schema/version callouts",
    ],
  },
  {
    version: "v0.3.1",
    date: "2024-06-05",
    changes: [
      "Added inline version badges and MissionProject schema callouts across header and footer",
      "Surfaced MissionProject import schema/version details in Constraints",
      "Improved responsive tables and access gate alignment with Architect stack keys"
    ],
  },
  {
    version: "v0.3.0",
    date: "2024-05-22",
    changes: [
      "Expanded sustainment presets including Whitefrost cold-weather demo",
      "Enhanced MissionProject ingest/export fidelity for schema v2",
      "Improved operator and packing list rollups"
    ],
  },
];
const defaultConstraints = {
  durationHours: 24,
  environment: 'Urban',
  teamSize: 4,
  maxWeightPerOperatorKg: 22,
  safetyFactor: 1.2,
  powerStrategy: {
    powerExternal: false,
    powerGenerator: false,
    powerBatteryOnly: true,
  },
  notes: '',
  altitudeM: null,
  temperatureC: null,
};

const fallbackPresets = [
  {
    id: 'recon24',
    label: 'Load 24h Recon Patrol',
    constraints: {
      durationHours: 24,
      environment: 'Mountain',
      teamSize: 4,
      maxWeightPerOperatorKg: 28,
      powerStrategy: {
        powerExternal: false,
        powerGenerator: false,
        powerBatteryOnly: true,
      },
      notes: '24h route recon. Low signature. Battery-only.',
    },
    kits: [
      {
        name: 'Team Leader',
        role: 'Lead',
        items: {
          bat_98wh_brick: 1,
          radio_harris_152: 1,
          radio_rto_headset: 1,
          sustain_mre: 1,
          sustain_water_blader: 1,
          tool_multitool: 1,
        },
      },
      {
        name: 'RTO',
        role: 'Communications',
        items: {
          bat_98wh_brick: 2,
          radio_harris_152: 1,
          radio_rto_headset: 1,
          node_vantage_edge: 1,
          tool_tripod: 1,
          sustain_mre: 1,
          sustain_water_blader: 1,
        },
      },
      {
        name: 'Scout',
        role: 'ISR',
        items: {
          uxs_quadcopter_scout: 1,
          bat_4s_5000: 3,
          tool_multitool: 1,
          sustain_mre: 1,
          sustain_water_blader: 1,
        },
      },
      {
        name: 'Support',
        role: 'Security',
        items: {
          sustain_mre: 1,
          sustain_water_blader: 1,
          tool_multitool: 1,
        },
      },
    ],
  },
  {
    id: 'uxs48',
    label: 'Load 48h UxS-Heavy Mission',
    constraints: {
      durationHours: 48,
      environment: 'Urban',
      teamSize: 6,
      maxWeightPerOperatorKg: 26,
      powerStrategy: {
        powerExternal: true,
        powerGenerator: true,
        powerBatteryOnly: false,
      },
      notes: '48h contested urban. Heavy UxS and relay support.',
    },
    kits: [
      {
        name: 'Team Leader',
        role: 'C2',
        items: {
          bat_98wh_brick: 2,
          radio_harris_152: 1,
          radio_rto_headset: 1,
          node_vantage_edge: 1,
          sustain_mre: 2,
          sustain_water_blader: 1,
        },
      },
      {
        name: 'RTO',
        role: 'Mesh',
        items: {
          bat_98wh_brick: 2,
          bat_240wh_station: 1,
          radio_harris_152: 1,
          node_vantage_edge: 1,
          power_solar_fold: 1,
          sustain_mre: 2,
          sustain_water_blader: 1,
        },
      },
      {
        name: 'UAS Operator',
        role: 'Air',
        items: {
          uxs_quadcopter_scout: 1,
          bat_4s_5000: 4,
          bat_98wh_brick: 1,
          sustain_mre: 2,
          sustain_water_blader: 1,
        },
      },
      {
        name: 'Support 1',
        role: 'Security',
        items: {
          sustain_mre: 2,
          sustain_water_blader: 1,
          tool_multitool: 1,
          tool_tripod: 1,
        },
      },
      {
        name: 'Support 2',
        role: 'Security',
        items: {
          sustain_mre: 2,
          sustain_water_blader: 1,
          tool_multitool: 1,
        },
      },
      {
        name: 'Power Manager',
        role: 'Generator',
        items: {
          bat_240wh_station: 1,
          other_batterycharger: 1,
          power_solar_fold: 1,
          sustain_mre: 2,
          sustain_water_blader: 1,
        },
      },
    ],
  },
  {
    id: 'sustainment48',
    label: 'Load demo sustainment scenario',
    constraints: {
      durationHours: 48,
      environment: 'Rural',
      teamSize: 5,
      maxWeightPerOperatorKg: 23,
      safetyFactor: 1.25,
      powerStrategy: {
        powerExternal: false,
        powerGenerator: true,
        powerBatteryOnly: true,
      },
      notes: 'Neutral sustainment demo: 48h mixed ISR, relay, and team sustainment package.',
    },
    kits: [
      {
        name: 'ISR kit',
        role: 'ISR overwatch',
        items: {
          uxs_quadcopter_scout: 1,
          bat_4s_5000: 4,
          bat_98wh_brick: 1,
          radio_harris_152: 1,
          tool_multitool: 1,
          sustain_mre: 2,
          sustain_water_blader: 1,
        },
      },
      {
        name: 'Relay support kit',
        role: 'Mesh relay support',
        items: {
          node_vantage_edge: 2,
          bat_98wh_brick: 3,
          bat_240wh_station: 1,
          power_solar_fold: 1,
          tool_tripod: 1,
          sustain_mre: 2,
          sustain_water_blader: 1,
        },
      },
      {
        name: 'Team sustainment kit',
        role: 'Base sustainment',
        items: {
          sustain_mre: 4,
          sustain_water_blader: 2,
          other_batterycharger: 1,
          radio_vhf: 1,
          tool_multitool: 1,
        },
      },
    ],
  },
  {
    id: 'whitefrost',
    label: 'WHITEFROST Sustainment',
    constraints: {
      durationHours: 72,
      environment: 'Arctic Mountain',
      teamSize: 6,
      maxWeightPerOperatorKg: 24,
      safetyFactor: 1.35,
      powerStrategy: {
        powerExternal: false,
        powerGenerator: false,
        powerBatteryOnly: true,
      },
      notes: 'Project WHITEFROST: cold-weather recon with mesh relays and partner sustainment.',
      altitudeM: 2600,
      temperatureC: -15,
    },
    kits: [
      {
        name: 'WHITEFROST Core ISR',
        role: 'Core ISR team',
        items: {
          uxs_quadcopter_scout: 1,
          bat_4s_5000: 4,
          bat_98wh_brick: 3,
          radio_harris_152: 1,
          radio_rto_headset: 1,
          sustain_mre_day: 3,
          sustain_water_blader: 1,
          sustain_cold_layers: 1,
          sustain_handwarmers: 1,
          sustain_battery_wraps: 1,
          tool_multitool: 1,
        },
      },
      {
        name: 'WHITEFROST Mesh Relay',
        role: 'Mesh relay support',
        items: {
          node_vantage_edge: 2,
          bat_98wh_brick: 3,
          bat_240wh_station: 1,
          power_solar_fold: 1,
          tool_tripod: 1,
          sustain_mre_day: 2,
          sustain_water_blader: 1,
          sustain_cold_layers: 1,
          sustain_handwarmers: 1,
          sustain_battery_wraps: 1,
        },
      },
      {
        name: 'WHITEFROST Partner Patrol',
        role: 'Partner-force patrol',
        items: {
          sustain_mre_day: 4,
          sustain_water_blader: 2,
          bat_98wh_brick: 2,
          radio_harris_152: 1,
          other_batterycharger: 1,
          sustain_cold_layers: 1,
          sustain_spares_pouch: 1,
        },
      },
      {
        name: 'WHITEFROST Sustainment',
        role: 'Sustainment cache',
        items: {
          sustain_mre_day: 6,
          sustain_water_blader: 3,
          sustain_cold_layers: 1,
          sustain_handwarmers: 2,
          sustain_battery_wraps: 1,
          sustain_spares_pouch: 1,
        },
      },
    ],
  },
];

const fallbackInventory = [
  {
    id: 'bat_4s_5000',
    name: '4S 5000mAh LiPo',
    category: 'Battery',
    weight_g: 520,
    energy_wh: 74,
    volume_l: 0.4,
    tags: ['UAS', 'UGV', 'field'],
    notes: 'Standard quad battery; store at storage charge.',
  },
  {
    id: 'bat_6s_10000',
    name: '6S 10000mAh LiPo',
    category: 'Battery',
    weight_g: 1400,
    energy_wh: 222,
    volume_l: 1.2,
    tags: ['VTOL', 'relay'],
    notes: 'High-capacity pack for VTOL or relay nodes.',
  },
  {
    id: 'radio_vhf',
    name: 'VHF Handheld',
    category: 'Radio',
    weight_g: 350,
    energy_wh: 12,
    volume_l: 0.5,
    tags: ['voice', 'interop'],
    notes: 'Standard squad radio with spare battery.',
  },
  {
    id: 'node_vantage',
    name: 'Vantage Relay Node',
    category: 'Node',
    weight_g: 2200,
    energy_wh: 180,
    volume_l: 3.2,
    tags: ['mesh', 'relay'],
    notes: 'Drop-in relay node for perimeter or vehicle mounting.',
  },
  {
    id: 'uas_quadcopter',
    name: 'Quadcopter ISR',
    category: 'UxS',
    weight_g: 2800,
    energy_wh: 120,
    volume_l: 8,
    tags: ['ISR', 'organic'],
    notes: 'Day/night quad with EO/IR gimbal.',
  },
  {
    id: 'tool_multimeter',
    name: 'Multimeter',
    category: 'Tool',
    weight_g: 380,
    energy_wh: null,
    volume_l: 0.8,
    tags: ['diagnostic'],
    notes: 'Basic electrical troubleshooting kit.',
  },
  {
    id: 'sustain_mre',
    name: 'MRE',
    category: 'Sustainment',
    weight_g: 510,
    energy_wh: null,
    volume_l: 1,
    tags: ['food'],
    notes: 'Field ration; average weight per meal.',
  },
  {
    id: 'sustain_mre_day',
    name: 'MRE (24h)',
    category: 'Sustainment',
    weight_g: 500,
    energy_wh: null,
    volume_l: 1.0,
    tags: ['food', '24h'],
    notes: 'One-day sustainment ration.',
  },
  {
    id: 'sustain_cold_layers',
    name: 'Cold-weather layer set',
    category: 'Sustainment',
    weight_g: 1800,
    energy_wh: null,
    volume_l: 6.5,
    tags: ['whitefrost', 'clothing', 'arctic'],
    notes: 'Base/mid/shell layers packaged for WHITEFROST sorties.',
  },
  {
    id: 'sustain_handwarmers',
    name: 'Hand warmers (12)',
    category: 'Sustainment',
    weight_g: 320,
    energy_wh: null,
    volume_l: 0.6,
    tags: ['arctic', 'comfort'],
    notes: 'Air-activated warmers to keep radios and batteries above freezing.',
  },
  {
    id: 'sustain_battery_wraps',
    name: 'Battery insulation wraps',
    category: 'Sustainment',
    weight_g: 420,
    energy_wh: null,
    volume_l: 0.8,
    tags: ['battery', 'arctic'],
    notes: 'Insulation sleeves and heat packs for Li-ion sustainment.',
  },
  {
    id: 'sustain_spares_pouch',
    name: 'Spares & repair pouch',
    category: 'Sustainment',
    weight_g: 950,
    energy_wh: null,
    volume_l: 1.8,
    tags: ['repair', 'cold'],
    notes: 'Tape, straps, zip ties, cables, and optics cloth for WHITEFROST kits.',
  },
  {
    id: 'sustain_water2l',
    name: 'Water (2L)',
    category: 'Sustainment',
    weight_g: 2000,
    energy_wh: null,
    volume_l: 2,
    tags: ['hydration'],
    notes: 'Baseline hydration load per operator.',
  },
  {
    id: 'tool_med',
    name: 'IFAK',
    category: 'Tool',
    weight_g: 750,
    energy_wh: null,
    volume_l: 1.2,
    tags: ['med'],
    notes: 'Individual first aid kit.',
  },
  {
    id: 'other_bivy',
    name: 'Bivy Shelter',
    category: 'Other',
    weight_g: 900,
    energy_wh: null,
    volume_l: 5,
    tags: ['sustainment'],
    notes: 'Lightweight overnight cover.',
  },
  {
    id: 'bat_98wh_brick',
    name: '98Wh Power Brick',
    category: 'Battery',
    weight_g: 720,
    energy_wh: 98,
    volume_l: 0.65,
    tags: ['comms', 'mission', 'carry-on', 'rf_spare', 'cuas_support'],
    notes: 'Commercial airline safe; pair with 12V adapter.',
  },
  {
    id: 'bat_240wh_station',
    name: '240Wh Field Station',
    category: 'Battery',
    weight_g: 2100,
    energy_wh: 240,
    volume_l: 1.9,
    tags: ['recharge', 'generator', 'cuas_support', 'rf_spare'],
    notes: 'Base battery for charging handsets and tablets.',
  },
  {
    id: 'radio_harris_152',
    name: 'AN/PRC-152 Handheld',
    category: 'Radio',
    weight_g: 870,
    energy_wh: 16,
    volume_l: 0.7,
    tags: ['VHF', 'UHF', 'voice', 'rf_spare'],
    notes: 'Standard handheld; include spare battery.',
  },
  {
    id: 'node_vantage_edge',
    name: 'Vantage Edge Node',
    category: 'Node',
    weight_g: 980,
    energy_wh: 45,
    volume_l: 1.2,
    tags: ['mesh', 'c2', 'vantage', 'cuas_support', 'ew_tool'],
    notes: 'Edge compute for RF/Vantage kits; CSI-capable.',
  },
  {
    id: 'uxs_quadcopter_scout',
    name: 'Scout Quadcopter',
    category: 'UxS',
    weight_g: 2300,
    energy_wh: 120,
    volume_l: 6.0,
    tags: ['recon', 'uas', 'day'],
    notes: 'Pack with 3x flight batteries and folding props.',
  },
  {
    id: 'tool_multitool',
    name: 'Field Multitool',
    category: 'Tool',
    weight_g: 220,
    energy_wh: null,
    volume_l: 0.1,
    tags: ['maintenance', 'general'],
    notes: 'Basic repair multitool with driver bits.',
  },
  {
    id: 'sustain_water_blader',
    name: '2L Water Bladder',
    category: 'Sustainment',
    weight_g: 2000,
    energy_wh: null,
    volume_l: 2.0,
    tags: ['hydration', '24h'],
    notes: 'Assumes filled; adjust for environment.',
  },
  {
    id: 'tool_tripod',
    name: 'Carbon Tripod',
    category: 'Tool',
    weight_g: 940,
    energy_wh: null,
    volume_l: 3.3,
    tags: ['sensors', 'node', 'cuas_support'],
    notes: 'Light tripod for antennas or sensors.',
  },
  {
    id: 'other_batterycharger',
    name: 'Dual Bay Smart Charger',
    category: 'Other',
    weight_g: 780,
    energy_wh: null,
    volume_l: 1.6,
    tags: ['charger', 'shore'],
    notes: 'Accepts 4S/6S; use with generator or wall power.',
  },
  {
    id: 'power_solar_fold',
    name: '80W Folding Solar',
    category: 'Other',
    weight_g: 2100,
    energy_wh: null,
    volume_l: 4.0,
    tags: ['charging', 'silent', 'cuas_support'],
    notes: 'Silent sustainment option; pair with station battery.',
  },
];

const state = {
  project: null,
  constraints: structuredClone(defaultConstraints),
  kits: [],
  assignments: [],
  inventory: [],
  inventoryById: {},
  presets: [],
  statusMessage: '',
  seededFromMissionProject: false,
  operatorSort: { key: 'operator', direction: 'asc' },
  meshContext: { suggestions: [] },
};

function normalizeKitsData(kitsLike) {
  if (!kitsLike) return [];
  const arr = Array.isArray(kitsLike) ? kitsLike : Object.values(kitsLike);
  return arr.map((kit) => ({
    ...kit,
    id: kit.id || `kit_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
    items: Array.isArray(kit.items)
      ? normalizeDesignItems(kit.items)
      : (kit.items || {}),
  }));
}

function itemsObjectToArray(items = {}) {
  return Object.entries(items || {}).map(([id, qty]) => ({ id, qty }));
}

function itemsArrayToObject(arr = []) {
  if (!Array.isArray(arr)) return arr || {};
  return arr.reduce((acc, entry) => {
    const entryId = entry?.id || entry?.item_id;
    if (!entryId) return acc;
    const qty = Number(entry.qty ?? entry.quantity ?? entry.count ?? 1);
    acc[entryId] = (acc[entryId] || 0) + (qty || 1);
    return acc;
  }, {});
}

function normalizeAssignments(assignmentsLike) {
  if (!assignmentsLike) return [];
  const arr = Array.isArray(assignmentsLike) ? assignmentsLike : Object.values(assignmentsLike);
  return arr.map((entry, idx) => ({
    id: entry.id || `op_${crypto.randomUUID ? crypto.randomUUID() : Date.now() + idx}`,
    operator: entry.operator || entry.name || `Operator ${idx + 1}`,
    role: entry.role || '',
    kitIds: Array.isArray(entry.kitIds) ? entry.kitIds.filter(Boolean) : [],
  }));
}

const elements = {
  inventoryListEl: document.getElementById('inventory-list'),
  kitsContainer: document.getElementById('kits-container'),
  summaryContent: document.getElementById('summary-content'),
  missionIntegrationContent: document.getElementById('mission-integration-content'),
  exportContent: document.getElementById('export-content'),
  packingListsContent: document.getElementById('packing-lists-content'),
  snapshotEl: document.getElementById('mission-snapshot'),
  missionProjectStatus: document.getElementById('mission-project-status'),
  inventoryCount: document.getElementById('inventory-count'),
  cuasFilter: document.getElementById('filter-cuas'),
  constraintsForm: document.getElementById('constraints-form'),
  kitForm: document.getElementById('kit-form'),
  kitNameInput: document.getElementById('kit-name-input'),
  kitRoleInput: document.getElementById('kit-role-input'),
  clipboardStatus: document.getElementById('clipboard-status'),
  categoryButtons: document.getElementById('category-buttons'),
  designImport: document.getElementById('design-import'),
  missionImport: document.getElementById('mission-import'),
  missionProjectImport: document.getElementById('mission-project-import'),
  importMissionProjectBtn: document.getElementById('import-mission-project'),
  exportMissionProjectBtn: document.getElementById('export-mission-project'),
  headerVersionBadge: document.getElementById('header-version'),
  footerVersionBadge: document.getElementById('footer-version'),
  changeLogEntries: document.getElementById('change-log-entries'),
  addOperatorBtn: document.getElementById('add-operator'),
  printPackingBtn: document.getElementById('print-packing'),
  meshSuggestions: document.getElementById('mesh-suggestions'),
};

function structuredClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizeSchemaVersion(value) {
  if (value === undefined || value === null) return '';
  return `${value}`;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTimestamp() {
  const now = new Date();
  const pad = (n) => `${n}`.padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
}

function setStatusMessage(text, tone = 'info') {
  state.statusMessage = text || '';
  const banner = document.getElementById('status-banner');
  if (!banner) return;
  if (!text) {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  banner.dataset.tone = tone;
  banner.textContent = text;
}

function renderVersionMeta() {
  const label = `${APP_VERSION} · MissionProject schema ${MISSIONPROJECT_SCHEMA_VERSION}`;
  if (elements.headerVersionBadge) elements.headerVersionBadge.textContent = label;
  if (elements.footerVersionBadge) elements.footerVersionBadge.textContent = label;
}

function renderChangeLog() {
  if (!elements.changeLogEntries) return;
  const entries = [...CHANGE_LOG].sort((a, b) => new Date(b.date) - new Date(a.date));
  elements.changeLogEntries.innerHTML = entries
    .map((entry) => {
      const changeList = (entry.changes || []).map((line) => `<li>${line}</li>`).join('');
      return `
        <article class="changelog-entry">
          <div class="changelog-header">
            <strong>${entry.version}</strong>
            <span class="muted">${entry.date}</span>
          </div>
          <ul>${changeList}</ul>
        </article>
      `;
    })
    .join('');
}

function buildConstraintListSnapshot(constraints) {
  return [
    { key: 'duration_hours', value: constraints.durationHours },
    { key: 'team_size', value: constraints.teamSize },
    { key: 'max_weight_per_operator_kg', value: constraints.maxWeightPerOperatorKg },
    { key: 'safety_factor', value: constraints.safetyFactor },
    { key: 'environment', value: constraints.environment },
    { key: 'power_strategy', value: structuredClone(constraints.powerStrategy) },
  ];
}

function buildKitsSummary() {
  const operatorLoads = buildOperatorSummary();
  const { durationHours, maxWeightPerOperatorKg } = state.constraints;
  const { avgWeight } = calculateTeamSummary();
  return {
    sustainment_hours: durationHours,
    max_weight_per_operator_kg: maxWeightPerOperatorKg,
    average_weight_per_operator_kg: avgWeight,
    operators: operatorLoads.map((op) => ({
      operator: op.operator,
      role: op.role,
      weight_kg: op.totalWeightKg,
      limit_kg: op.limitKg,
      delta_kg: op.deltaKg,
      over_limit: op.overLimit,
    })),
  };
}

function buildKitItemDetails(kit) {
  return Object.entries(kit.items || {}).map(([itemId, qty]) => {
    const item = state.inventoryById[itemId] || {};
    const weight_kg = typeof item.weight_g === 'number' ? +(item.weight_g * qty / 1000).toFixed(3) : null;
    const energy_wh = typeof item.energy_wh === 'number' ? +(item.energy_wh * qty).toFixed(1) : null;
    return {
      item_id: itemId,
      description: item.name || itemId,
      qty: qty || 0,
      weight_kg,
      energy_wh,
      tags: item.tags || [],
    };
  });
}

function mapAssignmentsByKit() {
  const map = {};
  state.assignments.forEach((assign) => {
    (assign.kitIds || []).forEach((id) => {
      if (assign.operator) map[id] = assign.operator;
      else if (assign.role) map[id] = assign.role;
    });
  });
  return map;
}

function buildMissionProjectFromState() {
  const base = state.project || createEmptyMissionProject();
  const constraintsList = buildConstraintListSnapshot(state.constraints);
  const assignmentMap = mapAssignmentsByKit();
  const kitsSummary = buildKitsSummary();
  const project = {
    ...base,
    schemaVersion: state.project?.schemaVersion || KITSMITH_SCHEMA_VERSION,
    schema_version: state.project?.schema_version || MISSIONPROJECT_SCHEMA_VERSION,
    source_schema_version: base.schemaVersion && base.schemaVersion !== KITSMITH_SCHEMA_VERSION ? base.schemaVersion : undefined,
    origin_tool: 'kit',
    name: base.name || 'KitSmith mission',
    constraints: {
      ...base.constraints,
      duration_hours: state.constraints.durationHours,
      team_size: state.constraints.teamSize,
      max_weight_per_operator_kg: state.constraints.maxWeightPerOperatorKg,
      safety_factor: state.constraints.safetyFactor,
      power_strategy: {
        ...structuredClone(defaultConstraints.powerStrategy),
        ...(state.constraints.powerStrategy || {}),
      },
      list: constraintsList,
    },
    environment: {
      ...(base.environment || {}),
      terrain: state.constraints.environment,
      altitude_m: state.constraints.altitudeM,
      temperature_c: state.constraints.temperatureC,
      notes: state.constraints.notes,
    },
    mission: {
      ...(base.mission || {}),
      summary: base.mission?.summary || 'Loaded via KitSmith',
    },
    kits: {
      origin_tool: 'kit',
      definitions: state.kits.map((kit) => {
        const totals = calculateKitTotals(kit);
        return {
          ...kit,
          origin_tool: 'kit',
          intended_role: kit.role || '',
          role: kit.role || '',
          assigned_element: assignmentMap[kit.id] || kit.role || '',
          items: buildKitItemDetails(kit),
          total_weight_kg: totals.totalWeightKg,
          total_energy_wh: totals.totalEnergyWh,
        };
      }),
      assignments: state.assignments.map((assign) => ({
        ...assign,
        origin_tool: 'kit',
        kitIds: [...assign.kitIds],
      })),
    },
    kitsSummary,
    constraints_list: constraintsList,
    kits_flat: [],
  };
  project.sustainment = {
    ...(base.sustainment || {}),
    constraints: project.constraints,
    kits: project.kits,
    kitsSummary,
  };
  project.kits_flat = project.kits.definitions;
  return project;
}

function persistState() {
  state.project = saveMissionProject(buildMissionProjectFromState());
}

function loadLegacyState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Legacy state unavailable', err);
    return null;
  }
}

function hydrateFromMissionProject() {
  const raw = localStorage.getItem(MISSION_PROJECT_STORAGE_KEY);
  if (!raw) {
    state.project = createEmptyMissionProject();
    return;
  }
  const project = loadMissionProject();
  ingestMissionProject(project, { skipRender: true, quiet: true });

  if (!state.kits.length) {
    const legacy = loadLegacyState();
    if (legacy) {
      state.constraints = { ...state.constraints, ...legacy.constraints };
      state.kits = normalizeKitsData(legacy.kits);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

async function loadInventory() {
  try {
    const res = await fetch('data/inventory.json');
    if (!res.ok) throw new Error('Inventory fetch failed');
    const data = await res.json();
    state.inventory = data;
    state.inventoryById = Object.fromEntries(data.map((item) => [item.id, item]));
  } catch (err) {
    console.error(err);
    state.inventory = fallbackInventory;
    state.inventoryById = Object.fromEntries(fallbackInventory.map((item) => [item.id, item]));
    elements.inventoryListEl.innerHTML = '<p class="muted">Inventory failed to load from /data. Using embedded fallback catalog.</p>';
    setStatusMessage('Inventory fallback loaded (offline/denied).', 'warning');
  }
}

async function loadPresets() {
  try {
    const res = await fetch('data/presets.json');
    if (!res.ok) throw new Error('Preset fetch failed');
    state.presets = await res.json();
  } catch (err) {
    console.warn('Preset load fallback', err);
    state.presets = fallbackPresets;
  }
}

async function loadDemoSustainment() {
  try {
    const res = await fetch('data/demo_mission_whitefrost.json');
    if (!res.ok) throw new Error('Demo mission fetch failed');
    const payload = await res.json();
    ingestMissionProject(payload, { quiet: true });
    renderAll();
    persistState();
    setStatusMessage('Demo sustainment scenario loaded (WHITEFROST baseline)', 'info');
  } catch (err) {
    console.warn('Demo sustainment load fallback', err);
    applyPreset('whitefrost');
    if (!state.kits.length) applyPreset('sustainment48');
    setStatusMessage('Loaded sustainment preset fallback', 'warning');
  }
}

function applyConstraintsFromProject(constraints = {}, env = {}) {
  if (Array.isArray(constraints.list)) {
    constraints.list.forEach((entry) => {
      if (!entry || !entry.key) return;
      constraints[entry.key] = entry.value;
    });
  }
  const power = constraints.power_strategy || constraints.powerStrategy || {};
  state.constraints = {
    ...structuredClone(defaultConstraints),
    ...state.constraints,
    durationHours: Number(constraints.durationHours ?? constraints.duration_hours ?? state.constraints.durationHours ?? defaultConstraints.durationHours),
    environment: env.terrain || constraints.environment || state.constraints.environment || defaultConstraints.environment,
    teamSize: Number(constraints.team_size ?? constraints.teamSize ?? state.constraints.teamSize ?? defaultConstraints.teamSize),
    maxWeightPerOperatorKg: Number(constraints.max_weight_per_operator_kg ?? constraints.maxWeightPerOperatorKg ?? state.constraints.maxWeightPerOperatorKg ?? defaultConstraints.maxWeightPerOperatorKg),
    safetyFactor: Number(constraints.safety_factor ?? constraints.safetyFactor ?? state.constraints.safetyFactor ?? defaultConstraints.safetyFactor),
    powerStrategy: { ...structuredClone(defaultConstraints.powerStrategy), ...power },
    notes: env.notes || constraints.notes || state.constraints.notes || '',
    altitudeM: env.altitude_m ?? state.constraints.altitudeM ?? null,
    temperatureC: env.temperature_c ?? state.constraints.temperatureC ?? null,
  };
  syncConstraintForm();
}

function applyMissionMeta(meta = {}) {
  const missionPatch = { ...(meta || {}) };
  if (Array.isArray(missionPatch.list)) {
    missionPatch.list.forEach((entry) => {
      if (!entry || !entry.key) return;
      missionPatch[entry.key] = entry.value;
    });
  }
  const project = state.project || createEmptyMissionProject();
  state.seededFromMissionProject = true;
  project.constraints = {
    ...project.constraints,
    duration_hours: Number(missionPatch.durationHours ?? missionPatch.duration_hours ?? project.constraints?.duration_hours ?? defaultConstraints.durationHours),
    team_size: Number(missionPatch.teamSize ?? missionPatch.team_size ?? project.constraints?.team_size ?? defaultConstraints.teamSize),
    max_weight_per_operator_kg: Number(
      missionPatch.maxWeightPerOperatorKg ?? missionPatch.max_weight_per_operator_kg ?? project.constraints?.max_weight_per_operator_kg ?? defaultConstraints.maxWeightPerOperatorKg
    ),
    safety_factor: Number(missionPatch.safetyFactor ?? missionPatch.safety_factor ?? project.constraints?.safety_factor ?? defaultConstraints.safetyFactor),
    power_strategy: {
      ...structuredClone(defaultConstraints.powerStrategy),
      ...(project.constraints?.power_strategy || project.constraints?.powerStrategy || {}),
      ...(missionPatch.power_strategy || missionPatch.powerStrategy || {}),
    },
  };
  project.constraints.list = buildConstraintListSnapshot({
    durationHours: project.constraints.duration_hours,
    teamSize: project.constraints.team_size,
    maxWeightPerOperatorKg: project.constraints.max_weight_per_operator_kg,
    safetyFactor: project.constraints.safety_factor,
    environment: missionPatch.environment || missionPatch.terrain || project.environment?.terrain || project.constraints?.environment,
    powerStrategy: project.constraints.power_strategy,
  });

  project.environment = {
    ...(project.environment || {}),
    terrain: missionPatch.environment || missionPatch.terrain || project.environment?.terrain || state.constraints.environment,
    altitude_m: missionPatch.altitudeM ?? missionPatch.altitude_m ?? project.environment?.altitude_m ?? null,
    temperature_c: missionPatch.temperatureC ?? missionPatch.temperature_c ?? project.environment?.temperature_c ?? null,
    notes: missionPatch.notes ?? project.environment?.notes ?? state.constraints.notes,
  };
  state.project = saveMissionProject(project);
  applyConstraintsFromProject(project.constraints, project.environment);
  renderAll();
  persistState();
}

function normalizeDesignItems(items = []) {
  return items.reduce((acc, entry) => {
    const entryId = entry?.id || entry?.item_id;
    if (entryId) {
      acc[entryId] = (acc[entryId] || 0) + (Number(entry.qty ?? entry.quantity ?? entry.count) || 1);
    }
    return acc;
  }, {});
}

function mergeEntities(existing = [], incoming = [], prefix = 'ent') {
  const map = new Map();
  (existing || []).forEach((entity, idx) => {
    if (!entity) return;
    const id = entity.id || entity.uid || `${prefix}_${idx + 1}`;
    map.set(id, { ...entity, id });
  });
  (incoming || []).forEach((entity, idx) => {
    if (!entity) return;
    const id = entity.id || entity.uid || `${prefix}_${map.size + 1}`;
    map.set(id, { ...entity, id, origin_tool: entity.origin_tool || prefix });
  });
  return Array.from(map.values());
}

function importDesigns(payload) {
  const { nodes = [], platforms = [], kits: kitList = [] } = payload || {};
  const project = state.project || createEmptyMissionProject();
  project.nodes = mergeEntities(project.nodes, nodes, 'node');
  project.platforms = mergeEntities(project.platforms, platforms, 'platform');
  const mergedKits = mergeEntities(project.kits?.definitions || [], kitList, 'kit');
  project.kits = {
    ...(project.kits || {}),
    origin_tool: 'kit',
    definitions: mergedKits.map((kit) => ({
      ...kit,
      items: Array.isArray(kit.items) ? kit.items : itemsObjectToArray(kit.items),
    })),
    assignments: project.kits?.assignments || [],
  };
  state.project = saveMissionProject(project);
  state.seededFromMissionProject = true;

  if (mergedKits.length) {
    state.kits = normalizeKitsData(mergedKits).map((kit) => ({
      ...kit,
      items: itemsArrayToObject(Array.isArray(kit.items) ? kit.items : itemsObjectToArray(kit.items)),
    }));
    renderAll();
    persistState();
  }
  if (payload?.mission) {
    applyMissionMeta(payload.mission);
  }
}

function recommendItemsForRole(role = '', durationHours = state.constraints.durationHours || 24) {
  const recommendations = {};
  const addIfAvailable = (id, qty = 1) => {
    if (state.inventoryById[id]) recommendations[id] = (recommendations[id] || 0) + qty;
  };
  const days = Math.max(1, Math.ceil((durationHours || 24) / 24));
  const normalizedRole = (role || '').toLowerCase();
  if (normalizedRole.includes('mesh') || normalizedRole.includes('relay')) {
    addIfAvailable('node_vantage_edge', 1);
    addIfAvailable('bat_240wh_station', 1);
    addIfAvailable('bat_98wh_brick', 2);
    addIfAvailable('power_solar_fold', 1);
    addIfAvailable('tool_tripod', 1);
  }
  if (normalizedRole.includes('isr') || normalizedRole.includes('recon') || normalizedRole.includes('scout')) {
    addIfAvailable('uxs_quadcopter_scout', 1);
    addIfAvailable('bat_4s_5000', 3);
    addIfAvailable('radio_harris_152', 1);
  }
  if (normalizedRole.includes('overwatch')) {
    addIfAvailable('radio_harris_152', 1);
    addIfAvailable('bat_98wh_brick', 2);
    addIfAvailable('tool_tripod', 1);
  }
  if (normalizedRole.includes('partner')) {
    addIfAvailable('sustain_mre', days + 1);
    addIfAvailable('sustain_water_blader', 1);
    addIfAvailable('other_batterycharger', 1);
  }
  addIfAvailable('sustain_mre', days);
  addIfAvailable('sustain_water_blader', 1);
  addIfAvailable('tool_multitool', 1);
  return recommendations;
}

function proposeKitsFromProject(project) {
  const kits = [];
  const constraints = project.constraints || {};
  const durationHours = constraints.duration_hours || constraints.durationHours || state.constraints.durationHours;
  const seeds = [];
  (project.nodes || []).forEach((node, idx) => {
    seeds.push({ name: node.name || `Node ${idx + 1}`, role: node.role || 'Node', hint: node });
  });
  (project.platforms || []).forEach((plat, idx) => {
    seeds.push({ name: plat.name || `Platform ${idx + 1}`, role: plat.role || plat.type || 'Platform', hint: plat });
  });

  if (!seeds.length) {
    seeds.push({ name: 'Recon Element', role: 'ISR Recon' });
    seeds.push({ name: 'Mesh Relay', role: 'Mesh Relay' });
    seeds.push({ name: 'Overwatch', role: 'Overwatch' });
    seeds.push({ name: 'Partner Patrol', role: 'Partner Support' });
  }

  seeds.forEach((seed, idx) => {
    const kit = createKitBase(seed.name, seed.role);
    kit.items = recommendItemsForRole(seed.role, durationHours);
    kits.push(kit);
  });

  return kits;
}

function ingestMissionProject(payload, options = {}) {
  const opts = { preferEmptyKits: false, quiet: false, skipRender: false, ...options };
  const project = saveMissionProject(payload || {});
  state.project = project;
  state.seededFromMissionProject = true;
  const incomingSchema = normalizeSchemaVersion(project.schemaVersion || project.schema_version);
  const targetSchema = normalizeSchemaVersion(KITSMITH_SCHEMA_VERSION);
  if (!opts.quiet && incomingSchema && incomingSchema !== targetSchema) {
    setStatusMessage(`MissionProject schema ${incomingSchema} imported; KitSmith targets ${targetSchema}`, 'warning');
  }
  applyConstraintsFromProject(project.constraints || {}, project.environment || {});

  const kitsSection = project.kits || {};
  const kitDefinitions = normalizeKitsData(kitsSection.definitions || kitsSection.kits || project.kits_flat || []).map((kit) => ({
    ...kit,
    items: itemsArrayToObject(Array.isArray(kit.items) ? kit.items : itemsObjectToArray(kit.items)),
  }));
  if (kitDefinitions.length) {
    state.kits = kitDefinitions;
  } else {
    state.kits = opts.preferEmptyKits ? [] : proposeKitsFromProject(project);
  }
  state.assignments = normalizeAssignments(kitsSection.assignments);
  if (!state.assignments.length && state.kits.length) {
    state.assignments = state.kits.map((kit, idx) => ({ id: `asg_${kit.id}`, operator: kit.name || `Operator ${idx + 1}`, role: kit.role || '', kitIds: [kit.id] }));
  }
  if (!opts.skipRender) {
    renderAll();
    persistState();
    if (!opts.quiet) setStatusMessage('MissionProject loaded', 'info');
  }
}

function importMissionProject(payload) {
  ingestMissionProject(payload, { preferEmptyKits: true });
}

async function handleFileImport(inputEl, onLoad) {
  const file = inputEl?.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const json = JSON.parse(text);
    onLoad(json);
    setStatusMessage(`${file.name} imported successfully`, 'info');
  } catch (err) {
    console.error(err);
    setStatusMessage('Import failed: ' + err.message, 'error');
  } finally {
    inputEl.value = '';
  }
}

function updateConstraintsFromForm() {
  const formData = new FormData(elements.constraintsForm);
  state.constraints.durationHours = Number(formData.get('durationHours')) || 0;
  state.constraints.environment = formData.get('environment') || 'Urban';
  state.constraints.teamSize = Number(formData.get('teamSize')) || 0;
  state.constraints.maxWeightPerOperatorKg = Number(formData.get('maxWeightPerOperatorKg')) || 0;
  state.constraints.safetyFactor = Number(formData.get('safetyFactor')) || 1;
  state.constraints.powerStrategy = {
    powerExternal: formData.get('powerExternal') === 'on',
    powerGenerator: formData.get('powerGenerator') === 'on',
    powerBatteryOnly: formData.get('powerBatteryOnly') === 'on',
  };
  state.constraints.notes = formData.get('notes') || '';
  state.constraints.altitudeM = formData.get('altitudeM') ? Number(formData.get('altitudeM')) : null;
  state.constraints.temperatureC = formData.get('temperatureC') ? Number(formData.get('temperatureC')) : null;
  renderAll();
  persistState();
}

function syncConstraintForm() {
  const form = elements.constraintsForm;
  form.durationHours.value = state.constraints.durationHours;
  form.environment.value = state.constraints.environment;
  form.teamSize.value = state.constraints.teamSize;
  form.maxWeightPerOperatorKg.value = state.constraints.maxWeightPerOperatorKg;
  form.safetyFactor.value = state.constraints.safetyFactor;
  form.powerExternal.checked = !!state.constraints.powerStrategy.powerExternal;
  form.powerGenerator.checked = !!state.constraints.powerStrategy.powerGenerator;
  form.powerBatteryOnly.checked = !!state.constraints.powerStrategy.powerBatteryOnly;
  form.notes.value = state.constraints.notes || '';
  form.altitudeM.value = state.constraints.altitudeM ?? '';
  form.temperatureC.value = state.constraints.temperatureC ?? '';
}

function resetConstraintsForm() {
  state.constraints = structuredClone(defaultConstraints);
  state.kits = [];
  state.assignments = [];
  hydrateBlank();
  syncConstraintForm();
  renderAll();
  persistState();
}

function createKitBase(name = 'New Kit', role = '') {
  return {
    id: `kit_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
    name,
    role,
    items: {},
  };
}

function addKit(name = 'New Kit', role = '') {
  const kit = createKitBase(name, role);
  state.kits.push(kit);
  state.assignments.push({
    id: `asg_${kit.id}`,
    operator: kit.name || 'Operator',
    role: kit.role || '',
    kitIds: [kit.id],
  });
  renderAll();
  persistState();
  return kit.id;
}

function removeKit(id) {
  if (!confirm('Remove this kit?')) return;
  state.kits = state.kits.filter((k) => k.id !== id);
  state.assignments = state.assignments
    .map((assignment) => ({
      ...assignment,
      kitIds: assignment.kitIds.filter((kid) => kid !== id),
    }))
    .filter((assignment) => assignment.kitIds.length > 0);
  renderAll();
  persistState();
}

function addAssignment(name = 'Operator', role = '') {
  const newAssignment = {
    id: `op_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
    operator: name,
    role,
    kitIds: [],
  };
  state.assignments.push(newAssignment);
  renderPackingListsView();
  renderSummaryPanel();
  persistState();
}

function removeAssignment(id) {
  state.assignments = state.assignments.filter((a) => a.id !== id);
  renderPackingListsView();
  renderSummaryPanel();
  persistState();
}

function updateAssignmentField(id, field, value) {
  state.assignments = state.assignments.map((assignment) => assignment.id === id ? { ...assignment, [field]: value } : assignment);
  renderPackingListsView();
  renderSummaryPanel();
  persistState();
}

function toggleAssignmentKit(assignmentId, kitId, enabled) {
  state.assignments = state.assignments.map((assignment) => {
    if (assignment.id !== assignmentId) return assignment;
    const kitIds = new Set(assignment.kitIds || []);
    if (enabled) kitIds.add(kitId);
    else kitIds.delete(kitId);
    return { ...assignment, kitIds: Array.from(kitIds) };
  }).filter((assignment) => (assignment.kitIds || []).length > 0 || assignment.id === assignmentId);
  renderPackingListsView();
  renderSummaryPanel();
  persistState();
}

function addItemToKit(kitId, itemId) {
  const kit = state.kits.find((k) => k.id === kitId);
  if (!kit) return;
  kit.items[itemId] = (kit.items[itemId] || 0) + 1;
  renderAll();
  persistState();
}

function addSuggestedItemToKit(kitId, itemId, qty = 1) {
  for (let i = 0; i < qty; i += 1) {
    addItemToKit(kitId, itemId);
  }
}

function adjustItemQuantity(kitId, itemId, delta) {
  const kit = state.kits.find((k) => k.id === kitId);
  if (!kit || !kit.items[itemId]) return;
  kit.items[itemId] += delta;
  if (kit.items[itemId] <= 0) delete kit.items[itemId];
  renderAll();
  persistState();
}

function calculateKitTotals(kit) {
  let totalWeightG = 0;
  let totalEnergyWh = 0;
  let batteryCount = 0;
  Object.entries(kit.items).forEach(([itemId, qty]) => {
    const item = state.inventoryById[itemId];
    if (!item) return;
    if (typeof item.weight_g === 'number') totalWeightG += item.weight_g * qty;
    if (typeof item.energy_wh === 'number') totalEnergyWh += item.energy_wh * qty;
    if (item.category === 'Battery') batteryCount += qty;
  });
  return {
    totalWeightKg: +(totalWeightG / 1000).toFixed(2),
    totalEnergyWh: +totalEnergyWh.toFixed(1),
    batteryCount,
  };
}

function kitPowerProfile(kit) {
  const hasRfUxS = Object.keys(kit.items).some((id) => {
    const cat = state.inventoryById[id]?.category;
    return cat === 'Radio' || cat === 'UxS' || cat === 'Node';
  });
  const baselineWhPerHour = hasRfUxS ? 15 : 8;
  const requiredWh = baselineWhPerHour * (state.constraints.durationHours || 0);
  const totals = calculateKitTotals(kit);
  const coverage = requiredWh > 0 ? totals.totalEnergyWh / requiredWh : 0;
  const avgBatteryWh = totals.batteryCount > 0 ? totals.totalEnergyWh / totals.batteryCount : 0;
  const modelBatteryRequirement = avgBatteryWh ? Math.ceil(requiredWh / avgBatteryWh) : 0;
  const batteryRequirementWithSafety = modelBatteryRequirement ? Math.ceil(modelBatteryRequirement * (state.constraints.safetyFactor || 1)) : 0;
  const safetyCoverage = requiredWh > 0 ? totals.totalEnergyWh / (requiredWh * (state.constraints.safetyFactor || 1)) : 0;
  return {
    baselineWhPerHour,
    requiredWh,
    coverage,
    status: totals.totalEnergyWh >= requiredWh * (state.constraints.safetyFactor || 1) ? 'Power OK' : 'Power shortfall likely',
    avgBatteryWh,
    modelBatteryRequirement,
    batteryRequirementWithSafety,
    safetyCoverage,
  };
}

function kitWeightStatus(kit) {
  const totals = calculateKitTotals(kit);
  const limit = state.constraints.maxWeightPerOperatorKg || 0;
  const over = limit > 0 && totals.totalWeightKg > limit;
  const margin = limit ? (limit - totals.totalWeightKg) / limit : 0;
  return {
    totals,
    over,
    margin,
    status: over ? 'Over limit' : 'Within limit',
  };
}

function kitStatus(kit) {
  const weight = kitWeightStatus(kit);
  const power = kitPowerProfile(kit);
  return {
    totals: weight.totals,
    overWeight: weight.over,
    weightMargin: weight.margin,
    powerShortfall: power.status !== 'Power OK',
    powerMargin: power.safetyCoverage - 1,
    runtime: power,
  };
}

function marginTone(margin) {
  if (margin >= 0.1) return 'green';
  if (margin >= -0.05) return 'amber';
  return 'red';
}

function calculateTeamSummary() {
  const kits = state.kits;
  const totals = kits.map((kit) => calculateKitTotals(kit));
  const teamWeight = totals.reduce((sum, t) => sum + t.totalWeightKg, 0);
  const avgWeight = kits.length ? +(teamWeight / kits.length).toFixed(2) : 0;

  const batteryCounts = {};
  let totalEnergy = 0;
  kits.forEach((kit) => {
    Object.entries(kit.items).forEach(([itemId, qty]) => {
      const item = state.inventoryById[itemId];
      if (item && item.category === 'Battery') {
        batteryCounts[item.name] = (batteryCounts[item.name] || 0) + qty;
      }
      if (item && typeof item.energy_wh === 'number') totalEnergy += item.energy_wh * qty;
    });
  });

  return {
    teamWeight: +teamWeight.toFixed(2),
    avgWeight,
    batteryCounts,
    totalEnergy: +totalEnergy.toFixed(1),
  };
}

function calculateMissionReadiness() {
  const kits = state.kits;
  if (!kits.length) return { percentWithin: 0, status: 'AMBER – Add kits', within: 0, total: 0 };
  const { maxWeightPerOperatorKg } = state.constraints;
  const within = kits.filter((kit) => {
    const totals = calculateKitTotals(kit);
    return !maxWeightPerOperatorKg || totals.totalWeightKg <= maxWeightPerOperatorKg;
  }).length;
  const percentWithin = Math.round((within / kits.length) * 100);
  let status = 'AMBER – Some kits over limit';
  if (percentWithin === 100) status = 'GREEN – All kits within limits';
  else if (percentWithin < 50) status = 'RED – Most kits over limit';
  return { percentWithin, status, within, total: kits.length };
}

function calculateTeamEnergyStatus() {
  const baselineWhPerHour = state.kits.reduce((sum, kit) => sum + kitPowerProfile(kit).baselineWhPerHour, 0);
  const requiredWh = baselineWhPerHour * (state.constraints.durationHours || 0) * (state.constraints.safetyFactor || 1);
  const availableWh = state.kits.reduce((sum, kit) => sum + calculateKitTotals(kit).totalEnergyWh, 0);
  const coverage = requiredWh > 0 ? availableWh / requiredWh : 0;
  return {
    baselineWhPerHour,
    requiredWh: +requiredWh.toFixed(1),
    availableWh: +availableWh.toFixed(1),
    coverage,
  };
}

function buildRiskVisualization(energyStatus) {
  const duration = state.constraints.durationHours || 0;
  const coverage = energyStatus.coverage || 0;
  const availableHours = duration * coverage;
  const pct = duration > 0 ? Math.min(100, (availableHours / duration) * 100) : 0;
  const tone = coverage >= 1.2 ? 'green' : coverage >= 0.9 ? 'amber' : 'red';
  const bufferHours = Math.max(0, availableHours - duration);
  const riskLabel = tone === 'green' ? 'Low risk' : tone === 'amber' ? 'Monitor' : 'High risk';
  return `
    <div class="risk-chart" role="img" aria-label="Battery sustainment risk">
      <div class="risk-metrics">
        <span>Duration: ${duration}h</span>
        <span>Available: ${availableHours.toFixed(1)}h eq.</span>
        <span class="risk-pill ${tone}">${riskLabel}</span>
      </div>
      <div class="risk-bar" aria-hidden="true">
        <div class="risk-required"></div>
        <div class="risk-available ${tone}" style="width:${pct}%;"></div>
      </div>
      <p class="muted small-text">${bufferHours > 0 ? `${bufferHours.toFixed(1)}h buffer beyond mission` : 'Shortfall vs mission duration once safety factor applied'}.</p>
    </div>
  `;
}

function deriveMeshContext(projectOverride) {
  const project = projectOverride || state.project || createEmptyMissionProject();
  const meshLinks = Array.isArray(project.mesh_links) ? project.mesh_links : [];
  const nodes = Array.isArray(project.nodes) ? project.nodes : [];
  const meshPlan = project.meshPlan || project.mesh_plan || {};
  const constraints = project.constraints || {};
  const durationHours = state.constraints.durationHours || constraints.duration_hours || 24;
  const suggestions = {};
  const addSuggestion = (itemId, qty, reason) => {
    if (!state.inventoryById[itemId]) return;
    if (!suggestions[itemId]) suggestions[itemId] = { itemId, qty: 0, reason };
    suggestions[itemId].qty += qty;
    suggestions[itemId].reason = reason;
  };

  const criticalRelays = meshLinks.filter((link) => link.critical || /relay/i.test(link.role || '') || /relay/i.test(link.notes || '')).length;
  const hasMesh = meshLinks.length > 0 || nodes.some((node) => /mesh|relay|node/i.test(node.role || node.name || ''));
  const durationDays = Math.max(1, Math.ceil(durationHours / 24));
  const ewLevel = (meshPlan.ewLevel || meshPlan.ew_level || meshPlan.ew || project.environment?.ewLevel || 'medium').toString().toLowerCase();

  if (hasMesh) {
    addSuggestion('node_vantage_edge', Math.max(1, criticalRelays), 'Critical relays benefit from spare mesh nodes');
    addSuggestion('bat_240wh_station', 1, 'Station battery for backhaul and relay uptime');
    addSuggestion('bat_98wh_brick', Math.max(durationDays, criticalRelays * 2), 'Battery sustainment for mesh nodes');
  }

  if (ewLevel === 'high' || ewLevel === 'severe') {
    addSuggestion('power_solar_fold', 1, 'EW threat: prioritize silent charging for relays');
    addSuggestion('tool_tripod', 1, 'Elevated antenna/relay positioning under EW pressure');
  }

  const roamingNodes = meshPlan.roamingNodes || meshPlan.roaming_nodes || 0;
  if (roamingNodes > 0) addSuggestion('node_vantage_edge', roamingNodes, 'Roaming nodes need spare endpoints');

  return {
    suggestions: Object.values(suggestions),
    meshLinks: meshLinks.length,
    criticalRelays,
    ewLevel: ewLevel || 'medium',
    hasMesh,
  };
}

function buildOperatorSummary() {
  const { maxWeightPerOperatorKg } = state.constraints;
  const assignments = state.assignments.length
    ? state.assignments
    : state.kits.map((kit, idx) => ({ id: `asg_${kit.id}`, operator: kit.name || `Operator ${idx + 1}`, role: kit.role || '', kitIds: [kit.id] }));

  return assignments.map((assignment, idx) => {
    const kits = assignment.kitIds
      .map((id) => state.kits.find((kit) => kit.id === id))
      .filter(Boolean);
    const weight = kits.reduce((sum, kit) => sum + calculateKitTotals(kit).totalWeightKg, 0);
    const limit = Number(maxWeightPerOperatorKg) || null;
    const over = limit ? weight > limit : false;
    const baselineWh = kits.reduce((sum, kit) => sum + kitPowerProfile(kit).baselineWhPerHour, 0);
    const totalEnergy = kits.reduce((sum, kit) => sum + calculateKitTotals(kit).totalEnergyWh, 0);
    const safety = state.constraints.safetyFactor || 1;
    const coverageFor = (hours) => {
      const req = baselineWh * hours * safety;
      return req > 0 ? totalEnergy / req : 0;
    };
    return {
      id: assignment.id,
      operator: assignment.operator || `Operator ${idx + 1}`,
      role: assignment.role || 'Role',
      kits: kits.map((k) => k.name || 'Kit').join(', ') || 'Unassigned',
      totalWeightKg: +weight.toFixed(2),
      overLimit: over,
      limitKg: limit,
      deltaKg: limit ? +(limit - weight).toFixed(2) : null,
      loadPct: limit ? +Math.min(200, (weight / limit) * 100).toFixed(1) : null,
      coverage24: coverageFor(24),
      coverageMission: coverageFor(state.constraints.durationHours || 24),
    };
  });
}

function sortOperators(summary = []) {
  const { key, direction } = state.operatorSort || {};
  const dir = direction === 'desc' ? -1 : 1;
  return [...summary].sort((a, b) => {
    const aVal = a?.[key];
    const bVal = b?.[key];
    if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
    return String(aVal || '').localeCompare(String(bVal || '')) * dir;
  });
}

function calculateAssignmentLoad(assignment) {
  const kits = assignment.kitIds
    .map((id) => state.kits.find((kit) => kit.id === id))
    .filter(Boolean);
  const totalWeight = kits.reduce((sum, kit) => sum + calculateKitTotals(kit).totalWeightKg, 0);
  return {
    kits,
    totalWeightKg: +totalWeight.toFixed(2),
    overLimit: state.constraints.maxWeightPerOperatorKg
      ? totalWeight > state.constraints.maxWeightPerOperatorKg
      : false,
  };
}

function buildSustainmentTimeline() {
  const missionPlus = state.constraints.durationHours ? state.constraints.durationHours + 24 : null;
  const durations = [24, 48, 72, state.constraints.durationHours || 0, missionPlus]
    .filter((h) => Number.isFinite(h) && h > 0)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a - b);

  return state.kits.map((kit) => {
    const totals = calculateKitTotals(kit);
    const profile = kitPowerProfile(kit);
    const rows = durations.map((hours) => {
      const requiredWh = profile.baselineWhPerHour * hours;
      const modelBatteries = profile.avgBatteryWh ? Math.ceil(requiredWh / profile.avgBatteryWh) : 0;
      const safeBatteries = modelBatteries ? Math.ceil(modelBatteries * (state.constraints.safetyFactor || 1)) : 0;
      const coverage = requiredWh > 0 ? totals.totalEnergyWh / (requiredWh * (state.constraints.safetyFactor || 1)) : 0;
      const shortage = coverage < 1;
      const sortieEquivalent = profile.baselineWhPerHour > 0 ? Math.floor(totals.totalEnergyWh / profile.baselineWhPerHour) : 0;
      return {
        hours,
        requiredWh,
        modelBatteries,
        safeBatteries,
        shortage,
        coverage,
        sortieEquivalent,
      };
    });

    return {
      kit,
      totals,
      profile,
      rows,
    };
  });
}

function renderMissionSnapshot() {
  const { durationHours, environment, teamSize, maxWeightPerOperatorKg, powerStrategy, altitudeM, temperatureC } = state.constraints;
  const power = powerStrategy.powerExternal ? 'External' : powerStrategy.powerGenerator ? 'Generator' : 'Battery-only';
  const envBits = [environment, altitudeM ? `${altitudeM}m` : null, temperatureC ? `${temperatureC}°C` : null].filter(Boolean).join(' · ');
  elements.snapshotEl.innerHTML = `
    <div class="pill-row">
      <span class="pill strong">${durationHours}h</span>
      <span class="pill">${envBits}</span>
      <span class="pill">Team ${teamSize}</span>
      <span class="pill">${maxWeightPerOperatorKg} kg/operator</span>
      <span class="pill">${power}</span>
      <span class="pill">Safety ${state.constraints.safetyFactor}x</span>
    </div>
  `;

  if (elements.missionProjectStatus) {
    const project = state.project || createEmptyMissionProject();
    const schemaVersion = normalizeSchemaVersion(project.schemaVersion || project.schema_version || MISSIONPROJECT_SCHEMA_VERSION);
    const missionSummary = [
      `${durationHours}h`,
      environment,
      `Team ${teamSize}`,
    ].filter(Boolean).join(' · ');
    const statusText = state.seededFromMissionProject
      ? 'Loaded from MissionProject import'
      : 'Ready for MissionProject-first planning';
    const schemaNote = schemaVersion && schemaVersion !== normalizeSchemaVersion(KITSMITH_SCHEMA_VERSION)
      ? `<span class="badge badge-warning">Schema mismatch (kit ${KITSMITH_SCHEMA_VERSION})</span>`
      : '';
    elements.missionProjectStatus.innerHTML = `
      <div class="status-card">
        <div class="status-card-header">
          <div>
            <p class="eyebrow">MissionProject status</p>
            <h3 class="status-card-title">${project.name || 'Mission'}</h3>
          </div>
          <div class="badge badge-ghost">Schema ${schemaVersion}</div>
        </div>
        <p class="muted">${missionSummary}</p>
        <p class="muted">${statusText}</p>
        ${schemaNote}
      </div>
    `;
  }
}

function renderMissionIntegrationPanel() {
  if (!elements.missionIntegrationContent) return;
  const project = buildMissionProjectFromState();
  const responsibilities = [
    'constraints (duration, team size, safety factor, power_strategy)',
    'kits.definitions (items, totals, intended roles)',
    'kits.assignments (operator-to-kit mapping)',
    'kitsSummary (sustainment hours and per-operator loads)',
  ];
  const sustainmentSlice = {
    schemaVersion: project.schemaVersion,
    origin_tool: project.origin_tool,
    constraints: {
      duration_hours: project.constraints.duration_hours,
      team_size: project.constraints.team_size,
      max_weight_per_operator_kg: project.constraints.max_weight_per_operator_kg,
      safety_factor: project.constraints.safety_factor,
      power_strategy: project.constraints.power_strategy,
      list: project.constraints.list,
    },
    kits: project.kits,
    kitsSummary: project.kitsSummary,
  };

  const snippet = escapeHtml(JSON.stringify(sustainmentSlice, null, 2));
  elements.missionIntegrationContent.innerHTML = `
    <div class="summary-card">
      <h3>MissionProject integration</h3>
      <p class="muted">KitSmith writes sustainment data into the shared MissionProject envelope for Architect and Mesh tools.</p>
      <ul class="status-list">${responsibilities.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
    <div class="summary-card mission-snippet">
      <h3>Live sustainment snippet</h3>
      <p class="muted">Snapshot reflects the current session and updates as kits or constraints change.</p>
      <pre>${snippet}</pre>
    </div>
  `;
}

function renderInventoryList() {
  const categoryFilterBtn = document.querySelector('.filter-button.active');
  const categoryFilter = categoryFilterBtn ? categoryFilterBtn.dataset.category : 'all';
  const textFilter = document.getElementById('filter-text').value.toLowerCase();
  const cuasOnly = elements.cuasFilter?.checked;

  const filtered = state.inventory.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesText = !textFilter ||
      item.name.toLowerCase().includes(textFilter) ||
      (item.tags || []).some((tag) => tag.toLowerCase().includes(textFilter));
    const cuasTagged = (item.tags || []).some((tag) => ['rf_spare', 'cuas_support', 'ew_tool'].includes(tag));
    const matchesCuas = !cuasOnly || cuasTagged;
    return matchesCategory && matchesText && matchesCuas;
  });

  elements.inventoryCount.textContent = `Showing ${filtered.length} of ${state.inventory.length} items`;

  if (!filtered.length) {
    elements.inventoryListEl.innerHTML = '<p class="muted">No inventory matches.</p>';
    return;
  }

  const kitOptions = state.kits.map((kit) => `<option value="${kit.id}">${kit.name || 'Kit'}</option>`).join('');
  const hasKits = state.kits.length > 0;

  elements.inventoryListEl.innerHTML = filtered.map((item) => {
    const tags = (item.tags || []).map((tag) => `<span class="pill">${tag}</span>`).join('');
    const energy = typeof item.energy_wh === 'number' ? `${item.energy_wh} Wh` : 'N/A';
    const kitSelect = hasKits ? `<select data-item="${item.id}" class="kit-target">${kitOptions}<option value="__new__">+ New kit</option></select>` : '';
    const addButton = hasKits ? `<button class="btn-primary add-to-kit" data-item="${item.id}">Add to Kit</button>` : '';
    const noKitMessage = hasKits ? '' : '<div class="notice">No kits yet. Create the first kit to add items.</div>';
    return `
      <article class="card">
        <header class="card-header">
          <div>
            <h3>${item.name}</h3>
            <p class="muted">${item.category}</p>
          </div>
          <div class="badge subtle">${(item.weight_g / 1000).toFixed(2)} kg</div>
        </header>
        <div class="meta-row">
          <span class="pill">Energy: ${energy}</span>
          <span class="pill">Volume: ${item.volume_l ?? 'N/A'} L</span>
        </div>
        <p class="muted">${item.notes || ''}</p>
        <div class="badges">${tags}</div>
        ${noKitMessage}
        <div class="add-row">
          ${kitSelect}
          ${addButton}
        </div>
      </article>
    `;
  }).join('');
}

function renderKitsPanel() {
  elements.kitsContainer.innerHTML = '';
  const template = document.getElementById('kit-template');

  state.kits.forEach((kit) => {
    const clone = template.content.cloneNode(true);
    const nameInput = clone.querySelector('.kit-name');
    const roleInput = clone.querySelector('.kit-role');
    nameInput.value = kit.name;
    roleInput.value = kit.role;

    nameInput.addEventListener('input', (e) => {
      kit.name = e.target.value;
      state.assignments = state.assignments.map((assignment) =>
        assignment.kitIds.includes(kit.id)
          ? { ...assignment, operator: assignment.operator || kit.name || 'Operator', role: assignment.role || kit.role }
          : assignment,
      );
      renderInventoryList();
      renderSummaryPanel();
      renderPackingListsView();
      persistState();
    });
    roleInput.addEventListener('input', (e) => {
      kit.role = e.target.value;
      state.assignments = state.assignments.map((assignment) =>
        assignment.kitIds.includes(kit.id)
          ? { ...assignment, role: assignment.role || kit.role || e.target.value }
          : assignment,
      );
      renderSummaryPanel();
      renderPackingListsView();
      persistState();
    });

    clone.querySelector('.remove-kit').addEventListener('click', () => removeKit(kit.id));

    const itemsList = clone.querySelector('.kit-items');
    const empty = clone.querySelector('.kit-empty');

    const entries = Object.entries(kit.items);
    if (!entries.length) {
      empty.style.display = 'block';
    } else {
      empty.style.display = 'none';
      entries.forEach(([itemId, qty]) => {
        const item = state.inventoryById[itemId];
        if (!item) return;
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <strong>${item.name}</strong>
            <p class="muted">${item.category}</p>
          </div>
          <div class="qty">
            <button class="btn-ghost qty-down" data-kit="${kit.id}" data-item="${itemId}">-</button>
            <span>${qty}</span>
            <button class="btn-ghost qty-up" data-kit="${kit.id}" data-item="${itemId}">+</button>
          </div>
        `;
        itemsList.appendChild(li);
      });
    }

    const status = kitStatus(kit);
    const card = clone.querySelector('.kit-card');
    const statusBadge = clone.querySelector('.status-badge');
    const weightBadge = clone.querySelector('.kit-weight-badge');
    const powerBadge = clone.querySelector('.kit-power-badge');

    const weightTone = marginTone(status.weightMargin);
    const powerTone = marginTone(status.powerMargin);
    card.classList.add(`status-${weightTone}-card`);
    statusBadge.textContent = status.overWeight ? 'Over weight limit' : 'Within limit';
    statusBadge.classList.add(`badge-${weightTone === 'red' ? 'danger' : weightTone === 'amber' ? 'warning' : 'success'}`);
    weightBadge.textContent = `${status.totals.totalWeightKg} kg / ${state.constraints.maxWeightPerOperatorKg} kg`; 
    weightBadge.classList.add(`badge-${weightTone === 'red' ? 'danger' : weightTone === 'amber' ? 'warning' : 'success'}`);

    powerBadge.textContent = status.powerShortfall ? 'Power shortfall likely' : 'Power margin OK';
    powerBadge.classList.add(`badge-${powerTone === 'red' ? 'danger' : powerTone === 'amber' ? 'warning' : 'success'}`);

    clone.querySelector('.kit-weight').textContent = status.totals.totalWeightKg;
    clone.querySelector('.kit-energy').textContent = status.totals.totalEnergyWh;
    const runtimePct = Math.min(100, Math.round(status.runtime.coverage * 100));
    clone.querySelector('.kit-runtime').textContent = `${runtimePct}% of ${state.constraints.durationHours}h requirement`;
    const batteryDetails = clone.querySelector('.kit-runtime');
    const modelNeed = status.runtime.modelBatteryRequirement || 0;
    const safeNeed = status.runtime.batteryRequirementWithSafety || 0;
    batteryDetails.title = `Model batteries: ${modelNeed}, with safety factor (${state.constraints.safetyFactor}x): ${safeNeed}`;

    elements.kitsContainer.appendChild(clone);
  });

  renderMeshSuggestions();
}

function renderMeshSuggestions() {
  if (!elements.meshSuggestions) return;
  const ctx = state.meshContext || deriveMeshContext();
  if (!state.kits.length) {
    elements.meshSuggestions.innerHTML = '<div class="summary-card"><p class="muted">Create a kit to apply mesh-driven suggestions.</p></div>';
    return;
  }

  const targetKit = state.kits.find((kit) => /mesh|relay|node/i.test(`${kit.name} ${kit.role}`)) || state.kits[0];
  const kitOptions = state.kits.map((kit) => `<option value="${kit.id}" ${kit.id === targetKit.id ? 'selected' : ''}>${kit.name || 'Kit'}</option>`).join('');
  const suggestionList = (ctx.suggestions || [])
    .map((suggestion) => {
      const item = state.inventoryById[suggestion.itemId];
      if (!item) return '';
      return `<li>
        <div>
          <strong>${item.name}</strong> <span class="pill">x${suggestion.qty}</span>
          <p class="muted small-text">${suggestion.reason || 'Mesh-derived recommendation'}</p>
        </div>
        <div class="suggestion-actions">
          <select class="suggestion-kit" data-item="${suggestion.itemId}">${kitOptions}</select>
          <button class="btn-primary apply-suggestion" data-item="${suggestion.itemId}" data-qty="${suggestion.qty}">Add to kit</button>
        </div>
      </li>`;
    })
    .join('');

  elements.meshSuggestions.innerHTML = `
    <div class="summary-card">
      <h3>Suggested items</h3>
      <p class="muted">Mesh links: ${ctx.meshLinks || 0} · Critical relays: ${ctx.criticalRelays || 0} · EW level: ${ctx.ewLevel || 'n/a'}</p>
      ${suggestionList ? `<ul class="suggestion-list">${suggestionList}</ul>` : '<p class="muted">No mesh-driven suggestions detected.</p>'}
      ${suggestionList ? `<button class="btn-ghost apply-all-suggestions" type="button" data-kit="${targetKit.id}">Apply all to ${targetKit.name || 'Kit'}</button>` : ''}
    </div>
  `;
}

function renderSummaryPanel() {
  const { teamWeight, avgWeight, batteryCounts, totalEnergy } = calculateTeamSummary();
  const { maxWeightPerOperatorKg, teamSize, durationHours, environment, safetyFactor } = state.constraints;
  const readiness = calculateMissionReadiness();
  const operatorSummary = sortOperators(buildOperatorSummary());
  const timeline = buildSustainmentTimeline();
  const energyStatus = calculateTeamEnergyStatus();
  const riskViz = buildRiskVisualization(energyStatus);
  const teamLimit = maxWeightPerOperatorKg && teamSize ? maxWeightPerOperatorKg * teamSize : 0;
  const teamWeightMargin = teamLimit ? (teamLimit - teamWeight) / teamLimit : 0;
  const teamWeightTone = marginTone(teamWeightMargin);
  const energyTone = marginTone(energyStatus.coverage - 1);
  const powerCoveragePct = Number.isFinite(energyStatus.coverage) ? Math.round(energyStatus.coverage * 100) : 0;

  const kitsSummary = state.kits.map((kit) => {
    const status = kitStatus(kit);
    const weightTone = marginTone(status.weightMargin);
    const runtimePct = Number.isFinite(status.runtime.safetyCoverage) ? Math.round(status.runtime.safetyCoverage * 100) : 0;
    return `<li><strong>${kit.name || 'Kit'} (${kit.role || 'Role'})</strong> · <span class="status-chip ${weightTone}">Weight ${status.totals.totalWeightKg} kg${maxWeightPerOperatorKg ? ` / ${maxWeightPerOperatorKg} kg` : ''}</span> <span class="status-chip ${marginTone(status.runtime.safetyCoverage - 1)}">${runtimePct}% of ${durationHours}h energy</span></li>`;
  }).join('');

  const batteries = Object.entries(batteryCounts).map(([name, qty]) => `<li>${name}: ${qty}</li>`).join('') || '<li>None</li>';

  const weightStatusClass = readiness.percentWithin === 100 ? 'status-green' : readiness.percentWithin < 50 ? 'status-red' : 'status-amber';

  const sortMeta = state.operatorSort || {};

  const operatorTable = operatorSummary.length
    ? `<div class="table-scroll">
        <table class="summary-table operator-table">
          <thead>
            <tr>
              <th><button class="sort-button ${sortMeta.key === 'operator' ? 'active' : ''}" data-sort="operator">Operator ${sortMeta.key === 'operator' ? (sortMeta.direction === 'asc' ? '↑' : '↓') : ''}</button></th>
              <th><button class="sort-button ${sortMeta.key === 'totalWeightKg' ? 'active' : ''}" data-sort="totalWeightKg">Carried weight ${sortMeta.key === 'totalWeightKg' ? (sortMeta.direction === 'asc' ? '↑' : '↓') : ''}</button></th>
              <th><button class="sort-button ${sortMeta.key === 'limitKg' ? 'active' : ''}" data-sort="limitKg">Limit ${sortMeta.key === 'limitKg' ? (sortMeta.direction === 'asc' ? '↑' : '↓') : ''}</button></th>
              <th><button class="sort-button ${sortMeta.key === 'deltaKg' ? 'active' : ''}" data-sort="deltaKg">Over/Under ${sortMeta.key === 'deltaKg' ? (sortMeta.direction === 'asc' ? '↑' : '↓') : ''}</button></th>
              <th>Bar</th>
              <th>Power 24h</th>
              <th>Power mission</th>
            </tr>
          </thead>
          <tbody>
            ${operatorSummary.map((op) => {
              const weightTone = marginTone((state.constraints.maxWeightPerOperatorKg ? (state.constraints.maxWeightPerOperatorKg - op.totalWeightKg) / state.constraints.maxWeightPerOperatorKg : 0));
              const power24Tone = marginTone(op.coverage24 - 1);
              const powerMissionTone = marginTone(op.coverageMission - 1);
              const barWidth = op.loadPct ? Math.min(100, op.loadPct) : 0;
              return `<tr class="${weightTone === 'red' ? 'status-row-red' : ''}">
                <td>${op.operator}<div class="muted small-text">${op.role}</div></td>
                <td>${op.totalWeightKg} kg</td>
                <td>${op.limitKg || '—'} kg</td>
                <td><span class="status-chip ${weightTone}">${op.deltaKg !== null ? `${op.deltaKg.toFixed(1)} kg` : 'N/A'}</span></td>
                <td><div class="load-bar"><div class="load-bar-fill ${op.overLimit ? 'over' : ''}" style="width:${barWidth}%;"></div><div class="load-bar-cap"></div></div></td>
                <td><span class="status-chip ${power24Tone}">${(op.coverage24 * 100).toFixed(0)}% of need</span></td>
                <td><span class="status-chip ${powerMissionTone}">${(op.coverageMission * 100).toFixed(0)}% of need</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`
    : '<p class="muted">No kits defined.</p>';

  const timelineTables = timeline.length
    ? timeline.map((entry) => {
        const header = `${entry.kit.name || 'Kit'} (${entry.kit.role || 'Role'})`;
        const rows = entry.rows.map((row) => {
          const tone = marginTone(row.coverage - 1);
          return `<tr class="${tone === 'red' ? 'status-row-red' : ''}"><td>${row.hours}h</td><td>${Math.ceil(row.requiredWh)} Wh</td><td>${row.modelBatteries}</td><td>${row.safeBatteries}</td><td>${entry.totals.batteryCount}</td><td><span class="status-chip ${tone}">${Math.round(row.coverage * 100)}% of need</span> · ${row.sortieEquivalent} sortie-equiv</td></tr>`;
        }).join('');
        return `<div class="summary-card"><h4>${header}</h4><p class="muted">Safety factor ${safetyFactor}x applied to requirements.</p><div class="table-scroll"><table class="summary-table"><thead><tr><th>Duration</th><th>Model Wh need</th><th>Batteries (model)</th><th>Batteries (safety)</th><th>On hand</th><th>Energy span</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
      }).join('')
    : '<p class="muted">Add kits to see sustainment timelines.</p>';

  const constraintBar = `
    <div class="constraint-bar">
      <div class="pill">Duration: ${durationHours}h</div>
      <div class="pill">Team: ${teamSize}</div>
      <div class="pill">Environment: ${environment}</div>
      <div class="pill">Max weight: ${maxWeightPerOperatorKg} kg</div>
      <div class="pill">Safety factor: ${safetyFactor}x</div>
    </div>`;

  elements.summaryContent.innerHTML = `
    ${constraintBar}
    <div class="summary-card">
      <h3>Weight & energy status</h3>
      <p class="muted">Live against mission constraints.</p>
      <ul class="status-list">
        <li>Team load <span class="status-chip ${teamWeightTone}">${teamWeight} kg${teamLimit ? ` / ${teamLimit} kg cap` : ''}</span></li>
        <li>Power margin <span class="status-chip ${energyTone}">${powerCoveragePct}% of ${durationHours}h need</span> (${energyStatus.availableWh} Wh on hand vs ${energyStatus.requiredWh} Wh required)</li>
      </ul>
      ${riskViz}
    </div>
    <div class="summary-grid">
      <div class="summary-tile">
        <p class="muted">Total kits</p>
        <div class="tile-value">${state.kits.length}</div>
      </div>
      <div class="summary-tile">
        <p class="muted">Total operators</p>
        <div class="tile-value">${teamSize}</div>
      </div>
      <div class="summary-tile">
        <p class="muted">Safety factor</p>
        <div class="tile-value">${safetyFactor}x</div>
      </div>
      <div class="summary-tile">
        <p class="muted">Total team weight</p>
        <div class="tile-value">${teamWeight} kg</div>
      </div>
      <div class="summary-tile">
        <p class="muted">Avg weight vs limit</p>
        <div class="tile-value">${avgWeight} kg vs ${maxWeightPerOperatorKg || '--'} kg</div>
      </div>
      <div class="summary-tile">
        <p class="muted">Battery count</p>
        <div class="tile-value">${Object.values(batteryCounts).reduce((a, b) => a + b, 0) || 0}</div>
      </div>
      <div class="summary-tile">
        <p class="muted">Total energy</p>
        <div class="tile-value">${totalEnergy} Wh</div>
      </div>
    </div>
    <div class="summary-card">
      <h3>Mission Readiness</h3>
      <p class="muted">${environment} | ${durationHours}h | Team size ${teamSize}</p>
      <div class="badge ${weightStatusClass}">${readiness.status}</div>
      <p>${readiness.within || 0}/${readiness.total || state.kits.length} kits within weight limits.</p>
    </div>
    <div class="summary-card">
      <h3>Per-kit status</h3>
      <ul>${kitsSummary || '<li>No kits defined</li>'}</ul>
    </div>
    <div class="summary-card">
      <h3>Per-operator loads</h3>
      ${operatorTable}
    </div>
    <div class="summary-card">
      <h3>Batteries</h3>
      <ul>${batteries}</ul>
    </div>
    <div class="summary-card">
      <h3>Sustainment timeline (batteries)</h3>
      <p class="muted">Red rows indicate kits that cannot satisfy the duration after applying the safety factor.</p>
      ${timelineTables}
    </div>
  `;

  renderMissionIntegrationPanel();
  renderMissionSnapshot();
  renderExportPanel();
}

function handleOperatorSort(e) {
  const btn = e.target.closest('.sort-button');
  if (!btn) return;
  const key = btn.dataset.sort;
  if (!key) return;
  const current = state.operatorSort || {};
  const direction = current.key === key && current.direction === 'asc' ? 'desc' : 'asc';
  state.operatorSort = { key, direction };
  renderSummaryPanel();
  renderExportPanel();
}

function renderExportPanel() {
  const readiness = calculateMissionReadiness();
  const payload = buildExportPayload();
  elements.exportContent.innerHTML = `
    <div class="summary-card">
      <p class="muted">JSON export includes constraints, kits, inventory used, operator loads, safety factor, and sustainment flags.</p>
      <p class="muted">Current readiness: ${readiness.status}. Safety factor ${state.constraints.safetyFactor}x.</p>
      <p class="muted">${payload.kits.length} kits | ${payload.summary.teamWeight} kg team weight.</p>
      <p class="muted">Packing lists and assignments save directly into the MissionProject sustainment scope.</p>
    </div>
  `;
}

function handleInventoryActions(e) {
  const down = e.target.closest('.qty-down');
  const up = e.target.closest('.qty-up');
  if (down) {
    adjustItemQuantity(down.dataset.kit, down.dataset.item, -1);
    return;
  }
  if (up) {
    addItemToKit(up.dataset.kit, up.dataset.item);
    return;
  }
  const btn = e.target.closest('.add-to-kit');
  if (!btn) return;
  const itemId = btn.dataset.item;
  const select = btn.parentElement.querySelector('.kit-target');
  let kitId = select ? select.value : '';
  if (kitId === '__new__' || !kitId) {
    const created = addKit('Quick kit', '');
    kitId = created;
  }
  addItemToKit(kitId, itemId);
}

function handleSuggestionActions(e) {
  const apply = e.target.closest('.apply-suggestion');
  const applyAll = e.target.closest('.apply-all-suggestions');
  if (apply) {
    const itemId = apply.dataset.item;
    const qty = Number(apply.dataset.qty) || 1;
    const select = apply.parentElement.querySelector('.suggestion-kit');
    const kitId = select?.value || state.kits[0]?.id;
    if (!kitId) {
      setStatusMessage('Create a kit before applying suggestions', 'warning');
      return;
    }
    addSuggestedItemToKit(kitId, itemId, qty);
    return;
  }

  if (applyAll) {
    const kitId = applyAll.dataset.kit || state.kits[0]?.id;
    if (!kitId) {
      setStatusMessage('Create a kit before applying suggestions', 'warning');
      return;
    }
    (state.meshContext?.suggestions || []).forEach((sug) => addSuggestedItemToKit(kitId, sug.itemId, sug.qty));
    setStatusMessage('Mesh-driven recommendations applied', 'info');
  }
}

function handleAssignmentActions(e) {
  const removeBtn = e.target.closest('.remove-assignment');
  if (removeBtn) {
    removeAssignment(removeBtn.dataset.assignment);
    return;
  }

  if (e.target.classList.contains('assignment-name')) {
    updateAssignmentField(e.target.dataset.assignment, 'operator', e.target.value);
    return;
  }

  if (e.target.classList.contains('assignment-role')) {
    updateAssignmentField(e.target.dataset.assignment, 'role', e.target.value);
    return;
  }

  if (e.target.matches('input[type="checkbox"][data-assignment][data-kit]')) {
    toggleAssignmentKit(e.target.dataset.assignment, e.target.dataset.kit, e.target.checked);
  }
}

function hydrateBlank() {
  if (state.kits.length === 0 && !state.seededFromMissionProject) {
    addKit('Alpha Kit', 'Lead');
    addKit('Bravo Kit', 'Support');
  }
}

function applyPreset(id) {
  const preset = state.presets.find((p) => p.id === id);
  if (!preset) return;
  state.seededFromMissionProject = false;
  state.constraints = structuredClone(preset.constraints);
  state.kits = preset.kits.map((kit) => ({
    ...createKitBase(kit.name, kit.role),
    items: structuredClone(kit.items),
  }));
  state.assignments = state.kits.map((kit, idx) => ({ id: `asg_${kit.id}`, operator: kit.name || `Operator ${idx + 1}`, role: kit.role || '', kitIds: [kit.id] }));
  syncConstraintForm();
  renderAll();
  persistState();
  document.querySelector('#kits').scrollIntoView({ behavior: 'smooth' });
}

function buildChecklistText() {
  const { constraints } = state;
  const energyStatus = calculateTeamEnergyStatus();
  const lines = [
    `Mission: ${constraints.durationHours}h, ${constraints.environment}, ${constraints.teamSize} operators`,
    `Safety factor: ${constraints.safetyFactor}x`,
    `Limits: ${constraints.maxWeightPerOperatorKg} kg per operator`,
    `Power: ${constraints.powerStrategy.powerBatteryOnly ? 'Battery-only' : constraints.powerStrategy.powerGenerator ? 'Generator-backed' : 'External/shore available'}`,
    '',
  ];

  state.kits.forEach((kit) => {
    const status = kitStatus(kit);
    const powerLabel = status.powerShortfall ? 'Power shortfall likely' : 'Power OK';
    lines.push(`${kit.name || 'Kit'} – ${kit.role || 'Role'} – ${status.totals.totalWeightKg} kg – ${status.overWeight ? 'Over limit' : 'Within weight limit'} – ${powerLabel}`);
    Object.entries(kit.items).forEach(([itemId, qty]) => {
      const item = state.inventoryById[itemId];
      if (!item) return;
      const perWeight = typeof item.weight_g === 'number' ? `${item.weight_g}g` : 'N/A';
      lines.push(`- ${qty} x ${item.name} (${item.category}) – ${perWeight} each`);
    });
    lines.push('');
  });

  const readiness = calculateMissionReadiness();
  const teamSummary = calculateTeamSummary();
  const teamLimit = constraints.maxWeightPerOperatorKg && constraints.teamSize ? constraints.maxWeightPerOperatorKg * constraints.teamSize : null;
  lines.push('Summary:');
  lines.push(`- Kits within weight limit: ${readiness.within || 0}/${readiness.total || state.kits.length}`);
  lines.push(`- Total team weight: ${teamSummary.teamWeight} kg${teamLimit ? ` / ${teamLimit} kg cap` : ''}`);
  lines.push(`- Total batteries: ${Object.values(teamSummary.batteryCounts).reduce((a, b) => a + b, 0)} (${teamSummary.totalEnergy} Wh)`);
  lines.push(`- Power coverage: ${Math.round((energyStatus.coverage || 0) * 100)}% of ${constraints.durationHours}h need (${energyStatus.availableWh} Wh on hand vs ${energyStatus.requiredWh} Wh required)`);
  lines.push('Notes:');
  lines.push(constraints.notes || '');
  return lines.join('\n');
}

function copyChecklist() {
  const text = buildChecklistText();
  const setStatus = (msg) => { elements.clipboardStatus.textContent = msg; };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => setStatus('Checklist copied to clipboard')).catch(() => setStatus('Copy failed'));
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setStatus('Checklist copied to clipboard');
  }
}

function renderPackingListsView() {
  const container = elements.packingListsContent;
  if (!container) return;
  if (!state.kits.length) {
    container.innerHTML = '<p class="muted">Add kits to build packing lists.</p>';
    return;
  }

  const kitSections = state.kits.map((kit) => {
    const rows = Object.entries(kit.items).map(([itemId, qty]) => {
      const item = state.inventoryById[itemId];
      if (!item) return '';
      const perWeight = typeof item.weight_g === 'number' ? `${(item.weight_g / 1000).toFixed(2)} kg` : 'N/A';
      return `<tr><td>${item.name}</td><td>${qty}</td><td>${perWeight}</td><td>☐</td></tr>`;
    }).join('');
    const kitTotals = calculateKitTotals(kit);
    return `
      <div class="packing-section page-break">
        <h3>${kit.name || 'Kit'} — ${kit.role || 'Role'}</h3>
        <p class="muted">Total weight: ${kitTotals.totalWeightKg} kg | Batteries: ${kitTotals.batteryCount}</p>
        <div class="table-scroll">
          <table class="packing-table">
            <thead><tr><th>Item</th><th>Qty</th><th>Weight (each)</th><th>Check</th></tr></thead>
            <tbody>${rows || '<tr><td colspan="4">No items</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');

  const missionMeta = state.project || createEmptyMissionProject();
  const missionBlock = `
    <div class="packing-section">
      <h3>Mission metadata</h3>
      <p class="muted">${missionMeta.name || 'Mission'} · ${missionMeta.mission?.ao || 'AO TBD'} · ${missionMeta.mission?.time_window || 'Dates TBD'} · Duration ${state.constraints.durationHours}h</p>
      <p class="muted">Environment: ${state.constraints.environment} · Alt ${state.constraints.altitudeM || '—'}m · Temp ${state.constraints.temperatureC ?? '—'}°C · Safety ${state.constraints.safetyFactor}x</p>
    </div>`;

  const operatorSummary = buildOperatorSummary();
  const operatorTable = operatorSummary.length
    ? `<div class="table-scroll">
        <table class="packing-table">
          <thead><tr><th>Operator</th><th>Role</th><th>Kits</th><th>Total weight</th><th>Limit</th></tr></thead>
          <tbody>
            ${operatorSummary.map((op) => `<tr class="${op.overLimit ? 'status-row-red' : ''}"><td>${op.operator}</td><td>${op.role}</td><td>${op.kits}</td><td>${op.totalWeightKg} kg</td><td>${op.overLimit ? 'Over' : 'OK'}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>`
    : '<p class="muted">No operators assigned.</p>';

  const assignments = state.assignments.length
    ? state.assignments.map((assignment) => {
        const load = calculateAssignmentLoad(assignment);
        const kitCheckboxes = state.kits.length
          ? state.kits.map((kit) => `<label class="checkbox"><input type="checkbox" data-assignment="${assignment.id}" data-kit="${kit.id}" ${assignment.kitIds.includes(kit.id) ? 'checked' : ''}/> ${kit.name || 'Kit'}</label>`).join('')
          : '<p class="muted">No kits available.</p>';
        return `
          <div class="assignment-card" data-assignment="${assignment.id}">
            <div class="assignment-header">
              <div class="inputs">
                <input type="text" class="assignment-name" data-assignment="${assignment.id}" value="${assignment.operator || ''}" placeholder="Operator" />
                <input type="text" class="assignment-role" data-assignment="${assignment.id}" value="${assignment.role || ''}" placeholder="Role" />
              </div>
              <button class="btn-ghost remove-assignment" type="button" data-assignment="${assignment.id}">Remove</button>
            </div>
            <div class="assignment-kits">${kitCheckboxes}</div>
            <div class="assignment-weight ${load.overLimit ? 'assignment-over' : ''}">Load: ${load.totalWeightKg} kg${state.constraints.maxWeightPerOperatorKg ? ` / ${state.constraints.maxWeightPerOperatorKg} kg max` : ''}</div>
          </div>
        `;
      }).join('')
    : '<p class="muted">Add operators to assign kits and monitor load limits.</p>';

  container.innerHTML = `
    ${missionBlock}
    <div class="packing-section">
      <h3>Per-kit packing lists</h3>
      <p class="muted">Use browser print for paper-ready checklists. Safety factor ${state.constraints.safetyFactor}x applied to consumables.</p>
      ${kitSections}
    </div>
    <div class="packing-section">
      <h3>Operator assignments</h3>
      <p class="muted">Max carry weight ${state.constraints.maxWeightPerOperatorKg || 'N/A'} kg. Highlighted rows exceed the limit.</p>
      <div class="packing-assignments">${assignments}</div>
      <h4>Operator loads</h4>
      ${operatorTable}
    </div>
  `;
}

function buildExportPayload() {
  const kitsWithTotals = state.kits.map((kit) => ({
    ...kit,
    totals: calculateKitTotals(kit),
    power: kitPowerProfile(kit),
  }));
  const usedInventoryIds = new Set();
  state.kits.forEach((kit) => {
    Object.keys(kit.items).forEach((id) => usedInventoryIds.add(id));
  });
  const inventoryUsed = Array.from(usedInventoryIds).map((id) => state.inventoryById[id]).filter(Boolean);
  const sustainment = buildSustainmentTimeline().map((entry) => ({
    kit: { name: entry.kit.name, role: entry.kit.role },
    totals: entry.totals,
    rows: entry.rows,
    status: entry.rows.some((r) => r.shortage) ? 'Risk' : 'OK',
  }));
  const missionProject = buildMissionProjectFromState();
  const geojson = buildMissionGeoJson(missionProject);
  const cotStub = buildCotStub(missionProject);
  return {
    constraints: state.constraints,
    kits: kitsWithTotals,
    assignments: state.assignments,
    inventoryUsed,
    summary: calculateTeamSummary(),
    readiness: calculateMissionReadiness(),
    operatorLoads: buildOperatorSummary(),
    sustainment,
    missionProject,
    geojson,
    cot: cotStub,
    exportedAt: new Date().toISOString(),
  };
}

function toPointGeometry(geo = {}) {
  const { lat, lon, lng, elevation, alt } = geo;
  const latitude = typeof lat === 'number' ? lat : null;
  const longitude = typeof lon === 'number' ? lon : (typeof lng === 'number' ? lng : null);
  if (latitude === null || longitude === null) return null;
  const coordinates = [longitude, latitude];
  if (typeof elevation === 'number' || typeof alt === 'number') {
    coordinates.push(elevation ?? alt);
  }
  return {
    type: 'Point',
    coordinates,
  };
}

function buildMissionGeoJson(project) {
  const features = [];
  const pushEntity = (entity, kind) => {
    const geometry = toPointGeometry(entity.geo || entity.location || {});
    if (!geometry) return;
    features.push({
      type: 'Feature',
      geometry,
      properties: {
        id: entity.id,
        name: entity.name,
        role: entity.role || kind,
        kind,
        origin_tool: entity.origin_tool || project.origin_tool || 'kit',
        rf_bands: entity.rf_bands || entity.rfBands,
        power_wh: entity.power?.battery_wh,
      },
    });
  };
  (project.nodes || []).forEach((node) => pushEntity(node, 'node'));
  (project.platforms || []).forEach((platform) => pushEntity(platform, 'platform'));
  (project.mesh_links || []).forEach((link) => {
    const from = (project.nodes || []).find((n) => n.id === link.from || n.id === link.source);
    const to = (project.nodes || []).find((n) => n.id === link.to || n.id === link.target);
    const fromGeo = from ? toPointGeometry(from.geo || from.location || {}) : null;
    const toGeo = to ? toPointGeometry(to.geo || to.location || {}) : null;
    if (!fromGeo || !toGeo) return;
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [fromGeo.coordinates, toGeo.coordinates],
      },
      properties: {
        id: link.id,
        name: link.name || `${from?.name || 'Node'} → ${to?.name || 'Node'}`,
        band: link.band || link.rf_band,
        range_km: link.range_km,
        origin_tool: link.origin_tool || project.origin_tool || 'kit',
      },
    });
  });
  return {
    type: 'FeatureCollection',
    features,
  };
}

function buildCotStub(project) {
  const units = [];
  const collectUnit = (entity, type) => {
    const geometry = toPointGeometry(entity.geo || entity.location || {});
    if (!geometry) return;
    units.push({
      uid: entity.id,
      type,
      name: entity.name || type,
      role: entity.role || '',
      lat: geometry.coordinates[1],
      lon: geometry.coordinates[0],
      alt: geometry.coordinates[2] || null,
      rf_bands: entity.rf_bands || entity.rfBands,
      origin_tool: entity.origin_tool || project.origin_tool || 'kit',
    });
  };
  (project.nodes || []).forEach((node) => collectUnit(node, 'node'));
  (project.platforms || []).forEach((platform) => collectUnit(platform, 'platform'));
  const nowIso = new Date().toISOString();
  return {
    name: project.name,
    summary: project.mission?.summary || '',
    time: nowIso,
    units,
  };
}

function downloadJSON() {
  const payload = buildExportPayload();
  const envSafe = (state.constraints.environment || 'env').toLowerCase();
  const fileName = `kitsmith_export_${state.constraints.durationHours}h_${envSafe}_${formatTimestamp()}.json`;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadMissionProject() {
  const project = buildMissionProjectFromState();
  const envSafe = (state.constraints.environment || 'env').toLowerCase();
  const fileName = `mission_project_${state.constraints.durationHours}h_${envSafe}_${formatTimestamp()}.json`;
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function buildManifest(xmlName, jsonPath, missionId) {
  // Use a deterministic UID to make the ATAK package reproducible and predictable across exports.
  const uid = missionId || jsonPath.replace(/\W+/g, '_');
  return `
<MissionPackageManifest version="2">
  <Configuration>
    <Parameter name="uid" value="${uid}" />
    <Parameter name="name" value="${xmlName}" />
    <Parameter name="onReceiveImport" value="true" />
    <Parameter name="onReceiveDelete" value="false" />
  </Configuration>
  <Contents>
    <Content ignore="false" zipEntry="${jsonPath}">
      <Parameter name="name" value="KitSmith kit export" />
      <Parameter name="contentType" value="DATA" />
    </Content>
  </Contents>
</MissionPackageManifest>`;
}

async function exportAtakMissionPackage() {
  const payload = buildExportPayload();
  const envSafe = (state.constraints.environment || 'env').toLowerCase();
  const timestamp = formatTimestamp();
  const jsonName = `kitsmith/kit_${timestamp}.json`;
  const missionProjectName = `kitsmith/mission_project_${timestamp}.json`;
  const geoName = `kitsmith/mission_${timestamp}.geojson`;
  const cotName = `kitsmith/mission_${timestamp}_cot.json`;
  const summaryName = `kitsmith/kit_summary_${timestamp}.json`;
  const checklistName = `kitsmith/kit_checklist_${timestamp}.txt`;
  const manifestName = 'MANIFEST/manifest.xml';
  const packageName = `KitSmith_MissionPackage_${state.constraints.durationHours}h_${envSafe}_${timestamp}.zip`;
  const manifest = buildManifest(`KitSmith_${state.constraints.durationHours}h_${state.constraints.environment}_${timestamp}`, jsonName, payload.missionProject?.id);
  const checklistText = buildChecklistText();
  const summary = {
    constraints: state.constraints,
    kits: state.kits.map((kit) => ({
      id: kit.id,
      name: kit.name,
      role: kit.role,
      totals: calculateKitTotals(kit),
      items: buildKitItemDetails(kit),
    })),
  };

  const zip = new JSZip();
  zip.file(jsonName, JSON.stringify(payload, null, 2));
  zip.file(missionProjectName, JSON.stringify(payload.missionProject, null, 2));
  zip.file(geoName, JSON.stringify(payload.geojson, null, 2));
  zip.file(cotName, JSON.stringify(payload.cot, null, 2));
  zip.file(summaryName, JSON.stringify(summary, null, 2));
  zip.file(checklistName, checklistText);
  zip.file(manifestName, manifest);
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = packageName;
  link.click();
  URL.revokeObjectURL(url);
}

function toggleKitForm(show) {
  elements.kitForm.hidden = !show;
  if (show) {
    elements.kitNameInput.focus();
  } else {
    elements.kitNameInput.value = '';
    elements.kitRoleInput.value = '';
  }
}

function handleKitFormSave() {
  const name = elements.kitNameInput.value.trim() || 'New Kit';
  const role = elements.kitRoleInput.value.trim();
  addKit(name, role);
  toggleKitForm(false);
}

function renderCategoryButtons() {
  const categories = ['all', 'Battery', 'Radio', 'Node', 'UxS', 'Tool', 'Sustainment', 'Other'];
  elements.categoryButtons.innerHTML = categories.map((cat) => `<button class="filter-button ${cat === 'all' ? 'active' : ''}" data-category="${cat}">${cat}</button>`).join('');
}

function handleCategoryClick(e) {
  const btn = e.target.closest('.filter-button');
  if (!btn) return;
  document.querySelectorAll('.filter-button').forEach((el) => el.classList.remove('active'));
  btn.classList.add('active');
  renderInventoryList();
}

function handleNavScroll() {
  const sections = ['constraints', 'inventory', 'kits', 'summary', 'mission-integration', 'packing-lists', 'export'].map((id) => document.getElementById(id));
  const scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
  const offset = 120;
  let activeId = 'constraints';
  sections.forEach((section) => {
    if (section && section.offsetTop - offset <= scrollPos) {
      activeId = section.id;
    }
  });
  document.querySelectorAll('.nav-link').forEach((link) => {
    const target = link.dataset.scroll.replace('#', '');
    link.classList.toggle('active', target === activeId);
  });
}

function renderAll() {
  state.meshContext = deriveMeshContext();
  renderInventoryList();
  renderKitsPanel();
  renderSummaryPanel();
  renderMissionIntegrationPanel();
  renderPackingListsView();
  handleNavScroll();
}

async function init() {
  renderCategoryButtons();
  attachEvents();
  hydrateFromMissionProject();
  await loadPresets();
  await loadInventory();
  hydrateBlank();
  syncConstraintForm();
  renderVersionMeta();
  renderChangeLog();
  renderAll();
}

function attachEvents() {
  elements.constraintsForm.addEventListener('input', updateConstraintsFromForm);
  document.getElementById('reset-constraints').addEventListener('click', resetConstraintsForm);
  document.getElementById('filter-text').addEventListener('input', renderInventoryList);
  if (elements.cuasFilter) elements.cuasFilter.addEventListener('change', renderInventoryList);
  elements.categoryButtons.addEventListener('click', handleCategoryClick);
  elements.inventoryListEl.addEventListener('click', handleInventoryActions);
  document.getElementById('kits-container').addEventListener('click', handleInventoryActions);
  document.getElementById('add-kit').addEventListener('click', () => toggleKitForm(true));
  document.getElementById('save-kit').addEventListener('click', handleKitFormSave);
  document.getElementById('cancel-kit').addEventListener('click', () => toggleKitForm(false));
  document.getElementById('copy-checklist').addEventListener('click', copyChecklist);
  document.getElementById('download-json').addEventListener('click', downloadJSON);
  document.getElementById('download-mission-project').addEventListener('click', downloadMissionProject);
  document.getElementById('download-atak').addEventListener('click', exportAtakMissionPackage);
  elements.summaryContent.addEventListener('click', handleOperatorSort);
  elements.addOperatorBtn.addEventListener('click', () => addAssignment('Operator', ''));
  elements.printPackingBtn.addEventListener('click', () => window.print());
  elements.packingListsContent.addEventListener('input', handleAssignmentActions);
  elements.packingListsContent.addEventListener('change', handleAssignmentActions);
  elements.packingListsContent.addEventListener('click', handleAssignmentActions);
  if (elements.meshSuggestions) elements.meshSuggestions.addEventListener('click', handleSuggestionActions);
  document.getElementById('demo-recon').addEventListener('click', () => applyPreset('recon24'));
  document.getElementById('demo-uxs').addEventListener('click', () => applyPreset('uxs48'));
  const sustainmentBtn = document.getElementById('demo-sustainment');
  if (sustainmentBtn) sustainmentBtn.addEventListener('click', () => applyPreset('sustainment48'));
  const whitefrostBtn = document.getElementById('demo-whitefrost');
  if (whitefrostBtn) whitefrostBtn.addEventListener('click', () => applyPreset('whitefrost'));
  elements.designImport.addEventListener('change', () => handleFileImport(elements.designImport, importDesigns));
  elements.missionImport.addEventListener('change', () => handleFileImport(elements.missionImport, applyMissionMeta));
  if (elements.missionProjectImport) elements.missionProjectImport.addEventListener('change', () => handleFileImport(elements.missionProjectImport, importMissionProject));
  if (elements.importMissionProjectBtn && elements.missionProjectImport) elements.importMissionProjectBtn.addEventListener('click', () => elements.missionProjectImport.click());
  if (elements.exportMissionProjectBtn) elements.exportMissionProjectBtn.addEventListener('click', downloadMissionProject);
  document.querySelectorAll('.nav-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.addEventListener('scroll', handleNavScroll, { passive: true });
}

window.loadDemoSustainment = loadDemoSustainment;
document.addEventListener('DOMContentLoaded', init);
