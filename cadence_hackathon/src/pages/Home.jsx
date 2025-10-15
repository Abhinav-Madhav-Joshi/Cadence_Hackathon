import { useState, useEffect } from 'react';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/dashboard/overview');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
        <h1 style={{ 
            padding: '20px', 
            backgroundColor: '#333', 
            color: 'white',
            margin: 0 
        }}>
            Cadence Mini Hackathon Dashboard
        </h1>
      <h2 style={{ color: 'black' }}>1. Dashboard Overview Table</h2>
      
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: 'white'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            <th style={{ border: '2px solid black', padding: '12px' }}>S.NO</th>
            <th style={{ border: '2px solid black', padding: '12px' }}>Key</th>
            <th style={{ border: '2px solid black', padding: '12px' }}>P0</th>
            <th style={{ border: '2px solid black', padding: '12px' }}>P1</th>
            <th style={{ border: '2px solid black', padding: '12px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} style={{ backgroundColor: '#ffeb3b' }}>
              <td style={{ border: '2px solid black', padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>
                {index + 1}
              </td>
              <td style={{ border: '2px solid black', padding: '10px', color: 'black', fontSize: '18px' }}>
                {row.Key}
              </td>
              <td style={{ border: '2px solid black', padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>
                {row.P0}
              </td>
              <td style={{ border: '2px solid black', padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>
                {row.P1}
              </td>
              <td style={{ border: '2px solid black', padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>
                {row.Total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
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
          fontSize: '16px'
        }}
      >
        Refresh Data
      </button>
    </div>
  );
}

export default Home;