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
    @http.route('/api/auth/signup', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False, cors='*')
    def signup_organisation(self, **kwargs):
        # Handle CORS Preflight
        if request.httprequest.method == 'OPTIONS':
            return request.make_response('', headers=[
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'POST, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type'),
            ])

        try:
            print(">>> Received Signup Request")
            data = json.loads(request.httprequest.data)
            input_data = data.get('params', data)
            
            name = input_data.get('name')
            organisation = input_data.get('organisation')
            email = input_data.get('email')
            phone = input_data.get('phone')

            print(f">>> Name: {name}, Org: {organisation}, Email: {email}")

            if not all([name, organisation, email]):
                return self._json_response({'error': 'Missing required fields'})

            # Check if email already exists in any partner record
            existing_partner = request.env['res.partner'].sudo().search([('email', '=', email)], limit=1)
            if existing_partner:
                return self._json_response({'error': 'This email is already registered in our system.'})

            # Create the organisation (company) record
            # In Odoo, 'company_type' is the key field for the Contacts module filter
            company = request.env['res.partner'].sudo().create({
                'name': organisation,
                'is_company': True,
                'company_type': 'company',
                'email': email,
                'phone': phone,
                'street': 'Automatic Signup',
            })

            # Create the contact person linked to the company
            contact = request.env['res.partner'].sudo().create({
                'name': name,
                'parent_id': company.id,
                'email': email,
                'phone': phone,
                'is_company': False,
                'company_type': 'person',
                'function': 'Organization Admin',
            })

            result = {
                'status': 'success',
                'contact_id': contact.id,
                'company_id': company.id,
                'message': f'Organisation "{organisation}" created successfully!'
            }
            print(f">>> Created Company ID: {company.id}")
            
            return self._json_response({'result': result})
            
        except Exception as e:
            print(f">>> Signup Error Error: {str(e)}")
            return self._json_response({'error': str(e)})
