const modal = document.getElementById('modal');
const addBookmarkBtn = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookMarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const submitBtn = document.getElementById('submit');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];
let bookmark = {};

// Show Modal, Focus on first input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Click anywhere in the overlay or on the close button, to close the modal
function closeModal(event) {
    if (event.target === modal || event.target === modalClose) {
        modal.classList.remove('show-modal');
    }
}

function validateFormUrl() {
    const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(exp);
    if (!((bookmark.url).match(regex))) {
        alert('Please provide a valid web address');
        return false;
    }
    return true;
}

function deleteBookmark(name, url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.name === name && bookmark.url === url) {
            bookmarks.splice(i, 1);
            return;
        }
    });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarksFromLocalStorage();
}


function updateDOM() {
    // Remove all existing bookmarks on the DOM and build again
    bookmarksContainer.textContent = '';

    bookmarks.forEach(bookmark => {
        const { name, url } = bookmark;
        const itemEl = document.createElement('div');
        itemEl.classList.add('item');

        const deleteIconEl = document.createElement('i');
        deleteIconEl.classList.add('fas', 'fa-trash-alt');
        deleteIconEl.setAttribute('id', 'delete-bookmark');
        deleteIconEl.setAttribute('title', 'Delete Bookmark');
        deleteIconEl.setAttribute('onClick', `deleteBookmark('${name}','${url}')`);

        const linkEl = document.createElement('div');
        linkEl.classList.add('link');

        const faviconEl = document.createElement('img');
        faviconEl.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        faviconEl.setAttribute('alt', 'Favicon');

        const linkNameEl = document.createElement('a');
        linkNameEl.setAttribute('href', `${url}`);
        linkNameEl.setAttribute('target', '_blank');
        linkNameEl.textContent = name;

        linkEl.append(faviconEl, linkNameEl);
        itemEl.append(deleteIconEl, linkEl);
        bookmarksContainer.appendChild(itemEl);
    });
}

function fetchBookmarksFromLocalStorage() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        updateDOM();
    }
}

// Handle Form Submit
function storeBookmark(event) {
    event.preventDefault();
    let url = event.target[1].value;
    bookmark = {
        name: event.target[0].value,
        url: (url.includes('http://') || url.includes('https://')) ? url : `https://${url}`,
    }
    if (validateFormUrl()) {
        bookmarks.push(bookmark);
        bookMarkForm.reset();
        websiteNameEl.focus();
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        fetchBookmarksFromLocalStorage();
    }
}

// Event Listeners
addBookmarkBtn.addEventListener('click', showModal);
modalClose.addEventListener('click', closeModal);
bookMarkForm.addEventListener('submit', storeBookmark);
window.addEventListener('click', closeModal);

// On Load
fetchBookmarksFromLocalStorage();