    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentEditId = null;

    function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    }

    function openModal(noteId = null) {
    const modal = document.getElementById('noteModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('noteForm');

    if (noteId) {
        const note = notes.find(n => n.id === noteId);
        modalTitle.textContent = 'Edit Note';
        form.title.value = note.title;
        document.getElementById('editor').innerHTML = note.content;
        currentEditId = noteId;
    } else {
        modalTitle.textContent = 'Create New Note';
        form.reset();
        document.getElementById('editor').innerHTML = '';
        currentEditId = null;
    }

    modal.style.display = 'block';
    }

    function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
    }

    function execCommand(command, value = null) {
    document.execCommand(command, false, value);
    }

    function renderNotes() {
    const container = document.getElementById('notesContainer');
    if (notes.length === 0) {
        container.innerHTML = '<div class="empty-state"><h2>No notes yet!</h2><p>Create your first note by clicking the button above.</p></div>';
        return;
    }

    container.innerHTML = notes.map(note => 
        `<div class="note-card">
            <h2 class="note-title">${note.title}    </h2>
            <div class="note-date">Posted: ${formatDate(note.date)}</div>
            <div class="note-content">${note.content}</div>
            <div class="note-actions">
                <button class="edit-btn" onclick="openModal('${note.id}')">Edit <i class='bx bx-edit-alt'></i></button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete <i class='bx bx-trash'></i></button>
            </div>
        </div>`
    ).join('');
    }

    function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    }
    }

    document.getElementById('noteForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const noteData = {
        id: currentEditId || Date.now().toString(),
        title: this.title.value.trim(),
        content: document.getElementById('editor').innerHTML.trim(),
        date: currentEditId ? notes.find(n => n.id === currentEditId).date : new Date().toISOString()
    };

    if (currentEditId) {
        notes = notes.map(note => note.id === currentEditId ? noteData : note);
    } else {
        notes.push(noteData);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    closeModal();
    renderNotes();
    });

    window.onclick = function(event) {
    const modal = document.getElementById('noteModal');
    if (event.target === modal) {
        closeModal();
    }
    }

    // Initial render
    renderNotes();
