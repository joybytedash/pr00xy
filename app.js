// App.js
import React, { useState } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/users');
      const data = await res.json();
      setUsers(data.data || []); // reqres.in returns { data: [...] }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Proxy Frontend</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={fetchPosts} disabled={loading}>
          Fetch Posts (/api)
        </button>
        <button onClick={fetchUsers} disabled={loading} style={{ marginLeft: '1rem' }}>
          Fetch Users (/auth)
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <h2>Posts</h2>
      <ul>
        {posts.slice(0, 5).map(post => (
          <li key={post.id} style={{ marginBottom: '1rem' }}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.first_name} {user.last_name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
