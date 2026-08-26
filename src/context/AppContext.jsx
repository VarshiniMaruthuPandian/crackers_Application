import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CRACKERS,
  INITIAL_SUPPLIERS,
  INITIAL_WORKERS,
  INITIAL_IMPORTS,
  INITIAL_EXPORTS,
  INITIAL_STOCK,
  INITIAL_ATTENDANCE,
  INITIAL_PAYROLL,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_CUSTOMERS,
  INITIAL_RAW_MATERIALS,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_BOM,
  INITIAL_PURCHASE_REQUESTS,
  INITIAL_QC_RECORDS,
  INITIAL_PACKING_ORDERS,
  INITIAL_DISPATCH_ORDERS,
  INITIAL_SAFETY_RECORDS,
  INITIAL_DOCUMENTS,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState('Super Admin');
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState({
    name: 'Admin Owner',
    email: 'admin@crackershop.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Core & Extended Data states
  const [crackers, setCrackers] = useState(INITIAL_CRACKERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [imports, setImports] = useState(INITIAL_IMPORTS);
  const [exportsList, setExportsList] = useState(INITIAL_EXPORTS);
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [payroll, setPayroll] = useState(INITIAL_PAYROLL);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // PDF Extended Modules Data
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [rawMaterials, setRawMaterials] = useState(INITIAL_RAW_MATERIALS);
  const [productionOrders, setProductionOrders] = useState(INITIAL_PRODUCTION_ORDERS);
  const [bom, setBom] = useState(INITIAL_BOM);
  const [purchaseRequests, setPurchaseRequests] = useState(INITIAL_PURCHASE_REQUESTS);
  const [qcRecords, setQcRecords] = useState(INITIAL_QC_RECORDS);
  const [packingOrders, setPackingOrders] = useState(INITIAL_PACKING_ORDERS);
  const [dispatchOrders, setDispatchOrders] = useState(INITIAL_DISPATCH_ORDERS);
  const [safetyRecords, setSafetyRecords] = useState(INITIAL_SAFETY_RECORDS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Toast System
  const [toast, setToast] = useState(null);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme.toUpperCase()} theme mode.`, 'info');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev?.id === Date.now() ? null : prev));
    }, 3500);
  };

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState(null);

  const requestConfirm = ({ title, message, onConfirm, confirmText = 'Confirm', type = 'danger' }) => {
    setConfirmModal({ title, message, onConfirm, confirmText, type });
  };

  const closeConfirm = () => setConfirmModal(null);

  const addAuditLog = (action, moduleName, details) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAuditLogs((prev) => [
      {
        id: `LOG-${Math.floor(9000 + Math.random() * 999)}`,
        timestamp,
        user: user.name,
        role: userRole,
        action,
        module: moduleName,
        details
      },
      ...prev
    ]);
  };

  // Auth Handlers
  const handleLogin = (email, password) => {
    if (email === 'admin@crackershop.com' && password === 'Admin@123') {
      setIsAuthenticated(true);
      showToast('Welcome back, Super Admin! Factory CRM Platform ready.', 'success');
      return true;
    }
    showToast('Invalid credentials. Use admin@crackershop.com / Admin@123', 'error');
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Logged out successfully.', 'info');
  };

  // CRUD for Extended Modules
  const addCustomer = (data) => {
    const created = {
      ...data,
      id: `CUST-00${customers.length + 1}`,
      outstanding: 0,
      status: 'Active'
    };
    setCustomers([created, ...customers]);
    addAuditLog('CREATE_CUSTOMER', 'CRM Core', `Added customer ${created.name} (${created.type})`);
    showToast(`Customer registered: ${created.name}`, 'success');
  };

  const addRawMaterial = (data) => {
    const created = {
      ...data,
      code: `RM-EXP-${Math.floor(100 + Math.random() * 899)}`,
      currentStock: Number(data.currentStock)
    };
    setRawMaterials([...rawMaterials, created]);
    addAuditLog('CREATE_RAW_MATERIAL', 'Raw Material', `Added RM ${created.name} (${created.code})`);
    showToast(`Raw Material registered: ${created.name}`, 'success');
  };

  const addProductionOrder = (data) => {
    const created = {
      ...data,
      id: `PO-2026-${productionOrders.length + 806}`,
      producedQty: 0,
      rejectedQty: 0,
      batchNo: `BATCH-2026-${data.product.substring(0, 2).toUpperCase()}${Math.floor(10 + Math.random() * 89)}`,
      status: 'Approved'
    };
    setProductionOrders([created, ...productionOrders]);
    addAuditLog('CREATE_PRODUCTION_ORDER', 'Production', `Created production order ${created.id} for ${created.product}`);
    showToast(`Production order created: ${created.id}`, 'success');
  };

  const addQCRecord = (data) => {
    const created = {
      ...data,
      id: `QC-2026-${qcRecords.length + 904}`,
      date: new Date().toISOString().split('T')[0]
    };
    setQcRecords([created, ...qcRecords]);
    addAuditLog('CREATE_QC_RECORD', 'Quality Control', `Inspected batch ${created.batchNo} - ${created.decision}`);
    showToast(`QC Record filed for Batch ${created.batchNo}`, 'success');
  };

  const addDispatchOrder = (data) => {
    const created = {
      ...data,
      id: `DSP-2026-${dispatchOrders.length + 703}`,
      status: 'In Transit',
      podStatus: 'Pending POD'
    };
    setDispatchOrders([created, ...dispatchOrders]);
    addAuditLog('CREATE_DISPATCH', 'Dispatch & Delivery', `Dispatched order ${created.orderId} via ${created.transporter}`);
    showToast(`Dispatch Order generated: ${created.id}`, 'success');
  };

  const addSafetyRecord = (data) => {
    const created = {
      ...data,
      id: `SAF-${safetyRecords.length + 105}`,
      status: 'Compliant'
    };
    setSafetyRecords([created, ...safetyRecords]);
    addAuditLog('CREATE_SAFETY_AUDIT', 'Safety & Compliance', `Recorded safety check: ${created.title}`);
    showToast(`Safety record created: ${created.title}`, 'success');
  };

  const approvePendingTask = (id) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    addAuditLog('APPROVE_TASK', 'Approvals', `Approved task reference ${id}`);
    showToast(`Task ${id} Approved successfully!`, 'success');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Math Totals
  const totalImportAmount = imports.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalExportRevenue = exportsList.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const todayImportsCount = imports.filter(i => i.date === '2026-08-25' || i.date === '2026-08-26').reduce((acc, curr) => acc + curr.bundles, 0) || 125;
  const todayExportsCount = exportsList.filter(e => e.date === '2026-08-26').reduce((acc, curr) => acc + curr.bundles, 0) || 87;
  const lowStockCount = stock.filter(s => s.status === 'Low Stock' || s.availableBundles <= s.reorderLevel).length;
  const presentWorkersCount = attendance.filter(a => a.status === 'Present').length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending Approval').length;

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      userRole,
      setUserRole,
      theme,
      toggleTheme,
      mobileMenuOpen,
      setMobileMenuOpen,
      user,
      setUser,
      currentTab,
      setCurrentTab,
      sidebarCollapsed,
      setSidebarCollapsed,
      globalSearch,
      setGlobalSearch,
      // Datasets
      crackers,
      suppliers,
      workers,
      imports,
      exportsList,
      stock,
      attendance,
      payroll,
      notifications,
      activities,
      customers,
      rawMaterials,
      productionOrders,
      bom,
      purchaseRequests,
      qcRecords,
      packingOrders,
      dispatchOrders,
      safetyRecords,
      documents,
      approvals,
      auditLogs,
      // Toast & Modals
      toast,
      showToast,
      confirmModal,
      requestConfirm,
      closeConfirm,
      // Totals
      totalImportAmount,
      totalExportRevenue,
      todayImportsCount,
      todayExportsCount,
      lowStockCount,
      presentWorkersCount,
      pendingApprovalsCount,
      // Methods
      handleLogin,
      handleLogout,
      addCustomer,
      addRawMaterial,
      addProductionOrder,
      addQCRecord,
      addDispatchOrder,
      addSafetyRecord,
      approvePendingTask,
      formatCurrency
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
