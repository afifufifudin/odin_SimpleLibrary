const modalOpen = 'modal-is-open';
const modalOpening = 'modal-is-opening';
const modalClosing = 'modal-is-closing';
let modalCheck = null;
let timeDuration = 500;

// Book & Library Logic

let myLibrary = [];
let newBook;

class Book {
  constructor(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

const generateBook = () =>{
  const newTitle = document.querySelector("#title_new").value;
  const newAuthor = document.querySelector("#author_new").value;
  const newPages = document.querySelector("#pages_new").value;
  const newRead = document.querySelector("#read_new").checked;

  const newBook = new Book(newTitle, newAuthor, newPages, newRead);
  return newBook;
}

const addingBook = (e)=>{
  e.preventDefault()
  newBook = generateBook();
  // console.log(newBook)
  myLibrary.push(newBook);
  // console.log(myLibrary)

  render();
  saveLocal();
  closeModal();
}

// Update
const saveLocal = () =>{
  localStorage.setItem(`myLibrary`, JSON.stringify(myLibrary));
}

const loadLocal = () =>{
  if(!localStorage.myLibrary){
    return;
  }else{
    let objects = localStorage.getItem('myLibrary');
    objects = JSON.parse(objects);
    myLibrary = objects;
  }
}

// Generate card for book

const createBook = (bookNumber, book)=>{
  const bookCollection = document.querySelector("#book-collection");
  const bookCard = document.createElement('article');
  const bookCount = document.createElement('header');
  const bookCardWrapper = document.createElement('body');
  const bookTitle = document.createElement('h2');
  const bookAuthor = document.createElement('p');
  const bookPages = document.createElement('p');
  const readForm = document.createElement('fieldset');
  const readLabel = document.createElement('label');
  const bookRead = document.createElement('input');
  const bookFooter = document.createElement('footer');
  const buttonWrapper = document.createElement('div');
  const deleteButton = document.createElement('button'); 

  const cardContent = [bookCount, bookCardWrapper, bookFooter];
  const wrapperContent = [bookTitle, bookAuthor, bookPages, readForm];
  
  bookCount.innerText = `Book #${bookNumber}`;
  
  bookTitle.innerText = `${book.title}`;
  bookAuthor.innerHTML = `<i>by ${book.author}</i>`;
  bookPages.innerHTML = `<b>${book.pages} pages</b>`;

  readLabel.setAttribute('for', 'read');
  bookRead.setAttribute('type', 'checkbox');
  bookRead.setAttribute('name', 'read');
  bookRead.setAttribute('id', 'read');
  // Check if book.read === True, if true, apply some style
  if(book.read){
    bookRead.setAttribute('checked', true);
    bookCount.style.backgroundColor = '#ffa500';
    // bookCount.style.color = '#ffffff';
    bookCount.innerHTML += "<b> Readed!</b>"
  };
  readLabel.innerText = 'Read ';
  readLabel.appendChild(bookRead);
  readForm.appendChild(readLabel);

  buttonWrapper.classList.add('grid');
  deleteButton.innerText = 'Remove from Library';
  buttonWrapper.appendChild(deleteButton);

  bookCard.classList.add('book');
  for(let i=0;i<cardContent.length;i++){
    bookCard.appendChild(cardContent[i]);
  }

  for(let i = 0;i<wrapperContent.length;i++){
    bookCardWrapper.appendChild(wrapperContent[i]);
  }

  bookRead.addEventListener('click', ()=>{
    book.read = !book.read;
    saveLocal();
    render();
  })

  deleteButton.addEventListener('click', ()=>{
    myLibrary.splice(myLibrary.indexOf(book), 1);
    saveLocal();
    render();
  })

  bookFooter.appendChild(buttonWrapper);
  bookCollection.appendChild(bookCard);
};


const renderEmpty = (container) =>{
  container.innerHTML = `
  <div class="empty-message" style="text-align: center;  padding: 2px; color:grey;">
    <h3 style="color: gray;">You don't have any books :(</h3>
  </div>
  `;
}

const render = ()=>{
  const bookCollection = document.querySelector("#book-collection");
  const books = document.querySelectorAll('.book');
  // remove already rendered card
  books.forEach(book => bookCollection.removeChild(book));
  
  if(myLibrary.length === 0){
    renderEmpty(bookCollection);
  }else{
    bookCollection.innerText = "";
    for(let i=0; i<myLibrary.length;i++){
      createBook(i+1, myLibrary[i]);
    }
  }
}


const bookModal = document.querySelector('#book_modal');
const modalButton = document.getElementById('add_book');
const cancelAdd = document.querySelector('#cancel_add');
const addBook = document.querySelector("#add_book");

// Open Modal
const openModal = (event) =>{
  const html = document.documentElement;
  const addBookForm = document.querySelector('#add_book_form');
  addBookForm.reset();
  html.classList.add(modalOpen);
  html.classList.add(modalOpening);
  setTimeout(()=>{
    html.classList.remove(modalOpening);
    modalCheck = 'open';
  }, timeDuration);
  bookModal.style.display='flex';
};

// close Modal
const closeModal = ()=>{
  modalCheck=null;
  const html = document.documentElement;
  html.classList.add(modalClosing);
  setTimeout(()=>{
    html.classList.remove(modalOpen);
    html.classList.remove(modalClosing);
    bookModal.style.display='none';
  }, timeDuration);
};

//Close modal if click outside the modal
document.addEventListener('click', (event)=>{
  if (modalCheck===null) return;
  const modalContent = bookModal.querySelector('article');
  const insideModal = modalContent.contains(event.target);
  if(!insideModal && modalCheck){
    closeModal();
  }
});

// Close modal with esc button
document.addEventListener('keydown', (event) => {
  if (event.key === "Escape" && modalCheck) {
    closeModal();
  }
});



loadLocal();
render();
