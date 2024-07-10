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

            window.localStorage.setItem(
                'loggedBlogAppUser',
                JSON.stringify(user)
            );

            blogService.setToken(user.token);
            setUser(user);
            setUsername('');
            setPassword('');
        } catch (exception) {
            console.error('Wrong credentials');
        }
    };

    const handleLogout = (event) => {
        event.preventDefault();
        window.localStorage.removeItem('loggedBlogAppUser');
    };

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
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
                <div>
                    {user.name} logged in{' '}
                    <button onClick={(event) => handleLogout(event)}>
                        Logout
                    </button>
                </div>
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
