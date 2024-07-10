import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm.jsx';
import BlogCreationForm from './components/BlogCreationForm.jsx';
import { Notification } from './components/Notification/Notification.jsx';
import Togglable from './components/Togglable.jsx';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');

    const blogFormRef = useRef();

    const handleBlogSubmit = async (blogObject) => {
        console.log('blogObject', blogObject);
        try {
            await blogService.create(blogObject);
            handleNotification('New blog created', 'success');
        } catch (exception) {
            handleNotification('Failed to create new blog', 'error');
            console.error('Failed to create new blog', exception);
        }
    };

    const fetchAllBlogs = async () => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    };

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
            handleNotification('Invalid credentials', 'error');
            console.error('Wrong credentials');
        }
    };

    const handleLogout = (event) => {
        event.preventDefault();
        window.localStorage.removeItem('loggedBlogAppUser');
    };

    const handleNotification = (message, type) => {
        setNotificationMessage(message);
        setNotificationType(type);
        setTimeout(() => {
            setNotificationMessage(null);
            setNotificationType(null);
        }, 5000);
    };

    useEffect(() => {
        fetchAllBlogs();
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    useEffect(() => {
        fetchAllBlogs();
    }, [notificationMessage]);

    return (
        <div>
            <h1>Bloglist</h1>
            {notificationMessage && (
                <Notification
                    message={notificationMessage}
                    type={notificationType}
                />
            )}
            {!user ? (
                <Togglable buttonLabel="Login" ref={blogFormRef}>
                    <LoginForm
                        handleSubmit={handleLoginSubmit}
                        username={username}
                        setUsername={setUsername}
                        password={password}
                        setPassword={setPassword}
                    />
                </Togglable>
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
                    <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
                        <BlogCreationForm handleSubmit={handleBlogSubmit} />
                    </Togglable>
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
