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
const modal = document.querySelector(".modal");
const backDrop = document.querySelector(".backdrop");
const quantityUpdate = document.querySelector(".quantity-update");
const inputFields = document.querySelectorAll(".text-field");
const formBtn = document.querySelector(".modal form");
const closeModalBtn = document.querySelector(".exit");

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
  quantityUpdate.addEventListener("click", () => {
    DashboardUI.show();
    DashboardUI.updateField();
  });

  formBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    DashboardUI.updateStock();
    DashboardUI.showMessage("quantity updated successfully", "success");
    DashboardUI.removeOverly();
    DashboardUI.clearInputFields();
  });
  closeModalBtn.addEventListener("click", () => {
    DashboardUI.removeOverly();
    DashboardUI.clearInputFields();
  });
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
          <span class="qty-data">${product.quantity}</span>
          <span class="iconify"><i class="bx bxs-label icon" data-label=${product.quantity}></i></span>
        </td>
    </tr>
    `;
  }

  static show = () => {
    modal.classList.add("show");
    backDrop.classList.add("show-backdrop");
  };
  static removeOverly = () => {
    modal.classList.remove("show");
    backDrop.classList.remove("show-backdrop");
  };
  static showTotalItems() {
    let storedProducts = Storage.getProducts();
    let products = [...storedProducts];
    if (products.length !== 0) {
      let lastProduct = products.slice(-1)[0];
      summaryInputs[0].innerHTML = lastProduct.id;
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
      if (!uniqueArr.includes(product.category)) {
        uniqueArr.push(product.category);
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

  static updateField = () => {
    let itemsFromLocalStorage = Storage.getProducts();

    let lastProduct =
      itemsFromLocalStorage.slice(-1)[0]; /*slice always returns an array */
    inputFields[0].addEventListener("input", () => {
      if (
        parseInt(inputFields[0].value) > 0 &&
        parseInt(inputFields[0].value) <= parseInt(lastProduct.id)
      ) {
        itemsFromLocalStorage.forEach((item) => {
          if (inputFields[0].value == item.id) {
            inputFields[1].value = item.name;
            inputFields[1].readOnly = true;
            inputFields[2].value = item.quantity;
          }
        });
      } else {
        if (inputFields[0].value == 0) {
          this.showMessage("Enter a Valid ID", "error");
          inputFields[0].value = "";
          this.clearInputFields();
        } else {
          inputFields[0].value = lastProduct.id;
          this.clearInputFields();

          this.showMessage(
            `${lastProduct.id}` + " is the last product in stock",
            "error"
          );
        }
      }
    });
  };

  static clearInputFields = () => {
    inputFields[0].value = "";
    inputFields[1].value = "";
    inputFields[2].value = "";
  };

  static updateStock = () => {
    let productsFromLocalStorage = Storage.getProducts();
    const id = parseInt(inputFields[0].value);
    const quantity = inputFields[2].value.trim();
    let quantCells = Array.from(document.getElementsByClassName("qty-data"));
    quantCells.forEach((cell) => {
      let parentIndex = cell.closest("tr").rowIndex;
      if (id === parentIndex) {
        cell.innerHTML = quantity;
        this.updateLabelColors(cell, quantity);
      }
    });
    productsFromLocalStorage.forEach((product) => {
      if (id == product.id) {
        product.quantity = quantity;
        localStorage.setItem(
          "products",
          JSON.stringify(productsFromLocalStorage)
        );
      }
    });
    this.showTotalQuantity();
    this.displayItemsInAndOutOfStock();
  };
  static updateLabelColors(cell, qty) {
    let cellLable = cell.nextElementSibling.children[0];
    cellLable.dataset.label = qty;
    let qtyInt = parseInt(qty);
    if (qtyInt == 0) {
      cellLable.classList = "bx bxs-label icon out-of-stock  ";
    } else if (qtyInt > 0 && qtyInt <= 20) {
      cellLable.classList = "bx bxs-label icon about-out-of-stock";
    } else {
      cellLable.classList = "bx bxs-label icon in-stock";
    }
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
