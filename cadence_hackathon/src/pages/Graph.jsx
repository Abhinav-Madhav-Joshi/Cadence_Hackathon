// import { useState, useEffect } from 'react';
// import { 
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie 
// } from 'recharts';

// function Graph() {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [view, setView] = useState("bar");
//   const [selectedKey, setSelectedKey] = useState("All");
//   const [keys, setKeys] = useState([]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:5000/api/dashboard/overview');
//       if (!response.ok) throw new Error('Failed to fetch data');
//       const result = await response.json();
//       setData(result);
//       setKeys(["All", ...new Set(result.map(item => item.Key))]);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (selectedKey === "All") {
//       setFilteredData(data);
//     } else {
//       setFilteredData(data.filter(item => item.Key === selectedKey));
//     }
//   }, [data, selectedKey]);

//   if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
//   if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

//   return (
//     <div style={{ padding: '20px', backgroundColor: 'white' }}>
//       <h2 style={{ color: 'black' }}>2. Graph Visualization</h2>

//       {/* Dropdown filter */}
//       <div style={{ marginBottom: '20px' }}>
//         <label style={{ marginRight: '10px' }}>Filter by Key:</label>
//         <select 
//           value={selectedKey} 
//           onChange={(e) => setSelectedKey(e.target.value)}
//           style={{ padding: '5px' }}
//         >
//           {keys.map((key, index) => (
//             <option key={index} value={key}>{key}</option>
//           ))}
//         </select>
//       </div>

//       {/* Toggle Buttons */}
//       <div style={{ marginBottom: '20px' }}>
//         <button onClick={() => setView("bar")} style={{ padding: '8px', marginRight: '10px', cursor: 'pointer' }}>
//           Bar Chart
//         </button>
//         <button onClick={() => setView("pie")} style={{ padding: '8px', cursor: 'pointer' }}>
//           Pie Chart
//         </button>
//       </div>

//       {/* BAR CHART */}
//       {view === "bar" && (
//         <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
//           <BarChart width={Math.max(filteredData.length * 120, 700)} height={400} data={filteredData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="Key" angle={-45} textAnchor="end" interval={0} height={80} />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="P0" fill="#8884d8" />
//             <Bar dataKey="P1" fill="#82ca9d" />
//           </BarChart>
//         </div>
//       )}

//       {/* PIE CHART */}
//       {view === "pie" && (
//         <PieChart width={700} height={400}>
//           <Pie
//             data={filteredData.map(item => ({ name: item.Key, value: item.Total }))}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={150}
//             fill="#8884d8"
//           />
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       )}
//     </div>
//   );
// }

// export default Graph;
