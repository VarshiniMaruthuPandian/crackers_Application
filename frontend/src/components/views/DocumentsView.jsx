import React, { useState } from 'react';
import { FileText, Search, Download, Upload, Calendar, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DocumentsView = () => {
  const { documents, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-400" /> Document Management Vault
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Store & manage statutory PESO permits, GST certificates, supplier agreements, and compliance records.
          </p>
        </div>

        <button
          onClick={() => showToast('Uploading document to secure vault...', 'info')}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Upload className="w-4 h-4 stroke-[3]" /> Upload Document
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="glass-card p-5 rounded-3xl border border-slate-800 flex items-center justify-between hover:border-orange-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">{doc.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{doc.category} • Uploaded by {doc.uploadedBy}</p>
                <span className="text-[10px] text-amber-400 font-mono block mt-1">Expiry: {doc.expiryDate}</span>
              </div>
            </div>

            <button
              onClick={() => showToast(`Downloading ${doc.title}...`, 'success')}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700"
              title="Download File"
            >
              <Download className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
