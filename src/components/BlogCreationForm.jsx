const BlogCreationForm = ({
    handleOnSubmit,
    title,
    handleTitleChange,
    author,
    handleAuthorChange,
    blogUrl,
    handleUrlChange,
}) => {
    return (
        <>
            Create new blog
            <form onSubmit={handleOnSubmit}>
                <div>
                    Title: <input onChange={handleTitleChange} value={title} />
                </div>
                <div>
                    Author:
                    <input onChange={handleAuthorChange} value={author} />
                </div>
                <div>
                    Url: <input onChange={handleUrlChange} value={blogUrl} />
                </div>
                <div>
                    <button
                        disabled={!title || !author || !blogUrl}
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
