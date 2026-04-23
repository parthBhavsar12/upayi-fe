import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction, Transaction } from '../../api/transactions';
import { ConfirmPopup } from '../../components/Common/ConfirmPopup';
import { Toast } from '../../components/Common/Toast';
import { Table, Button, Tag, DatePicker, Input, Card, Row, Col, Statistic } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import '../../styles/Transactions.css';

const { Search } = Input;

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Build query parameters for API filtering
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        if (filterDate) {
          params.append('date', filterDate.format('YYYY-MM-DD'));
        }
        
        const queryParams = params.toString();
        const data = await getTransactions(queryParams || undefined);
        setTransactions(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setToastMessage('Failed to load transactions');
        setLoading(false);
      }
    };

    void fetchTransactions();
  }, [searchTerm, filterDate]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete);
        setTransactions(transactions.filter(t => t._id !== transactionToDelete));
        setToastMessage('Transaction deleted successfully');
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        setToastMessage('Failed to delete transaction');
      }
    }
    setDeleteConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setTransactionToDelete(null);
  };

  // Calculate total amount from transactions
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const transactionCount = transactions.length;
  
  // API handles filtering, so transactions are already filtered
  const filteredTransactions = transactions;

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: '_id',
      key: 'id',
      render: (id: string) => (
        <Tag color="blue">#{id.slice(-8)}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold', color: '#5e8edb' }}>
          ₹{amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'time',
      render: (date: string) => dayjs(date).format('hh:mm A'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Transaction) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteClick(record._id)}
          danger
          size="small"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="transactions-container">
      {/* Statistics Tiles */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card className="stat-card">
            <div 
              className="stat-title security-label"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#6b7280',
                marginBottom: '8px'
              }}
            >
              Total Transactions
            </div>
            <Statistic
              value={transactionCount}
              prefix="#"
              valueStyle={{ color: '#5e8edb' }}
              title=""  // Empty title since we use custom title
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card className="stat-card">
            <div 
              className="stat-title security-label"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#6b7280',
                marginBottom: '8px'
              }}
            >
              Total Amount
            </div>
            <Statistic
              value={totalAmount}
              prefix="₹"
              precision={2}
              valueStyle={{ color: '#0087d1' }}
              title=""  // Empty title since we use custom title
            />
          </Card>
        </Col>
      </Row>

      <div className="transactions-header">
        <h2>Transactions</h2>
        <div className="transactions-filters">
          <Search
            placeholder="Search by transaction ID or amount"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={(value) => setSearchTerm(value)}
          />
          <DatePicker
            value={filterDate}
            onChange={(date) => setFilterDate(date)}
            placeholder="Filter by date"
            size="large"
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </div>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredTransactions}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
      
      <ConfirmPopup 
        isOpen={deleteConfirmOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={() => void handleConfirmDelete()}
        onCancel={handleCancelDelete}
      />
      
      {toastMessage && (
        <Toast message={toastMessage} />
      )}
    </div>
  );
}
