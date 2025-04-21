//add item to order
function addToOrder() {
  if (!selectedSubMenu) {
    alert("Please select a submenu.");
    return;
  }

  const optionsContainer = document.getElementById("dynamicOptionsContainer");
  const selects = optionsContainer.querySelectorAll("select");

  const selections = {};
  let itemCode = `${selectedSubMenu}`;
  let missing = false;

  selects.forEach(select => {
    const label = select.dataset.label;
    const value = select.value;
    if (!value) {
      alert(`Please select ${label}`);
      missing = true;
      return;
    }

    const text = select.options[select.selectedIndex].text;
    selections[label] = text;
    itemCode += value;
  });

  if (missing) return;

  const subMenu = selectedMainMenu.subMenu.find(sm => sm.id === selectedSubMenu);

  const row = {
    main: selectedMainMenu.name,
    sub: subMenu.name,
    ...selections,
    code: itemCode
  };

  orderItems.push(row);
  updateOrderTable();
  generateQRCode(orderItems.map(i => i.code));
  goBackToMainMenu();
}


// Update order table
function updateOrderTable() {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";

  orderItems.forEach((item, index) => {
    const optionDetails = Object.entries(item)
      .filter(([key]) => !["main", "sub", "code"].includes(key))
      .map(([key, val]) => `<div class="small-option">${key}: ${val}</div>`)
      .join("");

    const row = document.createElement("tr");
    row.classList.add("fade-smooth", "show");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <strong>${item.sub}</strong><br/>
        ${optionDetails}
        <div class="small-option text-muted">Code: ${item.code}</div>
      </td>
      <td class="d-none">${item.main}</td>
      <td class="d-none">${item.sub}</td>
      ${Object.entries(item)
        .filter(([key]) => !["main", "sub", "code"].includes(key))
        .map(([key, val]) => `<td class="d-none">${val}</td>`)
        .join("")}
      <td class="d-none">${item.code}</td>
      <td><button class="btn btn-sm btn-warning" onclick="removeItem(${index})">X</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Remove item from order
function removeItem(index) {
  orderItems.splice(index, 1);
  updateOrderTable();
  generateQRCode(orderItems.map(i => i.code));
}

// Generate QR code
function generateQRCode(dataArray) {
  new QRious({
    element: document.getElementById("qrCanvas"),
    size: 200,
    value: dataArray.join("\n")
  });
}
