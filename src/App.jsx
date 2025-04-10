import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/python');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/python', {
        question: question,
        options: [option1, option2, option3, option4],
        answer: answer,
      });
      console.log('Question saved:', response.data);

      const updated = await axios.get('http://localhost:3002/python');
      setData(updated.data);

      setQuestion('');
      setOption1('');
      setOption2('');
      setOption3('');
      setOption4('');
      setAnswer('');
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  return (
    <>
      <h1>FIRST COMMERCIAL PROJECT - QUIZ APP</h1>
      <form onSubmit={handleSubmit}>
        <div className="question-row">
          <label htmlFor="question">Question</label>
          <input
            type="text"
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="options-row">
          <div className="option">
            <label htmlFor="option1">Option 1</label>
            <input
              type="text"
              name="option1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              required
            />
          </div>
          <div className="option">
            <label htmlFor="option2">Option 2</label>
            <input
              type="text"
              name="option2"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              required
            />
          </div>
          <div className="option">
            <label htmlFor="option3">Option 3</label>
            <input
              type="text"
              name="option3"
              value={option3}
              onChange={(e) => setOption3(e.target.value)}
              required
            />
          </div>
          <div className="option">
            <label htmlFor="option4">Option 4</label>
            <input
              type="text"
              name="option4"
              value={option4}
              onChange={(e) => setOption4(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="answer-row">
          <label htmlFor="answer">Answer</label>
          <input
            type="number"
            min={0}
            max={3}
            name="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>

        <button type="submit">Save</button>
      </form>

      <h2>All Questions</h2>
      <div className="questions-list">
        {data.map((item, index) => (
          <div key={index} className="question-item">
            <div className="saved-question">Question: {item.question}</div>
            <div className="saved-options">
              {item.options.map((opt, optIndex) => (
                <span key={optIndex} className="saved-option">
                  {optIndex + 1}. {opt}
                </span>
              ))}
            </div>
            <div className="saved-answer">
              Answer: {item.options[item.answer]} (Option {Number(item.answer) + 1})
            </div>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;