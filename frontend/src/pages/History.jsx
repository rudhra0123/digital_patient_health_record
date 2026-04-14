// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/History.css";

// function PreviousRecords({ patientUid }) {
//   const [records, setRecords] = useState([]);
//   const [loadingSummary, setLoadingSummary] = useState({});
//   const [activeCard, setActiveCard] = useState(null);
//   const [showSummaryId, setShowSummaryId] = useState(null);
//   const [summaryError, setSummaryError] = useState({});
  

//   useEffect(() => {
//     const fetchRecords = async () => {
//       const patientId = localStorage.getItem("patientUid");
//       console.log("Fetching records for patient ID:", patientId);

//       const res = await axios.get(
//         `http://localhost:5000/api/records/history/${patientId}`
//       );


//       setRecords(res.data);
//     };

//     fetchRecords();
//   }, []);

//   const handleGenerateSummary = async (recordId) => {
//     try {
//       setLoadingSummary(prev => ({ ...prev, [recordId]: true }));
//       setSummaryError(prev => ({ ...prev, [recordId]: null }));

//       const res = await axios.post(
//         `http://localhost:5000/api/records/generate-summary/${recordId}`
//       );

//       // Update the record with the new summary
//       setRecords(records.map(record =>
//         record._id === recordId
//           ? { ...record, summary: res.data.summary }
//           : record
//       ));

//       // Show summary after successful API response
//       setShowSummaryId(recordId);
//     } catch (error) {
//       console.error("Error generating summary:", error);
//       const errorMsg = error.response?.data?.msg || "Failed to generate summary. Please try again.";
//       setSummaryError(prev => ({ ...prev, [recordId]: errorMsg }));
//       setShowSummaryId(null);
//     } finally {
//       setLoadingSummary(prev => ({ ...prev, [recordId]: false }));
//     }
//   };

//   return (
//     <div className="history-container">

//       <div className="history-header">
//         <h2>Records History</h2>
//       </div>

//       {records.length === 0 ? (
//         <p className="no-records">No records found</p>
//       ) : (



//           // records.map((record, index) => (
//           //   <div key={index} className="history-card">

//           //     <div className="card-content">
//           //       <p><strong>Doctor:</strong> {record.doctor}</p>
//           //       <p><strong>Hospital:</strong> {record.hospital}</p>
//           //       <p><strong>Visit Date:</strong> {new Date(record.visitDate).toLocaleDateString()}</p>
//           //       <p><strong>Reason:</strong> {record.reason}</p>

//           //       {record.summary && (
//           //         <div className="summary-section">
//           //           <p><strong>Summary:</strong></p>
//           //           <p className="summary-text">{record.summary}</p>
//           //         </div>
//           //       )}
//           //     </div>

//           //     <div className="card-buttons">
//           //       <a
//           //         href={record.signedUrl}
//           //         target="_blank"
//           //         rel="noreferrer"
//           //         className="view-btn"
//           //       >
//           //         View PDF
//           //       </a>

//           //       <a
//           //         href={record.signedUrl}
//           //         download
//           //         className="download-btn"
//           //       >
//           //         Download PDF
//           //       </a>

//           //       <button
//           //         onClick={() => handleGenerateSummary(record._id)}
//           //         className="summary-btn"
//           //         disabled={loadingSummary[record._id]}
//           //       >
//           //         {loadingSummary[record._id] ? "Generating..." : "Generate Summary"}
//           //       </button>
//           //     </div>

//           //   </div>
//           // ))
//           <div className={`history-cards ${activeCard ? "blur-background" : ""}`}>

//             {records.map((record, index) => {

//               const isActive = activeCard === record._id;

//               return (
//                 <div
//                   key={record._id}
//                   className={`history-card ${isActive ? "active-card" : ""}`}
//                 >

//                   {isActive && (
//                     <button
//                       className="close-btn"
//                       onClick={() => {
//                         setActiveCard(null);
//                         setShowSummaryId(null);
//                       }}
//                     >
//                       ✖
//                     </button>
//                   )}

//                   <div className="card-content">
//                     <p><strong>Doctor:</strong> {record.doctor}</p>
//                     <p><strong>Hospital:</strong> {record.hospital}</p>
//                     <p><strong>Date:</strong> {new Date(record.visitDate).toLocaleDateString()}</p>
//                     <p><strong>Reason:</strong> {record.reason}</p>
//                   </div>

//                   {!isActive && (
//                     <button
//                       className="view-more-btn"
//                       onClick={() => setActiveCard(record._id)}
//                     >
//                       View More
//                     </button>
//                   )}

//                   {isActive && (
//                     <>
//                       <div className="expanded-buttons">

//                         <a
//                           href={record.signedUrl}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="pdf-btn"
//                         >
//                           View PDF
//                         </a>

//                         <a
//                           href={record.signedUrl}
//                           download
//                           className="pdf-btn"
//                         >
//                           Download PDF
//                         </a>

//                         <button
//                           onClick={() => handleGenerateSummary(record._id)}
//                           className="summary-btn"
//                           disabled={loadingSummary[record._id]}
//                         >
//                           {loadingSummary[record._id] ? "Generating..." : "Generate Summary"}
//                         </button>
//                       </div>

//                       {showSummaryId === record._id && record.summary && (
//                         <div className="summary-box">
//                           <div className="summary-header">
//                             <span>AI Summary</span>
//                             <button
//                               onClick={() => setShowSummaryId(null)}
//                               className="close-summary"
//                             >
//                               ✖
//                             </button>
//                           </div>
//                           <p>{record.summary}</p>
//                         </div>
//                       )}

//                       {summaryError[record._id] && (
//                         <div className="summary-error">
//                           <p>{summaryError[record._id]}</p>
//                           <button
//                             onClick={() => setSummaryError(prev => ({ ...prev, [record._id]: null }))}
//                             className="close-error"
//                           >
//                             ✖
//                           </button>
//                         </div>
//                       )}

//                       {loadingSummary[record._id] && (
//                         <div className="summary-loading">
//                           <p>Generating AI summary...</p>
//                         </div>
//                       )}
//                     </>
//                   )}

//                 </div>
//               );
//             })}
//           </div>
//         )}

//     </div>
//   );

// }

// export default PreviousRecords;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/History.css";

function PreviousRecords({ patientUid }) {
  const [groupedVisits, setGroupedVisits] = useState([]);
  const [unlinkedRecords, setUnlinkedRecords] = useState([]);
  const [activeVisit, setActiveVisit] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState({});
  const [showSummaryId, setShowSummaryId] = useState(null);
  const [summaryError, setSummaryError] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const id = patientUid || localStorage.getItem("patientUid");
        const res = await axios.get(
          `http://localhost:5000/api/records/patient-history/${id}`
        );
        setGroupedVisits(res.data.groupedVisits || []);
        setUnlinkedRecords(res.data.unlinkedRecords || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchHistory();
  }, [patientUid]);

  const handleGenerateSummary = async (recordId, visitId) => {
    try {
      setLoadingSummary(prev => ({ ...prev, [recordId]: true }));
      setSummaryError(prev => ({ ...prev, [recordId]: null }));

      const res = await axios.post(
        `http://localhost:5000/api/records/generate-summary/${recordId}`
      );

      if (visitId) {

        setGroupedVisits(prev => prev.map(visit => ({
          ...visit,
          records: visit.records.map(r =>
            r._id === recordId ? { ...r, summary: res.data.summary } : r
          )
        })));
      } else {

        setUnlinkedRecords(prev => prev.map(r =>
          r._id === recordId ? { ...r, summary: res.data.summary } : r
        ));
      }

      setShowSummaryId(recordId);

    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Failed to generate summary.";
      setSummaryError(prev => ({ ...prev, [recordId]: errorMsg }));
    } finally {
      setLoadingSummary(prev => ({ ...prev, [recordId]: false }));
    }
  };

  if (groupedVisits.length === 0 && unlinkedRecords.length === 0) {
    return (
      <div className="history-container">
        <div className="history-header"><h2>Records History</h2></div>
        <p className="no-records">No records found</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Records History</h2>
      </div>

      {groupedVisits.map(visit => (
        <div key={visit._id} className="history-card" style={{ marginBottom: "20px" }}>
          <div className="card-content">
            <p><strong>📅 Date:</strong> {new Date(visit.visitDate).toLocaleDateString()}</p>
            <p><strong>👨‍⚕️ Doctor:</strong> {visit.doctor?.name || "—"}</p>
            <p><strong>🏥 Specialization:</strong> {visit.doctor?.specialization || "—"}</p>
            {visit.diagnosis && <p><strong>📋 Diagnosis:</strong> {visit.diagnosis}</p>}
            {visit.prescription && <p><strong>💊 Prescription:</strong> {visit.prescription}</p>}
            {visit.notes && <p><strong>📝 Notes:</strong> {visit.notes}</p>}
          </div>

          {!activeVisit || activeVisit !== visit._id ? (
            <button className="view-more-btn" onClick={() => setActiveVisit(visit._id)}>
              View Reports ({visit.records.length})
            </button>
          ) : (
            <button className="close-btn" onClick={() => setActiveVisit(null)}>
              ✖ Close
            </button>
          )}

          {activeVisit === visit._id && (
            <div style={{ marginTop: "16px" }}>
              {visit.records.length === 0 ? (
                <p style={{ color: "#6b7fa3", fontSize: "13px" }}>No reports uploaded for this visit.</p>
              ) : (
                visit.records.map(record => (
                  <div key={record._id} style={{
                    background: "#f0f5ff", borderRadius: "10px",
                    padding: "14px", marginBottom: "12px", border: "1px solid #dce6f5"
                  }}>
                    <p><strong>📄 Reason:</strong> {record.reason}</p>
                    <p><strong>📅 Date:</strong> {new Date(record.visitDate).toLocaleDateString()}</p>
                    <div className="expanded-buttons" style={{ marginTop: "10px" }}>
                      <a href={record.signedUrl} target="_blank" rel="noreferrer" className="pdf-btn">View PDF</a>
                      <a href={record.signedUrl} download className="pdf-btn">Download PDF</a>
                      <button onClick={() => handleGenerateSummary(record._id, visit._id)} className="summary-btn" disabled={loadingSummary[record._id]}>
                        {loadingSummary[record._id] ? "Generating..." : "Generate Summary"}
                      </button>
                    </div>
                    {showSummaryId === record._id && record.summary && (
                      <div className="summary-box">
                        <div className="summary-header">
                          <span>AI Summary</span>
                          <button onClick={() => setShowSummaryId(null)} className="close-summary">✖</button>
                        </div>
                        <p>{record.summary}</p>
                      </div>
                    )}
                    {summaryError[record._id] && (
                      <div className="summary-error">
                        <p>{summaryError[record._id]}</p>
                        <button onClick={() => setSummaryError(prev => ({ ...prev, [record._id]: null }))} className="close-error">✖</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}

      {unlinkedRecords.length > 0 && (
        <>
          <h3 style={{ marginTop: "32px", marginBottom: "16px", color: "#6b7fa3" }}>
            📁 Other Records
          </h3>
          <div className="history-cards">
            {unlinkedRecords.map(record => (
              <div key={record._id} className="history-card">
                <div className="card-content">
                  <p><strong>Doctor:</strong> {record.doctor}</p>
                  <p><strong>Hospital:</strong> {record.hospital}</p>
                  <p><strong>Date:</strong> {new Date(record.visitDate).toLocaleDateString()}</p>
                  <p><strong>Reason:</strong> {record.reason}</p>
                </div>
                <div className="expanded-buttons">
                  <a href={record.signedUrl} target="_blank" rel="noreferrer" className="pdf-btn">View PDF</a>
                  <a href={record.signedUrl} download className="pdf-btn">Download PDF</a>
                  <button onClick={() => handleGenerateSummary(record._id, null)} className="summary-btn" disabled={loadingSummary[record._id]}>
                    {loadingSummary[record._id] ? "Generating..." : "Generate Summary"}
                  </button>
                </div>

                {showSummaryId === record._id && record.summary && (
                  <div className="summary-box">
                    <div className="summary-header">
                      <span>AI Summary</span>
                      <button onClick={() => setShowSummaryId(null)} className="close-summary">✖</button>
                    </div>
                    <p>{record.summary}</p>
                  </div>
                )}

                {summaryError[record._id] && (
                  <div className="summary-error">
                    <p>{summaryError[record._id]}</p>
                    <button onClick={() => setSummaryError(prev => ({ ...prev, [record._id]: null }))} className="close-error">✖</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}

export default PreviousRecords;