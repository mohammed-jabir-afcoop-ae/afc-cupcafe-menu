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

  document.getElementById("backToMainBtn").style.display = "none";
}

function selectMainMenu(menuId) {
  selectedMainMenu = menuData.find(m => m.id === menuId);

  document.querySelectorAll(".main-menu-item").forEach(el => {
    if (el.dataset.id != menuId) {
      el.classList.add("fade-out");
      setTimeout(() => el.classList.add("hidden"), 300); // after fade-out, hide it
    }
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

  const subMenuSection = document.getElementById("subMenuSection");
  subMenuSection.classList.remove("hidden");
  subMenuSection.classList.add("fade-in");

  document.getElementById("backToMainBtn").classList.remove("hidden");
}

function selectSubMenu(subMenuId) {
  selectedSubMenu = subMenuId;

  const match = selectedMainMenu.subMenu.find(s => s.id === subMenuId);
  document.querySelectorAll("#subMenuButtons button").forEach(btn => {
    if (btn.textContent !== match.name) {
      btn.classList.add("fade-out");
      setTimeout(() => btn.classList.add("hidden"), 300);
    }
  });

  const changeBtn = document.getElementById("changeSubmenuBtn");
  const optionSec = document.getElementById("optionsSection");

  changeBtn.classList.remove("hidden");
  changeBtn.classList.add("fade-in");

  optionSec.classList.remove("hidden");
  optionSec.classList.add("fade-in");

  populateSelect("beanSelect", beans);
  populateSelect("milkSelect", milks);
  populateSelect("sizeSelect", sizes);
}

function resetSubmenu() {
  selectedSubMenu = null;

  document.querySelectorAll("#subMenuButtons button").forEach(btn => {
    btn.classList.remove("hidden", "fade-out");
    btn.classList.add("fade-in");
  });

  document.getElementById("changeSubmenuBtn").classList.add("hidden");
  document.getElementById("optionsSection").classList.add("hidden");

  clearSelect("beanSelect");
  clearSelect("milkSelect");
  clearSelect("sizeSelect");
}

function goBackToMainMenu() {
  selectedMainMenu = null;
  selectedSubMenu = null;

  document.querySelectorAll(".main-menu-item").forEach(item => {
    item.classList.remove("hidden", "fade-out");
    item.classList.add("fade-in");
  });

  document.getElementById("subMenuSection").classList.add("hidden");
  document.getElementById("optionsSection").classList.add("hidden");
  document.getElementById("backToMainBtn").classList.add("hidden");

  resetSubmenu();
}

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

function clearSelect(id) {
  document.getElementById(id).innerHTML = "";
}

function addToOrder() {
  const beanId = document.getElementById("beanSelect").value;
  const milkId = document.getElementById("milkSelect").value;
  const sizeId = document.getElementById("sizeSelect").value;

  if (!selectedSubMenu || !beanId || !milkId || !sizeId) {
    alert("Please select all options.");
    return;
  }

  const subMenu = selectedMainMenu.subMenu.find(sm => sm.id === selectedSubMenu);
  const itemCode = `${selectedSubMenu}${beanId}${milkId}${sizeId}`;

  const row = {
    main: selectedMainMenu.name,
    sub: subMenu.name,
    bean: beans.find(b => b.id == beanId).name,
    milk: milks.find(m => m.id == milkId).name,
    size: sizes.find(s => s.id == sizeId).name,
    code: itemCode
  };

  orderItems.push(row);
  updateOrderTable();
  generateQRCode(orderItems.map(i => i.code));
  goBackToMainMenu();
}

function updateOrderTable() {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";
  orderItems.forEach((item, index) => {
    const row = document.createElement("tr");
    row.classList.add("fade-smooth", "show");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <strong>${item.sub}</strong><br/>
        <div class="small-option">Bean: ${item.bean}</div>
        <div class="small-option">Milk: ${item.milk}</div>
        <div class="small-option">Size: ${item.size}</div>
        <div class="small-option text-muted">Code: ${item.code}</div>
      </td>
      <td class="d-none">${item.main}</td>
      <td class="d-none">${item.sub}</td>
      <td class="d-none">${item.bean}</td>
      <td class="d-none">${item.milk}</td>
      <td class="d-none">${item.size}</td>
      <td class="d-none">${item.code}</td>
      <td><button class="btn btn-sm btn-warning" onclick="removeItem(${index})">X</button></td>
    `;
    tbody.appendChild(row);
  });
}

function removeItem(index) {
  orderItems.splice(index, 1);
  updateOrderTable();
  generateQRCode(orderItems.map(i => i.code));
}

function generateQRCode(dataArray) {
  new QRious({
    element: document.getElementById("qrCanvas"),
    size: 200,
    value: dataArray.join("\n")
  });
}
