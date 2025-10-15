import React, { useEffect, useState } from 'react';

function ATable() {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/data-table');
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Group RSU into R, S, U and count
  const groupByRSU = (data) => {
    const counts = {};

    data.forEach((row) => {
      if (!row.RSU || row.RSU.length < 3) return;

      const R = row.RSU[0];
      const S = row.RSU[1];
      const U = row.RSU[2];

      const key = `${R}-${S}-${U}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const grouped = Object.entries(counts).map(([key, count]) => {
      const [R, S, U] = key.split('-');
      return { R, S, U, Count: count };
    });

    setGroupedData(grouped);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) groupByRSU(data);
  }, [data]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'black' }}>RSU Breakdown Table</h2>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          color: 'black',
          marginTop: '20px',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            <th style={{ border: '2px solid black', padding: '10px' }}>R</th>
            <th style={{ border: '2px solid black', padding: '10px' }}>S</th>
            <th style={{ border: '2px solid black', padding: '10px' }}>U</th>
            <th style={{ border: '2px solid black', padding: '10px' }}>Count</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((row, index) => (
            <tr key={index} style={{ backgroundColor: '#ffeb3b' }}>
              <td style={{ border: '2px solid black', padding: '10px', textAlign: 'center' }}>{row.R}</td>
              <td style={{ border: '2px solid black', padding: '10px', textAlign: 'center' }}>{row.S}</td>
              <td style={{ border: '2px solid black', padding: '10px', textAlign: 'center' }}>{row.U}</td>
              <td style={{ border: '2px solid black', padding: '10px', textAlign: 'center' }}>{row.Count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {groupedData.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No data available</p>
      )}
    </div>
  );
}

export default ATable;
