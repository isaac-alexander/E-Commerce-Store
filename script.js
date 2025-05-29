const container = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

let allProducts = []; // all products from the API
let currentPage = 1; // Current page number
const productsPerPage = 8; // Products to display per page

// Fetch products from the DummyJSON API
fetch('https://dummyjson.com/products?limit=100')
  .then(response => response.json())
  .then(data => {
    allProducts = data.products; // Store all products
    displayProducts(); // Display products on load
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });

// Display products based on currentPage and search query
function displayProducts() {
  const searchTerm = searchInput.value.toLowerCase(); // Get search term in lowercase
  const filtered = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm)
  ); // Filter products by title

  const totalPages = Math.ceil(filtered.length / productsPerPage); // Calculate total pages
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

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
    `;

    // Add card to container
    container.appendChild(card);
  });

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
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
