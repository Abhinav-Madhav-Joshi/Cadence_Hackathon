import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home';
import Graph from './pages/Graph';
import Navbar from './Components/Navbar';
import DDTable from './pages/Detailed_Data_Table';
import './App.css'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graphs" element={<Graph />} />
        <Route path="/ddt" element={<DDTable />} />
      </Routes>
    </div>
  )
}

export default App
