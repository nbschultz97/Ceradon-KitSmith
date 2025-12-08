const state = {
  constraints: {
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
  },
  kits: {},
  inventory: [],
  inventoryById: {},
};

const inventoryListEl = document.getElementById('inventory-list');
const kitsContainer = document.getElementById('kits-container');
const summaryContent = document.getElementById('summary-content');

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
];

async function loadInventory() {
  try {
    const res = await fetch('data/inventory.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.inventory = data;
    state.inventoryById = Object.fromEntries(data.map((item) => [item.id, item]));
    renderInventoryList();
  } catch (err) {
    console.warn('Inventory fetch failed, using fallback data', err);
    state.inventory = fallbackInventory;
    state.inventoryById = Object.fromEntries(fallbackInventory.map((item) => [item.id, item]));
    inventoryListEl.innerHTML = '<p class="muted">Inventory failed to load from /data. Using embedded fallback catalog.</p>';
    renderInventoryList();
  }
}

function updateConstraintsFromForm() {
  const form = document.getElementById('constraints-form');
  const formData = new FormData(form);
  state.constraints.durationHours = Number(formData.get('durationHours'));
  state.constraints.environment = formData.get('environment');
  state.constraints.teamSize = Number(formData.get('teamSize')) || 0;
  state.constraints.maxWeightPerOperatorKg = Number(formData.get('maxWeightPerOperatorKg')) || 0;
  state.constraints.powerStrategy = {
    powerExternal: formData.get('powerExternal') === 'on',
    powerGenerator: formData.get('powerGenerator') === 'on',
    powerBatteryOnly: formData.get('powerBatteryOnly') === 'on',
  };
  state.constraints.notes = formData.get('notes') || '';
  renderSummaryPanel();
  renderKitsPanel();
}

function resetConstraintsForm() {
  const form = document.getElementById('constraints-form');
  form.reset();
  updateConstraintsFromForm();
}

function addKit(name = 'Team Member', role = '') {
  const id = `kit_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
  state.kits[id] = {
    id,
    name,
    role,
    items: {},
  };
  renderKitsPanel();
}

function removeKit(id) {
  delete state.kits[id];
  renderKitsPanel();
  renderSummaryPanel();
}

function addItemToKit(kitId, itemId) {
  const kit = state.kits[kitId];
  if (!kit) return;
  kit.items[itemId] = (kit.items[itemId] || 0) + 1;
  renderKitsPanel();
  renderSummaryPanel();
}

function removeItemFromKit(kitId, itemId) {
  const kit = state.kits[kitId];
  if (!kit || !kit.items[itemId]) return;
  kit.items[itemId] -= 1;
  if (kit.items[itemId] <= 0) delete kit.items[itemId];
  renderKitsPanel();
  renderSummaryPanel();
}

function calculateKitTotals(kit) {
  let totalWeightG = 0;
  let totalEnergyWh = 0;
  Object.entries(kit.items).forEach(([itemId, qty]) => {
    const item = state.inventoryById[itemId];
    if (!item) return;
    if (typeof item.weight_g === 'number') totalWeightG += item.weight_g * qty;
    if (typeof item.energy_wh === 'number') totalEnergyWh += item.energy_wh * qty;
  });
  return {
    totalWeightKg: +(totalWeightG / 1000).toFixed(2),
    totalEnergyWh: +totalEnergyWh.toFixed(1),
  };
}

function estimateRuntimeCoverage(kit) {
  const { durationHours } = state.constraints;
  const hasHighDraw = Object.keys(kit.items).some((id) => {
    const item = state.inventoryById[id];
    return item && ['Node', 'UxS'].includes(item.category);
  });
  const hasRadio = Object.keys(kit.items).some((id) => {
    const item = state.inventoryById[id];
    return item && item.category === 'Radio';
  });
  const baselineWhPerHour = hasHighDraw ? 20 : hasRadio ? 12 : 8;
  const { totalEnergyWh } = calculateKitTotals(kit);
  const coverage = totalEnergyWh / (baselineWhPerHour * durationHours || 1);
  const pct = Math.min(100, Math.round(coverage * 100));
  return {
    coveragePercent: pct,
    label: `${pct}% of ${durationHours}h requirement`,
  };
}

function calculateTeamSummary() {
  const kits = Object.values(state.kits);
  const totals = kits.map((kit) => calculateKitTotals(kit));
  const teamWeight = totals.reduce((sum, t) => sum + t.totalWeightKg, 0);
  const avgWeight = kits.length ? +(teamWeight / kits.length).toFixed(2) : 0;

  const batteryCounts = {};
  kits.forEach((kit) => {
    Object.entries(kit.items).forEach(([itemId, qty]) => {
      const item = state.inventoryById[itemId];
      if (item && item.category === 'Battery') {
        batteryCounts[item.name] = (batteryCounts[item.name] || 0) + qty;
      }
    });
  });

  return {
    teamWeight: +teamWeight.toFixed(2),
    avgWeight,
    batteryCounts,
  };
}

function renderInventoryList() {
  const categoryFilter = document.getElementById('filter-category').value;
  const textFilter = document.getElementById('filter-text').value.toLowerCase();

  const filtered = state.inventory.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesText = !textFilter ||
      item.name.toLowerCase().includes(textFilter) ||
      (item.tags || []).some((tag) => tag.toLowerCase().includes(textFilter));
    return matchesCategory && matchesText;
  });

  if (!filtered.length) {
    inventoryListEl.innerHTML = '<p class="muted">No inventory matches.</p>';
    return;
  }

  inventoryListEl.innerHTML = filtered.map((item) => {
    const tags = (item.tags || []).map((tag) => `<span class="pill">${tag}</span>`).join('');
    const kitsOptions = Object.values(state.kits)
      .map((kit) => `<option value="${kit.id}">${kit.name}</option>`)
      .join('');
    const energy = typeof item.energy_wh === 'number' ? `${item.energy_wh} Wh` : 'N/A';
    return `
      <article class="card">
        <header>
          <h3>${item.name}</h3>
          <p class="muted">${item.category}</p>
        </header>
        <div class="badges">
          <span class="badge">${(item.weight_g / 1000).toFixed(2)} kg</span>
          <span class="badge">Energy: ${energy}</span>
        </div>
        <p class="muted">${item.notes || ''}</p>
        <div class="badges">${tags}</div>
        <div class="add-row">
          <select data-item="${item.id}" class="kit-target">
            ${kitsOptions || '<option value="">No kits</option>'}
          </select>
          <button class="btn-primary add-to-kit" data-item="${item.id}">Add to Kit</button>
        </div>
      </article>
    `;
  }).join('');
}

function renderKitsPanel() {
  kitsContainer.innerHTML = '';
  const template = document.getElementById('kit-template');

  Object.values(state.kits).forEach((kit) => {
    const clone = template.content.cloneNode(true);
    const nameInput = clone.querySelector('.kit-name');
    const roleInput = clone.querySelector('.kit-role');
    nameInput.value = kit.name;
    roleInput.value = kit.role;

    nameInput.addEventListener('input', (e) => {
      kit.name = e.target.value;
      renderInventoryList();
      renderSummaryPanel();
    });
    roleInput.addEventListener('input', (e) => {
      kit.role = e.target.value;
      renderSummaryPanel();
    });

    clone.querySelector('.remove-kit').addEventListener('click', () => removeKit(kit.id));

    const itemsList = clone.querySelector('.kit-items');
    const empty = clone.querySelector('.kit-empty');

    const entries = Object.entries(kit.items);
    if (entries.length === 0) {
      empty.style.display = 'block';
    } else {
      empty.style.display = 'none';
      entries.forEach(([itemId, qty]) => {
        const item = state.inventoryById[itemId];
        if (!item) return;
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <div>${item.name}</div>
            <p class="muted">${item.category}</p>
          </div>
          <div class="qty">
            <button class="btn-ghost" type="button">-</button>
            <span>${qty}</span>
            <button class="btn-ghost" type="button">+</button>
          </div>
        `;
        const [minus, plus] = li.querySelectorAll('button');
        minus.addEventListener('click', () => removeItemFromKit(kit.id, itemId));
        plus.addEventListener('click', () => addItemToKit(kit.id, itemId));
        itemsList.appendChild(li);
      });
    }

    const { totalWeightKg, totalEnergyWh } = calculateKitTotals(kit);
    clone.querySelector('.kit-weight').textContent = totalWeightKg;
    clone.querySelector('.kit-energy').textContent = totalEnergyWh;
    const runtime = estimateRuntimeCoverage(kit);
    clone.querySelector('.kit-runtime').textContent = runtime.label;

    kitsContainer.appendChild(clone);
  });

  renderInventoryList();
  renderSummaryPanel();
}

function renderSummaryPanel() {
  const { teamWeight, avgWeight, batteryCounts } = calculateTeamSummary();
  const { maxWeightPerOperatorKg, teamSize, durationHours, environment } = state.constraints;

  const teamOver = maxWeightPerOperatorKg > 0 && avgWeight > maxWeightPerOperatorKg;
  const teamSummary = `Team weight ${teamWeight} kg | Avg ${avgWeight} kg per operator (${teamOver ? 'Over' : 'OK'} vs ${maxWeightPerOperatorKg} kg limit)`;

  const kitsSummary = Object.values(state.kits).map((kit) => {
    const totals = calculateKitTotals(kit);
    const over = maxWeightPerOperatorKg > 0 && totals.totalWeightKg > maxWeightPerOperatorKg;
    return `<li><strong>${kit.name || 'Kit'}</strong> — ${totals.totalWeightKg} kg — ${over ? 'Over limit' : 'OK'}</li>`;
  }).join('');

  const batteries = Object.entries(batteryCounts).map(([name, qty]) => `<li>${name}: ${qty}</li>`).join('') || '<li>None</li>';

  summaryContent.innerHTML = `
    <div class="summary-card">
      <h3>Mission</h3>
      <p class="muted">${environment} | ${durationHours}h | Team size ${teamSize}</p>
      <p>${teamSummary}</p>
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
}

function handleInventoryActions(e) {
  const btn = e.target.closest('.add-to-kit');
  if (!btn) return;
  const itemId = btn.dataset.item;
  const select = btn.parentElement.querySelector('.kit-target');
  const kitId = select ? select.value : '';
  if (!kitId) {
    alert('Create a kit before adding items.');
    return;
  }
  addItemToKit(kitId, itemId);
}

function buildChecklistText() {
  const { constraints } = state;
  const lines = [
    `Mission: ${constraints.environment}, ${constraints.durationHours} hrs, team size ${constraints.teamSize}`,
    `Constraints: Max ${constraints.maxWeightPerOperatorKg} kg per operator`,
    '',
  ];

  Object.values(state.kits).forEach((kit) => {
    const totals = calculateKitTotals(kit);
    lines.push(`${kit.name || 'Kit'} – ${kit.role || 'Role'} – ${totals.totalWeightKg} kg`);
    Object.entries(kit.items).forEach(([itemId, qty]) => {
      const item = state.inventoryById[itemId];
      if (!item) return;
      lines.push(`- ${qty} x ${item.name} (${item.category}) – ${item.weight_g}g`);
    });
    lines.push('');
  });

  lines.push('Notes:');
  lines.push(constraints.notes || '');
  return lines.join('\n');
}

function copyChecklist() {
  const text = buildChecklistText();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Checklist copied to clipboard');
    }).catch(() => {
      alert('Copy failed');
    });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Checklist copied to clipboard');
  }
}

function downloadJSON() {
  const payload = {
    constraints: state.constraints,
    kits: state.kits,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kitsmith_export.json';
  link.click();
  URL.revokeObjectURL(url);
}

function hydrateDefaults() {
  addKit('Team Lead', 'TL');
  addKit('RTO', 'Communications');
}

function attachEvents() {
  document.getElementById('constraints-form').addEventListener('input', updateConstraintsFromForm);
  document.getElementById('reset-constraints').addEventListener('click', resetConstraintsForm);
  document.getElementById('filter-category').addEventListener('change', renderInventoryList);
  document.getElementById('filter-text').addEventListener('input', renderInventoryList);
  inventoryListEl.addEventListener('click', handleInventoryActions);
  document.getElementById('add-kit').addEventListener('click', () => addKit('New Kit', ''));
  document.getElementById('copy-checklist').addEventListener('click', copyChecklist);
  document.getElementById('download-json').addEventListener('click', downloadJSON);
}

function init() {
  attachEvents();
  updateConstraintsFromForm();
  hydrateDefaults();
  loadInventory();
}

document.addEventListener('DOMContentLoaded', init);
