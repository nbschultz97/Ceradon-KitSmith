const STORAGE_KEY = 'kitsmith_state_v1';
const defaultConstraints = {
  durationHours: 24,
  environment: 'Urban',
  teamSize: 4,
  maxWeightPerOperatorKg: 22,
  powerStrategy: {
    powerExternal: false,
    powerGenerator: false,
    powerBatteryOnly: true,
  },
  notes: '',
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
  constraints: structuredClone(defaultConstraints),
  kits: [],
  inventory: [],
  inventoryById: {},
  presets: [],
};

function normalizeKitsData(kitsLike) {
  if (!kitsLike) return [];
  const arr = Array.isArray(kitsLike) ? kitsLike : Object.values(kitsLike);
  return arr.map((kit) => ({
    ...kit,
    id: kit.id || `kit_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
    items: kit.items || {},
  }));
}

const elements = {
  inventoryListEl: document.getElementById('inventory-list'),
  kitsContainer: document.getElementById('kits-container'),
  summaryContent: document.getElementById('summary-content'),
  exportContent: document.getElementById('export-content'),
  snapshotEl: document.getElementById('mission-snapshot'),
  inventoryCount: document.getElementById('inventory-count'),
  constraintsForm: document.getElementById('constraints-form'),
  kitForm: document.getElementById('kit-form'),
  kitNameInput: document.getElementById('kit-name-input'),
  kitRoleInput: document.getElementById('kit-role-input'),
  clipboardStatus: document.getElementById('clipboard-status'),
  categoryButtons: document.getElementById('category-buttons'),
};

function structuredClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function formatTimestamp() {
  const now = new Date();
  const pad = (n) => `${n}`.padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
}

function persistState() {
  const payload = {
    constraints: state.constraints,
    kits: state.kits,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Persist failed', err);
  }
}

function showRestoreBanner(saved) {
  const existing = document.getElementById('restore-banner');
  if (existing) existing.remove();
  const banner = document.createElement('div');
  banner.id = 'restore-banner';
  banner.className = 'restore-banner';
  banner.innerHTML = `
    <span>Restore previous KitSmith session?</span>
    <div class="banner-actions">
      <button class="btn-primary" type="button" id="restore-session">Restore</button>
      <button class="btn-ghost" type="button" id="discard-session">Discard</button>
    </div>
  `;
  document.body.prepend(banner);
  document.getElementById('restore-session').onclick = () => {
    state.constraints = saved.constraints || structuredClone(defaultConstraints);
    state.kits = normalizeKitsData(saved.kits);
    renderAll();
    persistState();
    banner.remove();
  };
  document.getElementById('discard-session').onclick = () => {
    localStorage.removeItem(STORAGE_KEY);
    banner.remove();
  };
}

function checkRestore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && saved.constraints) {
      showRestoreBanner(saved);
    }
  } catch (err) {
    console.warn('No restore state', err);
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

function updateConstraintsFromForm() {
  const formData = new FormData(elements.constraintsForm);
  state.constraints.durationHours = Number(formData.get('durationHours')) || 0;
  state.constraints.environment = formData.get('environment') || 'Urban';
  state.constraints.teamSize = Number(formData.get('teamSize')) || 0;
  state.constraints.maxWeightPerOperatorKg = Number(formData.get('maxWeightPerOperatorKg')) || 0;
  state.constraints.powerStrategy = {
    powerExternal: formData.get('powerExternal') === 'on',
    powerGenerator: formData.get('powerGenerator') === 'on',
    powerBatteryOnly: formData.get('powerBatteryOnly') === 'on',
  };
  state.constraints.notes = formData.get('notes') || '';
  renderAll();
  persistState();
}

function syncConstraintForm() {
  const form = elements.constraintsForm;
  form.durationHours.value = state.constraints.durationHours;
  form.environment.value = state.constraints.environment;
  form.teamSize.value = state.constraints.teamSize;
  form.maxWeightPerOperatorKg.value = state.constraints.maxWeightPerOperatorKg;
  form.powerExternal.checked = !!state.constraints.powerStrategy.powerExternal;
  form.powerGenerator.checked = !!state.constraints.powerStrategy.powerGenerator;
  form.powerBatteryOnly.checked = !!state.constraints.powerStrategy.powerBatteryOnly;
  form.notes.value = state.constraints.notes || '';
}

function resetConstraintsForm() {
  state.constraints = structuredClone(defaultConstraints);
  state.kits = [];
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
  renderAll();
  persistState();
  return kit.id;
}

function removeKit(id) {
  if (!confirm('Remove this kit?')) return;
  state.kits = state.kits.filter((k) => k.id !== id);
  renderAll();
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
  return {
    baselineWhPerHour,
    requiredWh,
    coverage,
    status: totals.totalEnergyWh >= requiredWh ? 'Power OK' : 'Power shortfall likely',
  };
}

function kitWeightStatus(kit) {
  const totals = calculateKitTotals(kit);
  const limit = state.constraints.maxWeightPerOperatorKg || 0;
  const over = limit > 0 && totals.totalWeightKg > limit;
  return {
    totals,
    over,
    status: over ? 'Over limit' : 'Within limit',
  };
}

function kitStatus(kit) {
  const weight = kitWeightStatus(kit);
  const power = kitPowerProfile(kit);
  return {
    totals: weight.totals,
    overWeight: weight.over,
    powerShortfall: power.status !== 'Power OK',
    runtime: power,
  };
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

function renderMissionSnapshot() {
  const { durationHours, environment, teamSize, maxWeightPerOperatorKg, powerStrategy } = state.constraints;
  const power = powerStrategy.powerExternal ? 'External' : powerStrategy.powerGenerator ? 'Generator' : 'Battery-only';
  elements.snapshotEl.textContent = `${durationHours}h | ${environment} | ${teamSize} operators | ${maxWeightPerOperatorKg} kg cap | ${power}`;
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
      renderInventoryList();
      renderSummaryPanel();
      persistState();
    });
    roleInput.addEventListener('input', (e) => {
      kit.role = e.target.value;
      renderSummaryPanel();
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

    if (status.overWeight) {
      card.classList.add('status-red-card');
      statusBadge.textContent = 'Over weight limit';
      statusBadge.classList.add('badge-danger');
      weightBadge.textContent = `Over limit (${status.totals.totalWeightKg} kg / ${state.constraints.maxWeightPerOperatorKg} kg)`;
      weightBadge.classList.add('badge-danger');
    } else {
      card.classList.add('status-green-card');
      statusBadge.textContent = 'Within limit';
      statusBadge.classList.add('badge-success');
      weightBadge.textContent = `Within limit (${status.totals.totalWeightKg} kg / ${state.constraints.maxWeightPerOperatorKg} kg)`;
      weightBadge.classList.add('badge-success');
    }

    if (status.powerShortfall) {
      powerBadge.textContent = 'Power shortfall likely';
      powerBadge.classList.add('badge-danger');
    } else {
      powerBadge.textContent = 'Power OK';
      powerBadge.classList.add('badge-success');
    }

    clone.querySelector('.kit-weight').textContent = status.totals.totalWeightKg;
    clone.querySelector('.kit-energy').textContent = status.totals.totalEnergyWh;
    const runtimePct = Math.min(100, Math.round(status.runtime.coverage * 100));
    clone.querySelector('.kit-runtime').textContent = `${runtimePct}% of ${state.constraints.durationHours}h requirement`;

    elements.kitsContainer.appendChild(clone);
  });
}

function renderSummaryPanel() {
  const { teamWeight, avgWeight, batteryCounts, totalEnergy } = calculateTeamSummary();
  const { maxWeightPerOperatorKg, teamSize, durationHours, environment } = state.constraints;
  const readiness = calculateMissionReadiness();

  const kitsSummary = state.kits.map((kit) => {
    const status = kitStatus(kit);
    const weightStatus = status.overWeight ? 'Over limit' : 'Within weight limit';
    const powerLabel = status.powerShortfall ? 'Power shortfall likely' : 'Power OK';
    const runtimePct = Math.min(100, Math.round(status.runtime.coverage * 100));
    return `<li>${kit.name || 'Kit'} (${kit.role || 'Role'}) – ${status.totals.totalWeightKg} kg / ${maxWeightPerOperatorKg} kg – ${weightStatus} – Power: ~${runtimePct}% of ${durationHours}h requirement</li>`;
  }).join('');

  const batteries = Object.entries(batteryCounts).map(([name, qty]) => `<li>${name}: ${qty}</li>`).join('') || '<li>None</li>';

  const weightStatusClass = readiness.percentWithin === 100 ? 'status-green' : readiness.percentWithin < 50 ? 'status-red' : 'status-amber';

  elements.summaryContent.innerHTML = `
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
      <h3>Batteries</h3>
      <ul>${batteries}</ul>
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
      <p class="muted">JSON export includes constraints, kits, inventory used, and computed totals.</p>
      <p class="muted">Current readiness: ${readiness.status}.</p>
      <p class="muted">${payload.kits.length} kits | ${payload.summary.teamWeight} kg team weight.</p>
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
  syncConstraintForm();
  renderAll();
  persistState();
  document.querySelector('#kits').scrollIntoView({ behavior: 'smooth' });
}

function buildChecklistText() {
  const { constraints } = state;
  const lines = [
    `Mission: ${constraints.durationHours}h, ${constraints.environment}, ${constraints.teamSize} operators`,
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
  return {
    constraints: state.constraints,
    kits: kitsWithTotals,
    inventoryUsed,
    summary: calculateTeamSummary(),
    readiness: calculateMissionReadiness(),
    exportedAt: new Date().toISOString(),
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
  const manifestName = 'MANIFEST/manifest.xml';
  const packageName = `KitSmith_MissionPackage_${state.constraints.durationHours}h_${envSafe}_${timestamp}.zip`;
  const manifest = buildManifest(`KitSmith_${state.constraints.durationHours}h_${state.constraints.environment}_${timestamp}`, jsonName);

  const zip = new JSZip();
  zip.file(jsonName, JSON.stringify(payload, null, 2));
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
  const sections = ['constraints', 'inventory', 'kits', 'summary', 'export'].map((id) => document.getElementById(id));
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
  handleNavScroll();
}

async function init() {
  renderCategoryButtons();
  attachEvents();
  await loadPresets();
  await loadInventory();
  hydrateBlank();
  syncConstraintForm();
  renderAll();
  checkRestore();
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
  document.getElementById('download-atak').addEventListener('click', exportAtakMissionPackage);
  document.getElementById('demo-recon').addEventListener('click', () => applyPreset('recon24'));
  document.getElementById('demo-uxs').addEventListener('click', () => applyPreset('uxs48'));
  document.querySelectorAll('.nav-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.addEventListener('scroll', handleNavScroll, { passive: true });
}

document.addEventListener('DOMContentLoaded', init);
