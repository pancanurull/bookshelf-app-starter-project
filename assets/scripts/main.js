document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("bookForm");
    const searchForm = document.getElementById("searchBook");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    
    const STORAGE_KEY = "BOOKSHELF_APP";
    let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    function saveBooks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
    
    function generateBookId() {
        return +new Date();
    }
    
    function createBookElement(book) {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        bookElement.dataset.bookid = book.id;
        bookElement.dataset.testid = "bookItem";
        
        bookElement.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div class="book-buttons">
                <button class="btn-status" data-testid="bookItemIsCompleteButton">
                    ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
                </button>
                <button class="btn-edit" data-testid="bookItemEditButton">Edit Buku</button>
                <button class="btn-delete" data-testid="bookItemDeleteButton">Hapus Buku</button>
            </div>
        `;
        
        bookElement.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", function () {
            toggleBookStatus(book.id);
        });
        
        bookElement.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", function () {
            showEditModal(book.id);
        });
        
        bookElement.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", function () {
            showDeleteConfirmation(book.id);
        });
        
        return bookElement;
    }
    
    function renderBooks() {
        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";
        
        books.forEach((book) => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
    }
    
    function addBook(title, author, year, isComplete) {
        const newBook = {
            id: generateBookId(),
            title,
            author,
            year: parseInt(year),
            isComplete,
        };
        books.push(newBook);
        saveBooks();
        renderBooks();
        showNotification("Buku berhasil ditambahkan!");
    }
    
    function toggleBookStatus(id) {
        const book = books.find(book => book.id === id);
        if (book) {
            book.isComplete = !book.isComplete;
            saveBooks();
            renderBooks();
            showNotification(`Buku "${book.title}" ${book.isComplete ? "selesai dibaca" : "belum selesai dibaca"}`);
        }
    }
    
    function deleteBook(id) {
        const book = books.find(book => book.id === id);
        if (book) {
            const bookTitle = book.title;
            books = books.filter(book => book.id !== id);
            saveBooks();
            renderBooks();
            showNotification(`Buku "${bookTitle}" berhasil dihapus!`);
            closeModals();
        }
    }
    
    function updateBook(id, title, author, year) {
        const book = books.find(book => book.id === id);
        if (book) {
            book.title = title;
            book.author = author;
            book.year = parseInt(year);
            saveBooks();
            renderBooks();
            showNotification(`Buku "${title}" berhasil diperbarui!`);
            closeModals();
        }
    }
    
    // Modal Functions
    function showEditModal(id) {
        const book = books.find(book => book.id === id);
        if (!book) return;
        
        // Create Modal
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.id = "editModal";
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Buku</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <div class="form-group">
                            <label for="editTitle">Judul</label>
                            <input type="text" id="editTitle" value="${book.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="editAuthor">Penulis</label>
                            <input type="text" id="editAuthor" value="${book.author}" required>
                        </div>
                        <div class="form-group">
                            <label for="editYear">Tahun</label>
                            <input type="number" id="editYear" value="${book.year}" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-save">Simpan</button>
                            <button type="button" class="btn-cancel">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector(".close-modal").addEventListener("click", closeModals);
        modal.querySelector(".btn-cancel").addEventListener("click", closeModals);
        
        modal.querySelector("#editForm").addEventListener("submit", function(e) {
            e.preventDefault();
            const title = document.getElementById("editTitle").value;
            const author = document.getElementById("editAuthor").value;
            const year = document.getElementById("editYear").value;
            
            if (!title || !author || !year) {
                showNotification("Semua field harus diisi!", "error");
                return;
            }
            
            updateBook(id, title, author, year);
        });
        
        // Prevent closing when clicking inside modal content
        modal.querySelector(".modal-content").addEventListener("click", function(e) {
            e.stopPropagation();
        });
        
        // Close modal when clicking outside
        modal.addEventListener("click", closeModals);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add("show");
        }, 10);
    }
    
    function showDeleteConfirmation(id) {
        const book = books.find(book => book.id === id);
        if (!book) return;
        
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.id = "deleteModal";
        
        modal.innerHTML = `
            <div class="modal-content delete-confirm">
                <div class="modal-header">
                    <h3>Konfirmasi Hapus</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Apakah Anda yakin ingin menghapus buku "${book.title}"?</p>
                    <div class="form-actions">
                        <button class="btn-confirm-delete">Hapus</button>
                        <button class="btn-cancel">Batal</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector(".close-modal").addEventListener("click", closeModals);
        modal.querySelector(".btn-cancel").addEventListener("click", closeModals);
        modal.querySelector(".btn-confirm-delete").addEventListener("click", function() {
            deleteBook(id);
        });
        
        // Prevent closing when clicking inside modal content
        modal.querySelector(".modal-content").addEventListener("click", function(e) {
            e.stopPropagation();
        });
        
        // Close modal when clicking outside
        modal.addEventListener("click", closeModals);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add("show");
        }, 10);
    }
    
    function closeModals() {
        const modals = document.querySelectorAll(".modal");
        modals.forEach(modal => {
            modal.classList.remove("show");
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }
    
    function showNotification(message, type = "success") {
        const notification = document.createElement("div");
        notification.classList.add("notification", type);
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add("show");
        }, 10);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Event Listeners
    bookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("bookFormTitle").value;
        const author = document.getElementById("bookFormAuthor").value;
        const year = document.getElementById("bookFormYear").value;
        const isComplete = document.getElementById("bookFormIsComplete").checked;
        
        if (!title || !author || !year) {
            showNotification("Semua field harus diisi!", "error");
            return;
        }
        
        addBook(title, author, year, isComplete);
        bookForm.reset();
    });
    
    // Update checkbox label based on selection
    document.getElementById("bookFormIsComplete").addEventListener("change", function() {
        const buttonText = document.querySelector("#bookFormSubmit span");
        buttonText.textContent = this.checked ? "Selesai dibaca" : "Belum selesai dibaca";
    });
    
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
        
        if (!searchTitle) {
            renderBooks();
            return;
        }
        
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
        
        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";
        
        if (filteredBooks.length === 0) {
            const noResult = document.createElement("div");
            noResult.classList.add("no-result");
            noResult.innerHTML = "<p>Tidak ada buku yang ditemukan</p>";
            incompleteBookList.appendChild(noResult.cloneNode(true));
            completeBookList.appendChild(noResult);
            return;
        }
        
        filteredBooks.forEach((book) => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
    });
    
    // Clear search results when input is cleared
    document.getElementById("searchBookTitle").addEventListener("input", function() {
        if (!this.value) {
            renderBooks();
        }
    });
    
    // Initial render
    renderBooks();
    
    // Menghilangkan contoh buku dari HTML
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll("[data-testid='bookItem']").forEach(item => {
            if (!item.dataset.bookid) {
                item.remove();
            }
        });
    });
});