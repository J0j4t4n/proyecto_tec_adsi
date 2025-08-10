import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DashboardIcon, SunIcon, MoonIcon, SparklesIcon, PaintBrushIcon, DocumentDuplicateIcon, DocumentChartBarIcon, JohanIcon, CubeIcon, MenuIcon, CloseIcon, BellIcon, ComputerDesktopIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, PuzzlePieceIcon } from './components/Icons';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';
import { View, Customer, Product, Supplier, Invoice, Salesperson, ToastMessage, StrategicInsight, PurchaseOrder, AppDataState, GenericCrudConfig, User, Brand, Warehouse, SystemSettings, AppDataArrayKeys, JohanCommand, Notification, WarehouseTransfer, DashboardFilter, ExpenseCategory, Expense, Promotion, CashSession, CashClosing, UserProfile, Quote, DateRange, AuditLogEntry, CommunicationLog, TransactionRiskAnalysis, DuplicateInvoiceCheck, SupportTicket, MarketingCampaign } from './types';
import { NAVIGATION_STRUCTURE, VIEW_CONFIGS } from './constants';
import * as backendService from './services/backendService';
import InvoiceDesigner from './components/InvoiceDesigner';
import GenericCrudList from './components/GenericCrudList';
import GenericForm from './components/GenericForm';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import InvoiceView from './components/InvoiceView';
import Toast from './components/Toast';
import UniversalSearch from './components/UniversalSearch';
import { getJohanDashboardSynthesis, generateSmartReminderText, processJohanCommand, analyzeTransactionRisk, checkDuplicateInvoice, calculateCustomerScore, predictOpportunityCloseProbability } from './services/geminiService';
import { exportToPdf, exportToXlsx } from './services/downloadService';
import PurchaseOrderList from './components/PurchaseOrderList';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import AccountsReceivableReport from './components/AccountsReceivableReport';
import SoldItemsReport from './components/SoldItemsReport';
import KardexReport from './components/KardexReport';
import SystemConfig from './components/SystemConfig';
import JohanAIChat from './components/JohanAIChat';
import SalespeopleDashboard from './components/SalespeopleDashboard';
import CustomersDashboard from './components/CustomersDashboard';
import ConfirmationModal from './components/ConfirmationModal';
import SuppliersDashboard from './components/SuppliersDashboard';
import DailyClosingReport from './components/DailyClosingReport';
import InvoiceFromDocument from './components/InvoiceFromDocument';
import NotificationCenter from './components/NotificationCenter';
import CustomerProfile from './components/CustomerProfile';
import TransferList from './components/TransferList';
import TransferForm from './components/TransferForm';
import SalesForecast from './components/SalesForecast';
import ExecutiveReport from './components/ExecutiveReport';
import FinancialHealthDashboard from './components/FinancialHealthDashboard';
import POS from './components/POS';
import CashDrawerClosing from './components/CashDrawerClosing';
import SupplierProfile from './components/SupplierProfile';
import Login from './components/Login';
import InventoryDashboard from './components/InventoryDashboard';
import MarketingDashboard from './components/MarketingDashboard';
import QuoteList from './components/QuoteList';
import QuoteForm from './components/QuoteForm';
import AuditLog from './components/AuditLog';
import { OpportunitiesPipeline } from './components/SalesPipeline';
import ProfitAndLossStatement from './components/ProfitAndLossStatement';
import BalanceSheet from './components/BalanceSheet';
import CashFlowStatement from './components/CashFlowStatement';
import CommissionReport from './components/CommissionReport';
import StockReport from './components/StockReport';
import ModulesAndIntegrations from './components/IntegrationsConfig';
import CollectionsDashboard from './components/CollectionsDashboard';
import SupportTickets from './components/SupportTickets';
import MarketingCampaigns from './components/MarketingCampaigns';
import CashierDashboard from './components/CashierDashboard';
import ExpenseFromDocument from './components/ExpenseFromDocument';
import { formatCurrency } from './utils/formatters';


const Sidebar: React.FC<{
    currentView: View;
    onNavigate: (view: View) => void;
    isOpen: boolean;
    onClose: () => void;
    user: User;
    userProfiles: UserProfile[];
    systemSettings: SystemSettings;
}> = React.memo(({ currentView, onNavigate, isOpen, onClose, user, userProfiles, systemSettings }) => {
    
    const coreViews: { id: View; label: string; icon: React.ReactNode }[] = [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="h-6 w-6" /> },
    ];
    
    const userPermissions = useMemo(() => {
        const profile = userProfiles.find(p => p.id === user.profileId);
        return profile?.permissions || {};
    }, [user.profileId, userProfiles]);

    const filteredCoreViews = useMemo(() => coreViews.filter(view => userPermissions[view.id]?.view), [coreViews, userPermissions]);
    
    const filteredNavStructure = useMemo(() => {
        return NAVIGATION_STRUCTURE
            .map(section => ({
                ...section,
                groups: section.groups
                    .map(group => ({
                        ...group,
                        links: group.links.filter(link => userPermissions[link.id]?.view)
                    }))
                    .filter(group => group.links.length > 0)
            }))
            .filter(section => section.groups.length > 0);
    }, [userPermissions]);

    return (
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-neutral-900 border-r border-slate-200 dark:border-neutral-800 flex flex-col p-4 transition-transform duration-300 ease-in-out z-40 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center">
                  <div className="p-2 bg-primary-600 rounded-lg">
                      <PuzzlePieceIcon className="h-7 w-7 text-white"/>
                  </div>
                  <span className="ml-3 text-lg font-bold tracking-tighter">{systemSettings.companyName.split(' ').slice(0, 2).join(' ')}</span>
              </div>
               <button onClick={onClose} className="lg:hidden p-1 text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white" aria-label="Cerrar menú">
                  <CloseIcon className="h-6 w-6" />
              </button>
          </div>
          
          <nav className="flex-grow space-y-4 overflow-y-auto pr-2">
              <div className='space-y-1'>
                  {filteredCoreViews.map(item => (
                       <button
                          key={item.id}
                          onClick={() => onNavigate(item.id)}
                          className={`flex items-center w-full px-3 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 group ${
                            currentView === item.id
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                          }`}
                      >
                          {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "h-5 w-5" })}
                          <span className="ml-3">{item.label}</span>
                      </button>
                  ))}
              </div>

              <div className="space-y-2 pt-2">
              {filteredNavStructure.map(section => (
                  <div key={section.label}>
                      <h3 className="px-3 text-xs font-bold uppercase text-slate-400 dark:text-neutral-500 mb-2">{section.label}</h3>
                      <div className="space-y-1">
                          {section.groups.map(group => (
                              <div key={group.label}>
                                  {group.links.map(link => (
                                      <button
                                          key={link.id}
                                          onClick={() => onNavigate(link.id)}
                                          className={`flex items-center w-full pl-3 pr-2 py-2 text-sm font-medium rounded-md transition-all duration-200 group ${
                                            currentView === link.id
                                              ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-500/10'
                                              : 'text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800'
                                          }`}
                                      >
                                          {link.icon}
                                          <span className="ml-3">{link.label}</span>
                                      </button>
                                  ))}
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
              </div>
          </nav>
      </aside>
    );
});

type ModalState = 
    | { type: 'closed' }
    | { type: 'invoice-form'; invoice: Invoice | null }
    | { type: 'invoice-view'; invoice: Invoice }
    | { type: 'purchase-order-form'; purchaseOrder: PurchaseOrder | null }
    | { type: 'transfer-form'; transfer: WarehouseTransfer | null }
    | { type: 'quote-form'; quote: Quote | null }
    | { type: 'generic-form'; config: GenericCrudConfig; item: any | null };

type ConfirmationModalState = {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

const UserMenu: React.FC<{ user: User & { selectedWarehouseId: string }; warehouses: Warehouse[]; onLogout: () => void }> = ({ user, warehouses, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const selectedWarehouse = warehouses.find(w => w.id === user.selectedWarehouseId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors">
                <UserCircleIcon className="h-8 w-8 text-slate-700 dark:text-neutral-300" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border dark:border-neutral-800 py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b dark:border-neutral-800">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500">En: <strong>{selectedWarehouse?.name || 'N/A'}</strong></p>
                    </div>
                    <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <ArrowLeftOnRectangleIcon className="h-5 w-5"/>
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export const App: React.FC = () => {
    const [authenticatedUser, setAuthenticatedUser] = useState<(User & { selectedWarehouseId: string }) | null>(null);
    const [currentView, setCurrentView] = useState<{ view: View; payload: any }>({ view: 'dashboard', payload: null });
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({type: 'closed'});
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [isJohanOpen, setIsJohanOpen] = useState(false);
    const [johanCommand, setJohanCommand] = useState<JohanCommand | null>(null);
    const [confirmationModalState, setConfirmationModalState] = useState<ConfirmationModalState>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    const insightTimeoutRef = useRef<number | null>(null);
    const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
    
    // Dashboard-specific filters managed here to trigger AI insights
    const [dashboardFilter, setDashboardFilter] = useState<DashboardFilter>([]);
    const [dashboardDateRange, setDashboardDateRange] = useState<DateRange>({ start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date() });

    const [activeCashSession, setActiveCashSession] = useState<CashSession | null>(() => {
        try {
            const savedSession = localStorage.getItem('activeCashSession');
            return savedSession ? JSON.parse(savedSession) : null;
        } catch (error) {
            console.error("Error al leer la sesión de caja desde localStorage:", error);
            return null;
        }
    });
    const activityTimerRef = useRef<number | null>(null);

    const [dataState, setDataState] = useState<AppDataState | null>(null);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    useEffect(() => {
        backendService.getWarehouses().then(setWarehouses);
    }, []);

    const [insights, setInsights] = useState<StrategicInsight[]>([]);
    const [insightsLoading, setInsightsLoading] = useState(true);

    useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode) }, [isDarkMode]);
    
    const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    }, []);

    
    
    const addAuditLogEntry = useCallback(async (action: string, details: string) => {
        if (!authenticatedUser || !dataState) return;
        const newEntry: AuditLogEntry = {
            id: `AL-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId: authenticatedUser.id,
            userName: authenticatedUser.name,
            action,
            details
        };
        const newState = { ...dataState, auditLog: [newEntry, ...dataState.auditLog] };
        await updateState(newState);
    }, [authenticatedUser, dataState, updateState]);

    const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
        if (!dataState) return;
        const newNotification: Notification = {
            ...notification,
            id: Date.now(),
            date: new Date().toISOString(),
            read: false,
        };
        const newState = { ...dataState, notifications: [newNotification, ...dataState.notifications] };
        await updateState(newState);
    }, [dataState, updateState]);

    const handleNavigate = useCallback((view: View, payload: any = null) => {
        if (!authenticatedUser || !dataState) return;
        const profile = dataState.config_user_profiles.find(p => p.id === authenticatedUser.profileId);
        
        if (payload?.action === 'create_invoice_draft') {
            const customer = dataState.customers.find(c => c.id === payload.customerId);
             const draftInvoice: Partial<Invoice> = {
                customerId: customer?.id,
                customerName: customer?.name,
                status: 'borrador',
                items: [],
             };
             setModalState({ type: 'invoice-form', invoice: draftInvoice as Invoice });
            return;
        }

        if (view === 'expense_from_document' && payload?.prefill) { // This is the fix
            const config = VIEW_CONFIGS['finance_expenses'];
            setModalState({ type: 'generic-form', config, item: payload.prefill });
            // Do not navigate away from the upload view.
            return;
        }
        
        // Fix for "Hub de Contactos" and other similar actions
        if (payload?.action === 'create') {
            const config = VIEW_CONFIGS[view];
            if (config) {
                setModalState({ type: 'generic-form', config, item: null });
                return; // CRITICAL FIX: Stop execution to only open the modal, not navigate away.
            }
        }

        if (!profile || !profile.permissions[view]?.view) {
             addToast("No tienes permiso para acceder a esta sección.", "error");
            return;
        }

        setCurrentView({ view, payload });
        if (window.innerWidth < 1024) { // lg breakpoint in Tailwind
            setIsSidebarOpen(false);
        }
    }, [authenticatedUser, dataState, addToast]);

    // Predictive Invoicing Check
    useEffect(() => {
        if (authenticatedUser && dataState) {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            
            const recurringCustomers = dataState.customers.filter(c => {
                const customerInvoices = dataState.invoices.filter(i => i.customerId === c.id);
                if (customerInvoices.length < 2) return false;
                
                const hasCurrentMonthInvoice = customerInvoices.some(i => {
                    const issueDate = new Date(i.issueDate);
                    return issueDate.getMonth() === currentMonth && issueDate.getFullYear() === currentYear;
                });
                if (hasCurrentMonthInvoice) return false;
                
                const hasPrevMonthInvoice = customerInvoices.some(i => {
                     const issueDate = new Date(i.issueDate);
                     const d = new Date(currentYear, currentMonth - 1);
                     return issueDate.getMonth() === d.getMonth() && issueDate.getFullYear() === d.getFullYear();
                });
                const hasPrev2MonthInvoice = customerInvoices.some(i => {
                     const issueDate = new Date(i.issueDate);
                     const d = new Date(currentYear, currentMonth - 2);
                     return issueDate.getMonth() === d.getMonth() && issueDate.getFullYear() === d.getFullYear();
                });

                return hasPrevMonthInvoice && hasPrev2MonthInvoice;
            });
            
            recurringCustomers.forEach(customer => {
                const notificationExists = dataState.notifications.some(n => n.link?.payload?.customerId === customer.id && n.link?.payload?.action === 'create_invoice_draft');
                if (!notificationExists) {
                    addNotification({
                        type: 'info',
                        title: 'Sugerencia de Facturación',
                        message: `Parece que es hora de facturar a ${customer.name}. ¿Crear borrador?`,
                        link: { view: 'dashboard', payload: { action: 'create_invoice_draft', customerId: customer.id } }
                    });
                }
            });
        }
    }, [authenticatedUser, dataState, addNotification]);

    useEffect(() => {
        if (insightTimeoutRef.current) clearTimeout(insightTimeoutRef.current);

        const fetchAIData = async () => {
             if (!authenticatedUser || !dataState) return;
             const profile = dataState.config_user_profiles.find(p => p.id === authenticatedUser.profileId);
            if (currentView.view === 'dashboard' && profile?.permissions[currentView.view]?.view) {
                setInsightsLoading(true);
                try {
                    const insightsResult = await getJohanDashboardSynthesis(dataState, dashboardFilter.length > 0 ? dashboardFilter : null, dashboardDateRange);
                    setInsights(insightsResult);
                } catch (error) {
                    console.error("Failed to fetch Johan dashboard synthesis", error);
                    addToast("Error al contactar a Johan", "error");
                } finally {
                    setInsightsLoading(false);
                }
            }
        };
        
        if (currentView.view === 'dashboard' && authenticatedUser) {
            insightTimeoutRef.current = window.setTimeout(fetchAIData, 1500);
        } else {
            setInsights([]);
        }

        return () => {
            if (insightTimeoutRef.current) clearTimeout(insightTimeoutRef.current);
        }
    }, [currentView.view, dataState, dashboardFilter, dashboardDateRange, authenticatedUser, addToast]);
    
    const handleLogout = useCallback(async () => {
        await supabaseService.logout();
        localStorage.removeItem('activeCashSession');
        setAuthenticatedUser(null);
        setDataState(null);
        addToast("Has cerrado la sesión.", "info");
    }, [addToast]);

    const resetActivityTimer = useCallback(() => {
        if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
        activityTimerRef.current = window.setTimeout(() => {
            handleLogout();
            addToast("Sesión cerrada por inactividad.", "info");
        }, 15 * 60 * 1000); // 15 minutes
    }, [handleLogout, addToast]);

    useEffect(() => {
        if (authenticatedUser) {
            window.addEventListener('mousemove', resetActivityTimer);
            window.addEventListener('keydown', resetActivityTimer);
            resetActivityTimer();
        }
        return () => {
            if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
            window.removeEventListener('mousemove', resetActivityTimer);
            window.removeEventListener('keydown', resetActivityTimer);
        };
    }, [authenticatedUser, resetActivityTimer]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const handleViewInvoice = useCallback((invoice: Invoice) => {
        setModalState({ type: 'invoice-view', invoice });
    }, []);
    
    const handleSearchResultSelect = useCallback((item: any, type: string, view?: View, payload?: any) => {
        if (view && payload) {
            handleNavigate(view, payload);
        } else if (type === 'invoice') handleViewInvoice(item as Invoice);
        else if (type === 'product') handleNavigate('inventory_items_services');
        else if (type === 'salesperson') handleNavigate('salespeople_dashboard');
        else if (type === 'user') handleNavigate('config_users');
        setIsSidebarOpen(false);
    }, [handleNavigate, handleViewInvoice]);

    const handleInsightAction = useCallback((action: StrategicInsight['action']) => {
        if (!action || !dataState) return;
        if (action.type === 'view_invoice') {
            const invoiceToView = dataState.invoices.find(i => i.id === action.payload);
            if (invoiceToView) handleViewInvoice(invoiceToView);
        }
        if (action.type === 'view_product') {
             handleNavigate('inventory_items_services');
        }
        if (action.type === 'view_customer') {
            handleNavigate('customer_profile', action.payload);
        }
        if (action.type === 'navigate') {
            handleNavigate(action.payload);
        }
        if (action.type === 'create_po') {
            const product = dataState.products.find(p => p.id === action.payload);
            if(product) {
                const draftPO: Partial<PurchaseOrder> = {
                    status: 'borrador',
                    items: [{
                        productId: product.id,
                        productName: product.name,
                        quantity: 50, // Suggest a default quantity
                        unitCost: product.cost,
                        total: product.cost * 50,
                    }]
                };
                setModalState({ type: 'purchase-order-form', purchaseOrder: draftPO as PurchaseOrder });
            }
        }
    }, [dataState, handleNavigate, handleViewInvoice]);
    
    const handleJohanCommand = useCallback(async (command: JohanCommand) => {
        if (!dataState) return;
        setJohanCommand(null);
        
        switch (command.name) {
            case 'set_dashboard_range':
                handleNavigate('dashboard');
                setTimeout(() => setJohanCommand(command), 0);
                break;
            case 'navigate':
            case 'show_report':
                if (command.payload?.view) {
                    handleNavigate(command.payload.view);
                }
                break;
            case 'send_reminder':
                if (command.payload?.invoiceId) {
                    const invoice = dataState.invoices.find(i => i.id === command.payload.invoiceId);
                    if (invoice) {
                        const reminderText = await generateSmartReminderText(invoice);
                        addToast(`Recordatorio IA: "${reminderText}"`, 'info');
                    }
                }
                break;
            case 'generate_report':
                if (command.payload?.report_name) {
                    const reportName = command.payload.report_name;
                    const format = command.payload.format || 'pdf';
                    let data;
                    let columns;
                    if (reportName === 'sales_sold_items') {
                        data = dataState.invoices.filter(i => i.status === 'pagada').flatMap(i => i.items);
                        columns = [{key: 'productName', header: 'Producto'}, {key: 'quantity', header: 'Cantidad'}, {key: 'total', header: 'Total'}];
                    } else if (reportName === 'sales_accounts_receivable') {
                        data = dataState.invoices.filter(i => i.status !== 'pagada');
                        columns = [{key: 'id', header: 'ID'}, {key: 'customerName', header: 'Cliente'}, {key: 'total', header: 'Total'}];
                    }

                    if (data && columns) {
                        if (format === 'pdf') exportToPdf(columns, data, reportName);
                        else exportToXlsx(data, `${reportName}.xlsx`);
                        addToast(`Reporte ${reportName} generado en formato ${format}.`, 'success');
                    } else {
                        addToast(`No se pudo generar el reporte: ${reportName}`, 'error');
                    }
                }
                break;
        }
    }, [handleNavigate, dataState, addToast]);
    
    const handleInvoiceDataExtracted = useCallback((extractedData: Partial<Invoice>) => {
        setModalState({ type: 'invoice-form', invoice: extractedData as Invoice });
        addToast("Datos extraídos. Por favor, revisa y completa la factura.", "info");
    }, [addToast]);

    const handleScoreCustomer = useCallback(async (customerId: number, score: number) => {
        if (!dataState) return;

        const customer = dataState.customers.find(c => c.id === customerId);
        if (!customer) return;

        const updatedCustomers = dataState.customers.map(c => 
            c.id === customerId ? { ...c, customerScore: score } : c
        );

        const newState = { ...dataState, customers: updatedCustomers };
        await updateState(newState);
        addToast(`Puntuación de IA para ${customer.name} actualizada a ${score}.`, 'info');
    }, [dataState, updateState, addToast]);

    const handleInvoicePayment = useCallback(async (invoiceId: string) => {
        if (!dataState) return;
        
        const invoice = dataState.invoices.find(i => i.id === invoiceId);
        if (!invoice) return;

        const updatedInvoice = { ...invoice, status: 'pagada' as 'pagada', paymentDate: new Date().toISOString().split('T')[0] };
        const savedInvoice = await supabaseService.saveRecord('invoices', updatedInvoice);

        if (savedInvoice) {
            const updatedInvoices = dataState.invoices.map(i => i.id === savedInvoice.id ? savedInvoice : i);
            const newState = { ...dataState, invoices: updatedInvoices };

            await addAuditLogEntry('INVOICE_PAID', `Invoice ${invoiceId} marked as paid.`);
            const customer = dataState.customers.find(c => c.id === savedInvoice.customerId);
            if(customer) {
                const customerInvoices = updatedInvoices.filter(i => i.customerId === customer.id && i.status === 'pagada' && i.paymentDate);
                let totalDays = 0;
                customerInvoices.forEach(i => {
                    const issue = new Date(i.issueDate);
                    const payment = new Date(i.paymentDate!);
                    totalDays += (payment.getTime() - issue.getTime()) / (1000 * 3600 * 24);
                });
                const avgPaymentDays = Math.round(totalDays / customerInvoices.length);
                const updatedCustomer = { ...customer, avgPaymentDays };
                await supabaseService.saveRecord('customers', updatedCustomer);
                const updatedCustomers = dataState.customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
                newState.customers = updatedCustomers;
            }
            
            setDataState(newState);
            addToast(`Factura ${invoiceId} marcada como pagada.`, 'success');
            setModalState({type: 'closed'});
        } else {
            addToast('Error al marcar la factura como pagada.', 'error');
        }
    }, [dataState, addToast, addAuditLogEntry]);

    const handleAIFeedback = useCallback(async (invoiceId: string, feedbackType: 'risk' | 'paymentPrediction', value: 'correct' | 'incorrect') => {
        if (!dataState) return;
        
        const invoice = dataState.invoices.find(i => i.id === invoiceId);
        if (!invoice) return;

        let updatedInvoice;
        if (feedbackType === 'risk') {
            updatedInvoice = { ...invoice, riskFeedback: value };
        } else if (feedbackType === 'paymentPrediction') {
            updatedInvoice = { ...invoice, paymentPredictionFeedback: value };
        } else {
            return;
        }

        const savedInvoice = await supabaseService.saveRecord('invoices', updatedInvoice);

        if (savedInvoice) {
            const updatedInvoices = dataState.invoices.map(i => i.id === savedInvoice.id ? savedInvoice : i);
            const newState = { ...dataState, invoices: updatedInvoices };
            setDataState(newState);
            addToast('Gracias por tu feedback. Johan aprenderá de esto.', 'info');
        } else {
            addToast('Error al guardar el feedback.', 'error');
        }
    }, [dataState, addToast]);
    
    // START POS SESSION MANAGEMENT
    const handleOpenSession = useCallback(async (openingBalance: number) => {
        if (!authenticatedUser || !dataState) return;
        const newSession: CashSession = {
            id: `CS-${Date.now()}`,
            openingDate: new Date().toISOString(),
            userId: authenticatedUser.id,
            openingBalance,
            status: 'open'
        };

        const savedSession = await supabaseService.saveRecord('cash_sessions', newSession);

        if (savedSession) {
            const newState = { ...dataState, cashSessions: [...dataState.cashSessions, savedSession] };
            setDataState(newState);
            setActiveCashSession(savedSession);
            localStorage.setItem('activeCashSession', JSON.stringify(savedSession));
            addToast(`Sesión de caja abierta con ${formatCurrency(openingBalance)}`, 'success');
            await addAuditLogEntry('CASH_SESSION_OPEN', `Session ${savedSession.id} opened with balance ${openingBalance}.`);
        } else {
            addToast('Error al abrir la sesión de caja.', 'error');
        }
    }, [authenticatedUser, dataState, addToast, addAuditLogEntry]);

    const handleCloseSession = useCallback(async (closingData: Omit<CashClosing, 'id'|'closingDate'|'cashSessionId'|'openingDate'|'userId'>) => {
        if (!authenticatedUser || !dataState || !activeCashSession) return;
        
        const newClosing: CashClosing = {
            ...closingData,
            id: `CC-${Date.now()}`,
            cashSessionId: activeCashSession.id,
            openingDate: activeCashSession.openingDate,
            closingDate: new Date().toISOString(),
            userId: authenticatedUser.id
        };

        const savedClosing = await supabaseService.saveRecord('cash_closings', newClosing);

        if (savedClosing) {
            const newState = { ...dataState, cashClosings: [savedClosing, ...dataState.cashClosings] };
            setDataState(newState);
            setActiveCashSession(null);
            localStorage.removeItem('activeCashSession');
            addToast(`Sesión de caja cerrada. Diferencia total: ${formatCurrency(closingData.totalDifference)}`, closingData.totalDifference === 0 ? 'success' : 'info');
            await addAuditLogEntry('CASH_SESSION_CLOSE', `Session ${activeCashSession.id} closed. Difference: ${closingData.totalDifference}.`);
        } else {
            addToast('Error al cerrar la sesión de caja.', 'error');
        }

    }, [authenticatedUser, dataState, activeCashSession, addToast, addAuditLogEntry]);
    
    // --- Generic CRUD handlers ---
    const handleSave = useCallback(async (config: GenericCrudConfig, item: any) => {
        if (!dataState) return;
        const dataKey: AppDataArrayKeys = config.dataKey;
        const isNew = !item.id;
        
        let updatedList;
        if (isNew) {
            const newItem = { ...item, id: `${dataKey.slice(0, 4).toUpperCase()}-${Date.now()}` };
            updatedList = [...(dataState[dataKey] as any[]), newItem];
            await addAuditLogEntry('CREATE', `New ${config.singular} created: ${newItem.id} in ${config.title}.`);
        } else {
            updatedList = (dataState[dataKey] as any[]).map(existing => existing.id === item.id ? item : existing);
            await addAuditLogEntry('UPDATE', `Updated ${config.singular}: ${item.id} in ${config.title}.`);
        }
        
        const newState = { ...dataState, [dataKey]: updatedList };
        await updateState(newState);
        
        addToast(`${config.singular} ${isNew ? 'creado' : 'actualizado'} con éxito.`, 'success');
        setModalState({type: 'closed'});
    }, [dataState, updateState, addToast, addAuditLogEntry]);

    const handleDelete = useCallback((config: GenericCrudConfig, id: string | number) => {
        const confirmDelete = () => async () => {
            if (!dataState) return;
            const dataKey = config.dataKey;
            
            await supabaseService.deleteRecord(dataKey, id);

            const updatedList = (dataState[dataKey] as any[]).filter(item => item.id !== id);
            const newState = { ...dataState, [dataKey]: updatedList };
            setDataState(newState);

            addToast(`${config.singular} eliminado.`, 'success');
            setConfirmationModalState({isOpen: false, title: '', message: '', onConfirm: ()=>{}});
        }
        setConfirmationModalState({
            isOpen: true,
            title: `Eliminar ${config.singular}`,
            message: `¿Estás seguro de que quieres eliminar este ${config.singular.toLowerCase()}? Esta acción no se puede deshacer.`,
            onConfirm: confirmDelete(),
        });
    }, [dataState, addToast]);

    // --- Specific entity handlers ---
    const handleSaveInvoice = useCallback(async (invoice: Invoice) => {
        if (!dataState || !authenticatedUser) return;

        const isNew = !invoice.id;
        const customer = dataState.customers.find(c => c.id === invoice.customerId);
        invoice.customerName = customer?.name;
        
        if (!invoice.salespersonId) {
            invoice.salespersonId = authenticatedUser.id;
        }

        const invoiceToSave = isNew ? { ...invoice, id: `INV-${Date.now()}` } : invoice;
        
        // AI Checks for new invoices
        if (isNew) {
            const riskPromise = analyzeTransactionRisk(invoiceToSave, customer);
            const duplicatePromise = checkDuplicateInvoice(invoiceToSave, dataState.invoices.filter(i => i.customerId === invoice.customerId));
            const [risk, duplicate] = await Promise.all([riskPromise, duplicatePromise]);
            invoiceToSave.riskLevel = risk.riskLevel;
            invoiceToSave.riskReason = risk.reason;
            invoiceToSave.isPotentialDuplicate = duplicate.isDuplicate;
            invoiceToSave.duplicateReason = duplicate.reason;
        }

        const savedInvoice = await supabaseService.saveRecord('invoices', invoiceToSave);

        if (savedInvoice) {
            const updatedInvoices = isNew
                ? [savedInvoice, ...dataState.invoices]
                : dataState.invoices.map(i => i.id === savedInvoice.id ? savedInvoice : i);
            
            const newState = { ...dataState, invoices: updatedInvoices };
            
            // Update stock
            if (isNew && savedInvoice.warehouseId) {
                const newProducts = [...newState.products];
                savedInvoice.items.forEach(item => {
                    const productIndex = newProducts.findIndex(p => p.id === item.productId);
                    if (productIndex > -1 && newProducts[productIndex].stockByWarehouse[savedInvoice.warehouseId!]) {
                        newProducts[productIndex].stockByWarehouse[savedInvoice.warehouseId!] -= item.quantity;
                    }
                });
                newState.products = newProducts;
                await supabaseService.saveRecord('products', newState.products);
            }

            setDataState(newState);
            await addAuditLogEntry(isNew ? 'INVOICE_CREATE' : 'INVOICE_UPDATE', `Invoice ${savedInvoice.id} saved.`);
            
            addToast(`Factura ${isNew ? 'creada' : 'actualizada'} con éxito.`, 'success');
            if (savedInvoice.isPotentialDuplicate) {
                addToast(`Alerta: Esta factura podría ser un duplicado. Razón: ${savedInvoice.duplicateReason}`, 'info');
            }
            setModalState({type: 'closed'});
        } else {
            addToast('Error al guardar la factura.', 'error');
        }
    }, [dataState, updateState, addToast, authenticatedUser, addAuditLogEntry]);
    
    const handleSavePurchaseOrder = useCallback(async (po: PurchaseOrder) => {
        if (!dataState) return;
        const isNew = !po.id;
        const poToSave = isNew ? { ...po, id: `PO-${Date.now()}` } : po;

        const savedPO = await supabaseService.saveRecord('purchase_orders', poToSave);

        if (savedPO) {
            const updatedPOs = isNew ? [savedPO, ...dataState.purchaseOrders] : dataState.purchaseOrders.map(p => p.id === savedPO.id ? savedPO : p);
            
            const newState = { ...dataState, purchaseOrders: updatedPOs };
            
            // Update stock if received
            if (savedPO.status === 'recibida' && savedPO.warehouseId) {
                const warehouseId = savedPO.warehouseId;
                const newProducts = [...newState.products];
                savedPO.items.forEach(item => {
                    const productIndex = newProducts.findIndex(p => p.id === item.productId);
                    if (productIndex > -1) {
                        if (!newProducts[productIndex].stockByWarehouse[warehouseId]) {
                            newProducts[productIndex].stockByWarehouse[warehouseId] = 0;
                        }
                        newProducts[productIndex].stockByWarehouse[warehouseId] += item.quantity;
                    }
                });
                newState.products = newProducts;
                await supabaseService.saveRecord('products', newState.products);
            }
            
            setDataState(newState);
            addToast(`Orden de compra ${isNew ? 'creada' : 'actualizada'}.`, 'success');
            setModalState({type: 'closed'});
        } else {
            addToast('Error al guardar la orden de compra.', 'error');
        }
    }, [dataState, addToast]);
    
    const handleSaveTransfer = useCallback(async (transfer: WarehouseTransfer) => {
        if (!dataState) return;
        const newTransfer = { ...transfer, id: `TRF-${Date.now()}` };
        
        const savedTransfer = await supabaseService.saveRecord('warehouse_transfers', newTransfer);

        if (savedTransfer) {
            const updatedTransfers = [savedTransfer, ...dataState.warehouseTransfers];
            
            const newProducts = [...dataState.products];
            savedTransfer.items.forEach(item => {
                const productIndex = newProducts.findIndex(p => p.id === item.productId);
                if (productIndex > -1) {
                    newProducts[productIndex].stockByWarehouse[savedTransfer.fromWarehouseId] -= item.quantity;
                    newProducts[productIndex].stockByWarehouse[savedTransfer.toWarehouseId] = (newProducts[productIndex].stockByWarehouse[savedTransfer.toWarehouseId] || 0) + item.quantity;
                }
            });

            const newState = { ...dataState, warehouseTransfers: updatedTransfers, products: newProducts };
            await supabaseService.saveRecord('products', newState.products);
            
            setDataState(newState);
            addToast('Transferencia realizada con éxito.', 'success');
            setModalState({type: 'closed'});
        } else {
            addToast('Error al guardar la transferencia.', 'error');
        }
    }, [dataState, addToast]);
    
    const handleSaveQuote = useCallback(async (quote: Quote) => {
        if (!dataState) return;
        const isNew = !quote.id;
        const quoteToSave = isNew ? { ...quote, id: `COT-${Date.now()}` } : quote;

        // AI Probability update
        if (quoteToSave.stage !== 'Ganada' && quoteToSave.stage !== 'Perdida') {
             const customerInvoices = dataState.invoices.filter(i => i.customerId === quote.customerId);
             const prediction = await predictOpportunityCloseProbability(quoteToSave, customerInvoices);
             quoteToSave.probability = prediction.probability;
        } else {
            quoteToSave.probability = quoteToSave.stage === 'Ganada' ? 100 : 0;
        }

        const savedQuote = await supabaseService.saveRecord('quotes', quoteToSave);

        if (savedQuote) {
            const updatedQuotes = isNew ? [savedQuote, ...dataState.quotes] : dataState.quotes.map(q => q.id === savedQuote.id ? savedQuote : q);
            const newState = { ...dataState, quotes: updatedQuotes };
            setDataState(newState);
            addToast(`Cotización ${isNew ? 'creada' : 'actualizada'}.`, 'success');
            setModalState({type: 'closed'});
        } else {
            addToast('Error al guardar la cotización.', 'error');
        }
    }, [dataState, addToast]);

    const handleConvertToInvoice = useCallback((quote: Quote) => {
        const newInvoice: Partial<Invoice> = {
            customerId: quote.customerId,
            customerName: quote.customerName,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            status: 'borrador',
            items: quote.items.map(item => ({ ...item })),
            subtotal: quote.subtotal,
            iva: quote.iva,
            total: quote.total,
            salespersonId: quote.salespersonId
        };
        setModalState({ type: 'invoice-form', invoice: newInvoice as Invoice });
    }, []);

    const handleSaveSystemSettings = useCallback(async (settings: SystemSettings) => {
        if (!dataState) return;
        
        const savedSettings = await supabaseService.saveRecord('system_settings', settings);

        if (savedSettings) {
            const newState = { ...dataState, systemSettings: savedSettings };
            setDataState(newState);
            addToast('Configuración del sistema guardada.', 'success');
        } else {
            addToast('Error al guardar la configuración del sistema.', 'error');
        }
    }, [dataState, addToast]);
    
    const handleLogCommunication = useCallback(async (customerId: number, type: 'note_added' | 'call_logged', details: string) => {
        if (!dataState) return;
        const newLog: CommunicationLog = { id: `log-${Date.now()}`, date: new Date().toISOString(), type, details };
        
        const customer = dataState.customers.find(c => c.id === customerId);
        if (!customer) return;

        const updatedCustomer = { ...customer, communicationHistory: [newLog, ...(customer.communicationHistory || [])] };
        const savedCustomer = await supabaseService.saveRecord('customers', updatedCustomer);

        if (savedCustomer) {
            const updatedCustomers = dataState.customers.map(c => c.id === savedCustomer.id ? savedCustomer : c);
            const newState = { ...dataState, customers: updatedCustomers };
            setDataState(newState);
            addToast('Registro de comunicación añadido.', 'success');
        } else {
            addToast('Error al añadir el registro de comunicación.', 'error');
        }
    }, [dataState, addToast]);

    const handleSaveTicket = useCallback(async (ticket: SupportTicket) => {
        if (!dataState) return;
        const isNew = !ticket.id;
        
        const savedTicket = await supabaseService.saveRecord('support_tickets', ticket);

        if (savedTicket) {
            const updatedTickets = isNew
                ? [savedTicket, ...dataState.supportTickets]
                : dataState.supportTickets.map(t => t.id === savedTicket.id ? savedTicket : t);
            
            const newState = { ...dataState, supportTickets: updatedTickets };
            setDataState(newState);
            addToast(`Ticket ${isNew ? 'creado' : 'actualizado'}`. 'success');
        } else {
            addToast('Error al guardar el ticket.', 'error');
        }
    }, [dataState, addToast]);
    
    const handleSaveCampaign = useCallback(async (campaign: MarketingCampaign) => {
        if (!dataState) return;
        const isNew = !campaign.id;
        const campaignToSave = isNew ? { ...campaign, id: `CAMP-${Date.now()}` } : campaign;
        
        const savedCampaign = await supabaseService.saveRecord('marketing_campaigns', campaignToSave);

        if (savedCampaign) {
            const updatedCampaigns = isNew
                ? [savedCampaign, ...dataState.marketingCampaigns]
                : dataState.marketingCampaigns.map(c => c.id === savedCampaign.id ? savedCampaign : c);
            
            const newState = { ...dataState, marketingCampaigns: updatedCampaigns };
            setDataState(newState);
            addToast(`Campaña ${isNew ? 'creada' : 'actualizada'}`, 'success');
        } else {
            addToast('Error al guardar la campaña.', 'error');
        }
    }, [dataState, addToast]);

    const handleSendCampaign = useCallback(async (campaignId: string) => {
        if (!dataState) return;
        const campaign = dataState.marketingCampaigns.find(c => c.id === campaignId);
        if (!campaign) return;

        const updatedCampaign = { ...campaign, status: 'enviada' as const, sentAt: new Date().toISOString() };
        const savedCampaign = await supabaseService.saveRecord('marketing_campaigns', updatedCampaign);

        if (savedCampaign) {
            const updatedCampaigns = dataState.marketingCampaigns.map(c => c.id === savedCampaign.id ? savedCampaign : c);

            const customersToTarget = dataState.customers.filter(c =>
                savedCampaign.targetTags.some(tag => c.tags?.includes(tag))
            );

            const newCommLogs: CommunicationLog[] = customersToTarget.map(c => ({
                id: `comm-${c.id}-${Date.now()}`,
                date: new Date().toISOString(),
                type: 'campaign_email_sent',
                details: `Email de campaña enviado: "${savedCampaign.name}"`
            }));

            const customersToUpdate = dataState.customers.map(c => {
                const relevantLog = newCommLogs.find(log => log.id.startsWith(`comm-${c.id}`));
                if (relevantLog) {
                    return { ...c, communicationHistory: [relevantLog, ...(c.communicationHistory || [])] };
                }
                return c;
            }).filter(c => newCommLogs.some(log => log.id.startsWith(`comm-${c.id}`)));

            await supabaseService.saveRecord('customers', customersToUpdate);

            const updatedCustomers = dataState.customers.map(c => {
                const updatedCustomer = customersToUpdate.find(uc => uc.id === c.id);
                return updatedCustomer || c;
            });
            
            const newState = { ...dataState, marketingCampaigns: updatedCampaigns, customers: updatedCustomers };
            setDataState(newState);
            addToast(`Campaña "${savedCampaign.name}" enviada a ${customersToTarget.length} clientes.`, 'success');
        } else {
            addToast('Error al enviar la campaña.', 'error');
        }

    }, [dataState, addToast]);
    
    // Auth and initialization
    const handleLogin = useCallback(async (email: string, pass: string, warehouseId: string) => {
        const user = await backendService.login(email, pass);
        if (user && user.isActive) {
            const fullState = await backendService.getInitialAppState();
            setDataState(fullState);
            const userWithWarehouse = { ...user, selectedWarehouseId: warehouseId };
            setAuthenticatedUser(userWithWarehouse);
            await addAuditLogEntry('LOGIN', `User ${user.name} logged in from warehouse ${warehouseId}.`);
            
            const profile = fullState.config_user_profiles.find(p => p.id === user.profileId);
            if (profile?.name === 'Facturador / Cajero') {
                setCurrentView({ view: 'pos_view', payload: null });
            } else {
                setCurrentView({ view: 'dashboard', payload: null });
            }

            return userWithWarehouse;
        }
        return null;
    }, [addAuditLogEntry]);

    const showConfirmation = useCallback((title: string, message: string, onConfirm: () => void) => {
        setConfirmationModalState({ isOpen: true, title, message, onConfirm });
    }, []);

    const renderView = () => {
        if (!dataState || !authenticatedUser) return <Login onLogin={handleLogin} warehouses={warehouses} />;

        const profile = dataState.config_user_profiles.find(p => p.id === authenticatedUser.profileId);
        if (!profile) return <div>Error: Perfil de usuario no encontrado.</div>;
        
        const permissions = profile.permissions[currentView.view];

        // If the default view for a role is POS, but the session is closed, redirect them.
        if (currentView.view === 'pos_view' && !activeCashSession && profile.name === 'Facturador / Cajero') {
            return <CashierDashboard appState={dataState} activeCashSession={activeCashSession} onNavigate={handleNavigate} user={authenticatedUser} />;
        }
        
        // --- Custom Views ---
        switch (currentView.view) {
            case 'dashboard':
                const isCashierProfile = profile.name === 'Facturador / Cajero';
                if (isCashierProfile) {
                     return <CashierDashboard appState={dataState} activeCashSession={activeCashSession} onNavigate={handleNavigate} user={authenticatedUser} />;
                }
                return <Dashboard insights={insights} insightsLoading={insightsLoading} onAction={handleInsightAction} dataState={dataState} command={johanCommand} dashboardFilter={dashboardFilter} setDashboardFilter={setDashboardFilter} dateRange={dashboardDateRange} setDateRange={setDashboardDateRange} />;
            case 'designer': return <InvoiceDesigner />;
            case 'invoices_list': return <InvoiceList invoices={dataState.invoices} onAdd={() => setModalState({ type: 'invoice-form', invoice: null })} onEditInvoice={(inv) => setModalState({ type: 'invoice-form', invoice: inv })} handleViewInvoice={handleViewInvoice} onNavigate={handleNavigate} onAIFeedback={handleAIFeedback} />;
            case 'inventory_purchase_orders': return <PurchaseOrderList purchaseOrders={dataState.purchaseOrders} onAdd={() => setModalState({ type: 'purchase-order-form', purchaseOrder: null })} onEdit={(po) => setModalState({ type: 'purchase-order-form', purchaseOrder: po })} onNavigate={handleNavigate} />;
            case 'sales_accounts_receivable': return <AccountsReceivableReport invoices={dataState.invoices} customers={dataState.customers} addToast={addToast} onAIFeedback={handleAIFeedback} />;
            case 'sales_sold_items': return <SoldItemsReport invoices={dataState.invoices} products={dataState.products} />;
            case 'inventory_kardex': return <KardexReport products={dataState.products} invoices={dataState.invoices} purchaseOrders={dataState.purchaseOrders} warehouses={dataState.warehouses} transfers={dataState.warehouseTransfers} />;
            case 'config_system_config': return <SystemConfig settings={dataState.systemSettings} onSave={handleSaveSystemSettings} />;
            case 'salespeople_dashboard': return <SalespeopleDashboard appState={dataState} />;
            case 'suppliers_dashboard': return <SuppliersDashboard suppliers={dataState.suppliers} purchaseOrders={dataState.purchaseOrders} onNavigate={handleNavigate} />;
            case 'sales_daily_closing': return <DailyClosingReport invoices={dataState.invoices} />;
            case 'invoice_from_document': return <InvoiceFromDocument onDataExtracted={handleInvoiceDataExtracted} customers={dataState.customers} products={dataState.products} />;
            case 'customer_profile': return <CustomerProfile customerId={currentView.payload} appState={dataState} onLogCommunication={handleLogCommunication} />;
            case 'inventory_transfers': return <TransferList transfers={dataState.warehouseTransfers} warehouses={dataState.warehouses} onAdd={() => setModalState({ type: 'transfer-form', transfer: null })} />;
            case 'projections_ia': return <SalesForecast appState={dataState} />;
            case 'ia_executive_report': return <ExecutiveReport appState={dataState} />;
            case 'financial_health': return <FinancialHealthDashboard appState={dataState} />;
            case 'pos_view': return <POS appState={dataState} activeCashSession={activeCashSession} onSaveInvoice={handleSaveInvoice} onNavigate={handleNavigate} selectedWarehouseId={authenticatedUser.selectedWarehouseId} showConfirmation={showConfirmation}/>;
            case 'cash_drawer_closing': return <CashDrawerClosing appState={dataState} activeCashSession={activeCashSession} onOpenSession={handleOpenSession} onCloseSession={handleCloseSession} />;
            case 'supplier_profile': return <SupplierProfile supplierId={currentView.payload} appState={dataState} />;
            case 'inventory_dashboard': return <InventoryDashboard appState={dataState} onNavigate={handleNavigate} />;
            case 'marketing_dashboard': return <MarketingDashboard appState={dataState} onNavigate={handleNavigate} />;
            case 'sales_quotes': return <QuoteList quotes={dataState.quotes} onAdd={() => setModalState({ type: 'quote-form', quote: null })} onEdit={q => setModalState({ type: 'quote-form', quote: q })} onConvertToInvoice={handleConvertToInvoice} onNavigate={handleNavigate} />;
            case 'config_user_audit': return <AuditLog auditLog={dataState.auditLog} />;
            case 'crm_opportunities': return <OpportunitiesPipeline appState={dataState} user={authenticatedUser} onUpdateStage={(quoteId, newStage) => handleSaveQuote({ ...dataState.quotes.find(q => q.id === quoteId)!, stage: newStage })} onUpdateProbability={(quoteId, newProbability) => handleSaveQuote({ ...dataState.quotes.find(q => q.id === quoteId)!, probability: newProbability })}/>;
            case 'finance_pl_statement': return <ProfitAndLossStatement appState={dataState} />;
            case 'finance_balance_sheet': return <BalanceSheet appState={dataState} />;
            case 'finance_cash_flow': return <CashFlowStatement appState={dataState} />;
            case 'sales_commissions_report': return <CommissionReport appState={dataState} user={authenticatedUser} />;
            case 'inventory_stock_report': return <StockReport appState={dataState} />;
            case 'config_integrations': return <ModulesAndIntegrations />;
            case 'sales_collections_dashboard': return <CollectionsDashboard appState={dataState} onNavigate={handleNavigate} />;
            case 'crm_support_tickets': return <SupportTickets appState={dataState} onSaveTicket={handleSaveTicket} />;
            case 'marketing_campaigns': return <MarketingCampaigns campaigns={dataState.marketingCampaigns} customers={dataState.customers} onSaveCampaign={handleSaveCampaign} onSendCampaign={handleSendCampaign} />;
            case 'expense_from_document': return <ExpenseFromDocument onDataExtracted={(data) => handleNavigate('finance_expenses', { prefill: data })} categories={dataState.expenseCategories} />;

            // --- Generic Views ---
            default:
                const config = VIEW_CONFIGS[currentView.view];
                if (config && dataState[config.dataKey]) {
                    const isReadOnly = !permissions?.edit && !permissions?.delete;
                    return (
                        <GenericCrudList
                            config={config}
                            data={dataState[config.dataKey]}
                            onAdd={() => setModalState({ type: 'generic-form', config, item: null })}
                            onEdit={(item) => setModalState({ type: 'generic-form', config, item })}
                            onDelete={(id) => handleDelete(config, id)}
                            isReadOnly={isReadOnly}
                            appDataState={dataState}
                            canCreate={!!permissions?.create}
                            canEdit={!!permissions?.edit}
                            canDelete={!!permissions?.delete}
                            onNavigate={handleNavigate}
                        />
                    );
                }
                return <div className='p-8'>Vista no encontrada: {currentView.view}</div>;
        }
    }

    const unreadNotifications = dataState?.notifications.filter(n => !n.read).length || 0;

    if (!authenticatedUser || !dataState) {
        return <Login onLogin={handleLogin} warehouses={warehouses} />;
    }

    return (
        <div className={`flex h-screen bg-slate-100 dark:bg-neutral-950 text-slate-800 dark:text-neutral-200`}>
             <Sidebar
                currentView={currentView.view}
                onNavigate={(v) => handleNavigate(v)}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={authenticatedUser}
                userProfiles={dataState.config_user_profiles}
                systemSettings={dataState.systemSettings}
            />
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>}

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex-shrink-0 bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between p-3 sm:p-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1 text-slate-500 dark:text-neutral-400">
                        <MenuIcon className="h-6 w-6"/>
                    </button>
                    <div className="flex-grow flex justify-center">
                        <UniversalSearch data={dataState} onSelect={handleSearchResultSelect} />
                    </div>
                    <div className="flex items-center gap-3">
                         <button onClick={() => setIsJohanOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 font-semibold hover:bg-primary-200 dark:hover:bg-primary-500/20 transition">
                            <JohanIcon className="h-5 w-5"/>
                            <span className="hidden sm:inline">Johan</span>
                        </button>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors">
                            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                        </button>
                         <button onClick={() => setIsNotificationCenterOpen(true)} className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors">
                            <BellIcon className="h-6 w-6" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] items-center justify-center">{unreadNotifications}</span>
                                </span>
                            )}
                        </button>
                        <UserMenu user={authenticatedUser} warehouses={dataState.warehouses} onLogout={handleLogout} />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
            {/* Modal Logic */}
            {modalState.type === 'invoice-form' && (
                <Modal isOpen={true} onClose={() => setModalState({ type: 'closed' })} title={modalState.invoice?.id ? "Editar Factura" : "Nueva Factura"} size="7xl">
                    <InvoiceForm invoice={modalState.invoice} customers={dataState.customers} products={dataState.products} warehouses={dataState.warehouses} salespeople={dataState.salespeople} onSave={handleSaveInvoice} onCancel={() => setModalState({ type: 'closed' })} />
                </Modal>
            )}
            {modalState.type === 'invoice-view' && (
                <Modal isOpen={true} onClose={() => setModalState({ type: 'closed' })} title={`Factura ${modalState.invoice.id}`} size="5xl">
                    <InvoiceView invoice={modalState.invoice} systemSettings={dataState.systemSettings} onMarkAsPaid={handleInvoicePayment} onUpdateInvoice={handleSaveInvoice} />
                </Modal>
            )}
             {modalState.type === 'purchase-order-form' && (
                <Modal isOpen={true} onClose={() => setModalState({ type: 'closed' })} title={modalState.purchaseOrder?.id ? "Editar Orden de Compra" : "Nueva Orden de Compra"} size="5xl">
                    <PurchaseOrderForm purchaseOrder={modalState.purchaseOrder} suppliers={dataState.suppliers} products={dataState.products} warehouses={dataState.warehouses} onSave={handleSavePurchaseOrder} onCancel={() => setModalState({ type: 'closed' })} />
                </Modal>
            )}
             {modalState.type === 'transfer-form' && (
                <Modal isOpen={true} onClose={() => setModalState({ type: 'closed' })} title={"Nueva Transferencia de Inventario"} size="5xl">
                    <TransferForm warehouses={dataState.warehouses} products={dataState.products} onSave={handleSaveTransfer} onCancel={() => setModalState({ type: 'closed' })} />
                </Modal>
            )}
             {modalState.type === 'quote-form' && (
                <Modal isOpen={true} onClose={() => setModalState({ type: 'closed' })} title={modalState.quote?.id ? "Editar Cotización" : "Nueva Cotización"} size="5xl">
                    <QuoteForm quote={modalState.quote} customers={dataState.customers} products={dataState.products} onSave={handleSaveQuote} onCancel={() => setModalState({ type: 'closed' })} />
                </Modal>
            )}
            {modalState.type === 'generic-form' && (
                 <Modal isOpen={true} onClose={() => setModalState({ type: 'closed' })} title={`${modalState.item?.id ? 'Editar' : 'Nuevo'} ${modalState.config.singular}`}>
                    <GenericForm config={modalState.config} item={modalState.item} onSave={(item) => handleSave(modalState.config, item)} onCancel={() => setModalState({ type: 'closed' })} />
                </Modal>
            )}
            <div className="fixed top-5 right-5 z-[100]">
                {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />)}
            </div>
            <JohanAIChat isOpen={isJohanOpen} onClose={() => setIsJohanOpen(false)} appContext={dataState} onCommand={handleJohanCommand} />
             <ConfirmationModal 
                isOpen={confirmationModalState.isOpen}
                onClose={() => setConfirmationModalState({isOpen: false, title: '', message: '', onConfirm: ()=>{}})}
                onConfirm={confirmationModalState.onConfirm}
                title={confirmationModalState.title}
                message={confirmationModalState.message}
            />
            <NotificationCenter 
                isOpen={isNotificationCenterOpen}
                onClose={() => setIsNotificationCenterOpen(false)}
                notifications={dataState.notifications}
                onNavigate={(v, p) => { handleNavigate(v, p); setIsNotificationCenterOpen(false); }}
                onMarkAsRead={async (id) => {
                    const newNotifications = dataState.notifications.map(n => n.id === id ? {...n, read: true} : n);
                    await updateState({...dataState, notifications: newNotifications});
                }}
                 onMarkAllAsRead={async () => {
                    const newNotifications = dataState.notifications.map(n => ({...n, read: true}));
                    await updateState({...dataState, notifications: newNotifications});
                }}
                onClearAll={async () => {
                    await updateState({...dataState, notifications: []});
                }}
            />
        </div>
    );
}

export default App;