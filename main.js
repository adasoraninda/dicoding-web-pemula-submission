const STORAGE_KEY = "BOOKSHELF_APPS";
const RENDER_EVENT = "RENDER_EVENT";
const RENDER_EVENT_SEARCH = "RENDER_EVENT_SEARCH";
const books = [];
const searchedBooks = [];

// <Elements>
const inputTitleElement = document.getElementById("inputBookTitle");
const inputAuthorElement = document.getElementById("inputBookAuthor");
const inputYearElement = document.getElementById("inputBookYear");
const inputIsCompleteElement = document.getElementById("inputBookIsComplete");
const buttonSubmitElement = document.getElementById("bookSubmit");

const bookUnFinishedContainer = document.getElementById(
  "incompleteBookshelfList"
);
const bookFinishedContainer = document.getElementById("completeBookshelfList");

const inputSearchTitleElement = document.getElementById("searchBookTitle");
const buttonSearchElement = document.getElementById("searchSubmit");

const bookItemContent = (book) =>
  `
    <h3>${book.title}</h3>
    <p>${book.author}</p>
    <p>${book.year}</p>
  `;

const bookItemButtonContent = (positiveText, negativeText) =>
  `
    <button class="green">${positiveText}</button>
    <button class="red">${negativeText}</button>
  `;
// </Elements>

// <Use case functionality>
const addBook = (book) => {
  books.push(book);
  console.log(books);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const removeBook = (book) => {
  const bookIndex = books.indexOf(book);
  books.splice(bookIndex, 1);
  console.log(books);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const updateBook = (book) => {
  const bookIndex = books.indexOf(book);
  const bookCandidate = books[bookIndex];
  bookCandidate.isCompleted = !bookCandidate.isCompleted;
  console.log(books[bookIndex]);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const searchBook = (title) => {
  const bookFilter = books.filter((b) => b.title.includes(title));
  searchedBooks.splice(0, searchedBooks.length);
  searchedBooks.push(...bookFilter);
  document.dispatchEvent(new Event(RENDER_EVENT_SEARCH));
};

const generateId = () => +new Date();

const generateBookObject = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

const createBookItem = (book) => {
  const bookItemElement = document.createElement("article");
  const bookButtonElement = document.createElement("div");

  bookItemElement.setAttribute("id", `book-${book.id}`);
  bookItemElement.setAttribute("class", "book_item");
  bookItemElement.innerHTML = bookItemContent(book);

  bookButtonElement.setAttribute("class", "action");

  if (book.isCompleted) {
    bookButtonElement.innerHTML = bookItemButtonContent(
      "Belum selesai di Baca",
      "Hapus buku"
    );
    bookItemElement.appendChild(bookButtonElement);
  } else {
    bookButtonElement.innerHTML = bookItemButtonContent(
      "Selesai dibaca",
      "Hapus buku"
    );
    bookItemElement.appendChild(bookButtonElement);
  }

  for (i = 0; i < bookButtonElement.children.length; i++) {
    const button = bookButtonElement.children[i];
    button.addEventListener("click", () => {
      if (button.className.includes("green")) {
        updateBook(book);
      }

      if (button.className.includes("red")) {
        removeBook(book);
      }
    });
  }

  return bookItemElement;
};
// </ Use case functionality>

// <Persist data functionality>
const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }

  return true;
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    console.log(parsed);
  }
};

function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
// </Persist data functionality>

// <Event Handlers>
const submitAddBookHandler = (event) => {
  const title = inputTitleElement.value;
  const author = inputAuthorElement.value;
  const year = inputYearElement.value;
  const isCompleted = inputIsCompleteElement.checked;

  if (!title || !author || !year) {
    alert("Harap isi kolom yang kosong");
    event.preventDefault();
    return;
  }

  const book = generateBookObject(
    generateId(),
    title,
    author,
    parseInt(year),
    isCompleted
  );

  addBook(book);

  event.preventDefault();
};

const submitSearchBookHandler = (event) => {
  const title = inputSearchTitleElement.value;

  if (title) {
    searchBook(title);
  } else {
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  event.preventDefault();
};
// </Event Handlers>

// <Event Listeners>
document.addEventListener("DOMContentLoaded", function () {
  buttonSubmitElement.addEventListener("click", submitAddBookHandler);
  buttonSearchElement.addEventListener("click", submitSearchBookHandler);

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  bookUnFinishedContainer.innerHTML = "";
  bookFinishedContainer.innerHTML = "";

  for (book of books) {
    const bookElement = createBookItem(book);
    if (book.isCompleted) {
      bookFinishedContainer.append(bookElement);
    } else {
      bookUnFinishedContainer.append(bookElement);
    }
  }
});

document.addEventListener(RENDER_EVENT_SEARCH, () => {
  bookUnFinishedContainer.innerHTML = "";
  bookFinishedContainer.innerHTML = "";

  for (book of searchedBooks) {
    const bookElement = createBookItem(book);
    if (book.isCompleted) {
      bookFinishedContainer.append(bookElement);
    } else {
      bookUnFinishedContainer.append(bookElement);
    }
  }
});
// </Event Listeners>
