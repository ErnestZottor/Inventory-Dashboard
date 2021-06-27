const inputFields = document.querySelectorAll(".form__field");
const form = document.getElementsByClassName("inventory-inputs")[0];
const notificationDiv = document.querySelector(".toast");
const tableRows = document.getElementsByClassName("tb-rows");
const submitBtn = document.querySelector("#submit");
const quantUpdate = document.querySelector(".hidden");
const overlayInputFields = document.getElementsByClassName("text-field");
const backDrop = document.querySelector(".backdrop");
const quantityUpdate = document.querySelector(".quantity-update");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".exit");

const init = () => {
  displayProducts();
  updateField();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateStock();
    showMessage("product updated successfully", "success");
  });
  quantityUpdate.addEventListener("click", () => {
    show();
    updateOverlayFields();
  });
  quantUpdate.addEventListener("submit", (e) => {
    e.preventDefault();
    updateQtyStock();
    showMessage("quantity updated successfully", "success");
    removeOverly();
    clearQtyFields();
  });
  closeModalBtn.addEventListener("click", () => {
    removeOverly();
    clearQtyFields();
  });
};
// const checkIdValidity = (collections, i, obj) => {
//   let lastProduct = obj.slice(-1)[0];
//   collections[i].addEventListener("input", () => {
//     if (
//       parseInt(collections[i].value) > 0 &&
//       parseInt(collections[i].value) <= parseInt(lastProduct.id)
//     ) {
//       obj.forEach((item) => {
//         if (collections[i].value == item.id) {
//           for (let j = i + 1; j <= obj.lenght; j++) {
//             collections[j].value = 0;
//           }
//         }
//       });
//     }
//   });
// };
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
      }
      clearInputFields();
    }
  });
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
        <td class="qty-data">${quantity}</td>
    
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
        <td class="qty-data" >${product.quantity}</td>
    </tr>
    `;
};
const updateOverlayFields = () => {
  let itemsFromLocalStorage = Storage.getProducts();
  let idField = overlayInputFields[0];
  let lastProduct = itemsFromLocalStorage.slice(-1)[0];
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
        showMessage("Enter a Valid ID", "error");
        idField.value = "";
        clearQtyFields();
      } else {
        idField.value = lastProduct.id;
        clearQtyFields();

        showMessage(
          `${lastProduct.id}` + " is the last product in stock",
          "error"
        );
      }
    }
  });
};

const clearQtyFields = () => {
  overlayInputFields[0].value = "";
  overlayInputFields[1].value = "";

  overlayInputFields[2].value = "";
};
const updateQtyStock = () => {
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

const show = () => {
  modal.classList.add("show");
  backDrop.classList.add("show-backdrop");
};
const removeOverly = () => {
  modal.classList.remove("show");
  backDrop.classList.remove("show-backdrop");
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
