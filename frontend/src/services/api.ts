const ODOO_BASE_URL = 'http://localhost:8069';

export interface DashboardData {
    total_products: number;
    low_stock_items: number;
    pending_receipts: number;
    pending_deliveries: number;
    internal_transfers: number;
}

export interface ProductData {
    id: number;
    name: string;
    sku: string;
    category: string;
    stock_qty: number;
    min_qty: number;
    is_low_stock: boolean;
}

export interface OperationData {
    id: number;
    name: string;
    picking_type: string;
    state: string;
    origin: string;
    date: string;
}

export const inventoryService = {
    async getDashboard(): Promise<DashboardData> {
        const response = await fetch(`${ODOO_BASE_URL}/api/inventory/dashboard`);
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        return response.json();
    },

    async getProducts(): Promise<ProductData[]> {
        const response = await fetch(`${ODOO_BASE_URL}/api/inventory/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    async getOperations(): Promise<OperationData[]> {
        const response = await fetch(`${ODOO_BASE_URL}/api/inventory/operations`);
        if (!response.ok) throw new Error('Failed to fetch operations');
        return response.json();
    }
};
