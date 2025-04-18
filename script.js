const API_KEY='tagajFx4wcdwxCp1uGtiVLTBZAIQO5Et';
const url =  'https://api.nytimes.com/svc/books/v3';

document.addEventListener('DOMContentLoaded', async()=>{
    const categories =await getCategories();
    showCategories(categories);
})

function showError(message){
    const error = getElementById('error');
    error.textContent = message;
    error.classList.remove('hidden');
}

async function getCategories() { 
    try{
        const response = await fetch(`${url}/list/name.json?api-key=${API_KEY}`);//Lammada a las categorias de la API
        if(!response.ok) throw new Error(`No se encotraron las categorias`);

        const data = await response.json();
        return data.results;
        
    } catch (error) {
        console.error(error.message)
    }
};

async function getBooksByCategory(category) { 
    try{
        const response = await fetch(`${url}/list/current/${category}.json?api-key=${API_KEY}`);//Lammada a las categorias de la API
        if(!response.ok) throw new Error(`No se encotraron los libros`);

        const data = await response.json();
        return data.results.books;
        
    } catch (error) {
        console.error(error.message)
    }
};

//Funciones del DOM
async function handleCategoryClick(categoryName){
    const books = await getBooksByCategory(categoryName);
    showBooks(books);
};

function showBooks (books){
    const containerBooks = document.getElementById('book-list');
    containerBooks.innerHTML ='';

    books.forEach(book => {
        const card = document.createElement('article');
        card.classList.add('book-card');

        card.innerHTML = `
        <img src="${book.book_image} alt="Portada de ${book.title}"
        <h3>${book.title}</h3>
        <p><strong>Autor:</strong>${book.author}</p>
        <p><a href = "${book.amazon_product_url}" target="_blank">Comprar</a></p>
        `
        containerBooks.appendChild(card);
    });
};

function showCategories(categories){
    const container = document.getElementById('category-list');
    container.innerHTML = '';

    categories.forEach(cat => {
        const btn = document.createElement('botton');
        btn.classList.add('category-button');
        btn.textContent = cat.display_name;
        btn.addEventListener('click', ()=> handleCategoryClick(cat.list_name_encoded));
        container.appendChild(btn)

    })
};





