
const Stock = require('../models/Stock');

// @desc    Get all stocks
// @route   GET /api/stocks
// @access  Public
const getStocks = async (req, res) => {
  try {
    const items = await Stock.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single stock
// @route   GET /api/stocks/:id
// @access  Public
const getStockById = async (req, res) => {
  try {
    const item = await Stock.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a stock
// @route   POST /api/stocks
// @access  Public
const createStock = async (req, res) => {
  try {
    const item = new Stock(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a stock
// @route   PUT /api/stocks/:id
// @access  Public
const updateStock = async (req, res) => {
  try {
    const item = await Stock.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a stock
// @route   DELETE /api/stocks/:id
// @access  Public
const deleteStock = async (req, res) => {
  try {
    const item = await Stock.findById(req.params.id);
    if (item) {
      await Stock.deleteOne({ _id: req.params.id });
      res.json({ message: 'Stock removed' });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock
};
