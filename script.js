const container = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const categoryContainer = document.getElementById('category-container');


let allProducts = []; // all products from the API
let currentPage = 1; // Current page number
const productsPerPage = 8; // Products to display per page
let categories = []; // List of categories - NEW
let selectedCategory = 'all'; // Selected category - NEW


// Fetch products from the DummyJSON API
async function loadProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=100'); // Get data from API
    const data = await response.json(); // Convert response to JSON
    allProducts = data.products; // Save products to a variable
    displayProducts(); // Show products on the page
    getCategories(); // Generate categories - NEW

  } catch (error) {
    console.error('Error fetching products:', error); // Handle any errors
  }
}
// Extract unique categories from product list - NEW
function getCategories() {
  const allCats = new Set(allProducts.map(p => p.category)); // Get all unique categories
  categories = ['all', ...allCats]; // Include 'all' as default
  renderCategoryButtons(); // Display buttons
}

// Render buttons for each category - NEW
function renderCategoryButtons() {
  categoryContainer.innerHTML = ''; // Clear previous buttons
  categories.forEach(cat => {
    const btn = document.createElement('button'); // Create button
    btn.textContent = cat.toUpperCase(); // Button label
    btn.className = 'category-button'; // Button style
    if (cat === selectedCategory) btn.classList.add('active'); // Highlight selected - NEW

    btn.addEventListener('click', () => { // On click handler - NEW
      selectedCategory = cat; // Update selected category
      currentPage = 1; // Reset page
      displayProducts(); // Refresh products
    });

    categoryContainer.appendChild(btn); // Add to container
  });
}


// Display products based on currentPage and search query
function displayProducts() {
  const searchTerm = searchInput.value.toLowerCase(); // Get search term in lowercase
  const filtered = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm)
  ); // Filter products by title

  // Calculate how many pages we need in total
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  // Make sure currentPage is not less than 1
  if (currentPage < 1) {
    currentPage = 1;
  }

  // Make sure currentPage is not more than totalPages
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const currentProducts = filtered.slice(start, end); // Get products for current page

  container.innerHTML = ''; // Clear container

  currentProducts.forEach(product => {
    // Create card element
    const card = document.createElement('div');
    card.className = 'product-card';

    // Shorten description if needed
    let shortDescription = product.description;
    if (shortDescription.length > 60) {
      shortDescription = shortDescription.slice(0, 60) + '...';
    }

    // Add content to card
    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" />
      <h2>${product.title}</h2>
      <p>${shortDescription}</p>
      <div class="price">$${product.price}</div>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    // Add card to container
    container.appendChild(card);
  });

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

    renderCategoryButtons();
}

searchInput.addEventListener('input', () => {
  currentPage = 1; // Reset to page 1 on new search
  displayProducts();
});

prevBtn.addEventListener('click', () => {
  currentPage--;
  displayProducts();
});

nextBtn.addEventListener('click', () => {
  currentPage++;
  displayProducts();
});

// Cart data
let cart = [];

// DOM elements for cart
const cartList = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');

// Function to add a product to the cart
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId); // Find product by ID
  const itemInCart = cart.find(item => item.id === productId);

  if (itemInCart) {
    itemInCart.quantity += 1; // Increase quantity if already in cart
  } else {
    cart.push({ ...product, quantity: 1 }); // Add new item with quantity
  }

  updateCart(); // Refresh cart 
}

// Function to remove a product from the cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId); // Remove item
  updateCart();
}

// Function to update cart display and total
function updateCart() {
  cartList.innerHTML = ''; // Clear list

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const li = document.createElement('li');
    li.innerHTML = `
      ${item.title} x${item.quantity}
      <button onclick="removeFromCart(${item.id})">🗑</button>
    `;

    cartList.appendChild(li);
  });

  totalPriceElement.textContent = total.toFixed(2); // Update total price
}

// Call loadProducts when page loads
loadProducts();