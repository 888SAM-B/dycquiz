  import React from 'react'
  import { use } from 'react';
  import { useEffect,useState } from 'react';
  import axios from 'axios';
  import { useLocation } from 'react-router-dom';
  const url = import.meta.env.VITE_URL;
  const report = () => {
      const token = localStorage.getItem('token');
      if (!token) {
          return <div>Please log in to view the report.</div>;
      }

      const location = useLocation();
      const { code } = location.state || " ";
      const [name,setName] =useState("")
      const [total,setTotal] =useState(0)
      const [results,setResults] =useState([])

      useEffect(() => {
          const fetchReport = async () => {
    try {
      const response = await axios.get(`${url}/report?code=${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      const res=response.data
      setName(res.name);
      setResults(res.results);
      setTotal(res.totalQuestion)
    } catch (err) {
      console.error("Error fetching report:", err.response?.data || err.message);
    }
  };
          fetchReport();
      }, []);
    return (
  <div>
    <h2>{name.toUpperCase()}</h2>
    <table border={1} style={{ width: '100%', textAlign: 'left' , padding: '0px'}}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Score (Total : {total})</th>
          <th>Percentage</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {results.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.username}</td>
            <td>{item.score}</td>
            <td>{item.percentage}%</td>
            <td>{item.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

  }

  export default report