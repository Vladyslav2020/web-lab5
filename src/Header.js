import React, { useState } from 'react';
import User from './User';

const Header = ({ authData, login, logout, loading }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a
                    className="navbar-brand"
                    href=""
                    onClick={event => event.preventDefault()}
                >
                    Todos application
                </a>
                {authData.isAuthenticated ? (
                    <User name={authData.user.name} logout={logout} />
                ) : (
                    <button
                        className="btn btn-primary mt-3"
                        onClick={login}
                        disabled={loading}
                    >
                        Log in
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Header;
