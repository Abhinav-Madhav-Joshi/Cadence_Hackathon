import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DDTable() {
  const [data, setData] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [remarkInput, setRemarkInput] = useState('');
  const [dateInput, setDateInput] = useState(null);

  const fetchData = async () => {
    const res = await fetch('http://localhost:5000/api/data-table');
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemarkEdit = (ticket, currentRemark) => {
    setEditingTicket(ticket);
    setRemarkInput(currentRemark);
  };

  const saveRemark = async (ticket) => {
    await fetch('http://localhost:5000/api/data-table/remark', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket, newRemark: remarkInput }),
    });
    setEditingTicket(null);
    fetchData();
  };

  const saveDate = async (ticket, date) => {
    const formattedDate = date.toISOString().slice(0, 10);
    await fetch('http://localhost:5000/api/data-table/date', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket, newDate: formattedDate }),
    });
    fetchData();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>3. Detailed Data Table</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', backgroundColor: 'white' }}>
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
            <th>Remarks</th>
            <th>Audit Trail</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
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
              <td>{row.RemarkExists}</td>
              <td>
                {editingTicket === row.Ticket ? (
                  <>
                    <input
                      value={remarkInput}
                      onChange={(e) => setRemarkInput(e.target.value)}
                    />
                    <button onClick={() => saveRemark(row.Ticket)}>Save</button>
                  </>
                ) : (
                  <>
                    {row.Remarks}
                    <button onClick={() => handleRemarkEdit(row.Ticket, row.Remarks)} style={{ marginLeft: '10px' }}>
                      Edit
                    </button>
                  </>
                )}
              </td>
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
