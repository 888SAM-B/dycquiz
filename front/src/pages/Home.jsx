import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
           
            <div className="home-container">
                <div className="home-card">
                    <h1 className="home-title">Welcome to the Quiz App</h1>
                    <p className="home-subtitle">Test your brain. Compete. Have fun!</p>
                    <div className="button-group">
                        <button className="btn login-btn" onClick={() => navigate('/login')}>
                            Login
                        </button>
                        <button className="btn register-btn" onClick={() => navigate('/register')}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
