import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { fireDB } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import { Table } from "antd";

const UserOrdersTable = ({ userEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(fireDB, "order"),
          where("cartProducts.0.farmerEmail", "==", userEmail)
        );
        const querySnapshot = await getDocs(ordersQuery);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          orderId: doc.id
        }));
        
        // Sort orders by creation time
        const sortedOrders = fetchedOrders.sort((a, b) => 
          b.createdAt?.seconds - a.createdAt?.seconds
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchOrders();
    }
  }, [userEmail]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Customer",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Products",
      dataIndex: "cartProducts",
      key: "products",
      render: (products) => (
        <ul>
          {products.map((product, index) => (
            <li key={index}>{product.name} - Quantity: {product.quantity}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `₹${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date?.seconds * 1000).toLocaleDateString(),
    },
  ];

  return (
    <div className="container">
      <h2>Orders</h2>
      <Table 
        dataSource={orders} 
        columns={columns} 
        loading={loading}
        rowKey="orderId"
      />
    </div>
  );
};

export default UserOrdersTable; 