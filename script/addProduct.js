let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
const inputFields = document.querySelectorAll(".form__field");
const addBtn = document.querySelector(".add-btn");
const form = document.getElementsByClassName("inventory-inputs")[0];
const notificationDiv = document.querySelector(".toast");
const quantUpdate = document.querySelector(".hidden");
const overlayInputFields = document.getElementsByClassName("text-field");
const backDrop = document.querySelector(".backdrop");
const quantityUpdate = document.querySelector(".quantity-update");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".exit");

let id = 1;

const init = () => {
  sidebarBtn.onclick = function () {
    sidebar.classList.toggle("active");
    if (sidebar.classList.contains("active")) {
      sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  };
  UI.DisplayProducts();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = inputFields[0].value.trim();
    const description = inputFields[1].value.trim();
    const category = inputFields[2].value.trim();
    const quantity = inputFields[3].value.trim();

    const product = new Products(
      name,
      description,
      category,
      quantity,
      Storage.getProducts().length + 1
    );

    Storage.saveProducts(product);
    UI.PopulateRows(product);
    UI.clearInputFields();
    UI.showMessage("product added successfully", "success");
  });

  quantityUpdate.addEventListener("click", () => {
    UI.show();
    UI.updateField();
  });
  quantUpdate.addEventListener("submit", (e) => {
    e.preventDefault();
    UI.updateStock();
    UI.showMessage("quantity updated successfully", "success");
    UI.removeOverly();
    UI.clearQtyFields();
  });
  closeModalBtn.addEventListener("click", () => {
    UI.removeOverly();
    UI.clearQtyFields();
  });
};

class UI {
  static DisplayProducts() {
    const storedProducts = Storage.getProducts();
    const products = storedProducts;
    products.forEach((product) => UI.PopulateRows(product));
  }

  static PopulateRows(product) {
    //const id=0
    const list = document.getElementsByClassName("product-list")[0];
    list.innerHTML += `<tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.category}</td>
        <td class="qty-data">${product.quantity}</td>
    </tr>
    `;
  }
  static clearInputFields = () => {
    inputFields[1].value = "";
    inputFields[2].value = "";
    inputFields[3].value = "";
    inputFields[0].value = "";
  };

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
    let idField = overlayInputFields[0];
    let lastProduct =
      itemsFromLocalStorage.slice(-1)[0]; /*slice always returns an array */
    idField.addEventListener("input", () => {
      if (
        parseInt(idField.value) > 0 &&
        parseInt(idField.value) <= parseInt(lastProduct.id)
      ) {
        itemsFromLocalStorage.forEach((item) => {
          if (idField.value == item.id) {
            overlayInputFields[1].value = item.name;
            overlayInputFields[1].readOnly = true;
            overlayInputFields[2].value = item.quantity;
          }
        });
      } else {
        if (idField.value == 0) {
          this.showMessage("Enter a Valid ID", "error");
          idField.value = "";
          this.clearQtyFields();
        } else {
          idField.value = lastProduct.id;
          this.clearQtyFields();

          this.showMessage(
            `${lastProduct.id}` + " is the last product in stock",
            "error"
          );
        }
      }
    });
  };

  static clearQtyFields = () => {
    overlayInputFields[0].value = "";
    overlayInputFields[1].value = "";

    overlayInputFields[2].value = "";
  };
  static updateStock = () => {
    let productsFromLocalStorage = Storage.getProducts();
    const id = parseInt(overlayInputFields[0].value);
    const quantity = overlayInputFields[2].value.trim();
    let quantCells = Array.from(document.getElementsByClassName("qty-data"));
    quantCells.forEach((cell) => {
      let parentIndex = cell.closest("tr").rowIndex;
      if (id === parentIndex) {
        cell.innerHTML = quantity;
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
  };

  static show = () => {
    modal.classList.add("show");
    backDrop.classList.add("show-backdrop");
  };
  static removeOverly = () => {
    modal.classList.remove("show");
    backDrop.classList.remove("show-backdrop");
  };
}

class Products {
  constructor(name, description, category, quantity, id) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.quantity = quantity;
    this.id = id;
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
