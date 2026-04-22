const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/expense
// @desc    Add a new expense
// @access  Protected
router.post('/expense', protect, async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: 'Title, amount, and category are required' });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
      notes: notes || ''
    });

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    console.error('Add expense error:', error.message);
    res.status(500).json({ message: 'Server error while adding expense' });
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses of logged-in user
// @access  Protected
router.get('/expenses', protect, async (req, res) => {
  try {
    const { category, startDate, endDate, sort } = req.query;

    // Build filter
    const filter = { userId: req.user._id };
    if (category && category !== 'All') filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Sort
    const sortOption = sort === 'asc' ? { date: 1 } : { date: -1 };

    const expenses = await Expense.find(filter).sort(sortOption);

    // Compute total
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({ expenses, total, count: expenses.length });
  } catch (error) {
    console.error('Get expenses error:', error.message);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

// @route   DELETE /api/expense/:id
// @desc    Delete an expense
// @access  Protected
router.delete('/expense/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user owns expense
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error.message);
    res.status(500).json({ message: 'Server error while deleting expense' });
  }
});

module.exports = router;
