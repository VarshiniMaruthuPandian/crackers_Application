import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Building,
  Coins,
  Layers,
  Sparkles,
  Warehouse,
  Search,
  RefreshCw,
  Loader2,
  ClipboardList,
  Trash2,
  Pencil,
  Printer,
  CalendarRange,
  Calendar,
  Save,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const API_URL = 'http://localhost:5000/api';

const departments = [
  { id: 'Office',    label: 'Office',    icon: Building,  color: 'from-blue-500 to-indigo-600' },
  { id: 'Money',     label: 'Money',     icon: Coins,     color: 'from-emerald-500 to-teal-600' },
  { id: 'Set',       label: 'Set',       icon: Layers,    color: 'from-amber-500 to-orange-600' },
  { id: 'Finishing', label: 'Finishing', icon: Sparkles,  color: 'from-purple-500 to-pink-600' },
  { id: 'Godown',    label: 'Godown',    icon: Warehouse, color: 'from-rose-500 to-red-600' }
];

// ─── Print Report (Silent Iframe Print - No Extra Tab/Window) ───────────
const handlePrintReport = (records, fromDate, toDate) => {
  const total = records.reduce((s, r) => s + (r.count || 0), 0);
  const generatedAt = new Date().toLocaleString();
  const periodLabel = (fromDate || toDate)
    ? `${fromDate || 'Start'} to ${toDate || 'End'}`
    : 'All Dates';

  const rows = records.map((record, index) => `
    <tr style="background:${index % 2 === 0 ? '#fff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
      <td style="padding:9px 12px; font-weight:700; color:#f97316;">${index + 1}</td>
      <td style="padding:9px 12px; font-weight:600;">${record.department}</td>
      <td style="padding:9px 12px; text-align:center; font-weight:700;">${record.count} Staff</td>
      <td style="padding:9px 12px; font-family:monospace; color:#475569;">${record.date}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Worker Allocation Report</title>
      <meta charset="UTF-8"/>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; color:#1e293b; padding:40px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div style="border-bottom:3px solid #f97316; padding-bottom:16px; margin-bottom:24px;">
        <h1 style="font-size:22px; font-weight:900; color:#f97316;">Worker Allocation Report</h1>
        <p style="margin:6px 0 0; font-size:13px; color:#64748b;">Period: <strong>${periodLabel}</strong></p>
        <p style="margin:3px 0 0; font-size:11px; color:#94a3b8;">Generated: ${generatedAt}</p>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f97316; color:white;">
            <th style="padding:10px 12px; text-align:left;">No.</th>
            <th style="padding:10px 12px; text-align:left;">Department</th>
            <th style="padding:10px 12px; text-align:center;">No. of Workers</th>
            <th style="padding:10px 12px; text-align:left;">Date</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr style="background:#fff7ed; font-weight:900; border-top:2px solid #fed7aa;">
            <td colspan="2" style="padding:10px 12px; color:#9a3412; text-transform:uppercase; font-size:12px;">Grand Total</td>
            <td style="padding:10px 12px; text-align:center; color:#f97316; font-size:16px;">${total} Staff</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <p style="margin-top:32px; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:12px;">
        Worker Allocation Report — ${generatedAt}
      </p>
    </body>
    </html>
  `;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  }, 250);
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const ListworkersView = () => {
  const { showToast, theme } = useApp();
  const [allocations, setAllocations] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [search, setSearch]           = useState('');
  const [fromDate, setFromDate]       = useState('');
  const [toDate, setToDate]           = useState('');

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState(null);
  const [editDepartment, setEditDepartment] = useState('');
  const [editCount, setEditCount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fromDateRef = useRef(null);
  const toDateRef   = useRef(null);
  const editDateRef = useRef(null);

  useEffect(() => { fetchAllocations(); }, []);

  const fetchAllocations = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/workerAllocations`);
      setAllocations([...res.data].reverse());
    } catch { /* silent */ }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/workerAllocations/${id}`);
      setAllocations((prev) => prev.filter((r) => r._id !== id));
      if (showToast) showToast('Record deleted successfully', 'info');
    } catch { /* silent */ }
  };

  const startEditing = (record) => {
    setEditingRecord(record);
    setEditDepartment(record.department);
    setEditCount(record.count);
    setEditDate(record.date || '');
  };

  const handleUpdate = async () => {
    if (!editingRecord || !editCount || Number(editCount) <= 0) {
      if (showToast) showToast('Please enter a valid worker count', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await axios.put(`${API_URL}/workerAllocations/${editingRecord._id}`, {
        department: editDepartment,
        count: Number(editCount),
        date: editDate
      });

      if (res.data) {
        setAllocations((prev) =>
          prev.map((item) => (item._id === editingRecord._id ? res.data : item))
        );
        fetchAllocations();
        if (showToast) showToast('Worker allocation updated successfully!', 'success');
        setEditingRecord(null);
      }
    } catch (err) {
      if (showToast) showToast('Failed to update allocation', 'error');
    }
    setIsUpdating(false);
  };

  const clearFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
  };

  // Search + date range filter
  const filtered = allocations.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      (item.department || '').toLowerCase().includes(q) ||
      (item.date || '').includes(q);
    const itemDate  = item.date || '';
    const matchFrom = fromDate ? itemDate >= fromDate : true;
    const matchTo   = toDate   ? itemDate <= toDate   : true;
    return matchSearch && matchFrom && matchTo;
  });

  const totalStaff  = filtered.reduce((s, r) => s + (r.count || 0), 0);
  const hasFilters  = search || fromDate || toDate;

  const openPicker = (ref) => {
    try {
      if (ref.current && typeof ref.current.showPicker === 'function') {
        ref.current.showPicker();
      } else {
        ref.current?.focus();
      }
    } catch (e) {
      ref.current?.focus();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">

      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/20">
            <ClipboardList className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Worker Allocations List</h2>
            <p className="text-xs text-slate-400 mt-0.5">All department-wise worker allocations saved to database.</p>
          </div>
        </div>
        <button
          onClick={fetchAllocations}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 hover:bg-slate-800 text-slate-400 hover:text-orange-400 transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">

        {/* Filters Row */}
        <div className="flex flex-wrap items-end gap-3">

          {/* Search */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Search</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all w-40"
              />
            </div>
          </div>

          <div className="h-9 w-px bg-slate-800 self-end mb-0.5" />

          {/* From Date */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
              From Date
            </span>
            <div className="relative flex items-center">
              <input
                ref={fromDateRef}
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                onClick={() => openPicker(fromDateRef)}
                style={{
                  colorScheme: theme === 'dark' ? 'dark' : 'light',
                  backgroundColor: theme === 'dark' ? '#020617' : '#ffffff'
                }}
                className="pl-3 pr-8 py-2 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
              />
              <Calendar
                onClick={() => openPicker(fromDateRef)}
                className="w-4 h-4 text-slate-400 hover:text-orange-400 absolute right-2.5 cursor-pointer pointer-events-auto z-10 transition-colors"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
              To Date
            </span>
            <div className="relative flex items-center">
              <input
                ref={toDateRef}
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                onClick={() => openPicker(toDateRef)}
                style={{
                  colorScheme: theme === 'dark' ? 'dark' : 'light',
                  backgroundColor: theme === 'dark' ? '#020617' : '#ffffff'
                }}
                className="pl-3 pr-8 py-2 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
              />
              <Calendar
                onClick={() => openPicker(toDateRef)}
                className="w-4 h-4 text-slate-400 hover:text-orange-400 absolute right-2.5 cursor-pointer pointer-events-auto z-10 transition-colors"
              />
            </div>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all self-end"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Print Report */}
          <button
            onClick={() => handlePrintReport(filtered, fromDate, toDate)}
            disabled={filtered.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all self-end ${
              filtered.length > 0
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-md shadow-orange-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>

        {/* Active date-range info bar */}
        {(fromDate || toDate) && (
          <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded-xl">
            <CalendarRange className="w-3.5 h-3.5 shrink-0" />
            Showing records from{' '}
            <span className="font-bold font-mono">{fromDate || '—'}</span>
            {' '}to{' '}
            <span className="font-bold font-mono">{toDate || '—'}</span>
            {' '}—{' '}
            <span className="font-black">{filtered.length} records, {totalStaff} Staff</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 w-14">No.</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5 text-center">No. of Workers</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-400" />
                    <p className="text-slate-500 text-xs mt-2">Loading from database...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                    {hasFilters
                      ? 'No records match the selected filters.'
                      : 'No allocations saved yet. Go to Add Workers to create one.'}
                  </td>
                </tr>
              ) : (
                filtered.map((record, index) => {
                  const dept = departments.find((d) => d.id === record.department);
                  const Icon = dept ? dept.icon : Building;
                  return (
                    <tr key={record._id} className="hover:bg-slate-800/40 transition-colors">

                      {/* No. */}
                      <td className="p-3.5">
                        <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-black font-mono text-xs">
                          {index + 1}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${dept?.color || 'from-slate-600 to-slate-700'} text-white shadow-sm`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-white">{record.department}</span>
                        </div>
                      </td>

                      {/* Count */}
                      <td className="p-3.5 text-center">
                        <span className="px-3 py-1 bg-orange-500/15 text-orange-400 font-black font-mono text-sm rounded-xl border border-orange-500/20">
                          {record.count}
                        </span>
                        <span className="ml-1 text-slate-400 text-[10px]">staff</span>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 font-mono text-slate-300">{record.date}</td>

                      {/* Actions (Edit & Delete) */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => startEditing(record)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-orange-500/20 text-slate-400 hover:text-orange-400 transition-colors"
                            title="Edit Record"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(record._id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom total bar */}
        {!isLoading && filtered.length > 0 && (
          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
              {hasFilters && <span className="text-orange-400 ml-1">(filtered)</span>}
            </span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              Total: {totalStaff} Workers
            </span>
          </div>
        )}
      </div>

      {/* ─── Edit Modal ──────────────────────────────────────────────────────── */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Edit Worker Allocation</h3>
                  <p className="text-xs text-slate-400">Update department, staff count, or date</p>
                </div>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Fields */}
            <div className="space-y-4">

              {/* Department */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Department</label>
                <select
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Worker Count */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Number of Workers</label>
                <input
                  type="number"
                  min="1"
                  value={editCount}
                  onChange={(e) => setEditCount(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500"
                  placeholder="Enter worker count..."
                />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Allocation Date</label>
                <div className="relative flex items-center">
                  <input
                    ref={editDateRef}
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    onClick={() => openPicker(editDateRef)}
                    style={{
                      colorScheme: theme === 'dark' ? 'dark' : 'light',
                      backgroundColor: theme === 'dark' ? '#020617' : '#ffffff'
                    }}
                    className="w-full pl-3.5 pr-9 py-2.5 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                  />
                  <Calendar
                    onClick={() => openPicker(editDateRef)}
                    className="w-4 h-4 text-slate-400 hover:text-orange-400 absolute right-3 cursor-pointer z-10"
                  />
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};