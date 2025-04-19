const API_KEY='';
const url ='https://api.nytimes.com/svc/books/v3';

function showLoader(show){
    const loader= document.getElementById('loader');
    if(show){
        loader.classList.remove('hidden');
    }else{
        loader.classList.add('hidden');
    }
}

function renderNavBar(view){
    const navBar =document.getElementById('navBar');
    navBar.innerHTML = '';

    if(view === 'categories'){
        navBar.innerHTML=`
        <select id="filter-req">
        <option value="">Frecuencia</option>
        <option value="weekly">Semanal</option>
        <option value="monthly">Mensual</option>
    </select>
    <input type="text" id="filter-cat" placeholder="Buscar categoria">
    <select id="sort-cat">
        <option value="">Ordenar por...</option>
        <option value="oldest-asc">Mas Antiguo</option>
        <option value="oldest-desc">Mas recientes</option>
        <option value="newes-asc">Agregado primero</option>
        <option value="newes-desc">Agregado último</option>
        <option value="name-az">Nombre A-Z</option>
        <option value="name-za">Nombre Z-A</option>
    </select>
        `;
    }else if(view ==='books'){
        navBar.innerHTML=``;
    }
}

document.addEventListener('DOMContentLoaded', async()=>{ //
    showLoader(true);
    const categories =await getCategories();
    showCategories(categories);
    showLoader(false);
})

function showError(message){
    const error = getElementById('error');
    error.textContent = message;
    error.classList.remove('hidden');
}

async function getCategories() { 
    try{
        const response = await fetch(`${url}/lists/names.json?api-key=${API_KEY}`);//Llamada a las categorias de la API
        if(!response.ok) throw new Error('No se encotraron las categorias');

        const data = await response.json();
        return data.results;
        
    } catch (error) {
        console.error(error.message)
    }
};

async function getBooksByCategory(category) { 
    try{
        const response = await fetch(`${url}/lists/current/${category}.json?api-key=${API_KEY}`);//Llamada a las categorias de la API
        if(!response.ok) throw new Error('No se encotraron los libros');

        const data = await response.json();
        return data.results.books;
        
    } catch (error) {
        console.error(error.message)
    }
};

//Funciones del DOM
async function handleCategoryClick(categoryName){
    showLoader(true);
    const containerCat= document.getElementById('category-list');
    containerCat.classList.add('hidden')
    const containerBooks2 = document.getElementById('book-list');
    const containerBack = document.getElementById('btnRegreso');
    containerBack.classList.remove('hidden');
    
     //Boton de regreso
    const backBtn = document.createElement('button');
    backBtn.textContent = 'Ir a categorias';
    backBtn.classList.add('category-button');
    backBtn.addEventListener('click', () => {
        showLoader(true);
       
        containerBooks2.classList.add('hidden');
        containerCat.classList.remove('hidden');
        containerBack.classList.add('hidden')
        backBtn.remove();
        showLoader(false);
    })

    const books = await getBooksByCategory(categoryName);
    showBooks(books);
    containerBooks2.classList.remove('hidden');
    containerBack.appendChild(backBtn);
    showLoader(false);
};

function showBooks (books){
    const containerBooks = document.getElementById('book-list');
    containerBooks.innerHTML ='';

    books.forEach((book, index) => {
        const card = document.createElement('article');
        card.classList.add('book-card');
        //(#${index})
        card.innerHTML = `
        <img src="${book.book_image}" alt="Portada de ${book.title}">
        <h3>${book.title} (#${index + 1})</h3>
        <p><strong>Autor:</strong>${book.author}</p>
        <p><strong>Semanas en la lista:</strong>${book.weeks_on_list}</p>
        <p><strong>Descripcion</strong>${book.description || 'Sin datos'}</p>
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

        //btn.textContent = cat.display_name; //colocar el nombre
        btn.innerHTML=`
        <strong>>${cat.display_name}</strong>
        <br>Fecha del libro mas antiguo: ${cat.oldest_published_date || 'Sin datos'}
        <br>Fecha del ultimo libro agregado: ${cat.newes_published_date || 'Sin datos'}
        <br>Frecuencia de actualizacion: ${cat.updated || 'Sin datos'}
        `
        btn.addEventListener('click', ()=> handleCategoryClick(cat.list_name_encoded));
        container.appendChild(btn)
        renderNavBar('categories');

    })
};

