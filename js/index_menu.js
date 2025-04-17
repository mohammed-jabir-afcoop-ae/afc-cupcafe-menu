function renderMainMenu() {
  const container = document.getElementById("mainMenuSection");
  container.innerHTML = "";
  menuData.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-4 col-md-2 text-center mb-3 main-menu-item fade-in";
    col.dataset.id = item.id;
    col.innerHTML = `
      <img src="img/${item.id}.png" alt="${item.name}" class="menu-img rounded-circle border" onclick="selectMainMenu(${item.id})" />
      <div class="fw-bold mt-1">${item.name}</div>
    `;
    container.appendChild(col);
  });
  document.getElementById("mainMenuSection").style.display = "flex";
  document.getElementById("backToMainBtn").style.display = "none";
}

function selectMainMenu(menuId) {
  selectedMainMenu = menuData.find(m => m.id === menuId);
  document.querySelectorAll(".main-menu-item").forEach(el => {
    if (el.dataset.id != menuId) el.style.display = "none";
  });

  const subMenuContainer = document.getElementById("subMenuButtons");
  subMenuContainer.innerHTML = "";
  selectedMainMenu.subMenu.forEach(sm => {
    const btn = document.createElement("button");
    btn.className = "btn btn-submenu w-100";
    btn.textContent = sm.name;
    btn.onclick = () => selectSubMenu(sm.id);
    subMenuContainer.appendChild(btn);
  });

  document.getElementById("subMenuSection").style.display = "block";
  document.getElementById("backToMainBtn").style.display = "inline-block";
}

function selectSubMenu(subMenuId) {
  selectedSubMenu = subMenuId;

  document.querySelectorAll("#subMenuButtons button").forEach(btn => {
    if (btn.textContent !== selectedMainMenu.subMenu.find(s => s.id === subMenuId).name) {
      btn.style.display = "none";
    }
  });

  document.getElementById("changeSubmenuBtn").style.display = "inline-block";
  document.getElementById("optionsSection").style.display = "block";
  populateSelect("beanSelect", beans);
  populateSelect("milkSelect", milks);
  populateSelect("sizeSelect", sizes);
}

function resetSubmenu() {
  selectedSubMenu = null;
  document.querySelectorAll("#subMenuButtons button").forEach(btn => btn.style.display = "block");
  document.getElementById("changeSubmenuBtn").style.display = "none";
  document.getElementById("optionsSection").style.display = "none";
  clearSelect("beanSelect");
  clearSelect("milkSelect");
  clearSelect("sizeSelect");
}

function goBackToMainMenu() {
  selectedMainMenu = null;
  selectedSubMenu = null;
  document.querySelectorAll(".main-menu-item").forEach(item => item.style.display = "block");
  document.getElementById("subMenuSection").style.display = "none";
  document.getElementById("optionsSection").style.display = "none";
  document.getElementById("backToMainBtn").style.display = "none";
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
      <td><button class="btn btn-sm btn-danger" onclick="removeItem(${index})">X</button></td>
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
