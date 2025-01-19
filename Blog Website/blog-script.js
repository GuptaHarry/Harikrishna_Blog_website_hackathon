let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
let currentEditId = null;

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

function validateImageUrl(url) {
    return url || DEFAULT_IMAGE;
}

function handleImageError(img) {
    img.src = DEFAULT_IMAGE;
    img.classList.add('error');
}

function openModal(blogId = null) {
    const modal = document.getElementById('blogModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('blogForm');

    if (blogId !== null) {
        const blog = blogs.find(b => b.id === blogId);
        modalTitle.textContent = 'Edit Blog';
        form.title.value = blog.title;
        form.imageUrl.value = blog.imageUrl || '';
        form.category.value = blog.category;
        form.rating.value = blog.rating;
        document.getElementById('editor').innerHTML = blog.content;
        currentEditId = blogId;
    } else {
        modalTitle.textContent = 'Create New Blog';
        form.reset();
        document.getElementById('editor').innerHTML = '';
        currentEditId = null;
    }

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('blogModal').style.display = 'none';
}

function execCommand(command, value = null) {
    document.execCommand(command, false, value);
}

function generateStars(rating) {
    return '⭐'.repeat(rating);
}

function renderBlogs() {
    const container = document.getElementById('blogContainer');
    if (blogs.length === 0) {
        container.innerHTML = '<div class="empty-state"><h2>No blogs yet!</h2><p>Create your first blog by clicking the button above.</p></div>';
        return;
    }

    container.innerHTML = blogs.map(blog => `
        <div class="blog-card">
            <img src="${validateImageUrl(blog.imageUrl)}" 
                 alt="${blog.title}" 
                 class="blog-image"
                 onerror="handleImageError(this)">
            <div class="blog-content">
                <h2 class="blog-title">${blog.title}      <div><i class='bx bx-user'></i> <i class='bx bx-share bx-flip-horizontal' style='color:#464242'  ></i> <i class='bx bx-heart' style='color:#e05555'  ></i></div></h2>
                <div class="blog-category">Category: ${blog.category}</div>
                <div class="blog-text">${blog.content}</div>
                <div class="star-rating">Rating: ${generateStars(parseInt(blog.rating))}</div>
                <div class="blog-actions">
                    <button class="edit-btn" onclick="editBlog('${blog.id}')">Edit  <i class='bx bx-edit-alt'></i></button>
                    <button class="delete-btn" onclick="deleteBlog('${blog.id}')">Delete  <i class='bx bx-trash'></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add new editBlog function
function editBlog(blogId) {
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) {
        console.error('Blog not found');
        return;
    }
    openModal(blog);
}

// openModal function to bring up the dialog to edit
function openModal(blog = null) {
    const modal = document.getElementById('blogModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('blogForm');

    if (blog) {
        // if already exists so edit it
        modalTitle.textContent = 'Edit Blog';
        form.title.value = blog.title;
        form.imageUrl.value = blog.imageUrl || '';
        form.category.value = blog.category;
        form.rating.value = blog.rating;
        document.getElementById('editor').innerHTML = blog.content;
        currentEditId = blog.id;
    } else {
        // if no then create it
        modalTitle.textContent = 'Create New Blog';
        form.reset();
        document.getElementById('editor').innerHTML = '';
        currentEditId = null;
    }

    modal.style.display = 'block';
}

// delete blog card  function
function deleteBlog(blogId) {
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) {
        console.error('Blog not found');
        return;
    }
    
    if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
        blogs = blogs.filter(b => b.id !== blogId);
        localStorage.setItem('blogs', JSON.stringify(blogs));
        renderBlogs();
    }
}

// form submission
document.getElementById('blogForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const imageUrl = this.imageUrl.value.trim();
    
    const blogData = {
        id: currentEditId || Date.now().toString(),
        title: this.title.value.trim(),
        imageUrl: imageUrl || DEFAULT_IMAGE,
        category: this.category.value,
        rating: this.rating.value,
        content: document.getElementById('editor').innerHTML.trim()
    };

    if (currentEditId) {
        const index = blogs.findIndex(blog => blog.id === currentEditId);
        if (index !== -1) {
            blogs[index] = blogData;
        }
    } else {
        blogs.push(blogData);
    }

    localStorage.setItem('blogs', JSON.stringify(blogs));
    closeModal();
    renderBlogs();
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('blogModal');
    if (event.target === modal) {
        closeModal();
    }
}

// if some cards are present so it will render them directly.
renderBlogs();

