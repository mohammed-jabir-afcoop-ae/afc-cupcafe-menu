// ✨ Helper functions for consistent show/hide animations
function showElement(el) {
  if (!el) return;
  // Remove hidden class if present
  el.classList.remove("hidden", "fade-out");
  // Make sure the element is visible
  el.style.display = "block";
  // Force reflow to ensure animation triggers correctly
  void el.offsetWidth;
  // Add animation class
  el.classList.add("fade-in");
}

function hideElement(el) {
  if (!el) return;
  el.classList.remove("fade-in");
  el.classList.add("fade-out");
  setTimeout(() => {
    el.classList.add("hidden");
    el.style.display = "none";
  }, 300); // match fade duration
}


// Render main menu
function renderMainMenu() {
  const container = document.getElementById("mainMenuSection");
  container.innerHTML = "";
  menuData.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-4 col-md-2 text-center mb-3 main-menu-item fade-smooth show";
    col.dataset.id = item.id;
    col.innerHTML = `
      <img src="img/${item.id}.png" alt="${item.name}" class="menu-img rounded-circle border" onclick="selectMainMenu(${item.id})" />
      <div class="fw-bold mt-1">${item.name}</div>
    `;
    container.appendChild(col);
  });

  const section = document.getElementById("mainMenuSection");
  section.style.display = "flex";
  section.classList.add("fade-smooth", "show");

  document.getElementById("backToMainBtn").classList.add("hidden");
}

// Handle main menu selection
function selectMainMenu(menuId) {
  selectedMainMenu = menuData.find(m => m.id === menuId);

  document.querySelectorAll(".main-menu-item").forEach(el => {
    if (el.dataset.id != menuId) hideElement(el);
  });

  const subMenuContainer = document.getElementById("subMenuButtons");
  subMenuContainer.innerHTML = "";
  selectedMainMenu.subMenu.forEach(sm => {
    const btn = document.createElement("button");
    btn.className = "btn btn-primary w-100 mb-2 btn-submenu fade-in";
    btn.textContent = sm.name;
    btn.onclick = () => selectSubMenu(sm.id);
    subMenuContainer.appendChild(btn);
  });

  showElement(document.getElementById("subMenuSection"));
  showElement(document.getElementById("backToMainBtn"));
}

// Handle submenu selection
async function selectSubMenu(subMenuId) {
  selectedSubMenu = subMenuId;

  const match = selectedMainMenu.subMenu.find(s => s.id === subMenuId);
  document.querySelectorAll("#subMenuButtons button").forEach(btn => {
    if (btn.textContent !== match.name) hideElement(btn);
  });

  showElement(document.getElementById("changeSubmenuBtn"));
  showElement(document.getElementById("optionsSection"));

  await renderDynamicOptions(match.optionSetId); 
}

async function renderDynamicOptions(optionSetId) {
  const container = document.getElementById("dynamicOptionsContainer");
  container.innerHTML = "";

  const [optionMasterData, optionSetMasterData] = await Promise.all([
    fetch("json/Data_MenuItem_optionmaster.json").then(res => res.json()),
    fetch("json/Data_MenuItem_optionsetmaster.json").then(res => res.json())
  ]);

  const optionSet = optionSetMasterData.find(set => set.optionSetId === optionSetId);
  if (!optionSet) return;

  optionSet.optionIds.forEach(optionId => {
    const option = optionMasterData.find(opt => opt.optionId === optionId);
    if (!option) return;

    const wrapper = document.createElement("div");
    wrapper.className = "mb-2";

    const label = document.createElement("label");
    label.setAttribute("for", option.selectId);
    label.innerText = option.name + ":";

    const select = document.createElement("select");
    select.id = option.selectId;
    select.className = "form-select";

    option.values.forEach(val => {
      const opt = document.createElement("option");
      opt.value = val.id;
      opt.textContent = val.name;
      select.appendChild(opt);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    container.appendChild(wrapper);
  });
}


// Reset submenu view
function resetSubmenu() {
  selectedSubMenu = null;

  document.querySelectorAll("#subMenuButtons button").forEach(btn => {
    showElement(btn);
  });

  hideElement(document.getElementById("changeSubmenuBtn"));
  hideElement(document.getElementById("optionsSection"));

  // Clear dynamically generated options
  const container = document.getElementById("dynamicOptionsContainer");
  if (container) container.innerHTML = "";
}


// Back to main menu
function goBackToMainMenu() {
  selectedMainMenu = null;
  selectedSubMenu = null;

  document.querySelectorAll(".main-menu-item").forEach(item => {
    showElement(item);
  });

  hideElement(document.getElementById("subMenuSection"));
  hideElement(document.getElementById("optionsSection"));
  hideElement(document.getElementById("backToMainBtn"));

  resetSubmenu();
}

// Populate select dropdown
function populateSelect(selectId, list) {
  const select = document.getElementById(selectId);
  select.innerHTML = "";
  if (!Array.isArray(list)) return;
  list.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.id;
    option.textContent = opt.name;
    select.appendChild(option);
  });
}

// Clear select dropdown
function clearSelect(id) {
  document.getElementById(id).innerHTML = "";
}
