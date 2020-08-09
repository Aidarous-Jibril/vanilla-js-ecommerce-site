//Contentful
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "l7cz0m51lguf",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "ySWEFDT3bhcloSp0m_vTYha0hcUgceoXeIKl5yScRoI",
});
console.log(client);
//Header variables
const cartBtn = document.querySelector(".cart-btn");
const cartTotalItems = document.querySelector(".cart-items");

//Section-b cart variables
const cartParent = document.querySelector(".cart-parent");
const cartDOM = document.querySelector(".cart");
const cartClose = document.querySelector(".close-cart");
const cartContent = document.querySelector(".cart-content");
const cartTotalPrice = document.querySelector(".cart-total");
const clearCartBtn = document.querySelector(".clear-cart-btn");
const cartProductCenterDOM = document.querySelector(".product-center");

//empty array
let cart = [];
//all bag buttons
let allBagBtn = [];

//UI Class
class UI {
  static displayProducts(products) {
    // cart items from lS
    const cartItemsfromLS = Store.getCartItems();
    console.log("cartItemsfromLS", cartItemsfromLS.length);
    //display products on the DOM
    let result = "";
    products.forEach((item) => {
      result += `
          <article class="product">
          <div class="img-container">
            <img src=${item.image} alt="Sample photo" />
            <button class="bag-btn fas fa-shopping-cart" data-id=${item.id}> Add to Cart</button>
          </div>
          <div class="text">
            <h4>${item.title}</h4>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Voluptates .
            </p>
            <h3>${item.price}</h3>
          </div>
        </article>
          `;
    });
    cartProductCenterDOM.innerHTML = result;
    // });
  }
  //Get All Buttons method
  static getCartButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    allBagBtn = buttons;
    buttons.forEach((btn) => {
      //   console.log(btn);
      let id = btn.dataset.id;
      let alreadyAdded = cart.find((item) => item.id === id);
      if (alreadyAdded) {
        // console.log("target is ", e);
        e.innerText = " Added";
        e.target.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = " Added";
        e.target.disabled = true;
        //Get product from products in localStorage
        let singleCartItem = { ...Store.getSingleProduct(id), amount: 1 };
        console.log(singleCartItem);
        //Add product to cart array which is empty from begining
        cart = [...cart, singleCartItem];
        //Save cart array to the localStorage
        Store.saveCartItemsToLS(cart);
        //Set total items & total price values to cart total Items & cart total price
        UI.setCartValues(cart);
        //Add and Display caritem to DOM
        UI.addCartItemToDom(singleCartItem);
        //Show cart method
        //UI.showCart();
      });
    });
  }

  //Set values to cartItems and CartTotal
  static setCartValues(cartItems) {
    let totalCartPrice = 0;
    let totalCartItems = 0;

    cartItems.map((item) => {
      totalCartPrice += item.price * item.amount;
      totalCartItems += item.amount;
      //   totalCartItems = item.reduce((total, item) => total + item.amount);
    });
    cartTotalPrice.innerText = parseFloat(totalCartPrice.toFixed());
    cartTotalItems.innerText = totalCartItems;
  }
  //Add Item to the cart content DOM
  static addCartItemToDom(item) {
    //create DOM elem dynamically
    let div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <img src=${item.image} alt="product" />
            <div>
              <h4>${item.title}</h4>
              <h3>$${item.price}</h3>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}> </i>
              <span class="item-amount">${item.amount}</span>
              <i class="fas fa-chevron-down" data-id=${item.id}> </i>
            </div>
        `;
    cartContent.appendChild(div);
  }

  //Show cart
  static toggleCart() {
    cartParent.classList.toggle("showCartParent");
    cartDOM.classList.toggle("showCart");
  }

  //Set up UI.setupCartApp to show when the DOM content loaded
  static setupCartApp() {
    //Get all cart items from local storage & asign them to the above cart array as the DOM get loaded
    cart = Store.getCartItems();
    console.log(cart);
    UI.setCartValues(cart);
    UI.populateCartItems(cart);
    cartBtn.addEventListener("click", UI.toggleCart);
    cartClose.addEventListener("click", UI.toggleCart);
  }

  //handing localstorage items over to addCartItemsToDOM method to show on cart content DOM & show/hide items in cart
  static populateCartItems(cartItems) {
    cartItems.forEach((item) => {
      UI.addCartItemToDom(item);
    });
  }
  //set up UI.setupClearCart
  static setupClearCart() {
    clearCartBtn.addEventListener("click", () => {
      //Remove cart items from LS
      const getCartItemsID = cart.map((item) => item.id);
      console.log("ids are", getCartItemsID);
      getCartItemsID.forEach((id) => UI.removeCart(id));
      //clear cart items from DOM
      while (cartContent.children.length > 0) {
        cartContent.removeChild(cartContent.children[0]);
      }
      console.log(cartContent.children);
    });
    //Remove clicked item by adding addEventlistener to the parent(cartContent) of the targeted element
    cartContent.addEventListener("click", (e) => {
      // console.log(e.target);
      //if the target el is remove. get it's 'remove-item' class
      if (e.target.classList.contains("remove-item")) {
        const toBeRemovedItem = e.target;
        const id = e.target.dataset.id;
        //remove whole item from cart
        UI.removeCart(id);
        //remove whole item from cart content DOM
        toBeRemovedItem.parentElement.parentElement.remove();
        //else if the target el is increase, get it's 'fa-chevron-up' class
      } else if (e.target.classList.contains("fa-chevron-up")) {
        let increaseItemAmount = e.target;
        const id = e.target.dataset.id;
        //find cart item with this id
        let tempItemAmount = cart.find((item) => item.id === id);
        //increase amount of that item by 1
        tempItemAmount.amount = tempItemAmount.amount + 1;
        //Update LS &  setting cart items values with lates cart items and their tot price
        Store.saveCartItemsToLS(cart);
        UI.setCartValues(cart);
        increaseItemAmount.nextElementSibling.innerText = tempItemAmount.amount;
      } else if (e.target.classList.contains("fa-chevron-down")) {
        let decreaseItemAmount = e.target;
        console.log(decreaseItemAmount);
        const id = e.target.dataset.id;
        //find cart item with this id
        let tempItemAmount = cart.find((item) => item.id === id);
        tempItemAmount.amount = tempItemAmount.amount - 1;

        if (tempItemAmount.amount > 0) {
          decreaseItemAmount.previousElementSibling.innerText =
            tempItemAmount.amount;
          Store.saveCartItemsToLS(cart);
          UI.setCartValues(cart);
        } else {
          decreaseItemAmount.parentElement.parentElement.remove();
          UI.removeCart(id);
        }
      }
    });
  }

  //remove cart items from cart
  static removeCart(id) {
    //filter out items with these id's from
    cart = cart.filter((item) => item.id !== id);
    console.log(cart);
    UI.setCartValues(cart);
    Store.saveCartItemsToLS(cart);
    //retitle buttons 'add to cart'
    // console.log(allBagBtn);
    const singleButton = allBagBtn.find((btn) => btn.dataset.id === id);
    singleButton.disabled = false;
    singleButton.innerHTML = " Add to Cart";
    UI.toggleCart();
  }
}

//Products Class for fetching products from json file
class Products {
  static async getProducts() {
    try {
      //contentful
      let contentful = await client.getEntries({
        content_type: "phonoHouseProducts",
      });
      // console.log(contentful);
      // let res = await fetch("products.json");
      // let data = await res.json();

      let products = contentful.items;
      products = products.map((product) => {
        const { title } = product.fields;
        const { id } = product.sys;
        const { price } = product.fields;
        const image = product.fields.image.fields.file.url;
        return { id, title, price, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//Store Class: Handles LocalStorage Class
class Store {
  //Save all products into localStorage
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  //Get single product fron localStorage
  static getSingleProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((prod) => prod.id === id);
  }

  //Get all cart items from localStorage
  static getCartItems() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }

  //Save all cart Items into LocalStorage
  static saveCartItemsToLS(cartItems) {
    let cart = Store.getCartItems();
    cart = [...cartItems];
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", () => {
  Products.getProducts()
    .then((products) => {
      UI.displayProducts(products);
      Store.saveProducts(products);
    })
    .then(() => {
      UI.getCartButtons();
      UI.setupCartApp();
      UI.setupClearCart();
    });
});
