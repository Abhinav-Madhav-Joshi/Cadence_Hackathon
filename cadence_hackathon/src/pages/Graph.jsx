import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

function Graph() {
  const [data, setData] = useState([]);
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
      <h2 style={{ color: 'black' }}>2. Graph Visualization</h2>

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
            <BarChart width={Math.max(data.length * 120, 700)} height={400} data={data}>
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
            data={data.map(item => ({ name: item.Key, value: item.Total }))}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
          </Pie>
          <Tooltip />
        </PieChart>
      )}
    </div>
  );
}

export default Graph;
