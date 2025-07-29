import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Test.css'

const url = import.meta.env.VITE_URL;

const Test = () => {
  const [code, setCode] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a quiz code.');
      return;
    }

    try {
      const response = await axios.get(`${url}/import/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { quiz: fetchedQuiz, quizName } = response.data;

      if (!fetchedQuiz || fetchedQuiz.length === 0) {
        setError('No quiz found with this code.');
        return;
      }

      setQuiz(fetchedQuiz);
      setError('');
      alert(`Quiz Name: ${quizName}`);
      navigate('/takeatest', { state: { course: code, name: quizName } });

    } catch (err) {
      console.error('Error fetching quiz:', err.response?.data || err.message);
      setError('Invalid Code or Failed to load quiz.');
      setQuiz([]);
    }
  };

  return (
    <div className="test-container">
  <div className="test-card">
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className="test-input"
          placeholder="Enter Quiz Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <button type="submit" className="test-button">Submit</button>
    </form>

    {error && <div className="test-error">{error}</div>}
  </div>

  {quiz.length > 0 && (
    <div className="test-quiz">
      <h3>Quiz Questions:</h3>
      {quiz.map((q, index) => (
        <div key={index} className="test-question-card">
          <div className="card-body">
            <p><strong>Q{index + 1}:</strong> {q.question}</p>
            <ul className="list-group list-group-flush">
              {q.options.map((opt, idx) => (
                <li key={idx} className="list-group-item">{opt}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Test;
