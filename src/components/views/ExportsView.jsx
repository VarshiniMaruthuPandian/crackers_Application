import React, { useState } from 'react';
import {
  Plus,
  Search,
  Download,
  Trash2,
  Eye,
  ArrowUpRight,
  X,
  FileText,
  CheckCircle2,
  Clock,
  Printer,
  IndianRupee,
  Boxes,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExportsView = () => {
  const {
    exportsList,
    crackers,
    addExport,
    deleteExport,
    formatCurrency,
    requestConfirm,
    showToast,
    todayExportsCount
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [crackerFilter, setCrackerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    orderId: `ORD-${Math.floor(9000 + Math.random() * 999)}`,
    customer: 'Royal Celebrations Event Co',
    cracker: crackers[0]?.name || 'Lakshmi Crack',
    bundles: 5,
    packets: 500,
    sellingPrice: 5400,
    paymentStatus: 'Paid',
    remarks: 'Counter sale with bulk discount'
  });

  const totalAmountComputed = Number(formData.bundles || 0) * Number(formData.sellingPrice || 0);

  const filteredExports = exportsList.filter((item) => {
    const matchesSearch =
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cracker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCracker = crackerFilter ? item.cracker === crackerFilter : true;
    const matchesStatus = statusFilter ? item.paymentStatus === statusFilter : true;
    return matchesSearch && matchesCracker && matchesStatus;
  });

  const handleCrackerChange = (name) => {
    const found = crackers.find((c) => c.name === name);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        cracker: name,
        packets: prev.bundles * found.packetsPerBundle,
        sellingPrice: Math.round(found.pricePerBundle * 1.2)
      }));
    }
  };

  const handleBundlesChange = (val) => {
    const b = Number(val);
    const found = crackers.find((c) => c.name === formData.cracker);
    const pktsPerBundle = found ? found.packetsPerBundle : 100;
    setFormData((prev) => ({
      ...prev,
      bundles: b,
      packets: b * pktsPerBundle
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addExport(formData);
    setIsModalOpen(false);
  };

  const todayRevenue = exportsList
    .filter((e) => e.date === '2026-08-26')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const monthlyRevenue = exportsList.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const todayExportedPackets = exportsList
    .filter((e) => e.date === '2026-08-26')
    .reduce((acc, curr) => acc + curr.packets, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-emerald-400" /> Export & Sales Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track daily customer orders, wholesale export sales, and revenue earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast('Exporting Sales Audit Log to Excel...', 'info')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Download Report
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Export
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Today's Sales</p>
            <h3 className="text-xl font-black text-white mt-1">{todayExportsCount} Orders</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Exported Packets</p>
            <h3 className="text-xl font-black text-amber-400 mt-1">
              {(todayExportedPackets || 900).toLocaleString('en-IN')} Pkts
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Today's Revenue</p>
            <h3 className="text-xl font-black text-emerald-400 mt-1">
              {formatCurrency(todayRevenue || 57400)}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Monthly Revenue</p>
            <h3 className="text-xl font-black text-orange-400 mt-1">
              {formatCurrency(monthlyRevenue)}
            </h3>
          </div>
          <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, Customer, or Cracker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
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
            <option value="">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Export Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer / Buyer</th>
                <th className="p-4">Cracker</th>
                <th className="p-4 text-center">Bundles</th>
                <th className="p-4 text-center">Packets</th>
                <th className="p-4 text-right">Selling Price</th>
                <th className="p-4 text-right">Total Revenue</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredExports.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-slate-500 font-medium">
                    No export sales recorded.
                  </td>
                </tr>
              ) : (
                filteredExports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-medium text-slate-300">{item.date}</td>
                    <td className="p-4 font-mono font-bold text-amber-400">{item.orderId}</td>
                    <td className="p-4 font-semibold text-slate-200">{item.customer}</td>
                    <td className="p-4 font-bold text-white">{item.cracker}</td>
                    <td className="p-4 text-center font-bold text-slate-300">{item.bundles}</td>
                    <td className="p-4 text-center font-mono text-slate-400">{item.packets}</td>
                    <td className="p-4 text-right font-mono text-slate-300">{formatCurrency(item.sellingPrice)}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(item.totalAmount)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        item.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {item.paymentStatus === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setInvoiceModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Print / View Sales Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            requestConfirm({
                              title: 'Delete Export Entry?',
                              message: `Are you sure you want to delete order ${item.orderId}?`,
                              onConfirm: () => deleteExport(item.id)
                            });
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                          title="Delete Order"
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

      {/* Add Export Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-400" /> Record Sales Export
            </h3>
            <p className="text-xs text-slate-400 mb-6">Create new customer sales receipt and deduct stock.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Export Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Order Ref ID</label>
                  <input
                    type="text"
                    required
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Event Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="e.g. Venkatesh Traders"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cracker Name</label>
                  <select
                    value={formData.cracker}
                    onChange={(e) => handleCrackerChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    {crackers.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bundles Sold</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.bundles}
                    onChange={(e) => handleBundlesChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Selling Price per Bundle (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* Automatic Math Summary */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Packets Sold</span>
                  <p className="text-base font-black text-amber-400 font-mono">{formData.packets} Packets</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Sale Revenue</span>
                  <p className="text-base font-black text-emerald-400 font-mono">{formatCurrency(totalAmountComputed)}</p>
                </div>
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
                  Save Sales Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer Popup Modal */}
      {invoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setInvoiceModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-xl font-black text-white tracking-wider flex items-center justify-center gap-1">
                Cracker<span className="text-orange-500">Hub</span>
              </h3>
              <p className="text-[10px] text-amber-400 uppercase font-bold tracking-widest">Official Sales Tax Invoice</p>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
              <div className="flex justify-between"><span className="text-slate-400">Order Ref:</span> <span className="text-amber-400 font-bold">{invoiceModal.orderId}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Date:</span> <span className="text-slate-200">{invoiceModal.date}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Customer:</span> <span className="text-white font-bold">{invoiceModal.customer}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Cracker Item:</span> <span className="text-slate-200">{invoiceModal.cracker}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Bundles:</span> <span className="text-slate-200">{invoiceModal.bundles} ({invoiceModal.packets} Packets)</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Selling Price:</span> <span className="text-slate-200">{formatCurrency(invoiceModal.sellingPrice)} / Bundle</span></div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                <span className="text-slate-300 font-bold">Total Amount Paid:</span>
                <span className="text-emerald-400 font-black">{formatCurrency(invoiceModal.totalAmount)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => {
                  showToast('Sending receipt to printer...', 'success');
                  setInvoiceModal(null);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <button
                onClick={() => setInvoiceModal(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
