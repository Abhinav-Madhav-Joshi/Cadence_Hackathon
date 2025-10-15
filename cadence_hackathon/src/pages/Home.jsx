import { useState, useEffect, useMemo } from 'react';
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
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/dashboard/overview');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();

      setData(result);
      setFilteredData(result);

      const uniqueKeys = [...new Set(result.map((row) => row.Key))];
      setKeys(uniqueKeys);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected key
  useEffect(() => {
    if (selectedKey === 'All') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((row) => row.Key === selectedKey));
    }
  }, [selectedKey, data]);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!filteredData) return [];
    let sortable = [...filteredData];
    if (sortColumn) {
      sortable.sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        // Handle numeric columns safely
        if (['P0', 'P1', 'Total'].includes(sortColumn)) {
          aValue = Number(aValue ?? 0);
          bValue = Number(bValue ?? 0);
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredData, sortColumn, sortDirection]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setSortColumn('');
    } else {
      setSortColumn(value);
      setSortDirection('asc');
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div className='page_layout'>
      <h1 className='pageHeading'>Dashboard Overview</h1>

      {/* Filters */}
      <div className='homeFilter'>
        <label style={{ marginRight: '10px', fontWeight: 'bold', color: 'black' }}>Filter by Key:</label>
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="All">All</option>
          {keys.map((key, i) => (
            <option key={i} value={key}>{key}</option>
          ))}
        </select>

        {/* Sorting */}
        <label style={{ marginLeft: '20px', marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
          Sort by Column:
        </label>
        <select
          value={sortColumn}
          onChange={handleSortChange}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">None</option>
          <option value="Key">Key</option>
          <option value="P0">P0</option>
          <option value="P1">P1</option>
          <option value="Total">Total</option>
        </select>
        {sortColumn && (
          <button
            onClick={toggleSortDirection}
            style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
          >
            {sortDirection === 'asc' ? 'Asc ▲' : 'Desc ▼'}
          </button>
        )}
      </div>

      {/* Table */}
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
            {sortedData.map((row, index) => (
              <tr key={index} style={{ backgroundColor: 'white' }}>
                <td style={{ padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>{index + 1}</td>
                <td style={{ padding: '10px', color: 'black', fontSize: '18px' }}>{row.Key}</td>
                <td style={{ padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>{row.P0}</td>
                <td style={{ padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>{row.P1}</td>
                <td style={{ padding: '10px', textAlign: 'center', color: 'black', fontSize: '18px' }}>{row.Total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedData.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: 'black' }}>No data available</p>
        )}

        {/* Refresh Button */}
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

        {/* Charts */}
        <div className='homeCharts'>
          <h2 style={{ color: 'black' }}>Graph Visualization</h2>

          {/* Toggle chart view */}
          <div style={{ marginBottom: '20px' }}>
            <button className='homeButtons' onClick={() => setView("bar")} style={{ padding: '8px', marginRight: '10px', cursor: 'pointer' }}>
              Bar Chart
            </button>
            <button className='homeButtons' onClick={() => setView("pie")} style={{ padding: '8px', cursor: 'pointer' }}>
              Pie Chart
            </button>
          </div>

          {/* Bar Chart */}
          {view === "bar" && (
            <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
              <BarChart width={Math.max(sortedData.length * 120, 700)} height={400} data={sortedData}>
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

          {/* Pie Chart */}
          {view === "pie" && (
            <PieChart width={700} height={400}>
              <Pie
                data={sortedData.map(item => ({ name: item.Key, value: item.Total }))}
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
