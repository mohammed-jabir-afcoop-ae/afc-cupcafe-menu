let menuData = [];
let selectedMainMenu = null, selectedSubMenu = null;
let orderItems = [];

async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Failed to load " + path);
    return await res.json();
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
    return {};
  }
}

async function init() {
  try {
    const menuJSON = await loadJSON("jsonData/Data_MenuItem_menu.json");
    menuData = menuJSON.menuItems ?? menuJSON;

    renderMainMenu();
  } catch (err) {
    console.error("Initialization error:", err);
  }
}

window.onload = init;
