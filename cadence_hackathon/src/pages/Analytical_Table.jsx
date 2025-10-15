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
    <div className='page_layout'>
      <h2 className='pageHeading'>RSU Breakdown Table</h2>

      <table
        className='homeTable'
      >
        <thead>
          <tr>
            <th className='homeTableColumnHeadings'>R</th>
            <th className='homeTableColumnHeadings'>S</th>
            <th className='homeTableColumnHeadings'>U</th>
            <th className='homeTableColumnHeadings'>Count</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((row, index) => (
            <tr key={index} style={{ backgroundColor: 'white' }}>
              <td style={{ border: '2px solid black', padding: '10px', textAlign: 'center', color: 'black' }}>{row.R}</td>
              <td style={{ border: '2px solid black', padding: '10px', color: 'black',textAlign: 'center' }}>{row.S}</td>
              <td style={{ border: '2px solid black', padding: '10px', color: 'black',textAlign: 'center' }}>{row.U}</td>
              <td style={{ border: '2px solid black', padding: '10px', color: 'black',textAlign: 'center' }}>{row.Count}</td>
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
