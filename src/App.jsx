import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm.jsx';
import BlogCreationForm from './components/BlogCreationForm.jsx';
import { Notification } from './components/Notification/Notification.jsx';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [blogTitle, setBlogTitle] = useState('');
    const [blogAuthor, setBlogAuthor] = useState('');
    const [blogUrl, setBlogUrl] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');

    const handleTitleChange = (event) => {
        setBlogTitle(event.target.value);
    };

    const handleAuthorChange = (event) => {
        setBlogAuthor(event.target.value);
    };

    const handleUrlChange = (event) => {
        setBlogUrl(event.target.value);
    };

    const handleBlogSubmit = async (event) => {
        event.preventDefault();

        const blogObject = {
            title: blogTitle,
            author: blogAuthor,
            url: blogUrl,
        };

        try {
            await blogService.create(blogObject);
            handleNotification('New blog created', 'success');
        } catch (exception) {
            handleNotification('Failed to create new blog', 'error');
            console.error('Failed to create new blog', exception);
        }
    };

    const clearInputFields = () => {
        setBlogAuthor('');
        setBlogTitle('');
        setBlogUrl('');
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
            handleNotification('error', 'Wrong credentials');
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
        clearInputFields();
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
            {notificationMessage && (
                <Notification
                    message={notificationMessage}
                    type={notificationType}
                />
            )}
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
                    <BlogCreationForm
                        title={blogTitle}
                        handleTitleChange={handleTitleChange}
                        author={blogAuthor}
                        handleAuthorChange={handleAuthorChange}
                        blogUrl={blogUrl}
                        handleUrlChange={handleUrlChange}
                        handleOnSubmit={handleBlogSubmit}
                    />
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
