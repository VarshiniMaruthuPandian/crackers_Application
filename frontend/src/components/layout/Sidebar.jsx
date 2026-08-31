import React from 'react';
import {
  Flame,
  LayoutDashboard,
  Users,
  Boxes,
  ArrowUpRight,
  Truck,
  Factory,
  FileCode2,
  Layers,
  ShieldCheck,
  Package,
  ArrowDownLeft,
  ShoppingBag,
  Building2,
  CalendarCheck,
  CreditCard,
  ShieldAlert,
  CheckSquare,
  FileText,
  Shield,
  BarChart3,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const {
    currentTab,
    setCurrentTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleLogout,
    pendingApprovalsCount,
    theme
  } = useApp();

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'CRM & SALES',
      items: [
        { name: 'Customers', icon: Users },
        { name: 'Products', icon: Boxes },
        { name: 'Exports', icon: ArrowUpRight },
        { name: 'Dispatch', icon: Truck }
      ]
    },
    {
      group: 'MANUFACTURING',
      items: [
        { name: 'Production', icon: Factory },
        { name: 'BOM', icon: FileCode2 },
        { name: 'RawMaterials', icon: Layers },
        { name: 'QualityControl', icon: ShieldCheck },
        { name: 'Packing', icon: Package }
      ]
    },
    {
      group: 'INVENTORY & PURCHASES',
      items: [
        { name: 'Stock', icon: Boxes },
        { name: 'Imports', icon: ArrowDownLeft },
        { name: 'Purchases', icon: ShoppingBag },
        { name: 'Suppliers', icon: Building2 }
      ]
    },
    {
      group: 'WORKFORCE & HR',
      items: [
        { name: 'Workers', icon: Users },
        { name: 'Attendance', icon: CalendarCheck },
        { name: 'Payroll', icon: CreditCard }
      ]
    },
    {
      group: 'GOVERNANCE & SYSTEM',
      items: [
        { name: 'Safety', icon: ShieldAlert },
        { name: 'Approvals', icon: CheckSquare, badge: pendingApprovalsCount },
        { name: 'Documents', icon: FileText },
        { name: 'AuditLog', icon: Shield },
        { name: 'Analytics', icon: BarChart3 },
        { name: 'Reports', icon: FileSpreadsheet },
        { name: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleNavClick = (name) => {
    setCurrentTab(name);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-950 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
          sidebarCollapsed ? 'md:w-20' : 'md:w-64'
        } ${
          mobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Logo */}
        <div>
          <div className="h-18 flex items-center justify-between px-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                </div>
              </div>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <div className="truncate">
                  <h1 className="font-black text-lg text-white tracking-wider flex items-center gap-1">
                    Cracker<span className="text-orange-500">Hub</span>
                  </h1>
                  <p className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">CRM & Factory ERP</p>
                </div>
              )}
            </div>

            {/* Desktop Collapse & Mobile Close Toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors shrink-0"
                title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <p className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">
                    {group.group}
                  </p>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.name)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium text-xs transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                      }`}
                      title={sidebarCollapsed && !mobileMenuOpen ? item.name : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`} />
                        {(!sidebarCollapsed || mobileMenuOpen) && <span className="truncate">{item.name}</span>}
                      </div>

                      {(!sidebarCollapsed || mobileMenuOpen) && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-orange-500 text-slate-950 shadow-md">
                          {item.badge}
                        </span>
                      )}

                      {isActive && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-orange-500 rounded-l-full shadow-md shadow-orange-500/50" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Bottom */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent transition-all"
            title={sidebarCollapsed && !mobileMenuOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
