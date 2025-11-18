// server.js
// Clearwave Proxy Services: Express backend + React frontend served together

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));

// Proxy routes
app.use('/api', createProxyMiddleware({
  target: 'https://jsonplaceholder.typicode.com',
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

app.use('/auth', createProxyMiddleware({
  target: 'https://reqres.in',
  changeOrigin: true,
  pathRewrite: { '^/auth': '' },
}));

app.use('/data', createProxyMiddleware({
  target: 'https://httpbin.org',
  changeOrigin: true,
  pathRewrite: { '^/data': '' },
}));

// --- React frontend code bundled here ---
// Normally you'd run `npm run build` in React and serve the build folder.
// For simplicity, here’s a minimal React app embedded as static HTML.

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Clearwave Proxy Services</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: Arial, sans-serif; background:#f5f7fa; margin:0; padding:2rem; }
    h1 { color:#1e3c72; }
    button { margin-right:1rem; padding:0.5rem 1rem; border:none; background:#00c6ff; border-radius:5px; cursor:pointer; }
    button:hover { background:#0072ff; color:#fff; }
    ul { list-style:none; padding:0; }
    li { background:#fff; margin-bottom:0.5rem; padding:0.5rem; border-radius:5px; }
    .loading { font-style:italic; }
  </style>
</head>
<body>
  <h1>🌊 Clearwave Proxy Services</h1>
  <p>Frontend + Backend chained together</p>
  <div>
    <button onclick="fetchPosts()">Fetch Posts (/api)</button>
    <button onclick="fetchUsers()">Fetch Users (/auth)</button>
    <button onclick="fetchData()">Fetch Data (/data)</button>
  </div>
  <p id="status" class="loading"></p>
  <h2>Posts</h2>
  <ul id="posts"></ul>
  <h2>Users</h2>
  <ul id="users"></ul>
  <h2>Data</h2>
  <pre id="data"></pre>

  <script>
    const statusEl = document.getElementById('status');
    const postsEl = document.getElementById('posts');
    const usersEl = document.getElementById('users');
    const dataEl = document.getElementById('data');

    async function fetchPosts() {
      statusEl.textContent = "Loading posts...";
      postsEl.innerHTML = "";
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        data.slice(0,5).forEach(post => {
          const li = document.createElement('li');
          li.innerHTML = '<strong>' + post.title + '</strong><p>' + post.body + '</p>';
          postsEl.appendChild(li);
        });
        statusEl.textContent = "";
      } catch (err) {
        statusEl.textContent = "Error fetching posts.";
        console.error(err);
      }
    }

    async function fetchUsers() {
      statusEl.textContent = "Loading users...";
      usersEl.innerHTML = "";
      try {
        const res = await fetch('/auth/users');
        const data = await res.json();
        (data.data || []).forEach(user => {
          const li = document.createElement('li');
          li.textContent = user.first_name + " " + user.last_name + " (" + user.email + ")";
          usersEl.appendChild(li);
        });
        statusEl.textContent = "";
      } catch (err) {
        statusEl.textContent = "Error fetching users.";
        console.error(err);
      }
    }

    async function fetchData() {
      statusEl.textContent = "Loading data...";
      dataEl.textContent = "";
      try {
        const res = await fetch('/data/get');
        const data = await res.json();
        dataEl.textContent = JSON.stringify(data, null, 2);
        statusEl.textContent = "";
      } catch (err) {
        statusEl.textContent = "Error fetching data.";
        console.error(err);
      }
    }
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Clearwave Proxy Services running at http://localhost:${PORT}`);
});
