import React from 'react';

const LoginForm = ({
    handleSubmit,
    username,
    setUsername,
    password,
    setPassword,
}) => (
    <>
        <h2>Login to application</h2>
        <form onSubmit={handleSubmit}>
            <div>
                Username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                Password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    </>
);

export default LoginForm;
