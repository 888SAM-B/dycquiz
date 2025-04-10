import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [data, setData] = useState([])
  const [option1, setOption1] = useState("")
  const [option2, setOption2] = useState("")
  const [option3, setOption3] = useState("")
  const [option4, setOption4] = useState("")
  const [answer, setAnswer] = useState("")
  const [question, setQuestion] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/python")
        setData(response.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:3002/python", {
        question: question,options:[option1,option2,option3,option4],answer:answer
      })
      console.log("Question saved:", response.data)

      // Optional: Refresh data after post
      const updated = await axios.get("http://localhost:3002/python")
      setData(updated.data)

      setQuestion("")
      setOption1("") 
      setOption2("") 
      setOption3("") 
      setOption4("") 
      setAnswer('')
    } catch (error) {
      console.error("Error saving question:", error)
    }
  }

  return (
    <>
      <h1>FIRST COMMERCIAL PROJECT - QUIZ APP</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="question">Question</label>
        <input 
          type="text" 
          name="question" 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <br /> <br />
          <label htmlFor="option1">Option1</label>
        <input 
          type="text" 
          name="option1" 
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
          required
        />
        <br /> <br />
          <label htmlFor="option2">Option2</label>
        <input 
          type="text" 
          name="question" 
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
          required
        />
        <br /> <br />
          <label htmlFor="option3">Option3</label>
        <input 
          type="text" 
          name="option3" 
          value={option3}
          onChange={(e) => setOption3(e.target.value)}
          required
        /> <br /><br />
          <label htmlFor="option4">Option4</label>
        <input 
          type="text" 
          name="option4" 
          value={option4}
          onChange={(e) => setOption4(e.target.value)}
          required
        /> <br /><br />
        
        <label htmlFor="answer">Answer</label>
        <input 
          type="number"
          min={0}
          max={3} 
          name="answer" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        /> <br /><br />
        <button type="submit">Save</button>
      </form>

      <h2>All Questions</h2>
      <ul>
        {data.map((item, index) => (
          <>
          <li key={index}> question :{item.question}</li>
          <li>Options</li>
          <ul>
            {item.options.map((item1,index1)=>(
              <li>{item1}</li>
            ))}
          </ul>
          <li>answer :{item.answer}</li>
          <hr />
          </>
          
        ))}
      </ul>
    </>
  )
}

export default App
