// HTML Elements
const bookShelf = document.querySelector('.book-shelf');
const openFormBtn = document.querySelector('#add-book');
const submitBookBtn = document.querySelector('#submit-form');
const formOverLay = document.querySelector('.form-control');
const form = document.querySelector('.form');
const formTitle = document.querySelector('#form-input-title');
const closeFormBtn = document.querySelector('#close-form');

const myLibrary = {
  books: []
};

// Book Constructor
function Book(title, subTitle, author, pages, isRead) {
  this.title = title;
  this.subTitle = subTitle;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.createCard = (index) => {
  let card = document.createElement('div');
  card.classList.add('card');
  index === 0 ? card.style.transform = 'translate(-50%, 0)'
    : card.style.transform = `translate(-50%, ${index * 58}px)`;
  card.addEventListener('mouseenter', moveCard);
  card.addEventListener('mouseleave', returnCard);
  card.setAttribute('data-index', index);
  return card;
}

Book.prototype.createCardHeader = () => {
  let cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');
  return cardHeader;
}

Book.prototype.createCardBody = () => {
  let cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  return cardBody;
}

Book.prototype.toggle = function () {
  this.isRead = !this.isRead;
}

Book.prototype.display = function (target) {
  card = this.createCard(myLibrary.books.findIndex(item => item.title == this.title));
  cardHeader = this.createCardHeader();
  cardBody = this.createCardBody();
  target.appendChild(card);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  // Display properties
  let keys = Object.keys(this);
  keys.forEach(key => {
    let prop = document.createElement('div');
    prop.id = key;
    prop.classList.add(`${key}`);
    prop.classList.add(`prop`);
    key == 'isRead' && this.isRead == false ? card.childNodes[0].classList.add('not-read')
      : key == 'isRead' && this.isRead != false ? null
        : key == 'author' ? prop.textContent = `By ${this[key]}`
          : key == 'pages' ? prop.textContent = `Page Count: ${this[key]}`
            : prop.textContent = this[key];
    prop.id == 'title' ? prop.addEventListener('click', openCard) : null;

    key === 'title' || key === 'subTitle' ? card.childNodes[0].appendChild(prop)
      : card.childNodes[1].appendChild(prop);
  });
  console.log(myLibrary.books.findIndex(item => item.title == this.title));

  createDeleteButton(cardHeader);
  createReadButton(cardBody, myLibrary.books.findIndex(item => item.title == this.title));
  if (this.isRead == false) {
    cardHeader.classList.add('not-read');
    console.log(cardBody.childNodes[3].classList.remove('is-read'));
    console.log(cardBody.childNodes[3].classList.add('not-read'));
  } else {
    cardHeader.classList.add('is-read');
    console.log(cardBody.childNodes[3].classList.remove('not-read'));
    console.log(cardBody.childNodes[3].classList.add('is-read'));
  }
}


// Button Constructor
function Btn(name, text, state, action) {
  this.name = name;
  this.text = text;
  this.state = state;
  this.action = action;
}

Btn.prototype.display = function () {
  let newBtn = document.createElement('div');
  newBtn.classList.add('btn');
  this.name == 'toggle' && this.state != 'false' ? newBtn.classList.add('is-read')
    : newBtn.classList.add('not-read');
  newBtn.textContent = `${this.text}`
  newBtn.addEventListener('click', this.action);
  return newBtn;
}

// Create Delete Button
function createDeleteButton(card) {
  deleteBtn = new Btn('deleteBook', 'x', null, removeBookFromLibrary);
  card.appendChild(deleteBtn.display());
  card.childNodes[2].classList.remove('not-read');
  card.childNodes[2].classList.add('book-delete-btn');
}

// Create update read status button 
function createReadButton(card, index) {
  isReadBtn = new Btn('toggle', 'Read', myLibrary.books[index].isRead, toggleIsRead);
  card.appendChild(isReadBtn.display());
}

function displayLibrary(library) {
  clearDisplay();
  console.log(library);
  library.forEach(book => book.display(bookShelf));
}

function clearDisplay() {
  let nodes = document.querySelectorAll('.card');
  if (nodes) {
    nodes.forEach(node => node.parentNode.removeChild(node));
  }
}

function addBookToLibrary(book) {
  myLibrary.books.push(book);
}

function removeBookFromLibrary(e) {
  let removeBook = e.target.parentNode.parentNode.dataset.index;
  myLibrary.books.splice(removeBook, 1);

  // Remove book from localStorage
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary.books))
  displayLibrary(myLibrary.books);
}

function getInputValues() {
  let inputs = Array.from(form.querySelectorAll('.form-input'));
  let properties = inputs.map(input => input.value);
  properties[4] == 'true' ? properties[4] = true
    : properties[4] = false;

  createNewBook(properties);
}

function createNewBook(properties) {
  newBook = new Book(...properties);
  addBookToLibrary(newBook);
  populateStorage();
  displayLibrary(myLibrary.books);
  closeForm();
}

function toggleIsRead(e) {
  let thisBook = e.target.parentNode.parentNode.dataset.index;
  myLibrary.books[thisBook].toggle();
  e.target.classList.toggle('is-read');
  e.target.classList.toggle('not-read');
  e.target.parentNode.parentNode.childNodes[0].classList.toggle('not-read');
  populateStorage();
}

function moveCard(e) {
  const targetCard = e.target;
  let currentPosition = getPosition(targetCard);

  currentPosition.x == -50
    ? e.target.style.transform = `translate(-50%, ${currentPosition.y - 50}px) rotate(3deg)`
    : null;
}

function returnCard(e) {
  const targetCard = e.target;
  let currentPosition = getPosition(targetCard);

  currentPosition.x == -50
    ? e.target.style.transform = `translate(-50%, ${currentPosition.y + 50}px)`
    : null;
}

function openCard(e) {
  const targetCard = e.target.parentNode.parentNode;
  let currentPosition = getPosition(targetCard);

  currentPosition.x === -50
    ? targetCard.style.transform = `translate(${currentPosition.x + 110}%, ${currentPosition.y}px)`
    : currentPosition.x === 60
      ? targetCard.style.transform = `translate(${currentPosition.x - 110}%, ${currentPosition.y}px)`
      : null;
}

function getPosition(target) {
  let regex = /-\d+|\d+/g;
  const position = {};
  position.x = parseInt(target.style.transform.match(regex)[0]);
  position.y = parseInt(target.style.transform.match(regex)[1]);

  return position;
}

function openForm() {
  formTitle.focus();
  formOverLay.style.transform = 'scale(1)';
  formOverLay.style.opacity = '1';
  form.style.transform = 'translate(-50%, -50%)';
  form.style.transformOrigin = '-25% -25%';
  document.body.style.position = 'fixed';
}

function closeForm() {
  formOverLay.style.transform = 'scale(0)';
  formOverLay.style.opacity = '0';
  form.style.transform = 'translateX(-100vw)';
  document.body.style.position = '';
  form.reset();
}


// Event handlers
openFormBtn.addEventListener('click', openForm);
submitBookBtn.addEventListener('click', getInputValues);
closeFormBtn.addEventListener('click', closeForm);


// Check for local storage availability
function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
  }
}

function getBookProperties(library) {
  library.length > 0 ? keys = Object.keys(library[0])
    : keys = 0;

  let bookKeys = library.map((book, index) => {
    return keys.map(key => `${index}${key}`);
  });

  let bookValues = library.map((book) => {
    return keys.map(key => book[key]);
  });

  let booksProperties = [];
  for (let i = 0; i < library.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      booksProperties.push([bookKeys[i][j], bookValues[i][j]])
    }
  }
  return booksProperties;
}

function populateStorage() {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary.books));
}

// Retrieve books from local storage 
function setLibrary() {
  storageValues = JSON.parse(localStorage.getItem('myLibrary'));
  numberOfBooks = storageValues.length;
  keys = Object.keys(storageValues[0]);
  storageValues[0].isRead == 'true' || storageValues[0].isRead == true ? storageValues[0].isRead = true
    : storageValues[0].isRead = false;

  let books = [];

  for (let i = 0; i < numberOfBooks; i++) {
    let values = [];
    keys.forEach(key => values.push(storageValues[i][key]));
    books.push(values);
  }

  books.forEach(book => {
    newBook = new Book(...book);
    myLibrary.books.push(newBook);
  });
}

if (storageAvailable('localStorage')) {
  if (!localStorage.length > 0) {
    populateStorage();
  } else {
    setLibrary();
  }
}
else {
  console.log('no storage');

}

// Display initial library
displayLibrary(myLibrary.books);
