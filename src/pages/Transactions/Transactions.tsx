import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction, Transaction } from '../../api/transactions';
import { ConfirmPopup } from '../../components/Common/ConfirmPopup';
import { Toast } from '../../components/Common/Toast';
import { Table, Button, Tag, DatePicker, Input, Card, Row, Col, Statistic, Pagination, Select, Space } from 'antd';
import { DeleteOutlined, ArrowUpOutlined, CalendarOutlined } from '@ant-design/icons';
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
  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'thisMonth' | 'lastMonth' | 'last3Months' | 'lastYear' | 'currentYear' | 'singleDate' | 'customRange'>('today');
  const [singleDate, setSingleDate] = useState<Dayjs | null>(null);
  const [customStartDate, setCustomStartDate] = useState<Dayjs | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Dayjs | null>(null);
  const [filterChangeTrigger, setFilterChangeTrigger] = useState(0);

  // Clear transactions when filter changes to prevent confusion
  const handleDateFilterChange = (newFilter: typeof dateFilter) => {
    setTransactions([]); // Clear all data immediately
    setCurrentPage(1); // Reset to first page
    setDateFilter(newFilter);
    setFilterChangeTrigger(prev => prev + 1); // Force useEffect to run
  };

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    
    // Only allow numeric values (amounts)
    const isNumeric = !isNaN(parseFloat(trimmedValue)) && isFinite(parseFloat(trimmedValue));
    
    if (trimmedValue === '' || isNumeric) {
      setSearchTerm(trimmedValue);
      setCurrentPage(1);
    } else {
      // Clear search if non-numeric input
      setSearchTerm('');
      setCurrentPage(1);
    }
  };

  // Clear data when single date changes
  const handleSingleDateChange = (date: Dayjs | null) => {
    setTransactions([]); // Clear all data immediately
    setCurrentPage(1); // Reset to first page
    setSingleDate(date);
    setFilterChangeTrigger(prev => prev + 1); // Force useEffect to run
  };

  // Clear data when custom date range changes
  const handleCustomStartDateChange = (date: Dayjs | null) => {
    setTransactions([]); // Clear all data immediately
    setCurrentPage(1); // Reset to first page
    setCustomStartDate(date);
    setFilterChangeTrigger(prev => prev + 1); // Force useEffect to run
  };

  const handleCustomEndDateChange = (date: Dayjs | null) => {
    setTransactions([]); // Clear all data immediately
    setCurrentPage(1); // Reset to first page
    setCustomEndDate(date);
    setFilterChangeTrigger(prev => prev + 1); // Force useEffect to run
  };
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
        
        // Add filter parameter
        params.append('filter', dateFilter);
        
        // Add single date if selected
        if (dateFilter === 'singleDate' && singleDate) {
          params.append('date', singleDate.format('YYYY-MM-DD'));
        }
        
        // Add custom date range if selected
        if (dateFilter === 'customRange' && customStartDate && customEndDate) {
          params.append('startDate', customStartDate.format('YYYY-MM-DD'));
          params.append('endDate', customEndDate.format('YYYY-MM-DD'));
        }
        
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
  }, [searchTerm, dateFilter, singleDate, customStartDate, customEndDate, filterChangeTrigger]);

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
        setIsDeletingTransaction(true);
        await deleteTransaction(transactionToDelete);
        setTransactions(transactions.filter(t => t._id !== transactionToDelete));
        setToastMessage('Transaction deleted successfully');
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        setToastMessage('Failed to delete transaction');
      } finally {
        setIsDeletingTransaction(false);
      }
    }
    setDeleteConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const handleCancelDelete = () => {
    if (isDeletingTransaction) return;
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

  const [searchInput, setSearchInput] = useState('');

  // Function to get date range text based on filter
  const getDateRangeText = () => {
    const today = dayjs();
    
    switch (dateFilter) {
      case 'today':
        return today.format('MMM DD, YYYY');
      case 'yesterday':
        return today.subtract(1, 'day').format('MMM DD, YYYY');
      case 'thisMonth':
        return today.startOf('month').format('MMM DD') + ' - ' + today.format('MMM DD, YYYY');
      case 'lastMonth':
        return today.subtract(1, 'month').startOf('month').format('MMM DD') + ' - ' + today.subtract(1, 'month').endOf('month').format('MMM DD, YYYY');
      case 'last3Months':
        return today.subtract(2, 'month').startOf('month').format('MMM DD') + ' - ' + today.format('MMM DD, YYYY');
      case 'lastYear':
        return today.subtract(1, 'year').startOf('year').format('MMM DD, YYYY') + ' - ' + today.subtract(1, 'year').endOf('year').format('MMM DD, YYYY');
      case 'currentYear':
        return today.startOf('year').format('MMM DD') + ' - ' + today.format('MMM DD, YYYY');
      case 'singleDate':
        return singleDate ? singleDate.format('MMM DD, YYYY') : 'Select date';
      case 'customRange':
        if (customStartDate && customEndDate) {
          return customStartDate.format('MMM DD') + ' - ' + customEndDate.format('MMM DD, YYYY');
        }
        return 'Select range';
      default:
        return 'All dates';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove any character that is not a digit or a dot
    const cleaned = value.replace(/[^\d.]/g, '');
    // Prevent multiple dots
    const validValue = cleaned.replace(/(\..*)\./g, '$1');
    
    setSearchInput(validValue);

    if (validValue === '') {
      setSearchTerm('');
      setCurrentPage(1);
    }
  };

  return (
    <div className="transactions-container">

      <div className="transactions-header">
        <h2>Transactions</h2>
        <div className="transactions-filters">
        <Search
          placeholder="Search transactions by amount"
          allowClear
          enterButton
          size="large"
          value={searchInput}
          onSearch={(value) => {
            handleSearch(value);
          }}
          onChange={handleSearchChange}
          onClear={() => {
            setSearchInput('');
            setSearchTerm('');
            setCurrentPage(1);
          }}
          style={{ width: 300 }}
        />
        
        <Space size="middle">
          <Select
            value={dateFilter}
            onChange={handleDateFilterChange}
            size="large"
            style={{ width: 150 }}
            suffixIcon={<CalendarOutlined />}
          >
            <Select.Option value="today">Today</Select.Option>
            <Select.Option value="yesterday">Yesterday</Select.Option>
            <Select.Option value="thisMonth">This Month</Select.Option>
            <Select.Option value="lastMonth">Last Month</Select.Option>
            <Select.Option value="last3Months">Last 3 Months</Select.Option>
            <Select.Option value="lastYear">Last Year</Select.Option>
            <Select.Option value="currentYear">Current Year</Select.Option>
            <Select.Option value="singleDate">Single Date</Select.Option>
            <Select.Option value="customRange">Custom Range</Select.Option>
          </Select>
          
          {dateFilter === 'singleDate' && (
            <DatePicker
              value={singleDate}
              onChange={handleSingleDateChange}
              placeholder="Choose date"
              size="large"
              style={{ width: 140 }}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          )}
          
          {dateFilter === 'customRange' && (
            <Space>
              <DatePicker
                value={customStartDate}
                onChange={handleCustomStartDateChange}
                placeholder="Start date"
                size="large"
                style={{ width: 140 }}
                disabledDate={(current) => {
                  // Disable dates after today
                  if (current && current > dayjs().endOf('day')) {
                    return true;
                  }
                  // Disable dates after end date if end date is selected
                  if (customEndDate && current && current > customEndDate.endOf('day')) {
                    return true;
                  }
                  return false;
                }}
              />
              <DatePicker
                value={customEndDate}
                onChange={handleCustomEndDateChange}
                placeholder="End date"
                size="large"
                style={{ width: 140 }}
                disabledDate={(current) => {
                  // Disable dates after today
                  if (current && current > dayjs().endOf('day')) {
                    return true;
                  }
                  // Disable dates before start date if start date is selected
                  if (customStartDate && current && current < customStartDate.startOf('day')) {
                    return true;
                  }
                  return false;
                }}
              />
            </Space>
          )}
        </Space>
        </div>
      </div>

      {/* Statistics Tiles */}
      <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
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
              Data From
            </div>
            <Statistic
              value={getDateRangeText()}
              valueStyle={{ 
                color: '#10b981',
                fontSize: '1.50rem',
                fontWeight: 600
              }}
              title=""  // Empty title since we use custom title
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
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
        <Col xs={24} sm={12} md={8}>
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
              />
            </div>
          )}
        </div>
      ) : (
        <Table
          className="desktop-transactions"
          columns={columns}
          dataSource={filteredTransactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
          rowKey="_id"
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
        />
      )}
      
      {/* Desktop Pagination */}
      {!isMobile && filteredTransactions.length > PAGE_SIZE && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Pagination
            current={currentPage}
            total={filteredTransactions.length}
            pageSize={PAGE_SIZE}
            showSizeChanger={false}
            showQuickJumper={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
      
      <ConfirmPopup 
        isOpen={deleteConfirmOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={() => void handleConfirmDelete()}
        onCancel={handleCancelDelete}
        isConfirmLoading={isDeletingTransaction}
        confirmText="Delete"
        confirmLoadingText="Deleting..."
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
      
      {toastMessage && (
        <Toast message={toastMessage} />
      )}
    </div>
  );
}
