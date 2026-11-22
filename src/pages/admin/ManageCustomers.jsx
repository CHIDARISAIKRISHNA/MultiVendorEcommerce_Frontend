
import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc
// } from "firebase/firestore";

// import { db } from "../../lib/firebase";
import "../admin/styles/Admin.css";

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const snapshot = await getDocs(collection(db, "users"));

    setCustomers(
      snapshot.docs
        .filter(d => d.data().role === "customer")
        .map(d => ({
          id: d.id,
          ...d.data()
        }))
    );
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "users", id), { status });
      await fetchCustomers();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-container">
      <h1>Manage Customers</h1>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.status || "active"}</td>
                <td>
                  <button
                    onClick={() =>
                      updateStatus(customer.id, "active")
                    }
                  >
                    Activate
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(customer.id, "inactive")
                    }
                  >
                    Deactivate
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

export default ManageCustomers;
