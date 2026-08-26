import React, { useState } from 'react';
import { ShoppingBag, Search, Plus, CheckCircle2, Clock, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PurchasesView = () => {
  const { purchaseRequests, formatCurrency, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPurchases = purchaseRequests.filter(pr =>
    pr.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" /> Purchase Management & PO Requests
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Purchase requests → Supplier quotations → Manager PO approvals → Goods Receipt Note (GRN) & Payments.
          </p>
        </div>

        <button
          onClick={() => showToast('New Purchase Request created', 'success')}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Create Purchase Request
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search request ID, item, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Request Ref</th>
                <th className="p-4">Item Name</th>
                <th className="p-4 text-center">Required Qty</th>
                <th className="p-4">Requested By</th>
                <th className="p-4">Department</th>
                <th className="p-4 font-mono">Required Date</th>
                <th className="p-4 text-right">Est. Cost</th>
                <th className="p-4 text-center">PO Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredPurchases.map((pr) => (
                <tr key={pr.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{pr.id}</td>
                  <td className="p-4 font-bold text-white">{pr.item}</td>
                  <td className="p-4 text-center font-mono font-bold text-slate-300">{pr.qty}</td>
                  <td className="p-4 text-slate-300">{pr.requestedBy}</td>
                  <td className="p-4 text-slate-300">{pr.department}</td>
                  <td className="p-4 font-mono text-slate-400">{pr.requiredDate}</td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400">{formatCurrency(pr.estimatedCost)}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      pr.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {pr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
