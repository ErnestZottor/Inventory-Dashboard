let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
const summaryInputs = document.querySelectorAll(".right-side .number");
const labels = document.getElementsByClassName("bxs-label");
const removeItem = document.querySelector(".remove-product");
const actionIcon = document.getElementsByClassName("icon");
const overViewBoxes = document.querySelector(".overview-boxes");
const deleteIcon = document.getElementsByClassName("bx-trash");
const tableIndex = document.getElementsByClassName("prod-index");
const notificationDiv = document.querySelector(".toast");

let ind = 0;

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
  DashboardUI.showTotalQuantity();
  DashboardUI.displayItemsInAndOutOfStock();
  removeItem.addEventListener("click", () => {
    DashboardUI.showDeleteTable();
    let deleteIconArray = [...deleteIcon];
    deleteIconArray.forEach((icon) => {
      icon.addEventListener("click", (e) => {
        DashboardUI.deleteItem(e);
      });
    });
  });
  //   actionIcon.addEventListener("click", () => {
  //     alert("clicked");
  //   });
};

class DashboardUI {
  static DisplayProducts() {
    const storedProducts = Storage.getProducts();
    const products = storedProducts;
    products.forEach((product) => DashboardUI.PopulateRows(product));
  }

  static PopulateRows(product) {
    const list = document.getElementsByClassName("product-list")[0];
    list.innerHTML += `<tr>
        <td class= "prod-index">${product.id}</td>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.category}</td>
        <td class="label-cell">
          <span class="data">${product.quantity}</span>
          <span class="iconify"><i class="bx bxs-label icon" data-label=${product.quantity}></i></span>
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

  static showTotalQuantity() {
    let storedProducts = Storage.getProducts();
    let products = [...storedProducts];
    let counter = 0;
    if (products.length !== 0) {
      products.forEach((prod) => {
        counter += parseInt(prod.quantity);
      });
      summaryInputs[2].innerHTML = counter;
    } else summaryInputs[2].innerHTML = 0;
  }

  static displayItemsInAndOutOfStock() {
    let storedProducts = Storage.getProducts();
    let products = [...storedProducts];
    let count1 = 0;
    let count2 = 0;
    if (products.length !== 0) {
      products.forEach((prod) => {
        if (parseInt(prod.quantity) == 0) {
          count1++;
        } else {
          count2++;
        }
      });
      summaryInputs[3].innerHTML = count2;
      summaryInputs[4].innerHTML = count1;
    } else {
      summaryInputs[3].innerHTML = 0;
      summaryInputs[4].innerHTML = 0;
    }
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
      } else if (qty <= 20) {
        label.classList.add("about-out-of-stock");
      } else {
        label.classList.add("in-stock");
      }
    });
  }

  static deleteItem(event) {
    let buttonClicked = event.target;
    let id = buttonClicked.closest("tr").rowIndex;

    buttonClicked.closest("tr").remove();
    DashboardUI.showMessage("Product deleted", "error");
    DashboardUI.updateLocalStorage(id);
  }

  static updateLocalStorage(id) {
    let tableIndexArray = [...tableIndex];
    let productsFromLocalStorage = Storage.getProducts();
    let idBeforeDeletedItem = id - 1;
    productsFromLocalStorage.forEach((product) => {
      if (id == product.id) {
        productsFromLocalStorage.splice(id - 1, 1);
        productsFromLocalStorage.forEach((prod) => {
          if (prod.id > idBeforeDeletedItem) {
            prod.id = idBeforeDeletedItem += 1;
          }
        });
        localStorage.setItem(
          "products",
          JSON.stringify(productsFromLocalStorage)
        );
      }
    });
    tableIndexArray.forEach((tbRow, index) => {
      tbRow.textContent = index + 1;
    });
  }

  static showDeleteTable() {
    overViewBoxes.classList.add("hidden-summary");
    let actionIconArray = [...actionIcon];
    actionIconArray.forEach((icon) => {
      icon.classList = "bx bx-trash icon";
    });
  }

  static showMessage(message, state) {
    let hideTimeout = null;

    clearTimeout(hideTimeout);

    notificationDiv.textContent = message;
    notificationDiv.className = "toast toast--visible";

    if (state) {
      notificationDiv.classList.add(`toast--${state}`);
    }

    hideTimeout = setTimeout(() => {
      notificationDiv.classList.remove("toast--visible");
    }, 3000);
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
