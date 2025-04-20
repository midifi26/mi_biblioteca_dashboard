//const url_github_pages = 'https://midifi26.github.io/mi_biblioteca_dashboard/';
const API_KEY='tagajFx4wcdwxCp1uGtiVLTBZAIQO5Et';
const BASE_URL ='https://api.nytimes.com/svc/books/v3';

let allCat=[];
let allBooks=[];
let currentPage = 1;
const booksPPage = 5;

document.addEventListener('DOMContentLoaded', async()=>{
    showLoader(true);
    //antes
    //const categories = await getCategories();
    //showCategories(categories);
    //despues
    allCat = await getCategories();
    showCategories(allCat);
    showLoader(false);
});
function showLoader(show){
    const loader = document.getElementById('loader');
    if(show){
        loader.classList.remove('hidden');
    } else{
        loader.classList.add('hidden');
    }
}
function renderNavbar(view){
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = '';
    if (view == 'categories')
    {
        navbar.innerHTML = `
        <select id="filter-freq">
            <option value="">Frecuencia</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
        </select>
        <input type="text" id="filter-cat" placeholder="Buscar categoría">
        <select id="sort-cat">
            <option value="">Ordenar por...</option>
            <option value="oldest-asc">Más antiguo</option>
            <option value="oldest-desc">Más reciente</option>
            <option value="newest-asc">Agregado primero</option>
            <option value="newest-desc">Agregado último</option>
            <option value="name-az">Nombre A-Z</option>
            <option value="name-za">Nombre Z-A</option>
        </select>
        <button id="reset">Resetear orden</button>
        `;
        attachCatFilters(); //nuevo
    }
    else if (view == 'books')
    {
        navbar.innerHTML = `
        <input type="text" id="book-search" placeholder="Buscar por titulo">
        <select id="book-sort">
            <option value="">Ordenar por...</option>
            <option value="title-az">Título A-Z</option>
            <option value="title-za">Título Z-A</option>
            <option value="author-az">Autor A-Z</option>
            <option value="author-za">Autor Z-A</option>
        </select>
        <button id="reset">Resetear orden</button>
        `;
        //boton de regreso
        const backBtn = document.createElement('button');
        backBtn.textContent = 'Ir a categorías';
        backBtn.classList.add('category-button');
        backBtn.addEventListener('click', () => {
            showLoader(true);
            document.getElementById('book-list').classList.add('hidden');
            document.getElementById('category-list').classList.remove('hidden');
            //containerBack.classList.add('hidden');
            renderNavbar('categories');
            backBtn.remove();
            showLoader(false);  
        });
        navbar.appendChild(backBtn);
        attachBookFilters(); //nuevo
    }
}
function applyCategoryFilters(){//nuevo
    const freq = document.getElementById('filter-freq').value.toLowerCase();
    const search = document.getElementById('filter-cat').value.toLowerCase();
    const sort = document.getElementById('sort-cat').value;
    const reset = document.getElementById('reset');
    let filtered = [...allCat];
    // Filtrado por frecuencia
    if (freq) {
       filtered = filtered.filter(cat => cat.updated.toLowerCase() === freq);
    }
    // Búsqueda por nombre
    if (search) {
       filtered = filtered.filter(cat =>
           cat.display_name.toLowerCase().includes(search)
       );
    }
    // Ordenamiento
    switch (sort) {
        case 'oldest-asc':
            filtered.sort((a, b) => new Date(a.oldest_published_date) - new Date(b.oldest_published_date));
        break;
        case 'oldest-desc':
            filtered.sort((a, b) => new Date(b.oldest_published_date) - new Date(a.oldest_published_date));
        break;
        case 'newest-asc':
            filtered.sort((a, b) => new Date(a.newest_published_date) - new Date(b.newest_published_date));
        break;
        case 'newest-desc':
            filtered.sort((a, b) => new Date(b.newest_published_date) - new Date(a.newest_published_date));
        break;
        case 'name-az':
            filtered.sort((a, b) => a.display_name.localeCompare(b.display_name));
        break;
        case 'name-za':
            filtered.sort((a, b) => b.display_name.localeCompare(a.display_name));
        break;
    }
    //resetear
    if(reset)
        {
            showCategories(allCat);
        }
    // Mostrar categorías filtradas y ordenadas
    showCategories(filtered);
}
function attachCatFilters(){ //nuevo
    const freqSelect = document.getElementById('filter-freq');
    const searchInput = document.getElementById('filter-cat');
    const sortSelect = document.getElementById('sort-cat');
    const reset = document.getElementById('reset');
    freqSelect.addEventListener('change', applyCategoryFilters);
    searchInput.addEventListener('input', applyCategoryFilters);
    sortSelect.addEventListener('change', applyCategoryFilters);
    reset.addEventListener('click', applyCategoryFilters);
}
function applyBookFilters(){ //nuevo
    const search = document.getElementById('book-search').value.toLowerCase();
    const sort = document.getElementById('book-sort').value;
    const reset = document.getElementById('reset');
    let filteredBooks = [...allBooks];
    // Búsqueda por título
    if (search) {
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(search)
        );
    }
    // Ordenamiento
    switch (sort) {
        case 'title-az':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-za':
            filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'author-az':
            filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case 'author-za':
            filteredBooks.sort((a, b) => b.author.localeCompare(a.author));
            break;
    }


    //Resetear
    if(reset){
        showBooks(allBooks);
    };
    showBooks(filteredBooks); // Mostrar libros después de aplicar los filtros
}
function attachBookFilters(){
    const searchInput = document.getElementById('book-search');
    const sortSelect = document.getElementById('book-sort');
    const reset =document.getElementById('reset');
    searchInput.addEventListener('input', applyBookFilters);
    sortSelect.addEventListener('change', applyBookFilters);
    reset.addEventListener('click', applyBookFilters);
}
function showError(message){
    const error = document.getElementById('error');
    error.textContent = message;
    error.classList.remove('hidden');
}
async function getCategories(){ //Llamada a las categorías de libros
    try{
        const response = await fetch(`${BASE_URL}/lists/names.json?api-key=${API_KEY}`);
        if(!response.ok) throw new Error('No se cargaron las categorías');
        const data = await response.json();
        return data.results;
    } catch(error){
        showError(error.message);
    }
}
async function getBooksByCategory(category){ //Llamada a los libros por categorías
    try
    {
        const response = await fetch(`${BASE_URL}/lists/current/${category}.json?api-key=${API_KEY}`);
        if(!response.ok) throw new Error('No se cargaron los libros');
        const data = await response.json();
        return data.results.books;
    } catch(error){
        showError(error.message);
    }
}
//Funciones del DOM
function showBooks(books){
    const containerBooks = document.getElementById('book-list');
    containerBooks.innerHTML = '';
    allBooks = books;
    currentPage=1;
    

    books.forEach((book, index) =>{
        const card = document.createElement('article');
        card.classList.add('book-card');
        card.innerHTML = `
        <img src="${book.book_image}" alt="PORTADA DE ${book.title}" title="PORTADA DE ${book.title}">
        <h3>${book.title} (#${book.rank})</h3>
        <p><strong>Autor:</strong> ${book.author}</p>
        <p><strong>Semanas en la lista:</strong> ${book.weeks_on_list}</p>
        <p><strong>Descripción:</strong> ${book.description || 'Sin datos'}</p>
        <p><a href="${book.amazon_product_url}" target="_blank">Comprar</a></p>
        `;
        containerBooks.appendChild(card);
    });
    
    renderNavbar('books');
};


async function handleCategoryClick(categoryName){
    showLoader(true);
    const containerCat = document.getElementById('category-list');
    containerCat.classList.add('hidden');
    const containerBooks = document.getElementById('book-list');
    //const containerBack = document.getElementById('btnRegreso');
    //containerBack.classList.remove('hidden');
    //const navbar = document.getElementById('navbar');
    const books = await getBooksByCategory(categoryName);
    allBooks = books; //nuevo
    showBooks(books);
    containerBooks.classList.remove('hidden');
    //containerBack.appendChild(backBtn);
    showLoader(false);
}
function showCategories(categories){
    const container = document.getElementById('category-list');
    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.classList.add('category-button');
        //btn.textContent = cat.display_name;
        btn.innerHTML = `
            <strong>${cat.display_name}</strong>
            <br>Fecha del libro más antiguo: ${cat.oldest_published_date || 'Sin datos'}
            <br>Fecha del último libro agregado: ${cat.newest_published_date || 'Sin datos'}
            <br>Frecuencia de actualización: ${cat.updated || 'Sin datos'}
        `; 
        btn.addEventListener('click', () => handleCategoryClick(cat.list_name_encoded));
        container.appendChild(btn);
    });
    renderNavbar('categories');
    attachCatFilters();
}
//Funciones de la compaginación.
function displayBooksPage(page){
    const bookList= document.getElementById('book-list');
    const start = (page - 1) * booksPPage;
    const end = start + booksPPage;
    const booksToShow = allBooks.slice(start,end);

    bookList.innerHTML= '';

    booksToShow.forEach(book=>{
        const card = showBooks(book);
        bookList.appendChild(card);
    });

    renderPButton();
};

function renderPButton(){
    const pagination= document.getElementById('pagination');
    pagination.innerHTML='';

    const totalPages = Math.ceil(allBooks.length / booksPPage);

    for(let i = 1; i<totalPages; i++){
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('pagination-button');

        if(i=== currentPage){
            btn.classList.add('active');
        }


        btn.addEventListener('click',()=>{
            currentPage = i;
            displayBooksPage(currentPage);
        });

        pagination.appendChild(btn);
    }
}

