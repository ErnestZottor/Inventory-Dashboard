const inputFields = document.querySelectorAll(".form__field");
const form = document.getElementsByClassName("inventory-inputs")[0];
const notificationDiv = document.querySelector(".toast");
const tableRows = document.getElementsByClassName("tb-rows");
const submitBtn = document.querySelector("#submit");
let index = -1;
let newVal = {};

const init = () => {
  displayProducts();
  updateField();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateStock();
    showMessage("product updated successfully", "success");
  });
};

const updateField = () => {
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
          inputFields[2].value = item.description;
          inputFields[3].value = item.category;
          inputFields[4].value = item.quantity;
        }
      });
    } else {
      if (inputFields[0].value == 0) {
        showMessage("Enter a Valid ID", "error");
        inputFields[0].value = "";
      } else {
        inputFields[0].value = lastProduct.id;
        showMessage(
          `${lastProduct.id}` + " is the last product in stock",
          "error"
        );
        clearInputFields();
      }
    }
  });
  // clearInputFields();
};

const clearInputFields = () => {
  inputFields[1].value = "";
  inputFields[2].value = "";
  inputFields[3].value = "";
  inputFields[4].value = "";
  inputFields[0].value = "";
};
const updateStock = () => {
  let productsFromLocalStorage = Storage.getProducts();
  let tbRow = [...tableRows];

  const name = inputFields[1].value.trim();
  const description = inputFields[2].value.trim();
  const category = inputFields[3].value.trim();
  const quantity = inputFields[4].value.trim();
  const id = parseInt(inputFields[0].value);
  tbRow.forEach((row, tableIndex) => {
    if (tableIndex == id - 1) {
      row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${description}</td>
        <td>${category}</td>
        <td>${quantity}</td>
    
    `;
    }
  });
  productsFromLocalStorage.forEach((product) => {
    if (id == product.id) {
      product.name = name;
      product.description = description;
      product.category = category;
      product.quantity = quantity;
      localStorage.setItem(
        "products",
        JSON.stringify(productsFromLocalStorage)
      );
    }
  });
  clearInputFields();
};

const displayProducts = () => {
  const storedProducts = Storage.getProducts();
  storedProducts.forEach((product) => PopulateRows(product));
};

const PopulateRows = (product) => {
  const list = document.getElementsByClassName("product-list")[0];
  list.innerHTML += `<tr class="tb-rows">
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.category}</td>
        <td >${product.quantity}</td>
    </tr>
    `;
};

const showMessage = (message, state) => {
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
};

// ------------------------------------------Storage Class------------------------------------------------
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
