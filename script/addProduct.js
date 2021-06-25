let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
const inputFields = document.querySelectorAll(".form__field");
const addBtn = document.querySelector(".add-btn");
const form = document.getElementsByClassName("inventory-inputs")[0];
const deleteBtn = document.getElementsByClassName("danger-btn");
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
    // UI.handleDeletion();
    UI.PopulateRows(product);
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
        <td>${product.quantity}</td>
    </tr>
    `;
  }

  // static deleteItem(event) {
  //   let buttonClicked = event.target;
  //   let id = buttonClicked.closest("tr").rowIndex;

  //   buttonClicked.closest("tr").remove();
  //   UI.updateLocalStorage(id);
  // }

  // static updateLocalStorage(id) {
  //   let productsFromLocalStorage = Storage.getProducts();
  //   let idBeforeDeletedItem = id - 1;
  //   productsFromLocalStorage.forEach((product) => {
  //     if (id == product.id) {
  //       productsFromLocalStorage.splice(id - 1, 1);
  //       productsFromLocalStorage.forEach((prod) => {
  //         if (prod.id > idBeforeDeletedItem) {
  //           prod.id = idBeforeDeletedItem += 1;
  //         }
  //       });
  //       localStorage.setItem(
  //         "products",
  //         JSON.stringify(productsFromLocalStorage)
  //       );
  //     }
  //   });
  //   location.reload();
  // }
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
