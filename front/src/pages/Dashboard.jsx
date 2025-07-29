import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Dashboard.css'

const url = import.meta.env.VITE_URL;
const Dashboard = () => {
  const token = localStorage.getItem('token');
  const [name, setname] = useState('');
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
    getTests();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${url}/getInfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setname(response.data.firstname);
    } catch (err) {
      console.error("Error fetching user info:", err.response?.data || err.message);
    }
  };

  const getTests = async () => {
    try {
      const response = await axios.get(`${url}/getTests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setTests(response.data.tests);
    } catch (err) {
      console.error("Error fetching tests:", err.response?.data || err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-heading">Welcome {name}</h1>
        <div style={{ textAlign: 'center' }}>
          <button className="dashboard-button" onClick={() => navigate('/test')}>Take a Test</button>
          <button className="dashboard-button" onClick={() => navigate('/main')}>Create a Test</button>
         
        </div>

        <div className="previousTests">
          {tests.length > 0 ? (
            <>
              <h2 style={{color:'white'}}>Previous Tests:</h2>
              {tests.map((test, index) => (
                <div key={index} className="test-card">
                  <p style={{color:'white'}}><strong style={{color:'white'}}>Test {index + 1}:</strong> {test.code}
                  </p>
                  <p style={{color:'white'}}><strong style={{color:'white'}}>Name:</strong> {test.name}</p>
                  <button onClick={() => navigate('/report', { state: { code: test.code } })}>Report</button>
                </div>
              ))}
            </>
          ) : (
            <p>No previous tests available.</p>
          )}
        </div>
        <button className="dashboard-button-logout" onClick={() => navigate('/login')}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
