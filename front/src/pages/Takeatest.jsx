import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";
import '../style/Test1.css';
const url = import.meta.env.VITE_URL;

function TakeaTest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const location = useLocation();
  const course = location.state?.course || "unknown";
  const name = location.state?.name || "unknown";
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${url}/import/${course}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setQuestions(response.data.quiz);
      } catch (err) {
        console.error("Error fetching quiz:", err.response?.data || err.message);
        alert("Invalid Code or Failed to load quiz.");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [token]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetQuestionState();
    }
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setFinalAnswer(null);
    setAnswerStatus({});
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return; // Prevent submitting without selection

    const correctAnswer = questions[currentIndex].answer;

    setFinalAnswer(selectedOption);

    if (correctAnswer === selectedOption) {
      setCorrectAnswers(prev => prev + 1);
    }

    setAnswerStatus({
      [correctAnswer]: "greenyellow",
      [selectedOption]: selectedOption === correctAnswer ? "greenyellow" : "red",
    });

    setIsSubmitted(true);
  };

  if (loading) {
    return (
      <div className="body99">
        <div className="content">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    );
  }

const handleFinish = () => {
  if (currentIndex === questions.length - 1) {
    alert(`You have completed the quiz! Your score is ${correctAnswers} out of ${questions.length}.`);
    axios.post(`${url}/submit-quiz`, {
      code: location.state?.course,
      totalQuestions: questions.length,
      score: correctAnswers,
      percentage: (correctAnswers / questions.length) * 100,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      alert("Quiz submitted successfully!");
      navigate("/dashboard");
    })
    .catch(err => {
      console.error("Error submitting quiz:", err.response?.data || err.message);
    });
  } else {
    alert("Please complete all questions before finishing the test.");
  }
};

  return (
    <>
      <h1>QUIZ : {name.toUpperCase()} </h1>
      
      <div className="body">
        <div className="body1">
          {questions.length > 0 && (
            <>
              <div className="questions">
                <h2>{currentIndex + 1}. {questions[currentIndex].question}</h2>
                {questions[currentIndex].options.map((option, index) => (
                  <h4 key={index} style={{}}>
                    <input
                      className="option-input"
                      type="radio"
                      value={index}
                      name="opt"
                      checked={selectedOption === index}
                      onChange={() => setSelectedOption(index)}
                    />{" "}
                    {option}
                  </h4>
                ))}
              </div>
              <div className="buttons">
                <button onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
                {/* <button onClick={handlePrevious} disabled={currentIndex <= 0}>Previous</button> */}
                <button onClick={handleNext} disabled={!isSubmitted || currentIndex === questions.length - 1}>Next</button>
                <button onClick={handleFinish} style={{display: currentIndex === questions.length - 1 ? 'block' : 'none'}} 
                  disabled={!isSubmitted || currentIndex !== questions.length - 1}
                  >Finish Test</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default TakeaTest;
