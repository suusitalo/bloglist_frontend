import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const BlogCreationForm = ({ handleSubmit }) => {
    const [blogTitle, setBlogTitle] = useState('');
    const [blogAuthor, setBlogAuthor] = useState('');
    const [blogUrl, setBlogUrl] = useState('');

    const clearInputFields = () => {
        setBlogAuthor('');
        setBlogTitle('');
        setBlogUrl('');
    };

    const addBlog = async (event) => {
        event.preventDefault();
        handleSubmit({
            title: blogTitle,
            author: blogAuthor,
            url: blogUrl,
        });
        clearInputFields();
    };
    return (
        <>
            <h2>Create new blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    Title:
                    <input
                        onChange={(event) => setBlogTitle(event.target.value)}
                        value={blogTitle}
                    />
                </div>
                <div>
                    Author:
                    <input
                        onChange={(event) => setBlogAuthor(event.target.value)}
                        value={blogAuthor}
                    />
                </div>
                <div>
                    Url:
                    <input
                        onChange={(event) => setBlogUrl(event.target.value)}
                        value={blogUrl}
                    />
                </div>
                <div>
                    <button
                        disabled={!blogTitle || !blogAuthor || !blogUrl}
                        type="submit"
                        className="submitButton"
                    >
                        Create
                    </button>
                </div>
            </form>
        </>
    );
};

export default BlogCreationForm;
