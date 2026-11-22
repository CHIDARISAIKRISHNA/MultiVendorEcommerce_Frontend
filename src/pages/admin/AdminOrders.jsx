
import React, { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc
// } from "firebase/firestore";

// import { db } from "../../lib/firebase";
import "../admin/styles/Admin.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));

    setOrders(
      snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      await fetchOrders();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-container">
      <h1>Manage Orders</h1>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.productName}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.status}</td>
                <td>
                  <select
                    value={order.status || "pending"}
                    onChange={e =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
