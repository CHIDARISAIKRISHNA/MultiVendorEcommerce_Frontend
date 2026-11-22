
import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc
// } from "firebase/firestore";

// import { db } from "../../lib/firebase";
import "../admin/styles/Admin.css";

function ManageVendors() {
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    const snapshot = await getDocs(collection(db, "vendors"));

    setVendors(
      snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
    );
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "vendors", id), { status });
      await fetchVendors();
      alert(`Vendor ${status}`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-container">
      <h1>Manage Vendors</h1>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id}>
                <td>{vendor.storeName}</td>
                <td>{vendor.phone}</td>
                <td>{vendor.status}</td>
                <td>
                  <button
                    onClick={() =>
                      updateStatus(vendor.id, "approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(vendor.id, "rejected")
                    }
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageVendors;
