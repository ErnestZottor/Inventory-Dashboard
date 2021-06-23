const inputFields = document.querySelectorAll(".form__field");
const addBtn = document.querySelector(".add-btn");
const form = document.getElementsByClassName("inventory-inputs")[0];
const deleteBtn = document.getElementsByClassName("danger-btn");
//const inputFieldsArray = [...inputFields]
let id = 1;

const init = () => {
  UI.DisplayProducts();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = inputFields[0].value.trim();
    const description = inputFields[1].value.trim();
    const category = inputFields[2].value.trim();
    const quantity = inputFields[3].value.trim();

    // if (e.target.classList.contains("inventory-inputs") === true) {
    //   let prod = Storage.getProducts();

    //   prod.forEach((product) => {
    //     id = parseInt(product.id) + 1;
    //   });
    // }
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
  let deleteBtnArr = [...deleteBtn];
  deleteBtnArr.forEach((button) => {
    button.addEventListener("click", (event) => {
      UI.deleteItem(event);
      // console.log(event.target.dataset.id);
      // UI.reArrangeID();
      // window.onload();
      //   document.location.reload();
      //   return false;
      //UI.DisplayProducts();
      //   let id = event.target.parentElement.parentElement.rowIndex;
      //   console.log(id);
    });
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
        <td><button class="danger-btn" data-id=${product.id}></button></td>
    </tr>
    `;
  }

  //   static reArrangeID() {
  //     let idd = 0;
  //     let productsFromLocalStorage = Storage.getProducts();
  //     productsFromLocalStorage.forEach((product) => {
  //       product.id = idd += 1;
  //     });
  //     localStorage.setItem("products", JSON.stringify(productsFromLocalStorage));

  //   }
  static deleteItem(event) {
    let buttonClicked = event.target;
    let id = buttonClicked.closest("tr").rowIndex;

    buttonClicked.closest("tr").remove();
    UI.updateLocalStorage(id);
  }

  static updateLocalStorage(id) {
    let productsFromLocalStorage = Storage.getProducts();
    //let deletedItemId = event.target.closest("tr").rowIndex;
    //let id = event.target.parentElement.parentElement.rowIndex;
    // id = event.target.closest("tr").rowIndex;
    let idBeforeDeletedItem = id - 1;
    productsFromLocalStorage.forEach((product) => {
      if (id == product.id) {
        productsFromLocalStorage.splice(id - 1, 1);
        productsFromLocalStorage.forEach((prod) => {
          if (prod.id > idBeforeDeletedItem) {
            prod.id = idBeforeDeletedItem += 1;
          }
        });
        // console.log(productsFromLocalStorage);
        localStorage.setItem(
          "products",
          JSON.stringify(productsFromLocalStorage)
        );
      }
    });
  }
}

class Products {
  constructor(name, description, category, quantity, id) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.quantity = quantity;
    this.id = id;
  }
  getInputFieldValues() {}
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
