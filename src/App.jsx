import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm.jsx';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password,
            });

            blogService.setToken(user.token);
            setUser(user);
            setUsername('');
            setPassword('');
        } catch (exception) {
            console.error('Wrong credentials');
        }
    };

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    return (
        <div>
            {!user ? (
                <LoginForm
                    handleSubmit={handleLoginSubmit}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                />
            ) : (
                <div>{user.name} logged in</div>
            )}
            {user && (
                <>
                    <h2>blogs</h2>
                    {blogs.map((blog) => (
                        <Blog key={blog.id} blog={blog} />
                    ))}
                </>
            )}
        </div>
    );
};

export default App;
