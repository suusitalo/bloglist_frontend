import React, { forwardRef, useImperativeHandle, useState } from 'react';

const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
};

const Blog = forwardRef((props, ref) => {
    const [isExpanded, setExpanded] = useState(false);
    const { blog, handleLikeButtonClick, handleBlogDelete, userId } = props;

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
    };

    useImperativeHandle(ref, () => {
        return {
            toggleExpanded,
        };
    });

    const isBlogAddedByUser = blog.user === userId;

    return (
        <div style={blogStyle}>
            {blog?.title} {blog?.author}
            <button onClick={toggleExpanded}>
                {!isExpanded ? 'view' : 'hide'}
            </button>
            {isExpanded && (
                <div>
                    {blog?.url}
                    <br />
                    likes {blog?.likes}
                    <button onClick={() => handleLikeButtonClick(blog)}>
                        like
                    </button>
                    <br />
                    {blog?.author}
                    {isBlogAddedByUser && (
                        <button onClick={() => handleBlogDelete(blog)}>
                            Remove
                        </button>
                    )}
                </div>
            )}
        </div>
    );
});

Blog.displayName = 'Blog';
export default Blog;
