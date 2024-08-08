const secretKey = "qwerty-asdfgh-zxcvb";

if (typeof Storage === "undefined") {
  alert("Your browser doesn't support storage data storage will be unavailable");
}

const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (data, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const init = () => {
  const savedState = localStorage.getItem("appState");
  if (!savedState) {
    const initState = {
      theme: "light",
      lang: "en",
      lastUpdate: new Date().getTime(),
    };
    const encryptState = encryptData(initState, secretKey);
    localStorage.setItem("appState",encryptState);
  }
  applyState(loadState());
};

const loadState = () => {
  const encryptState = localStorage.getItem("appState");
  if (encryptState) {
    try {
      return decryptData(encryptState, secretKey);
    } catch (e) {
      console.log('niot', e);
      return null;
    }
  }
  return null;
};

const updateState = (newState) => {
  newState.lastUpdate = new Date().getTime();
  const encryptState = encryptData(newState, secretKey);
  localStorage.setItem("appState", encryptState);
};

const applyState = (state) => {
  if (state) {
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (state.theme === "dark") {
      document.body.className = "dark";
      themeToggleBtn.textContent = "Switch to dark";
      themeToggleBtn.classList.add("dark");
      themeToggleBtn.classList.remove("light");
    } else {
      document.body.className = "light";
      themeToggleBtn.textContent = "Switch to light";
      themeToggleBtn.classList.add("light");
      themeToggleBtn.classList.remove("dark");
    }
    const labelSelect = document.getElementById("labelSelect");
    if (state.lang === "en") {
      labelSelect.textContent = "Select language";
      themeToggleBtn.textContent = `Switch to ${
        state.theme === "dark" ? "light" : "dark"
      }`;
    } else {
      labelSelect.textContent = "Seleccione el idioma";
      themeToggleBtn.textContent = `Cambiar a ${
        state.theme === "dark" ? "Claro" : "Oscuro"
      }`;
    }
    document.getElementById("language").value = state.lang;
  }
};

document.getElementById("theme-toggle").addEventListener("click", () => {
  const state = loadState();
  if (state) {
    state.theme = state.theme === "dark" ? "light" : "dark";;
    updateState(state);
    applyState(state);
  }
});

document.getElementById("language").addEventListener("change", (e) => {
  const state = loadState();
  if (state) {
    state.lang = e.target.value;
    updateState(state);
    applyState(state);
  }
});

const autoRemoveOldData = () => {
  const state = loadState();
  if (state) {
    const currTime = new Date().getTime();
    const timeDiff = currTime - state.lastUpdate;
    const maxAllowAge = 1000 * 60;

    if (timeDiff > maxAllowAge) {
      localStorage.removeItem("appState");
      console.log("old srtorage remove from");
      init();
    }
  }
};

window.addEventListener("storage", (e) => {
  if (e.key === "appState") {
    applyState(loadState());
  }
});

init();
autoRemoveOldData();