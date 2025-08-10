import React from 'react';

export interface Customer {
  id: number;
  name: string;
  contact: string;
  email: string;
  avgPaymentDays: number;
  paymentBehavior?: 'on_time' | 'late' | 'normal' | 'new';
  communicationHistory?: CommunicationLog[];
  suggestedCreditLimit?: number | null;
  creditLimitReason?: string | null;
  tags?: string[];
  customerScore?: number | null;
}

export interface MarketingCampaign {
    id: string;
    name: string;
    subject: string;
    body: string;
    targetTags: string[];
    status: 'borrador' | 'enviada';
    sentAt?: string;
}

export interface CommunicationLog {
    id: string;
    date: string;
    type: 'invoice_sent' | 'invoice_viewed' | 'reminder_sent' | 'payment_received' | 'note_added' | 'ticket_created' | 'call_logged' | 'campaign_email_sent';
    details: string;
}


export interface Salesperson {
    id: string;
    name: string;
    commissionType: string;
    goal: number;
    commissionRate: number; // Tasa de comisión en porcentaje, ej: 5 para 5%
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    cost: number;
    stockByWarehouse: { [warehouseId: string]: number; };
    category: string;
}

export interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    category: string;
}

export interface Warehouse {
    id: string;
    name: string;
    location: string;
    manager: string;
}

export interface Brand {
    id: string;
    name: string;
    description: string;
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';
export type ViewPermissions = Partial<Record<PermissionAction, boolean>>;

export interface UserProfile {
    id: string;
    name: 'Super Administrador' | 'Administrador' | 'Vendedor' | 'Operaciones' | 'Contador' | 'Facturador / Cajero' | string;
    permissions: Partial<Record<View, ViewPermissions>>;
}

export interface User {
    id: string;
    name: string;
    email: string;
    profileId: string;
    password?: string;
    isActive: boolean;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
}

export interface SystemSettings {
    companyName: string;
    companyNit: string;
    companyAddress: string;
}

export interface InvoiceLineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  iva: number;
  total: number;
  discount?: number;
  promotionName?: string;
  note?: string;
}

export interface Invoice {
  id: string;
  customerId: number;
  customerName?: string;
  issueDate: string;
  dueDate: string;
  status: 'pagada' | 'pendiente' | 'vencida' | 'borrador';
  items: InvoiceLineItem[];
  subtotal: number;
  iva: number;
  total: number;
  totalDiscount?: number;
  paymentMethod: 'Efectivo' | 'Tarjeta de Crédito/Débito' | 'Transferencia' | 'PSE' | 'Nequi' | 'Daviplata' | 'Contra Entrega' | 'Punto de Pago' | 'N/A' | 'QR';
  paymentDate?: string | null;
  cune?: string;
  warehouseId?: string;
  cashSessionId?: string;
  salespersonId?: string;
  viewedAt?: string;
  riskLevel?: 'Bajo' | 'Medio' | 'Alto';
  riskReason?: string;
  riskFeedback?: 'correct' | 'incorrect' | null;
  predictedPaymentDate?: string;
  paymentRisk?: 'Bajo' | 'Medio' | 'Alto';
  paymentPredictionFeedback?: 'correct' | 'incorrect' | null;
  isPotentialDuplicate?: boolean;
  duplicateReason?: string;
  blockchainVerification?: { hash: string; timestamp: string; status: 'verified' } | null;
}

export interface QuoteLineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  iva: number;
  total: number;
}

export interface Quote {
  id: string;
  customerId: number;
  customerName?: string;
  issueDate: string;
  expiryDate: string;
  stage: 'Calificación' | 'Propuesta Enviada' | 'Negociación' | 'Ganada' | 'Perdida';
  items: QuoteLineItem[];
  subtotal: number;
  iva: number;
  total: number;
  salespersonId?: string;
  probability?: number | null;
}

export interface SupportTicket {
    id: string;
    customerId: number;
    customerName?: string;
    subject: string;
    description: string;
    status: 'Nuevo' | 'Abierto' | 'Resuelto';
    priority: 'Baja' | 'Media' | 'Alta';
    agentId?: string;
    createdAt: string;
}


export interface PurchaseOrderLineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName?: string;
  issueDate: string;
  status: 'borrador' | 'enviada' | 'recibida';
  items: PurchaseOrderLineItem[];
  subtotal: number;
  iva: number;
  total: number;
  warehouseId?: string;
}

export interface WarehouseTransferItem {
    productId: string;
    productName: string;
    quantity: number;
}

export interface WarehouseTransfer {
    id: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    date: string;
    items: WarehouseTransferItem[];
    notes?: string;
}

export interface ExpenseCategory {
    id: string;
    name: string;
}

export interface Expense {
    id: string;
    date: string;
    categoryId: string;
    description: string;
    amount: number;
}

export interface Promotion {
    id: string;
    name: string;
    description: string;
    type: 'percentage' | 'fixed';
    value: number;
    targetType: 'product' | 'category';
    targetValue: string;
    startDate: string;
    endDate: string;
}

export interface CashSession {
    id: string;
    openingDate: string;
    userId: string;
    openingBalance: number;
    status: 'open';
}

export interface CashClosing {
    id: string;
    cashSessionId: string;
    openingDate: string;
    closingDate: string;
    userId: string;
    openingBalance: number;
    expectedCash: number;
    countedCash: number;
    cashDifference: number;
    expectedCard: number;
    countedCard: number;
    cardDifference: number;
    expectedTransfer: number;
    countedTransfer: number;
    transferDifference: number;
    expectedOther: number;
    countedOther: number;
    otherDifference: number;
    totalSystemSales: number;
    totalCountedSales: number;
    totalDifference: number;
}

export type IntegrationStatus = 'connected' | 'available' | 'coming_soon';

export interface Integration {
  name: string;
  description: string;
  logo: string;
  category: 'ERP y Contabilidad' | 'Pasarelas de Pago' | 'E-commerce' | 'Marketing';
  status: IntegrationStatus;
  tags: string[];
}

export interface Module {
    id: string;
    name: string;
    description: string;
    category: 'Operations' | 'Growth' | 'Industry';
    isActive: boolean;
}


export type View =
  | 'dashboard'
  | 'products'
  | 'suppliers'
  | 'designer'
  // CRM
  | 'crm_contacts'
  | 'crm_opportunities'
  | 'crm_support_tickets'
  | 'customer_profile'
  // Ventas
  | 'sales_commission_types'
  | 'sales_salespeople'
  | 'sales_account_statement'
  | 'sales_master'
  | 'sales_accounts_receivable'
  | 'sales_sold_items'
  | 'sales_price_list'
  | 'sales_ledger'
  | 'sales_daily_closing'
  | 'sales_by_salesperson'
  | 'sales_detailed_invoices'
  | 'invoices_list'
  | 'sales_quotes'
  | 'sales_remissions'
  | 'sales_credit_notes'
  | 'sales_debit_notes'
  | 'salespeople_dashboard'
  | 'invoice_from_document'
  | 'cash_drawer_closing'
  | 'sales_commissions_report'
  | 'sales_collections_dashboard'
  // Inventario
  | 'inventory_dashboard'
  | 'inventory_warehouses'
  | 'inventory_groups'
  | 'inventory_price_types'
  | 'inventory_brands'
  | 'inventory_units'
  | 'inventory_items_services'
  | 'inventory_purchase_orders'
  | 'inventory_kardex'
  | 'inventory_committed_stock'
  | 'inventory_physical_inventory'
  | 'inventory_restock_report'
  | 'inventory_transfers'
  | 'inventory_stock_report'
  | 'suppliers_dashboard'
  | 'supplier_profile'
  // Finanzas
  | 'financial_health'
  | 'finance_expenses'
  | 'finance_pl_statement'
  | 'finance_balance_sheet'
  | 'finance_cash_flow'
  | 'expense_from_document'
  // Marketing
  | 'marketing_dashboard'
  | 'marketing_promotions'
  | 'marketing_campaigns'
  // IA
  | 'projections_ia'
  | 'ia_executive_report'
  // POS
  | 'pos_view'
  // Configuración
  | 'config_document_types'
  | 'config_payment_methods'
  | 'config_branches'
  | 'config_user_profiles'
  | 'config_users'
  | 'config_resolutions'
  | 'config_retention_types'
  | 'config_denominations'
  | 'config_classification_accounts'
  | 'config_user_audit'
  | 'config_integrations'
  | 'config_system_config';


// Navigation types
export interface NavLink {
    id: View;
    label: string;
    icon: React.ReactNode;
}
export interface NavGroup { label: string; links: NavLink[]; }
export interface NavSection { label: string; icon: React.ReactNode; groups: NavGroup[]; }

// UI types
export type ToastMessage = { id: number; message: string; type: 'success' | 'error' | 'info'; };

export type Notification = {
    id: number;
    date: string;
    type: 'info' | 'alert' | 'success';
    title: string;
    message: string;
    read: boolean;
    link?: {
        view: View;
        payload?: any;
    };
};

// --- Dashboard Types ---
export interface DateRange {
    start: Date | null;
    end: Date | null;
}

export type DashboardFilterType = 'category' | 'product' | 'customer' | 'cashier';
export interface DashboardFilterItem {
    type: DashboardFilterType;
    value: string | number;
    label: string;
}
export type DashboardFilter = DashboardFilterItem[];


// --- Johan AI Types ---
export type JohanState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface StrategicInsight {
  type: 'insight' | 'anomaly' | 'suggestion' | 'trend' | 'financial_health_alert' | 'capital_risk' | 'profit_leak' | 'hidden_gem';
  title: string;
  summary: string;
  kpi?: string;
  financialImpact?: string;
  urgency?: 'high' | 'medium' | 'low';
  action?: { type: string; payload: any; label: string; };
}

export interface SocraticQuestion {
  type: 'question';
  question: string;
}

export interface ChartData {
  type: 'chart';
  title: string;
  description?: string;
  chartType: 'bar' | 'line' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      color?: string;
      backgroundColor?: string[] | string;
      borderColor?: string[] | string;
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }[];
  };
}

export interface JohanCommand {
  name: 'set_dashboard_range' | 'navigate' | 'show_report' | 'send_reminder' | 'create_invoice' | 'generate_report';
  payload: {
    range?: any; // Was TimeRange
    view?: View;
    report_name?: View;
    invoiceId?: string;
    invoice_details?: Partial<Invoice>;
    filters?: { [key: string]: any };
    format?: 'pdf' | 'xlsx';
  };
}

export interface JohanResponse {
  command?: JohanCommand;
  parts: (StrategicInsight | SocraticQuestion | ChartData | {type: 'text', content: string})[];
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'johan';
  text?: string;
  response?: JohanResponse;
  file?: {
    name: string;
    type: string;
  };
}


// --- Generic CRUD Component Types ---
export interface FormField {
    name: keyof any;
    label: string;
    type: 'text' | 'number' | 'email' | 'select' | 'date' | 'permission-checklist' | 'checkbox' | 'password' | 'textarea';
    options?: { value: string | number; label: string }[];
    required?: boolean;
}

export interface ColumnConfig {
    key: keyof any;
    header: string;
    render?: (item: any, dataState?: AppDataState, onNavigate?: (view: View, payload?: any) => void) => React.ReactNode;
}

export interface AppDataState {
    customers: Customer[];
    products: Product[];
    suppliers: Supplier[];
    salespeople: Salesperson[];
    invoices: Invoice[];
    quotes: Quote[];
    purchaseOrders: PurchaseOrder[];
    users: User[];
    brands: Brand[];
    warehouses: Warehouse[];
    warehouseTransfers: WarehouseTransfer[];
    notifications: Notification[];
    expenseCategories: ExpenseCategory[];
    expenses: Expense[];
    promotions: Promotion[];
    marketingCampaigns: MarketingCampaign[];
    cashSessions: CashSession[];
    cashClosings: CashClosing[];
    auditLog: AuditLogEntry[];
    commission_types: any[];
    inventory_groups: any[];
    inventory_price_types: any[];
    inventory_units: any[];
    config_document_types: any[];
    config_payment_methods: any[];
    config_branches: any[];
    config_user_profiles: UserProfile[];
    config_resolutions: any[];
    config_retention_types: any[];
    config_denominations: any[];
    config_classification_accounts: any[];
    systemSettings: SystemSettings;
    supportTickets: SupportTicket[];
}

export type AppDataArrayKeys = {
  [K in keyof AppDataState]: AppDataState[K] extends any[] ? K : never;
}[keyof AppDataState];

export interface GenericCrudConfig {
    view: View;
    dataKey: AppDataArrayKeys;
    title: string;
    singular: string;
    icon: React.ReactNode;
    columns: ColumnConfig[];
    formFields: FormField[];
    customActions?: (onNavigate: (view: View, payload?: any) => void) => React.ReactNode;
}

// New AI Feature Types
export interface SalesForecastResponse {
    forecast: { day: number, predicted_sales: number }[];
    analysis: string;
    recommendation: string;
}

export interface ExecutiveReportData {
    executive_summary: string;
    kpis: { title: string; value: string; }[];
    strengths: { title: string; detail: string; }[];
    weaknesses: { title: string; detail: string; }[];
    recommendations: { title: string; detail: string; }[];
}

export interface AIFinancialForecast {
    forecast: { month: string; cash_in: number; cash_out: number; net_flow: number; end_balance: number }[];
    analysis: string;
    recommendations: { title: string; detail: string; }[];
}

// --- Sales Pipeline AI Types ---
export interface PipelineStageAnalysis {
  summary: string;
  actionableInsights: {
    text: string;
    itemId?: string;
  }[];
}

export interface FollowUpMessage {
  subject: string;
  body: string;
}

// --- Customer Loyalty AI Types ---
export interface RetentionRisk {
  level: 'Bajo' | 'Medio' | 'Alto';
  reason: string;
}

export interface LoyaltyOffer {
  offerTitle: string;
  offerDetails: string;
  suggestedAction?: {
    label: string;
    view: View;
    payload?: any;
  };
}

// --- New AI Feature Types ---
export interface TransactionRiskAnalysis {
    riskLevel: 'Bajo' | 'Medio' | 'Alto';
    reason: string;
    recommendation: string;
}

export interface MarketingCopySuggestion {
    channel: 'SMS' | 'Redes Sociales' | 'Email Subject';
    copy: string;
}

export interface PaymentPrediction {
    predictedDate: string;
    risk: 'Bajo' | 'Medio' | 'Alto';
    reasoning: string;
}

export interface SuggestedReply {
    subject: string;
    body: string;
}

export interface CreditLimitSuggestion {
    limit: number;
    reason: string;
}

export interface DuplicateInvoiceCheck {
    isDuplicate: boolean;
    reason: string;
}

export interface BlockchainVerification {
    hash: string;
    timestamp: string;
    status: 'verified';
}

// --- New CRM AI Types ---
export interface CustomerScore {
    score: number; // 1-100
    reason: string;
}

export interface OpportunityClosePrediction {
    probability: number; // 0-100
    reason: string;
}

export interface TicketSuggestion {
    priority: 'Baja' | 'Media' | 'Alta';
    agentId: string;
}

export interface AICustomerSummary {
    summary: string;
    keyObservations: {
        icon: 'positive' | 'negative' | 'neutral';
        text: string;
    }[];
    suggestedAction: {
        text: string;
        actionType: 'create_quote' | 'send_reminder' | 'offer_promotion';
    };
}

export interface AIEmailBodySuggestion {
    body: string;
}

export interface AIPosInsight {
    insightType: 'upsell' | 'cross_sell' | 'loyalty';
    message: string;
    suggestedProductId?: string;
}

export interface AIExtractedExpense {
    categoryId: string;
    description: string;
    amount: number;
    date: string;
}
