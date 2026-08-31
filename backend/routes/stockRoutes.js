
const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock
} = require('../controllers/stockController');

router.route('/').get(getStocks).post(createStock);
router.route('/:id').get(getStockById).put(updateStock).delete(deleteStock);

module.exports = router;
