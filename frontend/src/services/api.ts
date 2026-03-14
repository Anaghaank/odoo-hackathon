const ODOO_BASE_URL = 'http://localhost:8069';

export interface DashboardData {
    total_products: number;
    low_stock_items: number;
    pending_receipts: number;
    pending_deliveries: number;
    internal_transfers: number;
    efficiency_rate: number;
    stock_availability: number;
    on_time_delivery: number;
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
  reference: string;
  partner: string;
  type: string;
  state: string;
  date: string;
}

export interface MoveHistoryData {
  id: number;
  date: string;
  reference: string;
  product: string;
  from: string;
  to: string;
  qty: number;
  state: string;
}

export const inventoryService = {
    async _call(url: string, method: 'GET' | 'POST' = 'GET', params: any = {}): Promise<any> {
        let fullUrl = `${ODOO_BASE_URL}${url}`;
        const options: RequestInit = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        if (method === 'GET' && Object.keys(params).length > 0) {
            const query = new URLSearchParams(params).toString();
            fullUrl += `?${query}`;
        } else if (method === 'POST') {
            options.body = JSON.stringify(params);
        }
        
        const response = await fetch(fullUrl, {
            ...options,
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Failed to call ${url}`);
        const data = await response.json();
        if (data.status === 'error') throw new Error(data.message);
        return data;
    },

    async login(login: string, password: string): Promise<any> {
        const data = await this._call('/api/auth/login', 'POST', { login, password });
        if (data.status === 'success') {
            localStorage.setItem('core_user', JSON.stringify(data.user));
            return data.user;
        }
        throw new Error(data.message || 'Login failed');
    },

    logout() {
        localStorage.removeItem('core_user');
        window.location.href = '/login';
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('core_user');
    },

    async getDashboard(): Promise<DashboardData> {
        return this._call('/api/inventory/dashboard');
    },

    async getProducts(params?: { category?: string }): Promise<ProductData[]> {
        return this._call('/api/inventory/products', 'GET', params);
    },

    async getOperations(params?: { type?: string; status?: string }): Promise<OperationData[]> {
        return this._call('/api/inventory/operations', 'GET', params);
    },

    async getHistory(): Promise<MoveHistoryData[]> {
        return this._call('/api/inventory/history');
    },

    async getPeople(): Promise<any[]> {
        return this._call('/api/inventory/people');
    },

    async getAnalytics(): Promise<any> {
        return this._call('/api/inventory/analytics');
    },

    async getInvoices(): Promise<any[]> {
        return this._call('/api/inventory/invoices');
    },

    async setupDemoData(): Promise<any> {
        return this._call('/api/inventory/setup', 'POST');
    }
};
