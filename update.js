const inputFields = document.querySelectorAll(".form__field");
const form = document.getElementsByClassName("inventory-inputs")[0];

let index = -1;
let newVal = {};

const init = () => {
  updateField();
  document.querySelector(".update").addEventListener("click", (e) => {
    updateStock();
  });
};

const updateField = () => {
  inputFields[0].addEventListener("input", () => {
    let itemsFromLocalStorage = Storage.getProducts();
    itemsFromLocalStorage.forEach((item) => {
      if (inputFields[0].value == item.id) {
        inputFields[1].value = item.name;
        // inputFields[1].readOnly = true;
        inputFields[2].value = item.quantity;
        inputFields[3].value = item.category;
        inputFields[4].value = item.description;
      }
    });
  });
};

const updateStock = () => {
  let productsFromLocalStorage = Storage.getProducts();

  const name = inputFields[1].value.trim();
  const description = inputFields[4].value.trim();
  const category = inputFields[3].value.trim();
  const quantity = inputFields[2].value.trim();
  const id = parseInt(inputFields[0].value);

  productsFromLocalStorage.forEach((product) => {
    if (id == product.id) {
      product.name = name;
      let productQty = product.quantity;
      product.description = description;
      product.category = category;
      product.quantity = parseInt(quantity) + parseInt(productQty);
      localStorage.setItem(
        "products",
        JSON.stringify(productsFromLocalStorage)
      );
    }
  });
};

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

//------------------------------------ updateStock    ----------------------------------------
//   let newVall = {
//     name: name,
//     description: description,
//     category: category,
//     quantity: quantity,
//     id: id,
//   };

//   productsFromLocalStorage.splice(id - 1, 1, newVall);
