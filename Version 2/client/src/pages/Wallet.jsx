import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Wallet = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch transactions from the backend
    const fetchTransactions = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setTransactions([
            { id: 1, project: 'E-commerce Website', amount: 150, date: '2023-05-15', status: 'completed' },
            { id: 2, project: 'Mobile App Design', amount: 200, date: '2023-06-02', status: 'in-progress' },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (currentUser?.userType === 'sparky') {
      fetchTransactions();
    }
  }, [currentUser]);

  if (currentUser?.userType !== 'sparky') {
    return (
      <div className="wallet-page">
        <h2>Wallet</h2>
        <p>This feature is only available for Sparkies.</p>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      <h2>Your Wallet</h2>
      <div className="balance-card">
        <h3>Current Balance</h3>
        <p className="balance-amount">${currentUser.wallet || 0}</p>
        <button className="btn-withdraw" disabled>Withdraw Funds</button>
      </div>

      <div className="transactions">
        <h3>Transaction History</h3>
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.project}</td>
                  <td>${tx.amount}</td>
                  <td>{tx.date}</td>
                  <td className={`status-${tx.status.replace('-', '')}`}>
                    {tx.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Wallet;