import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction, Transaction } from '../../api/transactions';
import { ConfirmPopup } from '../../components/Common/ConfirmPopup';
import { Toast } from '../../components/Common/Toast';
import { Table, Button, Tag, DatePicker, Input, Card, Row, Col, Statistic, Pagination } from 'antd';
import { DeleteOutlined, SearchOutlined, ArrowUpOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import '../../styles/Transactions.css';

const { Search } = Input;
const PAGE_SIZE = 10;

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Get user's local timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Build query parameters for API filtering
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        if (filterDate) {
          params.append('date', filterDate.format('YYYY-MM-DD'));
        }
        // Don't send 'all=true' by default - let backend show today's data
        // Only send 'all=true' when user explicitly wants all data (e.g., via a "Show All" button)
        // Always send timezone
        params.append('timezone', timezone);
        
        const data = await getTransactions(params.toString());
        setTransactions(data);
        setLoading(false);
      } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
        setToastMessage(error.response?.data?.message || 'Failed to load transactions');
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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
      dataIndex: 'localCreatedAt',
      key: 'date',
      render: (localDate: string, record: Transaction) => {
        // Use localCreatedAt if available, fallback to createdAt
        const dateToUse = localDate || record.createdAt;
        return dayjs(dateToUse).format('MMM DD, YYYY');
      },
    },
    {
      title: 'Time',
      dataIndex: 'localCreatedAt',
      key: 'time',
      render: (localDate: string, record: Transaction) => {
        // Use localCreatedAt if available, fallback to createdAt
        const dateToUse = localDate || record.createdAt;
        return dayjs(dateToUse).format('hh:mm A');
      },
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
      
      {isMobile ? (
        <div className="mobile-transactions-list">
          {filteredTransactions
            .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
            .map((transaction) => (
              <Card key={transaction._id} className="mobile-transaction-card">
                <div className="mobile-transaction-header">
                  <Tag color="blue">#{transaction._id.slice(-8)}</Tag>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteClick(transaction._id)}
                    danger
                    size="small"
                  >
                    Delete
                  </Button>
                </div>
                <div className="mobile-transaction-body">
                  <div className="mobile-transaction-amount">
                    <span className="amount-label">Amount</span>
                    <span className="amount-value">₹{transaction.amount.toFixed(2)}</span>
                  </div>
                  <div className="mobile-transaction-date">
                    <div className="date-item">
                      <span className="date-label">Date</span>
                      <span className="date-value">{dayjs(transaction.localCreatedAt || transaction.createdAt).format('MMM DD, YYYY')}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Time</span>
                      <span className="date-value">{dayjs(transaction.localCreatedAt || transaction.createdAt).format('hh:mm A')}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          
          {filteredTransactions.length === 0 && !loading && (
            <div className="no-transactions">No transactions found</div>
          )}
          
          {/* Mobile Pagination */}
          {filteredTransactions.length > PAGE_SIZE && (
            <div className="mobile-pagination">
              <Pagination
                current={currentPage}
                total={filteredTransactions.length}
                pageSize={PAGE_SIZE}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
                onChange={(page) => setCurrentPage(page)}
                simple={true}
              />
            </div>
          )}
        </div>
      ) : (
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
      )}
      
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
      
      {/* Scroll to Top Button */}
      <Button
        type="primary"
        shape="circle"
        icon={<ArrowUpOutlined />}
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        size="large"
      />
    </div>
  );
}
