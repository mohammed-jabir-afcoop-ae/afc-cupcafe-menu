//add item to order
function addToOrder() {
  if (!selectedSubMenu) {
    alert("Please select a submenu item.");
    return;
  }

  const selects = document.querySelectorAll("#dynamicOptionsContainer select");
  const options = [];
  let code = selectedSubMenu;

  for (const select of selects) {
    const optionId = select.value;
    const optionName = select.previousElementSibling.innerText.replace(":", "").trim();
    const optionLabel = select.options[select.selectedIndex].text;

    if (!optionId) {
      alert(`Please select an option for ${optionName}`);
      return;
    }

    options.push({ id: optionId, name: optionName, value: optionLabel });
    code += optionId;
  }

  const subMenu = selectedMainMenu.subMenu.find(sm => sm.id === selectedSubMenu);

  const orderItem = {
    main: selectedMainMenu.name,
    sub: subMenu.name,
    options: options,
    code: code,
    json: null // we'll assign JSON here
  };

  // Generate and attach stringified JSON to the item
  orderItem.json = JSON.stringify(orderItem);

  orderItems.push(orderItem);
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

    // Generate readable options
    const optionsHtml = item.options.map(opt => {
      return `<div class="small-option">${opt.name}: ${opt.value}</div>`;
    }).join("");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <strong>${item.sub}</strong><br/>
        ${optionsHtml}
        <div class="small-option text-muted">Code: ${item.code}</div>
      </td>
      <td class="d-none">${item.main}</td>
      <td class="d-none">${item.sub}</td>
      <td class="d-none">${item.code}</td>
      <td class="d-none">${item.json}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="removeItem(${index})">X</button>
      </td>
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
