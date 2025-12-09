const STORAGE_KEY = 'kitsmith_state_v1';
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
    id: 'whitefrost',
    label: 'WHITEFROST Demo',
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
          bat_98wh_brick: 2,
          radio_harris_152: 1,
          radio_rto_headset: 1,
          sustain_mre: 3,
          sustain_water_blader: 1,
          tool_multitool: 1,
        },
      },
      {
        name: 'WHITEFROST Mesh Relay',
        role: 'Mesh relay support',
        items: {
          node_vantage_edge: 2,
          bat_98wh_brick: 2,
          bat_240wh_station: 1,
          power_solar_fold: 1,
          tool_tripod: 1,
          sustain_mre: 2,
          sustain_water_blader: 1,
        },
      },
      {
        name: 'WHITEFROST Partner Patrol',
        role: 'Partner-force patrol',
        items: {
          sustain_mre: 4,
          sustain_water_blader: 2,
          bat_98wh_brick: 2,
          radio_harris_152: 1,
          other_batterycharger: 1,
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
    tags: ['comms', 'mission', 'carry-on'],
    notes: 'Commercial airline safe; pair with 12V adapter.',
  },
  {
    id: 'bat_240wh_station',
    name: '240Wh Field Station',
    category: 'Battery',
    weight_g: 2100,
    energy_wh: 240,
    volume_l: 1.9,
    tags: ['recharge', 'generator'],
    notes: 'Base battery for charging handsets and tablets.',
  },
  {
    id: 'radio_harris_152',
    name: 'AN/PRC-152 Handheld',
    category: 'Radio',
    weight_g: 870,
    energy_wh: 16,
    volume_l: 0.7,
    tags: ['VHF', 'UHF', 'voice'],
    notes: 'Standard handheld; include spare battery.',
  },
  {
    id: 'node_vantage_edge',
    name: 'Vantage Edge Node',
    category: 'Node',
    weight_g: 980,
    energy_wh: 45,
    volume_l: 1.2,
    tags: ['mesh', 'c2', 'vantage'],
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
    tags: ['sensors', 'node'],
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
    tags: ['charging', 'silent'],
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
    if (!entry || !entry.id) return acc;
    acc[entry.id] = (acc[entry.id] || 0) + (Number(entry.qty) || 1);
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
  exportContent: document.getElementById('export-content'),
  packingListsContent: document.getElementById('packing-lists-content'),
  snapshotEl: document.getElementById('mission-snapshot'),
  inventoryCount: document.getElementById('inventory-count'),
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
  addOperatorBtn: document.getElementById('add-operator'),
  printPackingBtn: document.getElementById('print-packing'),
};

function structuredClone(obj) {
  return JSON.parse(JSON.stringify(obj));
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

function buildMissionProjectFromState() {
  const base = state.project || createEmptyMissionProject();
  const constraintsList = [
    { key: 'duration_hours', value: state.constraints.durationHours },
    { key: 'team_size', value: state.constraints.teamSize },
    { key: 'max_weight_per_operator_kg', value: state.constraints.maxWeightPerOperatorKg },
    { key: 'safety_factor', value: state.constraints.safetyFactor },
    { key: 'environment', value: state.constraints.environment },
    { key: 'power_strategy', value: structuredClone(state.constraints.powerStrategy) },
  ];
  const project = {
    ...base,
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
          assigned_to_element: (state.assignments.find((a) => (a.kitIds || []).includes(kit.id)) || {}).operator || '',
          items: itemsObjectToArray(kit.items),
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
    constraints_list: constraintsList,
    kits_flat: [],
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
  const project = loadMissionProject();
  state.project = project;
  const constraints = project.constraints || {};
  const env = project.environment || {};
  state.constraints = {
    ...structuredClone(defaultConstraints),
    durationHours: constraints.duration_hours ?? constraints.durationHours ?? defaultConstraints.durationHours,
    environment: env.terrain || constraints.environment || defaultConstraints.environment,
    teamSize: constraints.team_size ?? constraints.teamSize ?? defaultConstraints.teamSize,
    maxWeightPerOperatorKg: constraints.max_weight_per_operator_kg ?? constraints.maxWeightPerOperatorKg ?? defaultConstraints.maxWeightPerOperatorKg,
    safetyFactor: constraints.safety_factor ?? constraints.safetyFactor ?? defaultConstraints.safetyFactor,
    powerStrategy: { ...structuredClone(defaultConstraints.powerStrategy), ...(constraints.power_strategy || constraints.powerStrategy || {}) },
    notes: env.notes || project.mission?.summary || '',
    altitudeM: env.altitude_m ?? null,
    temperatureC: env.temperature_c ?? null,
  };

  const kitsSection = project.kits || {};
  state.kits = normalizeKitsData(kitsSection.definitions || kitsSection.kits || kitsSection);
  state.assignments = normalizeAssignments(kitsSection.assignments);

  if (!state.kits.length) {
    const legacy = loadLegacyState();
    if (legacy) {
      state.constraints = { ...state.constraints, ...legacy.constraints };
      state.kits = normalizeKitsData(legacy.kits);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  if (!state.assignments.length && state.kits.length) {
    state.assignments = state.kits.map((kit, idx) => ({
      id: `asg_${kit.id}`,
      operator: kit.name || `Operator ${idx + 1}`,
      role: kit.role || '',
      kitIds: [kit.id],
    }));
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

function applyMissionMeta(meta = {}) {
  if (Array.isArray(meta.list)) {
    meta.list.forEach((entry) => {
      if (!entry || !entry.key) return;
      meta[entry.key] = entry.value;
    });
  }
  if (meta.durationHours || meta.duration_hours) state.constraints.durationHours = Number(meta.durationHours ?? meta.duration_hours);
  if (meta.environment || meta.terrain) state.constraints.environment = meta.environment || meta.terrain;
  if (meta.teamSize || meta.team_size) state.constraints.teamSize = Number(meta.teamSize ?? meta.team_size);
  if (meta.maxWeightPerOperatorKg || meta.max_weight_per_operator_kg) state.constraints.maxWeightPerOperatorKg = Number(meta.maxWeightPerOperatorKg ?? meta.max_weight_per_operator_kg);
  if (meta.safetyFactor || meta.safety_factor) state.constraints.safetyFactor = Number(meta.safetyFactor ?? meta.safety_factor);
  if (meta.altitudeM || meta.altitude_m) state.constraints.altitudeM = Number(meta.altitudeM ?? meta.altitude_m);
  if (meta.temperatureC || meta.temperature_c) state.constraints.temperatureC = Number(meta.temperatureC ?? meta.temperature_c);
  syncConstraintForm();
  renderAll();
  persistState();
}

function normalizeDesignItems(items = []) {
  return items.reduce((acc, entry) => {
    if (entry && entry.id) {
      acc[entry.id] = (acc[entry.id] || 0) + (Number(entry.qty) || 1);
    }
    return acc;
  }, {});
}

function importDesigns(payload) {
  const kits = [];
  const { nodes = [], platforms = [], kits: kitList = [] } = payload || {};

  const project = state.project || createEmptyMissionProject();
  project.nodes = (nodes || []).map((node, idx) => ({
    id: node.id || `node_${idx + 1}`,
    origin_tool: node.origin_tool || 'node',
    ...node,
  }));
  project.platforms = (platforms || []).map((platform, idx) => ({
    id: platform.id || `platform_${idx + 1}`,
    origin_tool: platform.origin_tool || 'uxs',
    ...platform,
  }));
  state.project = saveMissionProject(project);

  [...nodes, ...platforms, ...kitList].forEach((def, idx) => {
    if (!def) return;
    const kit = createKitBase(def.name || `Kit ${idx + 1}`, def.role || def.type || '');
    kit.items = normalizeDesignItems(def.items || []);
    kits.push(kit);
  });

  if (kits.length) {
    state.kits = kits;
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

function importMissionProject(payload) {
  const project = saveMissionProject(payload || {});
  state.project = project;
  const kitsSection = project.kits || {};
  state.kits = normalizeKitsData(kitsSection.definitions || kitsSection.kits || []).map((kit) => ({
    ...kit,
    items: itemsArrayToObject(kit.items),
  }));
  state.assignments = normalizeAssignments(kitsSection.assignments);
  if (!state.kits.length) {
    state.kits = proposeKitsFromProject(project);
  }
  applyMissionMeta(project.constraints || {});
  if (!state.assignments.length && state.kits.length) {
    state.assignments = state.kits.map((kit, idx) => ({ id: `asg_${kit.id}`, operator: kit.name || `Operator ${idx + 1}`, role: kit.role || '', kitIds: [kit.id] }));
  }
  renderAll();
  persistState();
  setStatusMessage('MissionProject loaded', 'info');
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
    const over = maxWeightPerOperatorKg ? weight > maxWeightPerOperatorKg : false;
    const baselineWh = kits.reduce((sum, kit) => sum + kitPowerProfile(kit).baselineWhPerHour, 0);
    const totalEnergy = kits.reduce((sum, kit) => sum + calculateKitTotals(kit).totalEnergyWh, 0);
    const safety = state.constraints.safetyFactor || 1;
    const coverageFor = (hours) => {
      const req = baselineWh * hours * safety;
      return req > 0 ? totalEnergy / req : 0;
    };
    return {
      operator: assignment.operator || `Operator ${idx + 1}`,
      role: assignment.role || 'Role',
      kits: kits.map((k) => k.name || 'Kit').join(', ') || 'Unassigned',
      totalWeightKg: +weight.toFixed(2),
      overLimit: over,
      coverage24: coverageFor(24),
      coverageMission: coverageFor(state.constraints.durationHours || 24),
    };
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
    <span class="pill strong">${durationHours}h</span>
    <span class="pill">${envBits}</span>
    <span class="pill">Team ${teamSize}</span>
    <span class="pill">${maxWeightPerOperatorKg} kg/operator</span>
    <span class="pill">${power}</span>
    <span class="pill">Safety ${state.constraints.safetyFactor}x</span>
  `;
}

function renderInventoryList() {
  const categoryFilterBtn = document.querySelector('.filter-button.active');
  const categoryFilter = categoryFilterBtn ? categoryFilterBtn.dataset.category : 'all';
  const textFilter = document.getElementById('filter-text').value.toLowerCase();

  const filtered = state.inventory.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesText = !textFilter ||
      item.name.toLowerCase().includes(textFilter) ||
      (item.tags || []).some((tag) => tag.toLowerCase().includes(textFilter));
    return matchesCategory && matchesText;
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
}

function renderSummaryPanel() {
  const { teamWeight, avgWeight, batteryCounts, totalEnergy } = calculateTeamSummary();
  const { maxWeightPerOperatorKg, teamSize, durationHours, environment, safetyFactor } = state.constraints;
  const readiness = calculateMissionReadiness();
  const operatorSummary = buildOperatorSummary();
  const timeline = buildSustainmentTimeline();

  const kitsSummary = state.kits.map((kit) => {
    const status = kitStatus(kit);
    const weightStatus = status.overWeight ? 'Over limit' : 'Within weight limit';
    const runtimePct = Math.min(100, Math.round(status.runtime.coverage * 100));
    const modelNeed = status.runtime.modelBatteryRequirement || 0;
    const safeNeed = status.runtime.batteryRequirementWithSafety || 0;
    return `<li>${kit.name || 'Kit'} (${kit.role || 'Role'}) – ${status.totals.totalWeightKg} kg / ${maxWeightPerOperatorKg} kg – ${weightStatus} – Power: ~${runtimePct}% of ${durationHours}h requirement – Batteries: ${modelNeed} model | ${safeNeed} with safety</li>`;
  }).join('');

  const batteries = Object.entries(batteryCounts).map(([name, qty]) => `<li>${name}: ${qty}</li>`).join('') || '<li>None</li>';

  const weightStatusClass = readiness.percentWithin === 100 ? 'status-green' : readiness.percentWithin < 50 ? 'status-red' : 'status-amber';

  const operatorTable = operatorSummary.length
    ? `<table class="summary-table">
        <thead><tr><th>Operator</th><th>Role</th><th>Kits</th><th>Total weight</th><th>Weight margin</th><th>Power 24h</th><th>Power mission</th></tr></thead>
        <tbody>
          ${operatorSummary.map((op) => {
            const weightTone = marginTone((state.constraints.maxWeightPerOperatorKg ? (state.constraints.maxWeightPerOperatorKg - op.totalWeightKg) / state.constraints.maxWeightPerOperatorKg : 0));
            const power24Tone = marginTone(op.coverage24 - 1);
            const powerMissionTone = marginTone(op.coverageMission - 1);
            return `<tr class="${weightTone === 'red' ? 'status-row-red' : ''}">
              <td>${op.operator}</td>
              <td>${op.role}</td>
              <td>${op.kits}</td>
              <td>${op.totalWeightKg} kg</td>
              <td><span class="status-chip ${weightTone}">${state.constraints.maxWeightPerOperatorKg ? `${Math.max(0, (state.constraints.maxWeightPerOperatorKg - op.totalWeightKg)).toFixed(1)} kg free` : 'N/A'}</span></td>
              <td><span class="status-chip ${power24Tone}">${(op.coverage24 * 100).toFixed(0)}% of need</span></td>
              <td><span class="status-chip ${powerMissionTone}">${(op.coverageMission * 100).toFixed(0)}% of need</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`
    : '<p class="muted">No kits defined.</p>';

  const timelineTables = timeline.length
    ? timeline.map((entry) => {
        const header = `${entry.kit.name || 'Kit'} (${entry.kit.role || 'Role'})`;
        const rows = entry.rows.map((row) => {
          const tone = marginTone(row.coverage - 1);
          return `<tr class="${tone === 'red' ? 'status-row-red' : ''}"><td>${row.hours}h</td><td>${Math.ceil(row.requiredWh)} Wh</td><td>${row.modelBatteries}</td><td>${row.safeBatteries}</td><td>${entry.totals.batteryCount}</td><td><span class="status-chip ${tone}">${Math.round(row.coverage * 100)}% of need</span> · ${row.sortieEquivalent} sortie-equiv</td></tr>`;
        }).join('');
        return `<div class="summary-card"><h4>${header}</h4><p class="muted">Safety factor ${safetyFactor}x applied to requirements.</p><table class="summary-table"><thead><tr><th>Duration</th><th>Model Wh need</th><th>Batteries (model)</th><th>Batteries (safety)</th><th>On hand</th><th>Energy span</th></tr></thead><tbody>${rows}</tbody></table></div>`;
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

  renderMissionSnapshot();
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
  if (state.kits.length === 0) {
    addKit('Alpha Kit', 'Lead');
    addKit('Bravo Kit', 'Support');
  }
}

function applyPreset(id) {
  const preset = state.presets.find((p) => p.id === id);
  if (!preset) return;
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
  lines.push('Summary:');
  lines.push(`- Kits within weight limit: ${readiness.within || 0}/${readiness.total || state.kits.length}`);
  lines.push(`- Total team weight: ${teamSummary.teamWeight} kg`);
  lines.push(`- Total batteries: ${Object.values(teamSummary.batteryCounts).reduce((a, b) => a + b, 0)} (${teamSummary.totalEnergy} Wh)`);
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
        <table class="packing-table">
          <thead><tr><th>Item</th><th>Qty</th><th>Weight (each)</th><th>Check</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="4">No items</td></tr>'}</tbody>
        </table>
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
    ? `<table class="packing-table">
        <thead><tr><th>Operator</th><th>Role</th><th>Kits</th><th>Total weight</th><th>Limit</th></tr></thead>
        <tbody>
          ${operatorSummary.map((op) => `<tr class="${op.overLimit ? 'status-row-red' : ''}"><td>${op.operator}</td><td>${op.role}</td><td>${op.kits}</td><td>${op.totalWeightKg} kg</td><td>${op.overLimit ? 'Over' : 'OK'}</td></tr>`).join('')}
        </tbody>
      </table>`
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
  const envSafe = state.constraints.environment.toLowerCase();
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
  const envSafe = state.constraints.environment.toLowerCase();
  const fileName = `mission_project_${state.constraints.durationHours}h_${envSafe}_${formatTimestamp()}.json`;
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function buildManifest(xmlName, jsonPath) {
  const uid = crypto.randomUUID ? crypto.randomUUID() : `uid_${Date.now()}`;
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
  const envSafe = state.constraints.environment.toLowerCase();
  const timestamp = formatTimestamp();
  const jsonName = `kitsmith/kit_${timestamp}.json`;
  const missionProjectName = `kitsmith/mission_project_${timestamp}.json`;
  const geoName = `kitsmith/mission_${timestamp}.geojson`;
  const cotName = `kitsmith/mission_${timestamp}_cot.json`;
  const manifestName = 'MANIFEST/manifest.xml';
  const packageName = `KitSmith_MissionPackage_${state.constraints.durationHours}h_${envSafe}_${timestamp}.zip`;
  const manifest = buildManifest(`KitSmith_${state.constraints.durationHours}h_${state.constraints.environment}_${timestamp}`, jsonName);

  const zip = new JSZip();
  zip.file(jsonName, JSON.stringify(payload, null, 2));
  zip.file(missionProjectName, JSON.stringify(payload.missionProject, null, 2));
  zip.file(geoName, JSON.stringify(payload.geojson, null, 2));
  zip.file(cotName, JSON.stringify(payload.cot, null, 2));
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
  const sections = ['constraints', 'inventory', 'kits', 'summary', 'packing-lists', 'export'].map((id) => document.getElementById(id));
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
  renderInventoryList();
  renderKitsPanel();
  renderSummaryPanel();
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
  renderAll();
}

function attachEvents() {
  elements.constraintsForm.addEventListener('input', updateConstraintsFromForm);
  document.getElementById('reset-constraints').addEventListener('click', resetConstraintsForm);
  document.getElementById('filter-text').addEventListener('input', renderInventoryList);
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
  elements.addOperatorBtn.addEventListener('click', () => addAssignment('Operator', ''));
  elements.printPackingBtn.addEventListener('click', () => window.print());
  elements.packingListsContent.addEventListener('input', handleAssignmentActions);
  elements.packingListsContent.addEventListener('change', handleAssignmentActions);
  elements.packingListsContent.addEventListener('click', handleAssignmentActions);
  document.getElementById('demo-recon').addEventListener('click', () => applyPreset('recon24'));
  document.getElementById('demo-uxs').addEventListener('click', () => applyPreset('uxs48'));
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

document.addEventListener('DOMContentLoaded', init);
