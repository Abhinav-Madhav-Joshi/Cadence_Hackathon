import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie 
} from 'recharts';

function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("bar"); // bar or pie

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/dashboard/overview');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();

      setData(result);
      setFilteredData(result);

      // Extract all unique keys for dropdown
      const uniqueKeys = [...new Set(result.map((row) => row.Key))];
      setKeys(uniqueKeys);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter the table and chart based on selected key
  useEffect(() => {
    if (selectedKey === 'All') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((row) => row.Key === selectedKey));
    }
  }, [selectedKey, data]);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div className='home-page'>
        <h1 className='homeHeading'> Dashboard Overview</h1>

        <div className='homeFilter'>
        <label style={{ marginRight: '10px', fontWeight: 'bold', color: 'black' }}>Filter by Key:</label>
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="All">All</option>
          {keys.map((key, i) => (
            <option key={i} value={key}>
              {key}
            </option>
          ))}
        </select>
        </div>

      <div className='homeData'>
        <div>
      <table className='homeTable'>
        <thead>
          <tr>
            <th className='homeTableColumnHeadings'>S.NO</th>
            <th className='homeTableColumnHeadings'>Key</th>
            <th className='homeTableColumnHeadings'>P0</th>
            <th className='homeTableColumnHeadings'>P1</th>
            <th className='homeTableColumnHeadings'>Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} style={{ backgroundColor: 'white' }}>
              <td style={{ padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>
                {index + 1}
              </td>
              <td style={{ padding: '10px', color: 'black', fontSize: '18px' }}>{row.Key}</td>
              <td style={{ padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>{row.P0}</td>
              <td style={{ padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>{row.P1}</td>
              <td style={{ padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>{row.Total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'black' }}>No data available</p>
      )}

      <button
        onClick={fetchData}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
          fontSize: '16px',
        }}
      >
        Refresh Data
      </button>
      </div>

      <div className='homeCharts'>
        <h2 style={{ color: 'black' }}>Graph Visualization</h2>

        {/* Toggle Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setView("bar")} style={{ padding: '8px', marginRight: '10px', cursor: 'pointer' }}>
            Bar Chart
          </button>
          <button onClick={() => setView("pie")} style={{ padding: '8px', cursor: 'pointer' }}>
            Pie Chart
          </button>
        </div>

        {/* BAR CHART */}
        {view === "bar" && (
          <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
            <BarChart width={Math.max(filteredData.length * 120, 700)} height={400} data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Key" angle={-45} textAnchor="end" interval={0} height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="P0" fill="#8884d8" />
              <Bar dataKey="P1" fill="#82ca9d" />
            </BarChart>
          </div>
        )}

        {/* PIE CHART */}
        {view === "pie" && (
          <PieChart width={700} height={400}>
            <Pie
              data={filteredData.map(item => ({ name: item.Key, value: item.Total }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
            />
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>
      </div>
    </div>
  );
}

export default Home;
