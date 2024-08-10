if (navigator.serviceWorker.controller) {
  console.log(`Servive Worker is active and cotroll page`);
  navigator.serviceWorker.addEventListener("message", (e) => {
    if (e.data.type === "CACHE_ERROR") {
      dissplayError(e.data.message);
    }
    if (e.data.type === "METRICS") {
      const { metrics } = e.data;
      document.getElementById(
        "cacheHits"
      ).textContent = `Cache Hits: ${metrics.cacheHits}`;
      document.getElementById(
        "cacheMisses"
      ).textContent = `Cache Misses: ${metrics.cacheMisses}`;
    }
  });
}

const connectionType = navigator.connection
  ? navigator.connection.effectiveType
  : "4g";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        if (registration.active) {
          registration.active.postMessage({
            type: "SET_CONNECTION_TYPE",
            connectionType,
          });
        } else {
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage({
                type: "SET_CONNECTION_TYPE",
                connectionType,
              });
            }
          });
        }
        console.log(connectionType);
        console.log("Service Worker зареєстровано:", registration);
      })
      .catch((e) => {
        console.log("Помилка реєстрації Service Worker:", e);
      });
  });
}

document.getElementById("fetchData").addEventListener("click", () => {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const apiData = document.getElementById("apiData");
      apiData.innerHTML = "";
      // console.log(data);
      data.products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("card");

        productDiv.innerHTML = `
        <div class="prod-img">
          <img src="${product.images[0]}" alt="${
          product.title
        }" loading="lazy"/>
        </div>
        <div class ="prod-desc">
          <h2>${product.title}</h2>
          <p><strong>Price:</strong> $${product.price}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Description:</strong> ${
            product.description.length > 40
              ? product.description.slice(0, 40) + "..."
              : product.description
          }</p>
        </div>
      `;
        apiData.appendChild(productDiv);
      });
    })
    .catch((e) => {
      console.log("Помилка отримання даних з API:", e);
      const apiData = document.getElementById("apiData");
      apiData.innerHTML = `<h2>Do not visit download data. Please try again later.</h2>`;
    });
});

const resourceUrl = document.getElementById("resourceUrl");
const errorMessage = document.getElementById("errorMessage");
const dissplayError = (message) => {
  errorMessage.textContent = message;
  setTimeout(() => {
    errorMessage.textContent = "";
  }, 5000);
};

document.getElementById("addToCache").addEventListener("click", () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "ADD_TO_CACHE",
      url: resourceUrl.value,
    });
  } else {
    dissplayError("Service Worker не активний. Спробуйте пізніше.");
  }
});

document.getElementById("removeFromCache").addEventListener("click", () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "REMOVE_FROM_CACHE",
      url: resourceUrl.value,
    });
  } else {
    console.log(`Service work not active`);
    dissplayError("Service Worker не активний. Спробуйте пізніше.");
  }
});

document.getElementById("updateCache").addEventListener("click", () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "UPDATE_CACHE",
      url: resourceUrl.value,
    });
  } else {
    console.log(`Service work not active`);
    dissplayError("Service Worker не активний. Спробуйте пізніше.");
  }
});

document.getElementById("getMetrics").addEventListener("click", () => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "GET_METRICS" });
  } else {
    console.log(`Service work not active`);
  }
});
