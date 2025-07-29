import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaAngleDoubleUp } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import '../style/MainPage.css'

const url = import.meta.env.VITE_URL;

function MainPage() {
  const [data, setData] = useState([]);
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [answer, setAnswer] = useState('');
  const [code, setCode] = useState('');
  const [question, setQuestion] = useState('');
  const [visibility, setEditVisibility] = useState('none');
  const [visibility1, setQuestionsVisibility] = useState('block');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editElement, setEditElement] = useState({});
  const [codeVisibility, setCodeVisibility] = useState('none');
  const [showButton, setShowButton] = useState(false);
  const [testName, setTestName] = useState('');

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/python`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data.completedcourses);
        setTestName(response.data.title);
      } catch (error) {
        alert("Error Occurred. Try logging in again.");
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      question,
      options: [option1, option2, option3, option4],
      answer,
    };

    try {
      await axios.post(`${url}/python`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = await axios.get(`${url}/python`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(updated.data.completedcourses);
      resetForm();
      setTestName(updated.data.title);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOption1('');
    setOption2('');
    setOption3('');
    setOption4('');
    setAnswer('');
    setIsEditing(false);
    setEditId(null);
    setEditVisibility('none');
    setQuestionsVisibility('block');
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Delete this question?')) return;

    try {
      await axios.post(`${url}/remove_item`, { cid: id }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const refreshed = await axios.get(`${url}/python`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(refreshed.data.completedcourses);
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  const handleEdit1 = (item, id) => {
    setEditVisibility('block');
    setQuestionsVisibility('none');
    setQuestion(item.question);
    setOption1(item.options[0] || '');
    setOption2(item.options[1] || '');
    setOption3(item.options[2] || '');
    setOption4(item.options[3] || '');
    setAnswer(item.answer);
    setIsEditing(true);
    setEditId(id);
    setEditElement(item);
  };

  const exportQuiz = async () => {
    if (!testName.trim()) return alert("Test name is required!");

    const payload = {
      questions: data,
      testName,
      totalQuestions: data.length,
    };

    try {
      await axios.post(`${url}/export`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCode();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const fetchCode = async () => {
    try {
      const response = await axios.get(`${url}/get-code`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCode(response.data.code);
      setCodeVisibility('flex');
    } catch (error) {
      console.error('Code fetch error:', error);
    }
  };

  const handleEdit2 = async () => {
    const payload = {
      question: question?.trim(),
      options: [option1?.trim(), option2?.trim(), option3?.trim(), option4?.trim()],
      answer,
    };

    const dataToSend = {
      itemId: editId,
      updateValue: payload,
      title1: testName?.trim(),
    };

    if (
      editId === null ||
      !payload.question ||
      payload.options.some(opt => !opt) ||
      payload.answer === "" ||
      !dataToSend.title1
    ) {
      console.error("Validation failed");
      return;
    }

    try {
      await axios.post(`${url}/edit_item`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const handleTitle = async () => {
    if (!testName.trim()) return;

    const payload = { title: testName.trim() };

    try {
      await axios.post(`${url}/update-title`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Title update error:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert("Code copied!");
        setCodeVisibility('none');
        navigate('/dashboard');
        clearNow();
      })
      .catch(err => console.error("Copy error:", err));
  };

  const clearNow = async () => {
    try {
      await axios.post(`${url}/delete-quiz`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Clear error:', error);
    }
  };

  const clearAll = () => {
    if (window.confirm('Clear all questions?')) clearNow();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <h1>QUIZ</h1>

      <label htmlFor="testName">Name this Test</label>
      <input
        type="text"
        id="testName"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        onBlur={handleTitle}
        autoFocus
      />

      <div className="buttons">
        <button onClick={() => setEditVisibility('block')} className="addButton">Add a Question</button>
        {data.length > 0 && (
          <button onClick={exportQuiz} className="addButton">Export Quiz</button>
        )}
      </div>

      <div className="editarea" style={{ display: visibility }}>
        <div className="editAreaContents">
          <h1>{isEditing ? 'EDIT' : 'ADD'}</h1>
          <form onSubmit={handleSubmit}>
            <label>Question</label>
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />

            {[option1, option2, option3, option4].map((opt, i) => (
              <div key={i}>
                <label>{`Option ${i + 1}`}</label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const setters = [setOption1, setOption2, setOption3, setOption4];
                    setters[i](e.target.value);
                  }}
                  required
                />
              </div>
            ))}

            <label>Answer (1-4)</label>
            <input
              type="number"
              min="1"
              max="4"
              value={Number(answer) + 1}
              onChange={(e) => setAnswer(e.target.value - 1)}
              required
            />

            <div className="buttons1">
              {isEditing ? (
                <input type="button" className="update" value="UPDATE" onClick={handleEdit2} />
              ) : (
                <button type="submit" className='save-btn'>Save</button>
              )}
              <input
                type="button"
                className="cancel"
                value="CANCEL"
                onClick={resetForm}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="displayArea" style={{ display: visibility1 }}>
        {data.length > 0 && <h2>All Questions</h2>}
        <div className="questions-list">
          {data.map((item, index) => (
            <div key={item._id} className="question-item">
              <div>{index + 1}. {item.question}</div>
              <div>
                {item.options.map((opt, i) => (
                  <span key={i}>{opt}</span>
                ))}
              </div>
              <div>
                Answer: {item.options[item.answer]} (Option {Number(item.answer) + 1})
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => handleEdit1(item, index)} className='edit-btn'>Edit</button>
                <button onClick={() => handleRemove(index)} className='remove-btn'>Remove</button>
              </div>
              <hr />
            </div>
          ))}
        </div>

        {showButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '10px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 1000,
            }}
          >
            <FaAngleDoubleUp /> Go to Top
          </button>
        )}
      </div>

      {code && (
        <div className="quizcode" style={{ display: codeVisibility }}>
          <div className="code-container">
            <h1>YOUR QUIZ CODE: {code}</h1>
            <button onClick={handleCopy}>Copy Value</button>
          </div>
        </div>
      )}

      <button onClick={clearAll} className='clear-btn'>Clear</button>
    </>
  );
}

export default MainPage;
