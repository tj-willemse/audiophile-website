import '../styles/modern.css';
import '../styles/style.css';
import '../styles/components/header.css';
import '../styles/components/home.css';
import '../styles/components/footer.css';
import '../styles/components/about-bottom.css';
import '../styles/components/three-items-shop.css';
import '../styles/components/headphones.css';
import '../styles/components/products.css';
import '../styles/components/mobile-nav.css';
import '../styles/components/cart-modal.css';
import '../styles/components/checkout.css';
import '../styles/util.css';

// get elements
const menuToggle = document.querySelector('.hamburger input');
const mobileView = document.querySelector('.mobile-menu-overlay');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.querySelector('.cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const removeCartItem = document.getElementById('removeAllBtn');

// create elements
let cart = [];

// functions

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay(); // Update the display with the loaded cart
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadCart(); // Load the cart from localStorage
  displayProductBySlug(); // Display the product based on the slug
});

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update quantity on the product page
window.changeProductQuantity = function (amount) {
  const quantityElement = document.getElementById('quantity');
  let currentQuantity = parseInt(quantityElement.textContent);
  currentQuantity = Math.max(1, currentQuantity + amount); // Ensure quantity doesn't drop below 1
  quantityElement.textContent = currentQuantity;
};

// Function to update quantity within the cart
window.changeCartQuantity = function (slug, amount) {
  const cartItem = cart.find((item) => item.slug === slug);
  if (cartItem) {
    cartItem.quantity = Math.max(1, cartItem.quantity + amount); // Ensure quantity doesn't drop below 1
    saveCart();
    updateCartDisplay(); // Update the display after changing quantity
  }
};

function addToCart(slug, quantity) {
  fetch('/data.json')
    .then((response) => response.json())
    .then((data) => {
      const product = data.find((item) => item.slug === slug);
      if (product) {
        const cartItem = {
          name: product.name,
          price: product.price,
          quantity: quantity,
          slug: slug,
          image: product.image.mobile,
        };

        // Check if item already exists in the cart
        const existingItem = cart.find((item) => item.slug === slug);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push(cartItem);
        }
        saveCart();
        updateCartDisplay();
      }
    })
    .catch((error) => console.error('Error fetching the JSON:', error));
}

function updateCartDisplay() {
  cartItemsContainer.innerHTML = ''; // Clear the cart display
  let totalPrice = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');
    cartItemDiv.innerHTML = `
      <div class="main-cart-box">
        <img class="cart-img" src="${item.image}" alt="${item.name}" />
        <div class="cart-title-price">
          <span class="cart-title">${item.name
            .replace(/(Headphones|Speakers|Earphones)/, ' ')
            .trim()}</span>
          <span class="cart-price">$${itemTotal.toFixed(2)}</span>
        </div>
        <div class="product-quantity-button-box-cart">
          <div class="quantity-counter">
            <button class="minus" onclick="changeCartQuantity('${
              item.slug
            }', -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="plus" onclick="changeCartQuantity('${
              item.slug
            }', 1)">+</button>
          </div>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemDiv);
  });

  cartCount.textContent = cart.length;
  cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// Function to fetch and display the product based on the slug
function displayProductBySlug() {
  const currentPage = window.location.pathname;
  const slug = currentPage.split('/').pop().replace('.html', '');

  fetch('/data.json')
    .then((response) => response.json())
    .then((data) => {
      const product = data.find((item) => item.slug === slug);
      if (product) {
        displayProduct(product);
      } else {
        console.error('Product not found for slug:', slug);
      }
    })
    .catch((error) => console.error('Error fetching the JSON:', error));
}
document.addEventListener('DOMContentLoaded', () => {
  displayProductBySlug();
});

// Function to display the product and related products
function displayProduct(product) {
  const container = document.getElementById('product-container');
  container.innerHTML = ''; // Clear any existing content

  const productDiv = document.createElement('div'); // Create a new div for the product

  productDiv.innerHTML = `
    <div class="product-main-box">
        <div class="product-image">
            <img src="${product.image.mobile}" alt="${
    product.name
  }" class="main-img">
            <img src="${product.image.tablet}" alt="${
    product.name
  }" class="main-img-tablet">
            <img src="${product.image.desktop}" alt="${
    product.name
  }" class="main-img-desktop">
        </div>
        <div class="product-text-content-box">
            <div class="product-title">
                <h2>${product.name}</h2>
            </div>
            <div class="product-description">
                <p class="product-description-text">${product.description}</p>
            </div>
            <div class="product-price">
                <p class="product-price-text">$${product.price}</p>
            </div>
            <div class="product-quantity-button-box">
                <div class="quantity-counter">
                    <button class="minus" onclick="changeProductQuantity(-1)">-</button>
                    <span id="quantity" class="quantity">1</span>
                    <button class="plus" onclick="changeProductQuantity(1)">+</button>
                </div>
            </div>
        </div>
    </div>

    <div class="product-details">
        <div class="features">
            <h1 class="features-title">Features</h1>
            <p class="features-paragraph">${product.features.replace(
              /\n/g,
              '<br>'
            )}</p>
        </div>
        <div class="includes-section">
            <h1 class="includes-title">In the box</h1>
            <ul class="includes-list">
                ${product.includes
                  .map(
                    (item) => `
                    <li><span class="item-quantity">${item.quantity}x</span> <span class="item-text"> ${item.item} </span></li>
                `
                  )
                  .join('')}
            </ul>
        </div>
    </div>

    <div class="gallery">
        <div class="gallery-images">
            <img src="${
              product.gallery.first.mobile
            }" alt="Gallery image 1" class="gallery-img mobile">
            <img src="${
              product.gallery.second.mobile
            }" alt="Gallery image 2" class="gallery-img mobile">
            <img src="${
              product.gallery.third.mobile
            }" alt="Gallery image 3" class="gallery-img mobile">
            <img src="${
              product.gallery.first.tablet
            }" alt="Gallery image 1" class="gallery-img tablet" style="display:none;">
            <img src="${
              product.gallery.second.tablet
            }" alt="Gallery image 2" class="gallery-img tablet" style="display:none;">
            <img src="${
              product.gallery.third.tablet
            }" alt="Gallery image 3" class="gallery-img tablet" style="display:none;">
            <img src="${
              product.gallery.first.desktop
            }" alt="Gallery image 1" class="gallery-img desktop" style="display:none;">
            <img src="${
              product.gallery.second.desktop
            }" alt="Gallery image 2" class="gallery-img desktop" style="display:none;">
            <img src="${
              product.gallery.third.desktop
            }" alt="Gallery image 3" class="gallery-img desktop" style="display:none;">
        </div>
    </div>
  `;

  // Add the "Add to Cart" button programmatically
  const addToCartButton = document.createElement('button');
  addToCartButton.classList.add('button1');
  addToCartButton.textContent = 'Add to cart';

  // Get quantity from the span with id 'quantity'
  addToCartButton.addEventListener('click', () => {
    const quantityElement = productDiv.querySelector('#quantity');
    const selectedQuantity = parseInt(quantityElement.textContent); // Parse the current quantity
    addToCart(product.slug, selectedQuantity);
  });

  productDiv
    .querySelector('.product-quantity-button-box')
    .appendChild(addToCartButton);

  container.appendChild(productDiv); // Append the entire productDiv

  if (product.others && product.others.length > 0) {
    displayOthers(product.others);
  }
}

// Function to display related products
function displayOthers(others) {
  const container = document.getElementById('product-container');

  const othersSection = document.createElement('div');
  othersSection.classList.add('others-section');

  othersSection.innerHTML =
    '<h1 class="product-others-title">You may also like</h1>';

  const productBoxesContainer = document.createElement('div');
  productBoxesContainer.classList.add('product-boxes-container');

  others.forEach((other) => {
    if (!other.image || !other.image.mobile) {
      console.error('Invalid related product data:', other);
      return; // Skip if invalid
    }

    const otherDiv = document.createElement('div');
    otherDiv.classList.add('other-box');

    otherDiv.innerHTML = `
 
    <div class="other-main-box">

  
      <div class="other-image">
          <img src="${other.image.mobile}" alt="${other.name}" class="responsive-img xs">
          <img src="${other.image.tablet}" alt="${other.name}" class="responsive-img md hidden">
          <img src="${other.image.desktop}" alt="${other.name}" class="responsive-img lg hidden">
      </div>

      <div class="other-title">
          <h2 class="other-title-text">${other.name}</h2>
      </div>

      <a href ="/product-${other.slug}.html">
      <button class="button1" >See product</button>
      </a>
      </div>
    `;
    productBoxesContainer.appendChild(otherDiv);
  });
  othersSection.appendChild(productBoxesContainer);
  container.appendChild(othersSection);
}

function displayCart() {
  if (cartModal.style.display === 'block') {
    cartModal.style.display = 'none';
  } else {
    cartModal.style.display = 'block';
  }
}
function clearCart() {
  cart = [];
  saveCart();
  updateCartDisplay();
}

// event listeners

// Menu toggle button
menuToggle.addEventListener('change', function () {
  if (this.checked) {
    mobileView.style.display = 'block';
    const otherContent = document.querySelectorAll('.content'); // Adjust the selector as needed
    otherContent.forEach((content) => {
      content.style.display = 'none';
    });
  } else {
    mobileView.style.display = 'none';
    const otherContent = document.querySelectorAll('.content'); // Adjust the selector as needed
    otherContent.forEach((content) => {
      content.style.display = 'block';
    });
  }
});

// cart toggle buttons
cartIcon.addEventListener('click', displayCart);
removeCartItem.addEventListener('click', clearCart);
