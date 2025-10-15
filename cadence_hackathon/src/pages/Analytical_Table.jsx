import React, { useEffect, useState } from 'react';

function ATable() {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [selectedRSU, setSelectedRSU] = useState(null); // {R, S, U}
  const [showDetail, setShowDetail] = useState(false);

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

  // Get detailed records for selected R-S-U
  const getDetailedRecords = (R, S, U) => {
    return data.filter(
      (row) =>
        row.RSU &&
        row.RSU.length >= 3 &&
        row.RSU[0] === R &&
        row.RSU[1] === S &&
        row.RSU[2] === U
    );
  };

  const handleCountClick = (row) => {
    setSelectedRSU(row);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedRSU(null);
  };

  return (
    <div className='page_layout'>
      {!showDetail ? (
        <>
          <h1 className='pageHeading'>RSU Breakdown Table</h1>

          <table className='home_AT_Table'>
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
                  <td style={{ padding: '10px', textAlign: 'center', color: 'black' }}>{row.R}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'black' }}>{row.S}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'black' }}>{row.U}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'blue', cursor: 'pointer' }}
                      onClick={() => handleCountClick(row)}>
                    {row.Count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {groupedData.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No data available</p>
          )}
        </>
      ) : (
        <>
          <h1 className='pageHeading'>
            Detailed Records for R={selectedRSU.R}, S={selectedRSU.S}, U={selectedRSU.U}
          </h1>
          <button onClick={handleBack} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
            Back to RSU Breakdown
          </button>

          <table cellPadding="10" style={{ width: '100%', backgroundColor: 'grey', color: 'black', borderRadius: '10px' }}>
            <thead>
              <tr>
                {Object.keys(data[0] || {}).map((key) => (
                  <th key={key} className='homeTableColumnHeadings'>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getDetailedRecords(selectedRSU.R, selectedRSU.S, selectedRSU.U).map((row, index) => (
                <tr key={index} style={{ backgroundColor: 'white' }}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} style={{ padding: '10px', color: 'black' }}>
                      {value?.toString() || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {getDetailedRecords(selectedRSU.R, selectedRSU.S, selectedRSU.U).length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No records found</p>
          )}
        </>
      )}
    </div>
  );
}

export default ATable;
