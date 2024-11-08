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
const checkoutSummaryContainer = document.getElementById('summary-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const summaryTotalPrice = document.getElementById('summary-total-price');
const removeCartItem = document.getElementById('removeAllBtn');
const vatNumber = document.getElementById('summary-vat');
const grandNumber = document.getElementById('summary-grand-total');
const eMoneyBox = document.querySelector('.e-money-main-box');
const eRadio = document.getElementById('e-money-radio');
const cashRadio = document.getElementById('cash-on-radio');
const cashBox = document.querySelector('.cash-on-delivery-main-box');
const checkoutButton = document.getElementById('summaryBtn');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const phoneNumberInput = document.getElementById('phone-number-input');
const addressInput = document.getElementById('address-input');
const zipCodeInput = document.getElementById('zip-code-input');
const cityInput = document.getElementById('city-input');
const countryInput = document.getElementById('country-input');
const successModal = document.querySelector('.success-modal-main-box');
const checkoutSectionMain = document.querySelector('.checkout-section-main');
const successOrderItems = document.getElementById('success-order-items');
const modalGrandTotal = document.getElementById('modal-grand-total');
const backHomeButton = document.getElementById('back-home-button');

// create elements
let cart = [];
const shippingCost = 50;

// functions

function updateSuccessModal() {
  successOrderItems.innerHTML = '';
  let totalPrice = 0;
  const grandTotalValue = grandNumber.textContent;
  modalGrandTotal.textContent = grandTotalValue;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    const summaryItemDiv = createItemElement(item, itemTotal);
    successOrderItems.appendChild(summaryItemDiv);
  });
}

function createItemElement(item, itemTotal) {
  const summaryItemDiv = document.createElement('div');
  summaryItemDiv.classList.add('summary-items');
  summaryItemDiv.innerHTML = `
    <div class="main-summary-box">
      <div class="summary-img-title-box">
        <img class="success-img-items" src="${item.image}" alt="${item.name}" />
        <div class="summary-title-img-price">
          <span class="cart-title">${item.name
            .replace(/(Headphones|Speakers|Earphones)/, ' ')
            .trim()}</span>
          <span class="cart-price">$${Math.round(itemTotal)}</span>
        </div>
      </div>
      <span class="summary-quantity-display">x ${item.quantity}</span>
    </div>
     
  `;
  return summaryItemDiv;
}

function validateForms() {
  let isValid = true;

  function validateField(inputElement, regex, fieldName, errorMessage) {
    if (!regex.test(inputElement.value.trim())) {
      isValid = false;
      inputElement.style.border = '1px solid red';
      console.log(`${fieldName} is not valid. ${errorMessage}`);
    } else {
      isValid = true;
      inputElement.style.border = '1px solid green';
      console.log(`${fieldName} is valid`);
    }
  }
  validateField(
    phoneNumberInput,
    /^\d{10}$/,
    'Phone number',
    'Must be exactly 10 digits and contain only numbers.'
  );
  validateField(
    emailInput,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'Email',
    'Must be a valid email format.'
  );
  validateField(
    zipCodeInput,
    /^\d{4,5}(?:[-\s]?\d{4})?$/,
    'Zip code',
    'Must be 4 or 5 digits, optionally followed by a 4-digit extension.'
  );

  function validateInput(inputElement, fieldName) {
    if (inputElement.value.trim() === '') {
      isValid = false;
      inputElement.style.border = '1px solid red';
      console.log(`${fieldName} cannot be empty`);
    } else {
      inputElement.style.border = '1px solid green';
      console.log(`${fieldName} is valid`);
    }
  }
  validateInput(addressInput, 'Address');
  validateInput(cityInput, 'City');
  validateInput(countryInput, 'Country');
  validateInput(nameInput, 'Name');

  if (isValid) {
    successModalActive();
  }
}

function successModalActive() {
  successModal.style.display = 'block';
  checkoutSectionMain.style.display = 'none';

  // email content section
  const userEmail = emailInput.value;
  const orderDetails = 'Happy Shopping :)';

  fetch('/api/send-confirmation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEmail, orderDetails }),
  })
    .then((response) => {
      if (response.ok) {
        console.log('Confirmation email sent successfully');
      } else {
        console.error('Error sending confirmation email');
      }
    })
    .catch((error) => console.error('Error:', error));

  updateSuccessModal();
}

function radioExsist() {
  if (eRadio && cashRadio && eMoneyBox && cashBox) {
    eRadio.addEventListener('change', togglePaymentFields);
    cashRadio.addEventListener('change', togglePaymentFields);

    togglePaymentFields();
  }
}

function togglePaymentFields() {
  cashBox.style.display = cashRadio.checked ? 'flex' : 'none';
  eMoneyBox.style.display = eRadio.checked ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', radioExsist);

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  displayProductBySlug();
});

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

window.changeProductQuantity = function (amount) {
  const quantityElement = document.getElementById('quantity');
  let currentQuantity = parseInt(quantityElement.textContent);
  currentQuantity = Math.max(1, currentQuantity + amount);
  quantityElement.textContent = currentQuantity;
};

window.changeCartQuantity = function (slug, amount) {
  const cartItem = cart.find((item) => item.slug === slug);
  if (cartItem) {
    cartItem.quantity = Math.max(1, cartItem.quantity + amount);
    saveCart();
    updateCartDisplay();
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

function calculateTotalPrice() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartDisplay() {
  cartItemsContainer.innerHTML = '';
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
         <span class="cart-price">$${Math.round(itemTotal)}</span>
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
  cartTotalPrice.textContent = `$${calculateTotalPrice().toFixed(2)}`;
  updateSummaryDisplay();
}

function updateSummaryDisplay() {
  if (!checkoutSummaryContainer) {
    return;
  }

  checkoutSummaryContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    const summaryItemDiv = document.createElement('div');
    summaryItemDiv.classList.add('summary-items');
    summaryItemDiv.innerHTML = `
      <div class="main-summary-box">
        <div class="summary-img-title-box">
          <img class="cart-img" src="${item.image}" alt="${item.name}" />
          <div class="summary-title-img-price">
            <span class="cart-title">${item.name
              .replace(/(Headphones|Speakers|Earphones)/, ' ')
              .trim()}</span>
            <span class="cart-price">$${Math.round(itemTotal)}</span>
          </div>
        </div>
        <span class="summary-quantity-display">x ${item.quantity}</span>
      </div>
    `;
    checkoutSummaryContainer.appendChild(summaryItemDiv);
  });

  if (summaryTotalPrice) {
    summaryTotalPrice.textContent = `$${Math.round(calculateTotalPrice())}`;
  }

  const totalVat = calculateTotalVat(totalPrice);
  if (vatNumber) {
    vatNumber.textContent = `$${Math.round(totalVat)}`;
  }

  updateGrandNumber(totalPrice);
}

function updateGrandNumber(total) {
  grandNumber.textContent = calculateGrandTotal(total);
}

function calculateGrandTotal(total) {
  return `$${total + shippingCost}`;
}

function calculateTotalVat(total) {
  return (total * 20) / 100;
}

function displayProductBySlug() {
  const currentPage = window.location.pathname;
  const slug = currentPage.split('/').pop().replace('.html', '');

  fetch('/data.json')
    .then((response) => response.json())
    .then((data) => {
      const product = data.find((item) => item.slug === slug);
      if (product) {
        displayProduct(product);
      }
    })
    .catch((error) => console.error('Error fetching the JSON:', error));
}
document.addEventListener('DOMContentLoaded', () => {
  displayProductBySlug();
});

function displayProduct(product) {
  const container = document.getElementById('product-container');
  container.innerHTML = '';
  const productDiv = document.createElement('div');
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

  const addToCartButton = document.createElement('button');
  addToCartButton.classList.add('button1');
  addToCartButton.textContent = 'Add to cart';

  addToCartButton.addEventListener('click', () => {
    const quantityElement = productDiv.querySelector('#quantity');
    const selectedQuantity = parseInt(quantityElement.textContent); // Parse the current quantity
    addToCart(product.slug, selectedQuantity);
    displayCart();
  });

  productDiv
    .querySelector('.product-quantity-button-box')
    .appendChild(addToCartButton);

  container.appendChild(productDiv);

  if (product.others && product.others.length > 0) {
    displayOthers(product.others);
  }
}

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
  displayCart();
}

// event listeners

// Menu toggle button
menuToggle.addEventListener('change', function () {
  if (this.checked) {
    mobileView.style.display = 'block';
    const otherContent = document.querySelectorAll('.content');
    otherContent.forEach((content) => {
      content.style.display = 'none';
    });
  } else {
    mobileView.style.display = 'none';
    const otherContent = document.querySelectorAll('.content');
    otherContent.forEach((content) => {
      content.style.display = 'block';
    });
  }
});

// cart toggle buttons
cartIcon.addEventListener('click', displayCart);
removeCartItem.addEventListener('click', clearCart);

document.addEventListener('DOMContentLoaded', function () {
  if (checkoutButton) {
    checkoutButton.addEventListener('click', validateForms);
  }

  if (backHomeButton) {
    backHomeButton.addEventListener('click', clearCart);
  }
});
