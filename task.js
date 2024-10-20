// Fetch data from the API
async function fetchBooks(page = 1) {
    const response = await fetch(`https://gutendex.com/books/?page=${page}`);
    const data = await response.json();
    return data.results;  // Return the array of books
}

function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';  // Clear any previous results

    books.forEach(book => {
        const genres = book.subjects.join(', ');
        const authors = book.authors.map(author => author.name).join(', ');

        bookList.innerHTML += `
            <div class="book-item">
                <img src="${book.formats['image/jpeg']}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>Author(s): ${authors}</p>
                <p>Genre(s): ${genres}</p>
                <button class="wishlist-btn" data-id="${book.id}">❤️</button>
            </div>
        `;
    });
}

// Search functionality
const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
    displayBooks(filteredBooks);
});

const genreDropdown = document.getElementById('genre-dropdown');
genreDropdown.addEventListener('change', (e) => {
    const selectedGenre = e.target.value;
    const filteredBooks = books.filter(book => book.subjects.includes(selectedGenre));
    displayBooks(filteredBooks);
});

function handleWishlist(bookId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlist.includes(bookId)) {
        wishlist = wishlist.filter(id => id !== bookId);  // Remove from wishlist
    } else {
        wishlist.push(bookId);  // Add to wishlist
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Toggle wishlist on button click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('wishlist-btn')) {
        const bookId = e.target.getAttribute('data-id');
        handleWishlist(bookId);
        e.target.classList.toggle('liked');  // Update button style
    }
});

// Pagination logic
let currentPage = 1;

function loadNextPage() {
    currentPage++;
    fetchBooks(currentPage).then(displayBooks);
}

function loadPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchBooks(currentPage).then(displayBooks);
    }
}

// Event listeners for pagination buttons
document.getElementById('next-page').addEventListener('click', loadNextPage);
document.getElementById('prev-page').addEventListener('click', loadPreviousPage);

function showWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistBooks = books.filter(book => wishlist.includes(book.id));
    displayBooks(wishlistBooks);  // Reuse the display function
}

// Event listener for Wishlist button
document.getElementById('wishlist-btn').addEventListener('click', showWishlist);
