const inputFields = document.querySelectorAll(".form__field");
const form = document.getElementsByClassName("inventory-inputs")[0];

let index = -1;
let newVal = {};

const init = () => {
  displayProducts();
  updateField();
  //   updateStock();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
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
        inputFields[2].value = item.description;
        inputFields[3].value = item.category;
        inputFields[4].value = item.quantity;
      }
    });
  });
};

const updateStock = () => {
  let productsFromLocalStorage = Storage.getProducts();

  const name = inputFields[1].value.trim();
  const description = inputFields[2].value.trim();
  const category = inputFields[3].value.trim();
  const quantity = inputFields[4].value.trim();
  const id = parseInt(inputFields[0].value);

  productsFromLocalStorage.forEach((product) => {
    if (id == product.id) {
      product.name = name;
      let productQty = product.quantity;
      product.description = description;
      product.category = category;
      product.quantity = quantity;
      localStorage.setItem(
        "products",
        JSON.stringify(productsFromLocalStorage)
      );
    }
  });
  location.reload();
};

const displayProducts = () => {
  const storedProducts = Storage.getProducts();
  // const products = storedProducts;
  storedProducts.forEach((product) => PopulateRows(product));
};

const PopulateRows = (product) => {
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
