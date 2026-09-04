
const WorkerAllocation = require('../models/WorkerAllocation');

// @desc    Get all worker allocations
// @route   GET /api/workerAllocations
// @access  Public
const getWorkerAllocations = async (req, res) => {
  try {
    const items = await WorkerAllocation.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a worker allocation
// @route   POST /api/workerAllocations
// @access  Public
const createWorkerAllocation = async (req, res) => {
  try {
    const item = new WorkerAllocation(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a worker allocation
// @route   DELETE /api/workerAllocations/:id
// @access  Public
const deleteWorkerAllocation = async (req, res) => {
  try {
    const item = await WorkerAllocation.findById(req.params.id);
    if (item) {
      await WorkerAllocation.deleteOne({ _id: req.params.id });
      res.json({ message: 'WorkerAllocation removed' });
    } else {
      res.status(404).json({ message: 'WorkerAllocation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a worker allocation
// @route   PUT /api/workerAllocations/:id
// @access  Public
const updateWorkerAllocation = async (req, res) => {
  try {
    const { department, count, date } = req.body;
    const updateData = {};
    if (department !== undefined) updateData.department = department;
    if (count !== undefined) updateData.count = Number(count);
    if (date !== undefined) updateData.date = date;

    const updatedItem = await WorkerAllocation.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'WorkerAllocation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getWorkerAllocations,
  createWorkerAllocation,
  updateWorkerAllocation,
  deleteWorkerAllocation
};

