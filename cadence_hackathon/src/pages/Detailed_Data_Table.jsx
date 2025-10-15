import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DDTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState('All');
  const [editingTicket, setEditingTicket] = useState(null);
  const [remarkInput, setRemarkInput] = useState('');
  const [showRemarks, setShowRemarks] = useState(true);
  const [expandedRemarks, setExpandedRemarks] = useState({});
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchData = async () => {
    const res = await fetch('http://localhost:5000/api/data-table');
    const result = await res.json();
    setData(result);
    setFilteredData(result);

    // Get all unique keys for dropdown filter
    const uniqueKeys = [...new Set(result.map((row) => row.Key))];
    setKeys(uniqueKeys);
  };

  // Filter table based on selected key
  useEffect(() => {
    if (selectedKey === 'All') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((row) => row.Key === selectedKey));
    }
  }, [selectedKey, data]);

  // Apply sorting
  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData];
    if (sortColumn) {
      sortableData.sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        // Handle Date column properly
        if (sortColumn === 'Date') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortColumn, sortDirection]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemarkEdit = (ticket, currentRemark) => {
    setEditingTicket(ticket);
    setRemarkInput(currentRemark);
  };

  const saveRemark = async (ticket) => {
    const remarkExists = remarkInput.trim() === '' ? 'N' : 'Y';
    await fetch('http://localhost:5000/api/data-table/remark', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket, newRemark: remarkInput, remarkExists }),
    });
    setEditingTicket(null);
    fetchData();
  };

  const saveDate = async (ticket, date) => {
    const formattedDate =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0');
    await fetch('http://localhost:5000/api/data-table/date', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket, newDate: formattedDate }),
    });
    fetchData();
  };

  const toggleShowRemarks = () => {
    setShowRemarks((prev) => !prev);
  };

  const toggleRemarkExpanded = (ticket) => {
    setExpandedRemarks((prev) => ({
      ...prev,
      [ticket]: !prev[ticket],
    }));
  };

  // Handle dropdown change for sorting
  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setSortColumn('');
    } else {
      setSortColumn(value);
      setSortDirection('asc'); // default ascending
    }
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className='page_layout'>
      <h1 className='pageHeading'>Detailed Data Table</h1>

      {/* Filter by Key */}
      <div style={{ marginBottom: '20px' }}>
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
      </div>

      {/* Sorting dropdown */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold', color: 'black' }}>Sort by Column:</label>
        <select
          value={sortColumn}
          onChange={handleSortChange}
          style={{ padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">None</option>
          <option value="Key">Key</option>
          <option value="Ticket">Ticket</option>
          <option value="RSU">RSU</option>
          <option value="Escalation">Escalation</option>
          <option value="Priority">Priority</option>
          <option value="Date">Date</option>
          <option value="ProdLevel2">ProdLevel2</option>
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

      {/* Show Remarks Toggle */}
      <label style={{ marginBottom: '10px', display: 'inline-block', color: 'black' }}>
        <input
          type="checkbox"
          checked={showRemarks}
          onChange={toggleShowRemarks}
          style={{ marginRight: '8px' }}
        />
        Show Remarks Column
      </label>

      {/* Table */}
      <table border="1" cellPadding="10" style={{ width: '100%', backgroundColor: 'white', color: 'black' }}>
        <thead>
          <tr>
            <th>Key</th>
            <th>Ticket</th>
            <th>RSU</th>
            <th>Escalation</th>
            <th>Priority</th>
            <th>Date</th>
            <th>ProdLevel2</th>
            <th>Remark Exists (Y/N)</th>
            {showRemarks && <th>Remarks</th>}
            <th>Audit Trail</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.Ticket}>
              <td>{row.Key}</td>
              <td>{row.Ticket}</td>
              <td>{row.RSU}</td>
              <td>{row.Escalation}</td>
              <td>{row.Priority}</td>
              <td>
                <DatePicker
                  selected={row.Date ? new Date(row.Date) : null}
                  onChange={(date) => saveDate(row.Ticket, date)}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="bottom"
                />
              </td>
              <td>{row.ProdLevel2}</td>
              <td>
                <button
                  style={{
                    backgroundColor: row.RemarkExists === 'Y' ? '#4CAF50' : '#ccc',
                    color: row.RemarkExists === 'Y' ? 'white' : '#555',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: row.RemarkExists === 'Y' ? 'pointer' : 'default',
                  }}
                  disabled={row.RemarkExists !== 'Y'}
                  onClick={() => toggleRemarkExpanded(row.Ticket)}
                  title={row.RemarkExists === 'Y' ? 'Show/Hide Remarks' : 'No Remarks'}
                >
                  {row.RemarkExists}
                </button>
              </td>
              {showRemarks && (
                <td>
                  {editingTicket === row.Ticket ? (
                    <>
                      <input
                        value={remarkInput}
                        onChange={(e) => setRemarkInput(e.target.value)}
                        style={{ width: '100%' }}
                      />
                      <button onClick={() => saveRemark(row.Ticket)} style={{ marginLeft: '5px' }}>
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      {expandedRemarks[row.Ticket] ? (
                        <>
                          <pre style={{ whiteSpace: 'pre-wrap' }}>{row.Remarks || 'No remarks'}</pre>
                          <button
                            onClick={() => handleRemarkEdit(row.Ticket, row.Remarks)}
                            style={{ marginTop: '5px' }}
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        <button onClick={() => toggleRemarkExpanded(row.Ticket)}>Show Remarks</button>
                      )}
                    </>
                  )}
                </td>
              )}
              <td>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{row.AuditTrail}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DDTable;
