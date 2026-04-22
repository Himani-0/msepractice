import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getExpenses, addExpense, deleteExpense } from '../utils/api';

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Education', 'Other'];

const CATEGORY_META = {
  Food: { emoji: '🍔', cls: 'cat-food' },
  Travel: { emoji: '✈️', cls: 'cat-travel' },
  Bills: { emoji: '📄', cls: 'cat-bills' },
  Shopping: { emoji: '🛍️', cls: 'cat-shopping' },
  Health: { emoji: '💊', cls: 'cat-health' },
  Entertainment: { emoji: '🎬', cls: 'cat-entertainment' },
  Education: { emoji: '📚', cls: 'cat-education' },
  Other: { emoji: '📌', cls: 'cat-other' },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], notes: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpenses = useCallback(async (category = activeCategory) => {
    try {
      setLoading(true);
      const data = await getExpenses({ category });
      setExpenses(data.expenses);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchExpenses(activeCategory);
  }, [activeCategory, fetchExpenses]);

  const handleFilter = (cat) => {
    setActiveCategory(cat);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const { title, amount, category, date } = formData;
    if (!title || !amount || !category || !date) {
      return setFormError('All fields except notes are required');
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      return setFormError('Amount must be a positive number');
    }

    setSubmitting(true);
    setFormError('');
    try {
      await addExpense({ ...formData, amount: Number(amount) });
      setFormSuccess('Expense added!');
      setFormData({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], notes: '' });
      fetchExpenses(activeCategory);
      setTimeout(() => setFormSuccess(''), 2500);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    setDeletingId(id);
    try {
      await deleteExpense(id);
      fetchExpenses(activeCategory);
    } catch (err) {
      alert('Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  const avg = expenses.length > 0 ? (total / expenses.length).toFixed(0) : 0;

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">💰 SpendSense</div>
        <div className="navbar-user">
          <span className="user-greeting">Hello, <span>{user?.name?.split(' ')[0]}</span></span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card total">
            <div className="stat-label">Total Spent</div>
            <div className="stat-value">₹{total.toLocaleString('en-IN')}</div>
          </div>
          <div className="stat-card count">
            <div className="stat-label">Transactions</div>
            <div className="stat-value">{expenses.length}</div>
          </div>
          <div className="stat-card avg">
            <div className="stat-label">Avg. per Entry</div>
            <div className="stat-value">₹{Number(avg).toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          {/* Add Expense Form */}
          <div className="panel">
            <div className="panel-title"><span className="dot" />Add Expense</div>
            {formError && <div className="error-msg">⚠️ {formError}</div>}
            {formSuccess && <div className="success-msg">✅ {formSuccess}</div>}
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>Title</label>
                <input name="title" placeholder="e.g. Lunch at Dhaba" value={formData.title} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input name="amount" type="number" placeholder="0.00" min="0.01" step="0.01" value={formData.amount} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleFormChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_META[c].emoji} {c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input name="date" type="date" value={formData.date} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <input name="notes" placeholder="Any extra details..." value={formData.notes} onChange={handleFormChange} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : '+ Add Expense'}
              </button>
            </form>
          </div>

          {/* Expense List */}
          <div className="panel">
            <div className="panel-title"><span className="dot" style={{ background: 'var(--accent2)' }} />Expenses</div>

            {/* Filter Buttons */}
            <div className="filter-bar">
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => handleFilter(cat)}
                >
                  {cat !== 'All' && CATEGORY_META[cat]?.emoji + ' '}{cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : expenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🪙</div>
                <p>No expenses found.<br />Add your first one!</p>
              </div>
            ) : (
              <div className="expense-list">
                {expenses.map((exp, i) => (
                  <div className="expense-item" key={exp._id} style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="expense-left">
                      <div className={`category-dot ${CATEGORY_META[exp.category]?.cls}`}>
                        {CATEGORY_META[exp.category]?.emoji}
                      </div>
                      <div className="expense-info">
                        <div className="expense-title">{exp.title}</div>
                        <div className="expense-meta">{exp.category} · {formatDate(exp.date)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="expense-amount">₹{exp.amount.toLocaleString('en-IN')}</div>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(exp._id)}
                        disabled={deletingId === exp._id}
                      >
                        {deletingId === exp._id ? '...' : '✕'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
