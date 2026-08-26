import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Edit,
  ArrowDownLeft,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ImportsView = () => {
  const {
    imports,
    suppliers,
    crackers,
    addImport,
    deleteImport,
    formatCurrency,
    requestConfirm,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [crackerFilter, setCrackerFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetailModal, setViewDetailModal] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    supplier: suppliers[0]?.name || '',
    cracker: crackers[0]?.name || '',
    bundles: 10,
    packetsPerBundle: 100,
    costPerBundle: 4500,
    invoiceNo: `INV-CRK-${Math.floor(1000 + Math.random() * 9000)}`,
    paymentStatus: 'Paid',
    remarks: 'Routine stock import'
  });

  const totalPacketsComputed = Number(formData.bundles || 0) * Number(formData.packetsPerBundle || 0);
  const totalAmountComputed = Number(formData.bundles || 0) * Number(formData.costPerBundle || 0);

  const filteredImports = imports.filter((item) => {
    const matchesSearch =
      item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cracker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = supplierFilter ? item.supplier === supplierFilter : true;
    const matchesStatus = statusFilter ? item.paymentStatus === statusFilter : true;
    const matchesCracker = crackerFilter ? item.cracker === crackerFilter : true;
    return matchesSearch && matchesSupplier && matchesStatus && matchesCracker;
  });

  const handleCrackerSelect = (name) => {
    const selected = crackers.find((c) => c.name === name);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        cracker: name,
        packetsPerBundle: selected.packetsPerBundle,
        costPerBundle: selected.pricePerBundle
      }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addImport(formData);
    setIsModalOpen(false);
  };

  const handleDownloadReport = () => {
    showToast('Exporting Import Audit Report to Excel/PDF...', 'info');
    setTimeout(() => {
      showToast('Import_Report_August2026.xlsx downloaded successfully!', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ArrowDownLeft className="w-6 h-6 text-blue-400" /> Import Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track crackers purchased and imported into shop inventory from Sivakasi & vendors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export Report
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Import
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Invoice, Supplier, or Cracker name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500"
          >
            <option value="">All Suppliers</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>

          <select
            value={crackerFilter}
            onChange={(e) => setCrackerFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500"
          >
            <option value="">All Crackers</option>
            {crackers.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Imports Data Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Invoice No</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Cracker</th>
                <th className="p-4 text-center">Bundles</th>
                <th className="p-4 text-center">Pkts/Bundle</th>
                <th className="p-4 text-center">Total Pkts</th>
                <th className="p-4 text-right">Cost/Bundle</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredImports.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-slate-500 font-medium">
                    No import records found matching query.
                  </td>
                </tr>
              ) : (
                filteredImports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-medium text-slate-300">{item.date}</td>
                    <td className="p-4 font-mono font-bold text-orange-400">{item.invoiceNo}</td>
                    <td className="p-4 font-semibold text-slate-200">{item.supplier}</td>
                    <td className="p-4 font-bold text-white">{item.cracker}</td>
                    <td className="p-4 text-center font-bold text-slate-300">{item.bundles}</td>
                    <td className="p-4 text-center text-slate-400">{item.packetsPerBundle}</td>
                    <td className="p-4 text-center font-mono font-bold text-amber-400">
                      {item.totalPackets.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-300">{formatCurrency(item.costPerBundle)}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(item.totalAmount)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        item.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.paymentStatus === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.paymentStatus === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                        {item.paymentStatus === 'Pending' && <Clock className="w-3 h-3" />}
                        {item.paymentStatus === 'Partial' && <AlertCircle className="w-3 h-3" />}
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewDetailModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            requestConfirm({
                              title: 'Delete Import Record?',
                              message: `Are you sure you want to remove invoice ${item.invoiceNo}?`,
                              onConfirm: () => deleteImport(item.id)
                            });
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                          title="Delete Import"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Import Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black tracking-tight text-white mb-1 flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-blue-400" /> Add New Import Shipment
            </h3>
            <p className="text-xs text-slate-400 mb-6">Enter cracker bundle quantity and cost details from invoice.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Import Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNo}
                    onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Supplier</label>
                  <select
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cracker Name</label>
                  <select
                    value={formData.cracker}
                    onChange={(e) => handleCrackerSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    {crackers.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Bundles</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.bundles}
                    onChange={(e) => setFormData({ ...formData, bundles: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Packets per Bundle</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.packetsPerBundle}
                    onChange={(e) => setFormData({ ...formData, packetsPerBundle: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cost per Bundle (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.costPerBundle}
                    onChange={(e) => setFormData({ ...formData, costPerBundle: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
              </div>

              {/* Automatic Computation Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Packets (Auto)</span>
                  <p className="text-base font-black text-amber-400 font-mono">
                    {totalPacketsComputed.toLocaleString('en-IN')} Pkts
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{formData.bundles} bundles × {formData.packetsPerBundle} pkts</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Import Amount (Auto)</span>
                  <p className="text-base font-black text-emerald-400 font-mono">
                    {formatCurrency(totalAmountComputed)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{formData.bundles} bundles × ₹{formData.costPerBundle}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="e.g. Batch #90 pre-festival delivery"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 rounded-xl shadow-lg shadow-orange-500/20"
                >
                  Save Import Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setViewDetailModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Import Invoice Summary</h3>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between"><span className="text-slate-400">Invoice No:</span> <span className="font-mono text-orange-400 font-bold">{viewDetailModal.invoiceNo}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Date:</span> <span className="text-slate-200">{viewDetailModal.date}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Supplier:</span> <span className="font-semibold text-slate-200">{viewDetailModal.supplier}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Cracker Name:</span> <span className="font-bold text-white">{viewDetailModal.cracker}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Bundles Imported:</span> <span className="font-bold text-slate-200">{viewDetailModal.bundles}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Packets:</span> <span className="font-mono text-amber-400 font-bold">{viewDetailModal.totalPackets.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Purchase Amount:</span> <span className="font-mono text-emerald-400 font-bold">{formatCurrency(viewDetailModal.totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Status:</span> <span className="font-bold text-emerald-400">{viewDetailModal.paymentStatus}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Remarks:</span> <span className="text-slate-300 italic">{viewDetailModal.remarks || 'None'}</span></div>
            </div>

            <button
              onClick={() => setViewDetailModal(null)}
              className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
