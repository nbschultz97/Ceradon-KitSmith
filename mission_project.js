const MISSION_PROJECT_SCHEMA_VERSION = 1;
const MISSION_PROJECT_STORAGE_KEY = 'mission_project';

function createEmptyMissionProject() {
  return {
    schemaVersion: MISSION_PROJECT_SCHEMA_VERSION,
    mission: {},
    nodes: [],
    platforms: [],
    kits: {
      definitions: [],
      assignments: [],
    },
    sustainment: {},
  };
}

function normalizeProject(raw) {
  const base = createEmptyMissionProject();
  if (!raw || typeof raw !== 'object') return base;
  const kits = raw.kits || {};
  return {
    ...base,
    ...raw,
    kits: {
      definitions: Array.isArray(kits) ? kits : kits.definitions || [],
      assignments: kits.assignments || [],
    },
    sustainment: raw.sustainment || {},
    schemaVersion: MISSION_PROJECT_SCHEMA_VERSION,
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
  window.createEmptyMissionProject = createEmptyMissionProject;
  window.loadMissionProject = loadMissionProject;
  window.saveMissionProject = saveMissionProject;
}
