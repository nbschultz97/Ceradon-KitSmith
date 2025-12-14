// KitSmith uses the stack-wide MissionProject envelope but anchors on a
// sustainment-focused schema v2. Keep this constant in sync with
// `schema/mission_project_kits_v2.json`.
const KITSMITH_SCHEMA_VERSION = 2;
const MISSION_PROJECT_SCHEMA_VERSION = "2.0.0";
const MISSION_PROJECT_STORAGE_KEY = 'mission_project';
const DEFAULT_CONSTRAINT_KEYS = [
  'duration_hours',
  'team_size',
  'max_weight_per_operator_kg',
  'safety_factor',
  'environment',
  'power_strategy',
];

function createEmptyMissionProject() {
  return {
    schemaVersion: KITSMITH_SCHEMA_VERSION,
    origin_tool: 'kit',
    id: `mission_${Date.now()}`,
    name: 'Untitled Mission',
    mission: {
      summary: '',
      commander_intent: '',
      ao: '',
      time_window: '',
    },
    environment: {
      temperature_c: null,
      altitude_m: null,
      terrain: '',
      weather: '',
      notes: '',
    },
    constraints: {
      duration_hours: null,
      team_size: null,
      max_weight_per_operator_kg: null,
      safety_factor: 1,
      power_strategy: {
        power_external: false,
        power_generator: false,
        power_battery_only: true,
      },
    },
    nodes: [],
    platforms: [],
    mesh_links: [],
    kits: {
      origin_tool: 'kit',
      definitions: [],
      assignments: [],
    },
  };
}

function normalizeArray(arr) {
  return Array.isArray(arr) ? arr : [];
}

function normalizeItemsCollection(itemsLike) {
  if (Array.isArray(itemsLike)) {
    return itemsLike.reduce((acc, entry) => {
      if (!entry || !entry.id) return acc;
      acc[entry.id] = typeof entry.qty === 'number' ? entry.qty : Number(entry.qty) || 0;
      return acc;
    }, {});
  }
  return itemsLike || {};
}

function ensureStableId(prefix, value) {
  if (value) return value;
  return `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
}

function normalizeProject(raw) {
  const base = createEmptyMissionProject();
  if (!raw || typeof raw !== 'object') return base;
  const kits = raw.kits || {};
  const constraintsList = Array.isArray(raw.constraints?.list || raw.constraints_list)
    ? raw.constraints.list || raw.constraints_list
    : [];
  const constraintObjFromList = constraintsList.reduce((acc, entry) => {
    if (!entry || !entry.key) return acc;
    acc[entry.key] = entry.value;
    return acc;
  }, {});
  return {
    ...base,
    ...raw,
    origin_tool: raw.origin_tool || 'kit',
    id: raw.id || base.id,
    name: raw.name || base.name,
    mission: { ...base.mission, ...(raw.mission || {}) },
    environment: { ...base.environment, ...(raw.environment || {}) },
    constraints: {
      ...base.constraints,
      ...(raw.constraints || {}),
      ...constraintObjFromList,
      power_strategy: {
        ...base.constraints.power_strategy,
        ...(raw.constraints?.power_strategy || {}),
      },
      list: constraintsList,
    },
    nodes: normalizeArray(raw.nodes).map((node, idx) => ({
      id: ensureStableId('node', node.id || node.uid),
      origin_tool: node.origin_tool || raw.origin_tool || 'kit',
      ...node,
    })),
    platforms: normalizeArray(raw.platforms).map((platform, idx) => ({
      id: ensureStableId('platform', platform.id || platform.uid),
      origin_tool: platform.origin_tool || raw.origin_tool || 'kit',
      ...platform,
    })),
    mesh_links: normalizeArray(raw.mesh_links).map((link, idx) => ({
      id: ensureStableId('link', link.id),
      origin_tool: link.origin_tool || raw.origin_tool || 'kit',
      ...link,
    })),
    kits: {
      origin_tool: kits.origin_tool || raw.origin_tool || 'kit',
      definitions: normalizeArray(kits.definitions || kits.kits || kits).map((kit, idx) => ({
        id: ensureStableId('kit', kit.id),
        origin_tool: kit.origin_tool || raw.origin_tool || 'kit',
        ...kit,
        items: normalizeItemsCollection(kit.items),
      })),
      assignments: normalizeArray(kits.assignments).map((asg, idx) => ({
        id: ensureStableId('asg', asg.id),
        origin_tool: asg.origin_tool || raw.origin_tool || 'kit',
        ...asg,
      })),
    },
    schemaVersion: KITSMITH_SCHEMA_VERSION,
  };
}

function loadMissionProject() {
  try {
    const raw = localStorage.getItem(MISSION_PROJECT_STORAGE_KEY);
    if (!raw) return createEmptyMissionProject();
    return normalizeProject(JSON.parse(raw));
  } catch (err) {
    console.warn('Mission project load failed, using empty project', err);
    return createEmptyMissionProject();
  }
}

function saveMissionProject(project) {
  const payload = normalizeProject(project || {});
  try {
    localStorage.setItem(MISSION_PROJECT_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save mission project', err);
  }
  return payload;
}

if (typeof window !== 'undefined') {
  window.MISSION_PROJECT_SCHEMA_VERSION = MISSION_PROJECT_SCHEMA_VERSION;
  window.KITSMITH_SCHEMA_VERSION = KITSMITH_SCHEMA_VERSION;
  window.createEmptyMissionProject = createEmptyMissionProject;
  window.loadMissionProject = loadMissionProject;
  window.saveMissionProject = saveMissionProject;
}
