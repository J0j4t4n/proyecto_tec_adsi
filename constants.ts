import React from 'react';
import { Customer, Product, NavSection, Salesperson, User, Brand, Warehouse, GenericCrudConfig, AppDataState, ExpenseCategory, Expense, Promotion, View, CashSession, CashClosing, UserProfile, Quote, ViewPermissions, AuditLogEntry, Supplier, Invoice, PurchaseOrder, SupportTicket, MarketingCampaign } from './types';
import { BuildingStorefrontIcon, ClipboardDocumentListIcon, Cog6ToothIcon, CubeIcon, DocumentChartBarIcon, DocumentTextIcon, PresentationChartLineIcon, StarIcon, UserGroupIcon, UsersIcon, DocumentDuplicateIcon, TagIcon, KeyIcon, WrenchScrewdriverIcon, ShieldCheckIcon, BuildingOfficeIcon, ChartBarSquareIcon, SparklesIcon, ArrowPathIcon, ChartBarIcon, BanknotesIcon, ReceiptPercentIcon, MegaphoneIcon, CalculatorIcon, DocumentPlusIcon, ViewColumnsIcon, ScaleIcon, CurrencyDollarIcon, ComputerDesktopIcon, BackspaceIcon, LockClosedIcon, PuzzlePieceIcon, PaperAirplaneIcon } from './components/Icons';
import { formatCurrency } from './utils/formatters';

// --- DATA GENERATION FOR A TECHNOLOGY COMPANY ---

const B2B_CUSTOMER_PREFIXES = ["Innovatech", "Data Solutions", "Cloud Services", "Cyber Security Group", "Digital Ventures", "Tech Global", "Quantum Leap", "NextGen Systems"];
const B2B_CUSTOMER_SUFFIXES = ["S.A.S.", "Ltda.", "Corp.", "Tech", "Group"];
const CORPORATE_CLIENTS = ["Bancolombia S.A.", "Rappi SAS", "Ministerio de TIC", "Globant Colombia", "Ecopetrol", "Grupo Éxito", "Mercado Libre Colombia"];
const PERSON_NAMES = ["Juan Pérez", "María García", "Carlos Rodríguez", "Ana Martínez", "Luis Hernández", "Laura Gómez", "José López", "Sofía González"];

const TECH_CATEGORIES = ['Portátiles', 'Componentes PC', 'Periféricos', 'Redes y Servidores', 'Software y Licencias', 'Accesorios'];
const TECH_PRODUCTS = [
    { name: 'Laptop Dell Latitude 7420 i7 16GB RAM 512GB SSD', category: 'Portátiles', cost: 4800000, price: 6200000 },
    { name: 'MacBook Pro 14" Chip M2 Pro 16GB RAM 512GB SSD', category: 'Portátiles', cost: 8500000, price: 10500000 },
    { name: 'SSD Kingston NV2 1TB NVMe PCIe 4.0', category: 'Componentes PC', cost: 250000, price: 380000 },
    { name: 'Memoria RAM Corsair Vengeance DDR5 16GB 5200MHz', category: 'Componentes PC', cost: 310000, price: 450000 },
    { name: 'Monitor Dell UltraSharp U2723QE 27" 4K IPS', category: 'Periféricos', cost: 2100000, price: 2800000 },
    { name: 'Teclado Mecánico Logitech MX Mechanical', category: 'Periféricos', cost: 550000, price: 720000 },
    { name: 'Router TP-Link Archer AX55 Wi-Fi 6', category: 'Redes y Servidores', cost: 350000, price: 480000 },
    { name: 'Switch Cisco Catalyst C9200L 24 Puertos', category: 'Redes y Servidores', cost: 3200000, price: 4500000 },
    { name: 'Licencia Microsoft 365 Business Standard (Anual)', category: 'Software y Licencias', cost: 450000, price: 600000 },
    { name: 'Licencia Adobe Creative Cloud (Anual)', category: 'Software y Licencias', cost: 2200000, price: 2800000 },
    { name: 'Docking Station CalDigit TS4 Thunderbolt 4', category: 'Accesorios', cost: 1500000, price: 1950000 },
    { name: 'UPS APC Back-UPS Pro 1500VA', category: 'Accesorios', cost: 900000, price: 1200000 },
    { name: 'Servidor Dell PowerEdge R650', category: 'Redes y Servidores', cost: 15000000, price: 22000000 },
    { name: 'Tarjeta de Video NVIDIA RTX 4070', category: 'Componentes PC', cost: 2800000, price: 3500000 },
    { name: 'Mouse Logitech MX Master 3S', category: 'Periféricos', cost: 380000, price: 490000 },
];

const TECH_SUPPLIERS = [
    { id: 'SUP-01', name: 'TechData Colombia', contactPerson: 'Carlos Fernández', email: 'cfernandez@techdata.co', category: 'Componentes PC' },
    { id: 'SUP-02', name: 'Ingram Micro SAS', contactPerson: 'Lucía Méndez', email: 'lmendez@ingrammicro.com', category: 'Redes y Servidores' },
    { id: 'SUP-03', name: 'Dell EMC Colombia', contactPerson: 'Andrés Sarmiento', email: 'a.sarmiento@dell.com', category: 'Portátiles' },
    { id: 'SUP-04', name: 'Microsoft Colombia', contactPerson: 'Isabela Rojas', email: 'isabelar@microsoft.com', category: 'Software y Licencias' },
];

const generateProducts = (count: number): Product[] => {
    const products: Product[] = [];
    for (let i = 0; i < count; i++) {
        const template = TECH_PRODUCTS[i % TECH_PRODUCTS.length];
        const variation = i % 10 === 0 ? ` Kit Empresarial` : '';
        const name = `${template.name}${variation}`;
        products.push({
            id: `PROD-${String(i + 1).padStart(4, '0')}`,
            name: name,
            description: `Equipo de tecnología de la categoría ${template.category}`,
            price: template.price * (1 + (Math.random() - 0.5) * 0.05), // 5% price variation
            cost: template.cost * (1 + (Math.random() - 0.5) * 0.03), // 3% cost variation
            stockByWarehouse: { 'W-01': 10 + Math.floor(Math.random() * 100), 'W-02': 5 + Math.floor(Math.random() * 30) },
            category: template.category,
        });
    }
    return products;
}

const customerTags = ['Nuevo', 'Calificado', 'Cliente Fiel', 'Inactivo', 'VIP'];

const generateCustomers = (count: number): Customer[] => {
    const customers: Customer[] = [
        { id: 1, name: 'Consumidor Final', contact: 'N/A', email: 'n/a@techsol.co', avgPaymentDays: 0, paymentBehavior: 'normal', communicationHistory: [], suggestedCreditLimit: 0, creditLimitReason: 'Cliente genérico para ventas de contado.', tags: ['General'] },
    ];
    for (let i = 2; i <= count; i++) {
        let name;
        if (i <= 8) { // Use the 7 corporate clients
            name = CORPORATE_CLIENTS[i - 2];
        } else {
            const prefix = B2B_CUSTOMER_PREFIXES[Math.floor(Math.random() * B2B_CUSTOMER_PREFIXES.length)];
            const suffix = B2B_CUSTOMER_SUFFIXES[Math.floor(Math.random() * B2B_CUSTOMER_SUFFIXES.length)];
            name = `${prefix} ${suffix}`;
        }
        customers.push({
            id: i,
            name: name,
            contact: PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)],
            email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
            avgPaymentDays: Math.floor(Math.random() * 40) + 15, // 15 to 55 days for tech
            paymentBehavior: ['on_time', 'late', 'normal', 'new'][i % 4] as any,
            communicationHistory: [
                { id: `comm-${i}-1`, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), type: 'invoice_sent', details: 'Factura INV-2024-1180 enviada.' },
                { id: `comm-${i}-2`, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), type: 'payment_received', details: 'Pago recibido para INV-2024-1180.' },
            ],
            suggestedCreditLimit: null,
            creditLimitReason: null,
            tags: [customerTags[i % customerTags.length]]
        });
    }
    return customers;
};


// --- DATA DEFINITIONS ---
export const WAREHOUSES: Warehouse[] = [
    { id: 'W-01', name: 'Bodega Principal (Celta)', location: 'Funza, Cundinamarca', manager: 'Ricardo Gomez' },
    { id: 'W-02', name: 'Oficina (Usaquén)', location: 'Calle 116, Bogotá', manager: 'Andrés Pérez' },
];

export const PRODUCTS: Product[] = generateProducts(150);
export const CUSTOMERS: Customer[] = generateCustomers(250);
export const SUPPLIERS: Supplier[] = TECH_SUPPLIERS;

export const SALESPEOPLE: Salesperson[] = [
    { id: 'USR-02', name: 'Andrés Rojas', commissionType: 'Comisión Ventas', goal: 350000000, commissionRate: 2 },
    { id: 'USR-03', name: 'Carolina Vélez', commissionType: 'Comisión Ventas', goal: 400000000, commissionRate: 2.5 },
    { id: 'USR-04', name: 'Cajero POS', commissionType: 'Salario Fijo', goal: 50000000, commissionRate: 0 },
];

export const BRANDS: Brand[] = [
    { id: 'B-01', name: 'Dell', description: 'Laptops y Servidores' },
    { id: 'B-02', name: 'Logitech', description: 'Periféricos de alta calidad' },
    { id: 'B-03', name: 'Cisco', description: 'Equipos de Redes' },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    { id: 'CAT-EXP-01', name: 'Nómina y Salarios' },
    { id: 'CAT-EXP-02', name: 'Arriendo Bodega y Oficinas' },
    { id: 'CAT-EXP-03', name: 'Servicios Públicos e Internet' },
    { id: 'CAT-EXP-04', name: 'Marketing y Publicidad Online' },
    { id: 'CAT-EXP-05', name: 'Transporte y Logística' },
    { id: 'CAT-EXP-06', name: 'Licencias de Software y Suscripciones' },
];

export const PROMOTIONS: Promotion[] = [
    { id: 'PROMO-01', name: '15% OFF en Monitores Dell', description: 'Descuento en todos los monitores Dell UltraSharp', type: 'percentage', value: 15, targetType: 'product', targetValue: 'PROD-0005', startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: 'PROMO-02', name: 'Combo Teclado y Mouse Logitech', description: 'Lleva un teclado y mouse MX con 20% de descuento', type: 'percentage', value: 20, targetType: 'category', targetValue: 'Periféricos', startDate: '2024-08-01', endDate: '2024-08-15' },
];

export const CASH_SESSIONS: CashSession[] = [];
export const CASH_CLOSINGS: CashClosing[] = [];

const generateQuotes = (count: number): Quote[] => {
    const quotes: Quote[] = [];
    const stages: Quote['stage'][] = ['Calificación', 'Propuesta Enviada', 'Negociación', 'Ganada', 'Perdida'];
    for (let i = 0; i < count; i++) {
        const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
        const issueDate = new Date();
        issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 60));
        const expiryDate = new Date(issueDate);
        expiryDate.setDate(expiryDate.getDate() + 15);

        const items: any[] = [];
        const numItems = Math.floor(Math.random() * 5) + 1;
        let subtotal = 0;
        for (let j = 0; j < numItems; j++) {
            const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
            const quantity = Math.floor(Math.random() * 5) + 1;
            const itemSubtotal = product.price * quantity;
            items.push({
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                unitPrice: product.price,
                subtotal: itemSubtotal,
                iva: itemSubtotal * 0.19,
                total: itemSubtotal * 1.19,
            });
            subtotal += itemSubtotal;
        }

        quotes.push({
            id: `COT-${issueDate.getFullYear()}-${String(i + 1).padStart(4, '0')}`,
            customerId: customer.id,
            customerName: customer.name,
            issueDate: issueDate.toISOString().split('T')[0],
            expiryDate: expiryDate.toISOString().split('T')[0],
            stage: stages[i % stages.length],
            items,
            subtotal,
            iva: subtotal * 0.19,
            total: subtotal * 1.19,
            salespersonId: `USR-0${(i % 2) + 2}`,
            probability: stages[i % stages.length] === 'Ganada' ? 100 : stages[i % stages.length] === 'Perdida' ? 0 : Math.floor(Math.random() * 80) + 10,
        });
    }
    return quotes;
};
export const ALL_QUOTES: Quote[] = generateQuotes(50);
export const ALL_AUDIT_LOGS: AuditLogEntry[] = [];
export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
    { id: 'TKT-001', customerId: 2, customerName: CORPORATE_CLIENTS[0], subject: 'Consulta sobre factura INV-2024-1180', description: 'El cliente no entiende un cargo en su última factura.', status: 'Abierto', priority: 'Media', agentId: 'USR-02', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'TKT-002', customerId: 3, customerName: CORPORATE_CLIENTS[1], subject: 'Problema con la entrega del pedido', description: 'El pedido llegó incompleto, falta un monitor Dell U2723QE.', status: 'Nuevo', priority: 'Alta', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'TKT-003', customerId: 4, customerName: CORPORATE_CLIENTS[2], subject: 'Garantía de teclado Logitech', description: 'El teclado MX Mechanical dejó de funcionar después de 2 meses.', status: 'Resuelto', priority: 'Media', agentId: 'USR-03', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];
export const INITIAL_MARKETING_CAMPAIGNS: MarketingCampaign[] = [
    {
        id: 'CAMP-01',
        name: 'Campaña de Bienvenida Nuevos Clientes',
        subject: '¡Bienvenido a TechSol! Un descuento especial para ti',
        body: 'Hola [Customer Name], gracias por unirte a nosotros. Disfruta de un 10% de descuento en tu próxima compra de periféricos.',
        targetTags: ['Nuevo'],
        status: 'borrador',
    },
    {
        id: 'CAMP-02',
        name: 'Reactivación Clientes Inactivos',
        subject: 'Te extrañamos, [Customer Name]',
        body: 'Ha pasado un tiempo. Vuelve y descubre nuestras nuevas soluciones en servidores y redes con un beneficio especial.',
        targetTags: ['Inactivo'],
        status: 'enviada',
        sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
];


const generateInvoices = (count: number, years: number): Invoice[] => {
    let invoices: Invoice[] = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setFullYear(today.getFullYear() - years);
    let invoiceNumber = 1;

    for (let i = 0; i < count; i++) {
        const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
        const randomTimestamp = startDate.getTime() + Math.random() * (today.getTime() - startDate.getTime());
        const issueDate = new Date(randomTimestamp);
        
        const items: any[] = [];
        const numItems = Math.floor(Math.random() * 8) + 1;
        let subtotal = 0;

        for(let j = 0; j < numItems; j++) {
            const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
            const quantity = Math.floor(Math.random() * 10) + 1; // B2B quantities for tech
            const itemSubtotal = product.price * quantity;
            items.push({
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                unitPrice: product.price,
                subtotal: itemSubtotal,
                iva: itemSubtotal * 0.19,
                total: itemSubtotal * 1.19,
            });
            subtotal += itemSubtotal;
        }

        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + 30);
        
        let status: Invoice['status'] = 'pagada';
        let paymentDate: string | null = null;
        const daysSinceIssue = (today.getTime() - issueDate.getTime()) / (1000 * 3600 * 24);

        if (daysSinceIssue < 30) { // Recent invoices might be pending
            if (Math.random() < 0.6) status = 'pagada';
            else if (Math.random() < 0.8) status = 'pendiente';
            else status = 'vencida';
        } else if (daysSinceIssue < 60) {
            if (Math.random() < 0.9) status = 'pagada';
            else status = 'vencida';
        }

        if (status === 'pagada') {
            const paymentDays = Math.floor(Math.random() * 15) - 5; // Can pay a bit early or late
            const pDate = new Date(dueDate);
            pDate.setDate(pDate.getDate() + paymentDays);
            paymentDate = pDate.toISOString().split('T')[0];
        } else if (status === 'vencida') {
            dueDate.setDate(issueDate.getDate() - 35); // make it overdue for sure
        }
        
        const year = issueDate.getFullYear();
        
        invoices.push({
            id: `INV-${year}-${String(invoiceNumber++).padStart(4, '0')}`,
            customerId: customer.id, customerName: customer.name,
            issueDate: issueDate.toISOString().split('T')[0],
            paymentDate,
            dueDate: dueDate.toISOString().split('T')[0],
            status, items, subtotal, iva, total,
            paymentMethod: ['Transferencia', 'Efectivo', 'Tarjeta de Crédito/Débito', 'PSE', 'Nequi', 'Daviplata'][i % 6] as any,
            salespersonId: `USR-0${(i % 2) + 2}`, // Assign to salespeople USR-02, USR-03
            warehouseId: i % 2 === 0 ? 'W-01' : 'W-02',
            isPotentialDuplicate: false,
            duplicateReason: '',
            riskFeedback: null,
            paymentPredictionFeedback: null,
            blockchainVerification: null
        });
    }
    // Add one verified invoice for demo
    if (invoices.length > 0) {
        invoices[invoices.length - 1].blockchainVerification = {
            hash: '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            timestamp: new Date().toISOString(),
            status: 'verified'
        };
    }
    return invoices;
};

const generatePurchaseOrders = (count: number, years: number): PurchaseOrder[] => {
    const purchaseOrders: PurchaseOrder[] = [];
     const today = new Date();
    const startDate = new Date();
    startDate.setFullYear(today.getFullYear() - years);
    
    for (let i = 0; i < count; i++) {
        const supplier = SUPPLIERS[Math.floor(Math.random() * SUPPLIERS.length)];
        const randomTimestamp = startDate.getTime() + Math.random() * (today.getTime() - startDate.getTime());
        const issueDate = new Date(randomTimestamp);
        const year = issueDate.getFullYear();
        
        const items: any[] = [];
        const numItems = Math.floor(Math.random() * 10) + 5;
        let subtotal = 0;
        for (let j = 0; j < numItems; j++) {
            const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
            const quantity = Math.floor(Math.random() * 50) + 20; // Larger quantities for tech POs
            const total = product.cost * quantity;
            items.push({
                productId: product.id,
                productName: product.name,
                quantity,
                unitCost: product.cost,
                total,
            });
            subtotal += total;
        }

        purchaseOrders.push({
            id: `PO-${year}-${String(i + 1).padStart(3, '0')}`,
            supplierId: supplier.id, supplierName: supplier.name,
            issueDate: issueDate.toISOString().split('T')[0],
            status: 'recibida', items, subtotal, iva: subtotal * 0.19, total: subtotal * 1.19,
            warehouseId: 'W-01'
        });
    }
    return purchaseOrders;
};

const generateExpenses = (years: number): Expense[] => {
    const expenses: Expense[] = [];
    const today = new Date();
    const months = years * 12;
    for (let i = 0; i < months; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        expenses.push({ id: `EXP-N-${i}`, date: date.toISOString().split('T')[0], categoryId: 'CAT-EXP-01', description: `Nómina ${date.toLocaleString('es-CO', {month: 'long'})}`, amount: 85000000 + Math.random() * 15000000 });
        expenses.push({ id: `EXP-A-${i}`, date: date.toISOString().split('T')[0], categoryId: 'CAT-EXP-02', description: `Arriendo ${date.toLocaleString('es-CO', {month: 'long'})}`, amount: 25000000 });
        expenses.push({ id: `EXP-S-${i}`, date: date.toISOString().split('T')[0], categoryId: 'CAT-EXP-06', description: `Suscripciones Cloud y Software`, amount: 12000000 + Math.random() * 4000000 });
        if (i % 2 === 0) {
            expenses.push({ id: `EXP-M-${i}`, date: date.toISOString().split('T')[0], categoryId: 'CAT-EXP-04', description: `Campaña Google Ads`, amount: 8000000 + Math.random() * 3000000 });
        }
    }
    return expenses;
};

export const ALL_INVOICES: Invoice[] = generateInvoices(1200, 1);
export const ALL_PURCHASE_ORDERS: PurchaseOrder[] = generatePurchaseOrders(150, 1);
export const ALL_EXPENSES: Expense[] = generateExpenses(1);
export const INITIAL_CAPITAL = 500000000;


// --- CONFIGURATION CONSTANTS (MUST BE DEFINED BEFORE USER_PROFILES) ---

export const NAVIGATION_STRUCTURE: NavSection[] = [
     {
        label: "CRM",
        icon: React.createElement(UsersIcon),
        groups: [
            {
                label: "Gestión de Clientes",
                links: [
                    { id: 'crm_contacts', label: 'Hub de Contactos', icon: React.createElement(UsersIcon, { className: "h-5 w-5" }) },
                    { id: 'crm_opportunities', label: 'Oportunidades', icon: React.createElement(StarIcon, { className: "h-5 w-5" }) },
                    { id: 'crm_support_tickets', label: 'Tickets de Soporte', icon: React.createElement(ClipboardDocumentListIcon, { className: "h-5 w-5" }) },
                ]
            }
        ]
    },
    {
        label: "Ventas",
        icon: React.createElement(BuildingStorefrontIcon),
        groups: [
             {
                label: "Operaciones",
                links: [
                    { id: 'pos_view', label: 'Abrir POS', icon: React.createElement(ComputerDesktopIcon, { className: "h-5 w-5" }) },
                    { id: 'invoices_list', label: 'Facturas', icon: React.createElement(DocumentTextIcon, { className: "h-5 w-5" }) },
                    { id: 'sales_quotes', label: 'Cotizaciones', icon: React.createElement(DocumentPlusIcon, { className: "h-5 w-5" }) },
                    { id: 'sales_salespeople', label: 'Vendedores', icon: React.createElement(UserGroupIcon, { className: "h-5 w-5" }) },
                ]
            },
            {
                label: "Informes y Cartera",
                links: [
                    { id: 'sales_accounts_receivable', label: 'Cuentas por Cobrar', icon: React.createElement(BanknotesIcon, { className: "h-5 w-5" }) },
                    { id: 'cash_drawer_closing', label: 'Gestión de Caja', icon: React.createElement(BackspaceIcon, { className: "h-5 w-5" }) },
                    { id: 'sales_commissions_report', label: 'Informe de Comisiones', icon: React.createElement(ReceiptPercentIcon, { className: "h-5 w-5" }) },

                ]
            }
        ]
    },
     {
        label: "Inventario",
        icon: React.createElement(CubeIcon),
        groups: [
            {
                label: "General",
                links: [
                    { id: 'inventory_dashboard', label: 'Dashboard', icon: React.createElement(ChartBarSquareIcon, { className: "h-5 w-5" }) },
                    { id: 'inventory_items_services', label: 'Items y Servicios', icon: React.createElement(CubeIcon, { className: "h-5 w-5" }) },
                    { id: 'suppliers', label: 'Proveedores', icon: React.createElement(BuildingOfficeIcon, { className: "h-5 w-5" }) },
                    { id: 'inventory_purchase_orders', label: 'Órdenes de Compra', icon: React.createElement(ClipboardDocumentListIcon, { className: "h-5 w-5" }) },
                    { id: 'inventory_transfers', label: 'Transferencias', icon: React.createElement(ArrowPathIcon, { className: "h-5 w-5" }) },
                ]
            },
            {
                label: "Informes",
                links: [
                    { id: 'inventory_stock_report', label: 'Informe de Stock', icon: React.createElement(DocumentChartBarIcon, { className: "h-5 w-5" }) },
                    { id: 'inventory_kardex', label: 'Kardex', icon: React.createElement(DocumentTextIcon, { className: "h-5 w-5" }) },
                ]
            }
        ]
    },
    {
        label: "Marketing",
        icon: React.createElement(MegaphoneIcon),
        groups: [
             {
                label: "Estrategia",
                links: [
                    { id: 'marketing_dashboard', label: 'Dashboard', icon: React.createElement(ChartBarSquareIcon, { className: "h-5 w-5" }) },
                    { id: 'marketing_promotions', label: 'Promociones', icon: React.createElement(ReceiptPercentIcon, { className: "h-5 w-5" }) },
                    { id: 'marketing_campaigns', label: 'Campañas Email', icon: React.createElement(PaperAirplaneIcon, { className: "h-5 w-5" }) },
                ]
            }
        ]
    },
    {
        label: "Finanzas",
        icon: React.createElement(CalculatorIcon),
        groups: [
            {
                label: "Análisis",
                links: [
                    { id: 'financial_health', label: 'Análisis Financiero', icon: React.createElement(SparklesIcon, { className: "h-5 w-5" }) },
                    { id: 'finance_pl_statement', label: 'Estado de P&L', icon: React.createElement(DocumentChartBarIcon, { className: "h-5 w-5" }) },
                    { id: 'finance_balance_sheet', label: 'Balance General', icon: React.createElement(ScaleIcon, { className: "h-5 w-5" }) },
                    { id: 'finance_cash_flow', label: 'Flujo de Caja', icon: React.createElement(BanknotesIcon, { className: "h-5 w-5" }) },
                    { id: 'finance_expenses', label: 'Gastos', icon: React.createElement(CurrencyDollarIcon, { className: "h-5 w-5" }) },
                    { id: 'expense_from_document', label: 'Gasto desde Documento', icon: React.createElement(SparklesIcon, { className: "h-5 w-5" }) },
                ]
            }
        ]
    },
    {
        label: "Configuración",
        icon: React.createElement(Cog6ToothIcon),
        groups: [
            {
                label: "General",
                links: [
                    { id: 'config_user_profiles', label: 'Perfiles de Usuario', icon: React.createElement(ShieldCheckIcon, { className: "h-5 w-5" }) },
                    { id: 'config_users', label: 'Usuarios', icon: React.createElement(UserGroupIcon, { className: "h-5 w-5" }) },
                    { id: 'config_branches', label: 'Sucursales', icon: React.createElement(BuildingOfficeIcon, { className: "h-5 w-5" }) },
                    { id: 'config_integrations', label: 'Módulos e Integraciones', icon: React.createElement(PuzzlePieceIcon, { className: "h-5 w-5" }) },
                    { id: 'config_system_config', label: 'Info. de la Empresa', icon: React.createElement(WrenchScrewdriverIcon, { className: "h-5 w-5" }) },
                    { id: 'config_user_audit', label: 'Bitácora', icon: React.createElement(LockClosedIcon, { className: "h-5 w-5" }) },
                ]
            }
        ]
    }
];

// --- USER MANAGEMENT (Moved before VIEW_CONFIGS to solve dependency) ---
export const USERS: User[] = [
    { id: 'USR-01', name: 'Kai Administration', email: 'kairo', profileId: 'UP-SUPERADMIN', password: 'J0j4t4n***', isActive: true },
    { id: 'USR-02', name: 'Andrés Rojas', email: 'arojas', profileId: 'UP-VENDEDOR', password: 'password123', isActive: true },
    { id: 'USR-03', name: 'Carolina Vélez', email: 'cvelez', profileId: 'UP-VENDEDOR', password: 'password123', isActive: true },
    { id: 'USR-04', name: 'Cajero POS', email: 'cajero', profileId: 'UP-FACTURADOR', password: 'password123', isActive: true },
    { id: 'USR-05', name: 'Laura Operaciones', email: 'loperaciones', profileId: 'UP-OPERACIONES', password: 'password123', isActive: true },
    { id: 'USR-06', name: 'cajero 1', email: 'cajero1', profileId: 'UP-FACTURADOR', password: 'J0j4t4n***', isActive: true },
];

export const USER_PROFILES: UserProfile[] = [
    {
        id: 'UP-SUPERADMIN',
        name: 'Super Administrador',
        permissions: {}, // Placeholder, will be populated after VIEW_CONFIGS is defined
    },
    {
        id: 'UP-VENDEDOR',
        name: 'Vendedor',
        permissions: {
            dashboard: { view: true },
            crm_contacts: { view: true, create: true, edit: true },
            crm_opportunities: { view: true, create: true, edit: true },
            sales_quotes: { view: true, create: true, edit: true },
            invoices_list: { view: true, create: true, edit: true },
            pos_view: { view: true },
            sales_commissions_report: { view: true }
        }
    },
    {
        id: 'UP-FACTURADOR',
        name: 'Facturador / Cajero',
        permissions: {
            dashboard: { view: true },
            pos_view: { view: true },
            invoices_list: { view: true, create: true },
            cash_drawer_closing: { view: true },
            crm_contacts: { view: true, create: true },
        }
    },
    {
        id: 'UP-OPERACIONES',
        name: 'Operaciones',
        permissions: {
            dashboard: { view: true },
            inventory_dashboard: { view: true },
            inventory_items_services: { view: true, create: true, edit: true },
            inventory_purchase_orders: { view: true, create: true, edit: true },
            suppliers: { view: true, create: true, edit: true },
            inventory_stock_report: { view: true },
            inventory_kardex: { view: true },
            inventory_transfers: { view: true, create: true },
        }
    }
];

export const VIEW_CONFIGS: Record<View, GenericCrudConfig> = {
    // Dummy entries for views that have custom components but are based on lists
    dashboard: {} as any, designer: {} as any, invoices_list: {} as any, sales_accounts_receivable: {} as any, sales_sold_items: {} as any,
    inventory_purchase_orders: {} as any, inventory_kardex: {} as any, config_system_config: {} as any, salespeople_dashboard: {} as any,
    suppliers_dashboard: {} as any, sales_daily_closing: {} as any, invoice_from_document: {} as any, customer_profile: {} as any, inventory_transfers: {} as any,
    projections_ia: {} as any, ia_executive_report: {} as any, financial_health: {} as any, pos_view: {} as any, cash_drawer_closing: {} as any,
    supplier_profile: {} as any, inventory_dashboard: {} as any, marketing_dashboard: {} as any, sales_quotes: {} as any, config_user_audit: {} as any,
    crm_opportunities: {} as any, finance_pl_statement: {} as any, finance_balance_sheet: {} as any, finance_cash_flow: {} as any, sales_commissions_report: {} as any,
    inventory_stock_report: {} as any, config_integrations: {} as any, sales_collections_dashboard: {} as any, crm_support_tickets: {} as any, marketing_campaigns: {} as any,
    products: {} as any, sales_commission_types: {} as any, sales_account_statement: {} as any, sales_master: {} as any, sales_price_list: {} as any, 
    sales_ledger: {} as any, sales_by_salesperson: {} as any, sales_detailed_invoices: {} as any, sales_remissions: {} as any, sales_credit_notes: {} as any, 
    sales_debit_notes: {} as any, inventory_groups: {} as any, inventory_price_types: {} as any, inventory_units: {} as any, inventory_committed_stock: {} as any, 
    inventory_physical_inventory: {} as any, inventory_restock_report: {} as any, config_document_types: {} as any, config_payment_methods: {} as any, 
    config_resolutions: {} as any, config_retention_types: {} as any, config_denominations: {} as any, config_classification_accounts: {} as any,
    expense_from_document: {} as any,

    // CRM
    crm_contacts: {
        view: 'crm_contacts', dataKey: 'customers', title: 'Hub de Contactos', singular: 'Contacto', icon: React.createElement(UsersIcon),
        columns: [
            { key: 'name', header: 'Nombre', render: (c: Customer, _: AppDataState, onNav?: (v: View, p?: any) => void) => React.createElement('button', { onClick: () => onNav?.('customer_profile', c.id), className: "font-semibold text-primary-600 hover:underline" }, c.name) },
            { key: 'contact', header: 'Contacto' }, { key: 'email', header: 'Email' },
            { key: 'tags', header: 'Etiquetas', render: (c: Customer) => React.createElement('div', { className: "flex flex-wrap gap-1" }, c.tags?.map(t => React.createElement('span', { key: t, className: "px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full" }, t))) }
        ],
        formFields: [
            { name: 'name', label: 'Nombre Completo o Razón Social', type: 'text', required: true }, { name: 'contact', label: 'Persona de Contacto', type: 'text' },
            { name: 'email', label: 'Email', type: 'email', required: true },
        ]
    },

    // Ventas
    sales_salespeople: {
        view: 'sales_salespeople', dataKey: 'salespeople', title: 'Vendedores', singular: 'Vendedor', icon: React.createElement(UserGroupIcon),
        columns: [
            { key: 'name', header: 'Nombre' }, { key: 'commissionType', header: 'Tipo de Comisión' },
            { key: 'goal', header: 'Meta de Ventas', render: (s: Salesperson) => formatCurrency(s.goal) }, { key: 'commissionRate', header: 'Tasa (%)' }
        ],
        formFields: [
            { name: 'name', label: 'Nombre', type: 'text', required: true },
            { name: 'commissionType', label: 'Tipo de Comisión', type: 'text', required: true },
            { name: 'goal', label: 'Meta de Ventas', type: 'number', required: true },
            { name: 'commissionRate', label: 'Tasa de Comisión (%)', type: 'number', required: true },
        ]
    },
    // Inventario
    inventory_items_services: {
        view: 'inventory_items_services', dataKey: 'products', title: 'Items y Servicios', singular: 'Item', icon: React.createElement(CubeIcon),
        columns: [
            { key: 'name', header: 'Nombre' }, { key: 'category', header: 'Categoría' },
            { key: 'price', header: 'Precio', render: (p: Product) => formatCurrency(p.price) },
            { key: 'cost', header: 'Costo', render: (p: Product) => formatCurrency(p.cost) },
            { key: 'stockByWarehouse', header: 'Stock Total', render: (p: Product) => Object.values(p.stockByWarehouse).reduce((sum, val) => sum + val, 0) }
        ],
        formFields: [
            { name: 'name', label: 'Nombre', type: 'text', required: true },
            { name: 'category', label: 'Categoría', type: 'select', options: TECH_CATEGORIES.map(c => ({value: c, label: c})), required: true },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'price', label: 'Precio', type: 'number', required: true },
            { name: 'cost', label: 'Costo', type: 'number', required: true },
        ]
    },
    suppliers: {
        view: 'suppliers', dataKey: 'suppliers', title: 'Proveedores', singular: 'Proveedor', icon: React.createElement(BuildingOfficeIcon),
        columns: [
            { key: 'name', header: 'Nombre', render: (s: Supplier, _: AppDataState, onNav?: (v: View, p?: any) => void) => React.createElement('button', { onClick: () => onNav?.('supplier_profile', s.id), className: "font-semibold text-primary-600 hover:underline" }, s.name) },
            { key: 'contactPerson', header: 'Contacto' }, { key: 'email', header: 'Email' }, { key: 'category', header: 'Categoría Principal' }
        ],
        formFields: [
            { name: 'name', label: 'Nombre', type: 'text', required: true },
            { name: 'contactPerson', label: 'Persona de Contacto', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'category', label: 'Categoría', type: 'text' },
        ]
    },
    inventory_warehouses: {
        view: 'inventory_warehouses', dataKey: 'warehouses', title: 'Bodegas', singular: 'Bodega', icon: React.createElement(BuildingOfficeIcon),
        columns: [{ key: 'name', header: 'Nombre' }, { key: 'location', header: 'Ubicación' }, { key: 'manager', header: 'Encargado' }],
        formFields: [
            { name: 'name', label: 'Nombre', type: 'text', required: true }, { name: 'location', label: 'Ubicación', type: 'text' },
            { name: 'manager', label: 'Encargado', type: 'text' },
        ]
    },
    inventory_brands: {
        view: 'inventory_brands', dataKey: 'brands', title: 'Marcas', singular: 'Marca', icon: React.createElement(TagIcon),
        columns: [{ key: 'name', header: 'Nombre' }, { key: 'description', header: 'Descripción' }],
        formFields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }, { name: 'description', label: 'Descripción', type: 'text' }],
    },
    // Finanzas
    finance_expenses: {
        view: 'finance_expenses', dataKey: 'expenses', title: 'Gastos', singular: 'Gasto', icon: React.createElement(CurrencyDollarIcon),
        columns: [
            { key: 'date', header: 'Fecha' },
            { key: 'categoryId', header: 'Categoría', render: (e: Expense, data: AppDataState) => data.expenseCategories.find(c => c.id === e.categoryId)?.name || 'N/A' },
            { key: 'description', header: 'Descripción' },
            { key: 'amount', header: 'Monto', render: (e: Expense) => formatCurrency(e.amount) },
        ],
        formFields: [
            { name: 'date', label: 'Fecha', type: 'date', required: true },
            { name: 'categoryId', label: 'Categoría', type: 'select', options: EXPENSE_CATEGORIES.map(c => ({value: c.id, label: c.name})), required: true },
            { name: 'description', label: 'Descripción', type: 'text', required: true },
            { name: 'amount', label: 'Monto', type: 'number', required: true },
        ],
        customActions: (onNavigate) => React.createElement('button', {
            onClick: () => onNavigate('expense_from_document'),
            className: "flex items-center gap-2 bg-accent-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-600 transition-colors duration-300 shadow-md",
            children: [React.createElement(SparklesIcon, { key: "icon", className: "h-5 w-5" }), 'Crear con IA']
        })
    },
    // Marketing
    marketing_promotions: {
        view: 'marketing_promotions', dataKey: 'promotions', title: 'Promociones', singular: 'Promoción', icon: React.createElement(ReceiptPercentIcon),
        columns: [
            { key: 'name', header: 'Nombre' }, { key: 'description', header: 'Descripción' },
            { key: 'type', header: 'Tipo' }, { key: 'value', header: 'Valor' },
            { key: 'startDate', header: 'Inicio' }, { key: 'endDate', header: 'Fin' },
        ],
        formFields: [
            { name: 'name', label: 'Nombre', type: 'text', required: true }, { name: 'description', label: 'Descripción', type: 'text' },
            { name: 'type', label: 'Tipo', type: 'select', options: [{value: 'percentage', label: 'Porcentaje'}, {value: 'fixed', label: 'Monto Fijo'}]},
            { name: 'value', label: 'Valor', type: 'number' },
            { name: 'startDate', label: 'Fecha Inicio', type: 'date' }, { name: 'endDate', label: 'Fecha Fin', type: 'date' },
        ]
    },
    // Configuración
    config_user_profiles: {
        view: 'config_user_profiles', dataKey: 'config_user_profiles', title: 'Perfiles de Usuario', singular: 'Perfil', icon: React.createElement(ShieldCheckIcon),
        columns: [{ key: 'name', header: 'Nombre del Perfil' }],
        formFields: [
            { name: 'name', label: 'Nombre del Perfil', type: 'text', required: true },
            { name: 'permissions', label: 'Permisos', type: 'permission-checklist' }
        ]
    },
    config_users: {
        view: 'config_users', dataKey: 'users', title: 'Usuarios', singular: 'Usuario', icon: React.createElement(UserGroupIcon),
        columns: [
            { key: 'name', header: 'Nombre' }, { key: 'email', header: 'Email' },
            { key: 'profileId', header: 'Perfil', render: (u: User, data: AppDataState) => data.config_user_profiles.find(p => p.id === u.profileId)?.name || 'N/A' },
            { key: 'isActive', header: 'Activo', render: (u: User) => u.isActive ? 'Sí' : 'No' }
        ],
        formFields: [
            { name: 'name', label: 'Nombre', type: 'text', required: true },
            { name: 'email', label: 'Email (será el usuario)', type: 'email', required: true },
            { name: 'password', label: 'Contraseña', type: 'password', required: true },
            { name: 'profileId', label: 'Perfil', type: 'select', options: USER_PROFILES.map(p => ({value: p.id, label: p.name})), required: true },
            { name: 'isActive', label: 'Usuario Activo', type: 'checkbox' }
        ]
    },
    config_branches: {
        view: 'config_branches', dataKey: 'warehouses', title: 'Sucursales', singular: 'Sucursal', icon: React.createElement(BuildingOfficeIcon),
        columns: [{ key: 'name', header: 'Nombre' }, { key: 'location', header: 'Ubicación' }, { key: 'manager', header: 'Encargado' }],
        formFields: [
            { name: 'name', label: 'Nombre', type: 'text', required: true }, { name: 'location', label: 'Ubicación', type: 'text' },
            { name: 'manager', label: 'Encargado', type: 'text' },
        ]
    }
};

// --- USER MANAGEMENT (part 2: Populate Super Admin Permissions) ---
const allViewsForSuperAdmin: View[] = Array.from(new Set([
    ...(Object.keys(VIEW_CONFIGS) as (keyof typeof VIEW_CONFIGS)[]),
    ...NAVIGATION_STRUCTURE.flatMap(s => s.groups.flatMap(g => g.links.map(l => l.id)))
]));

const superAdminPermissions: Partial<Record<View, ViewPermissions>> = {};
allViewsForSuperAdmin.forEach(viewId => {
    if (viewId) { // Basic check to avoid issues with undefined/null ids
        superAdminPermissions[viewId] = { view: true, create: true, edit: true, delete: true };
    }
});

const superAdminProfile = USER_PROFILES.find(p => p.id === 'UP-SUPERADMIN');
if (superAdminProfile) {
    superAdminProfile.permissions = superAdminPermissions;
}
