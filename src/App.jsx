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
    const blogRef = useRef();

    const fetchAllBlogs = async () => {
        try {
            const fetchedBlogs = await blogService.getAll();
            arrangeBlogsByLikes(fetchedBlogs);
        } catch {
            handleNotification('Failed to fetch blogs', 'error');
            console.error('Failed to fetch blogs');
        }
    };

    const handleBlogSubmit = async (blogObject) => {
        try {
            await blogService.create(blogObject);
            handleNotification('New blog created', 'success');
        } catch (exception) {
            handleNotification('Failed to create new blog', 'error');
            console.error('Failed to create new blog', exception);
        }
    };

    const arrangeBlogsByLikes = (fetchedBlogs) => {
        const sortedBlogs = [...fetchedBlogs].sort((a, b) => b.likes - a.likes);
        setBlogs(sortedBlogs);
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

    const handleLikeButtonClick = async (blog) => {
        try {
            const updatedBlog = { ...blog, likes: blog.likes + 1 };
            await blogService.update(blog.id, updatedBlog);
            fetchAllBlogs();
        } catch (exception) {
            handleNotification('Failed to like blog', 'error');
            console.error('Failed to like blog', exception);
        }
    };

    const handleBlogDelete = async (blog) => {
        if (window.confirm(`Delete ${blog.title} by ${blog.author} ?`)) {
            try {
                await blogService.remove(blog.id);
                handleNotification('Blog deleted', 'success');
            } catch (exception) {
                handleNotification('Failed to delete blog', 'error');
                console.error('Failed to delete blog', exception);
            }
        }
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
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    useEffect(() => {
        fetchAllBlogs();
    }, []);

    useEffect(() => {
        const currentBlogs = blogs;
        if (blogs !== currentBlogs) arrangeBlogsByLikes();
    }, [blogs]);

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
                        <Blog
                            ref={blogRef}
                            key={blog.id}
                            blog={blog}
                            handleLikeButtonClick={handleLikeButtonClick}
                            handleBlogDelete={handleBlogDelete}
                            userId={user.id}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default App;
