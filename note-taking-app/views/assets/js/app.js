class NotesApp {
    constructor() {
        this.apiUrl = '/api';
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadNotes();
    }

    bindEvents() {
        // Add note button
        document.getElementById('addNoteBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Modal close events
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submit
        document.getElementById('noteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNote();
        });

        // Close modal when clicking outside
        document.getElementById('noteModal').addEventListener('click', (e) => {
            if (e.target.id === 'noteModal') {
                this.closeModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    async loadNotes() {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiUrl}/notes`);
            const data = await response.json();

            if (data.success) {
                this.renderNotes(data.data);
            } else {
                this.showToast('Error loading notes', 'error');
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            this.showToast('Error loading notes', 'error');
        } finally {
            this.hideLoading();
        }
    }

    renderNotes(notes) {
        const notesGrid = document.getElementById('notesGrid');
        const emptyState = document.getElementById('emptyState');

        if (notes.length === 0) {
            notesGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        notesGrid.innerHTML = notes.map(note => this.createNoteCard(note)).join('');

        // Bind note card events
        this.bindNoteCardEvents();
    }

    createNoteCard(note) {
        const createdDate = new Date(note.createdAt).toLocaleString();
        const truncatedContent = note.content.length > 150 
            ? note.content.substring(0, 150) + '...' 
            : note.content;

        return `
            <div class="note-card bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-semibold text-gray-800 truncate">${this.escapeHtml(note.title)}</h3>
                    <div class="flex space-x-2 ml-2">
                        <button class="edit-note text-blue-500 hover:text-blue-700" data-id="${note.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button class="delete-note text-red-500 hover:text-red-700" data-id="${note.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-4 leading-relaxed">${this.escapeHtml(truncatedContent)}</p>
                <div class="text-xs text-gray-400">
                    Created: ${createdDate}
                </div>
            </div>
        `;
    }

    bindNoteCardEvents() {
        // Edit buttons
        document.querySelectorAll('.edit-note').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteId = e.currentTarget.getAttribute('data-id');
                this.editNote(noteId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-note').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteId = e.currentTarget.getAttribute('data-id');
                this.deleteNote(noteId);
            });
        });
    }

    openModal(title = 'Add New Note', noteData = null) {
        const modal = document.getElementById('noteModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('noteForm');

        modalTitle.textContent = title;
        
        if (noteData) {
            document.getElementById('noteTitle').value = noteData.title;
            document.getElementById('noteContent').value = noteData.content;
        } else {
            form.reset();
        }

        modal.classList.remove('hidden');
        document.getElementById('noteTitle').focus();
    }

    closeModal() {
        const modal = document.getElementById('noteModal');
        modal.classList.add('hidden');
        this.currentEditingId = null;
        document.getElementById('noteForm').reset();
    }

    async saveNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();

        if (!title || !content) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            const url = this.currentEditingId 
                ? `${this.apiUrl}/notes/${this.currentEditingId}`
                : `${this.apiUrl}/notes`;
            
            const method = this.currentEditingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            const data = await response.json();

            if (data.success) {
                this.showToast(data.message, 'success');
                this.closeModal();
                this.loadNotes();
            } else {
                this.showToast(data.message || 'Error saving note', 'error');
            }
        } catch (error) {
            console.error('Error saving note:', error);
            this.showToast('Error saving note', 'error');
        }
    }

    async editNote(noteId) {
        try {
            const response = await fetch(`${this.apiUrl}/notes/${noteId}`);
            const data = await response.json();

            if (data.success) {
                this.currentEditingId = noteId;
                this.openModal('Edit Note', data.data);
            } else {
                this.showToast('Error loading note', 'error');
            }
        } catch (error) {
            console.error('Error loading note:', error);
            this.showToast('Error loading note', 'error');
        }
    }

    async deleteNote(noteId) {
        if (!confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/notes/${noteId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                this.showToast(data.message, 'success');
                this.loadNotes();
            } else {
                this.showToast(data.message || 'Error deleting note', 'error');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            this.showToast('Error deleting note', 'error');
        }
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.remove('hidden');
        document.getElementById('notesGrid').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('hidden');
        document.getElementById('notesGrid').classList.remove('hidden');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        
        // Set toast color based on type
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;

        // Show toast
        toast.classList.add('toast-show');

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('toast-show');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
});
