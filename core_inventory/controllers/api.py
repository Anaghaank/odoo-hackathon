import json
from odoo import http
from odoo.http import request

class CoreInventoryApi(http.Controller):

    def _json_response(self, data):
        return request.make_response(
            json.dumps(data),
            headers=[('Content-Type', 'application/json')]
        )

    @http.route('/api/inventory/dashboard', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_dashboard_data(self):
        if request.httprequest.method == 'OPTIONS':
            return request.make_response('', headers=[
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type'),
            ])

        # Using sudo() to ensure public access works without session
        dashboard = request.env['core.dashboard'].sudo().create({})
        dashboard._compute_kpi()
        
        data = {
            'total_products': dashboard.total_products,
            'low_stock_items': dashboard.low_stock_items,
            'pending_receipts': dashboard.pending_receipts,
            'pending_deliveries': dashboard.pending_deliveries,
            'internal_transfers': dashboard.internal_transfers,
        }
        return self._json_response(data)

    @http.route('/api/inventory/products', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_products(self):
        if request.httprequest.method == 'OPTIONS':
            return request.make_response('', headers=[('Access-Control-Allow-Origin', '*')])

        products = request.env['core.product'].sudo().search([])
        product_list = []
        for p in products:
            product_list.append({
                'id': p.id,
                'name': p.name,
                'sku': p.sku,
                'category': p.category_id.name if p.category_id else 'Uncategorized',
                'stock_qty': p.stock_qty,
                'min_qty': p.min_qty,
                'is_low_stock': p.is_low_stock,
            })
        return self._json_response(product_list)

    @http.route('/api/inventory/operations', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_operations(self):
        if request.httprequest.method == 'OPTIONS':
            return request.make_response('', headers=[('Access-Control-Allow-Origin', '*')])

        pickings = request.env['core.picking'].sudo().search([], limit=20)
        picking_list = []
        for p in pickings:
            picking_list.append({
                'id': p.id,
                'name': p.name,
                'picking_type': p.picking_type,
                'state': p.state,
                'origin': p.origin or '',
                'date': str(p.scheduled_date) if p.scheduled_date else '',
            })
        return self._json_response(picking_list)
