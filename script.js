let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
const summaryInputs = document.querySelectorAll(".right-side .number");
const labels = document.getElementsByClassName("bxs-label");

const init = () => {
  sidebarBtn.onclick = function () {
    sidebar.classList.toggle("active");
    if (sidebar.classList.contains("active")) {
      sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  };
  DashboardUI.DisplayProducts();
  DashboardUI.showTotalItems();
  DashboardUI.showTotalCategory();
  DashboardUI.displayLabelColor();
};

class DashboardUI {
  static DisplayProducts() {
    const storedProducts = Storage.getProducts();
    const products = storedProducts;
    products.forEach((product) => DashboardUI.PopulateRows(product));
  }

  static PopulateRows(product) {
    //const id=0
    const list = document.getElementsByClassName("product-list")[0];
    list.innerHTML += `<tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.category}</td>
        <td class="label-cell">
          <span class="data">${product.quantity}</span>
          <span class="iconify"><i class="bx bxs-label" data-label=${product.quantity}></i></span>
        </td>
    </tr>
    `;
    //
  }

  static showTotalItems() {
    let storedProducts = Storage.getProducts();
    let products = [...storedProducts];
    if (products.length !== 0) {
      let lastProduct = products.slice(-1); /*slice always returns an array */
      lastProduct.forEach((prod) => {
        summaryInputs[0].innerHTML = prod.id;
      });
    } else summaryInputs[0].innerHTML = 0;
  }

  static showTotalCategory() {
    let storedProducts = Storage.getProducts();
    let uniqueArr = [];
    storedProducts.forEach((product) => {
      if (!uniqueArr.includes(product.name)) {
        uniqueArr.push(product.name);
      }
    });
    summaryInputs[1].innerHTML = uniqueArr.length;
  }

  static displayLabelColor() {
    let labelsArray = [...labels];
    labelsArray.forEach((label) => {
      let qty = parseInt(label.dataset.label);
      if (qty == 0) {
        label.classList.add("out-of-stock");
      } else if (qty <= 2000) {
        label.classList.add("about-out-of-stock");
      } else {
        label.classList.add("in-stock");
      }
    });
  }
}

class Storage {
  static getProducts() {
    let products = "";
    if (localStorage.getItem("products") == null) {
      products = [];
    } else {
      products = JSON.parse(localStorage.getItem("products"));
    }
    return products;
  }

  static saveProducts(prodObject) {
    let productsFromLocalStorage = Storage.getProducts();
    productsFromLocalStorage.push(prodObject);
    localStorage.setItem("products", JSON.stringify(productsFromLocalStorage));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
