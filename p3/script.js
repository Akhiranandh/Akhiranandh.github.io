// --- AUTHENTICATION LOGIC WITH LOCALSTORAGE ---
const landing = document.getElementById('landing');
const app = document.getElementById('app');
const showLoginBtn = document.getElementById('show-login');
const showRegisterBtn = document.getElementById('show-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMsg = document.getElementById('login-message');
const registerMsg = document.getElementById('register-message');
const welcome = document.getElementById('welcome');
const logoutBtn = document.getElementById('logout');

let currentUser = null;

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function saveSession(username) {
  localStorage.setItem('sessionUser', username);
}

function loadSession() {
  return localStorage.getItem('sessionUser');
}

function clearSession() {
  localStorage.removeItem('sessionUser');
}

function showApp(username) {
  landing.style.display = 'none';
  app.style.display = 'block';
  welcome.textContent = `Welcome, ${username}!`;
  currentUser = username;
  fetchPosts();
}

function showLanding() {
  landing.style.display = 'block';
  app.style.display = 'none';
  loginForm.reset();
  registerForm.reset();
  loginMsg.textContent = '';
  registerMsg.textContent = '';
}

// Toggle forms
showLoginBtn.onclick = () => {
  loginForm.style.display = 'flex';
  registerForm.style.display = 'none';
  loginMsg.textContent = '';
};
showRegisterBtn.onclick = () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'flex';
  registerMsg.textContent = '';
};

// Registration
registerForm.onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;
  let users = getUsers();
  if (users.find(u => u.username === username)) {
    registerMsg.textContent = 'Username already exists.';
    return;
  }
  users.push({ username, password });
  setUsers(users);
  registerMsg.style.color = 'green';
  registerMsg.textContent = 'Registration successful! Please login.';
  setTimeout(() => {
    showLoginBtn.click();
    registerMsg.style.color = '#e84118';
  }, 1000);
};

// Login
loginForm.onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  let users = getUsers();
  let user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    loginMsg.textContent = 'Invalid username or password.';
    return;
  }
  saveSession(username);
  showApp(username);
};

// Logout
logoutBtn.onclick = function() {
  clearSession();
  showLanding();
  currentUser = null;
};

// Auto-login if session exists
window.onload = function() {
  const sessionUser = loadSession();
  if (sessionUser) {
    showApp(sessionUser);
  } else {
    showLanding();
  }
};

// --- SOCIAL FEED LOGIC (JSONPLACEHOLDER) ---
const postsContainer = document.getElementById('posts');
const postForm = document.getElementById('postForm');
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');

async function fetchPosts() {
  postsContainer.innerHTML = '<em>Loading posts...</em>';
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  const posts = await res.json();
  postsContainer.innerHTML = '';
  posts.forEach(post => renderPost(post));
}

function renderPost(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post';
  postDiv.innerHTML = `
    <div class="post-title">${post.title}</div>
    <div class="post-body">${post.body}</div>
    <button class="show-comments" data-id="${post.id}">Show Comments</button>
    <div class="comments" id="comments-${post.id}" style="display:none;"></div>
  `;
  postsContainer.appendChild(postDiv);

  postDiv.querySelector('.show-comments').addEventListener('click', async function() {
    const commentsDiv = document.getElementById(`comments-${post.id}`);
    if (commentsDiv.style.display === 'none') {
      commentsDiv.style.display = 'block';
      if (!commentsDiv.hasChildNodes()) {
        commentsDiv.innerHTML = '<em>Loading comments...</em>';
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
        const comments = await res.json();
        commentsDiv.innerHTML = comments.map(c => `
          <div class="comment"><strong>${c.name}:</strong> ${c.body}</div>
        `).join('');
      }
      this.textContent = 'Hide Comments';
    } else {
      commentsDiv.style.display = 'none';
      this.textContent = 'Show Comments';
    }
  });
}

// Add new post (local only, for demo)
postForm.onsubmit = async function(e) {
  e.preventDefault();
  const newPost = {
    title: titleInput.value,
    body: bodyInput.value,
    userId: 1
  };
  renderPost(newPost);
  postForm.reset();
};
