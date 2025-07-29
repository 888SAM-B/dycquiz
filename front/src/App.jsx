// import './App.css'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import MainPage from './pages/MainPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Test from './pages/Test'
import Dashboard from './pages/Dashboard'
import Takeatest from './pages/Takeatest'
import Report from './pages/Report'


function App() {
  return (
   <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/main" element={<MainPage/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/test" element={<Test/>}/>
        <Route path="/takeatest" element={<Takeatest/>}/>
        <Route path="/report" element={<Report/>}/>
      </Routes>
    </div>
  )
}
export default App;