
const mongoose = require('mongoose');

const WorkerAllocationSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const WorkerAllocation = mongoose.model('WorkerAllocation', WorkerAllocationSchema);

module.exports = WorkerAllocation;
