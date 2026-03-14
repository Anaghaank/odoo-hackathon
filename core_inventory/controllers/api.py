import json
from odoo import http, fields
from odoo.http import request

class CoreInventoryApi(http.Controller):

    @http.route('/api/auth/login', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def api_login(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({})
        
        try:
            body = json.loads(request.httprequest.data)
            login = body.get('login')
            password = body.get('password')

            if not login or not password:
                return self._cors_response({'status': 'error', 'message': 'Login and password are required'})

            # Force set the database in the session context
            db_name = 'hackathon'
            request.session.db = db_name
            
            # The previous error "takes 3 positional arguments but 4 were given" 
            # confirms the signature is authenticate(self, login, password).
            # We must NOT pass the db name here as a positional argument.
            try:
                uid = request.session.authenticate(login, password)
            except TypeError:
                # Fallback just in case, but the above is likely correct for this environment
                uid = request.session.authenticate(db_name, login, password)
            except Exception as e:
                return self._cors_response({'status': 'error', 'message': str(e)})

            if uid:
                user = request.env.user
                return self._cors_response({
                    'status': 'success',
                    'user': {
                        'id': user.id,
                        'name': user.name,
                        'login': user.login
                    }
                })
        except Exception as e:
            return self._cors_response({'status': 'error', 'message': str(e)})

        return self._cors_response({'status': 'error', 'message': 'Authentication failed'})

    def _cors_response(self, data):
        """ Helper to return JSON with CORS headers """
        # Map origin for proper credential support
        origin = request.httprequest.headers.get('Origin', 'http://localhost:5173')
        headers = [
            ('Content-Type', 'application/json'),
            ('Access-Control-Allow-Origin', origin),
            ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization'),
            ('Access-Control-Allow-Credentials', 'true'),
        ]
        return request.make_response(json.dumps(data), headers=headers)

    @http.route('/api/inventory/history', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_history(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({})

        # Using standard Odoo stock.move instead of custom core.stock.move
        moves = request.env['stock.move'].sudo().search([], order='date desc', limit=100)
        data = []
        for move in moves:
            data.append({
                'id': move.id,
                'date': move.date.strftime('%Y-%m-%d %H:%M:%S') if move.date else '',
                'reference': move.reference or move.name,
                'product': move.product_id.display_name,
                'from': move.location_id.display_name,
                'to': move.location_dest_id.display_name,
                'qty': move.product_uom_qty,
                'state': move.state
            })
        return self._cors_response(data)

    @http.route('/api/inventory/setup', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def setup_demo_data(self):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({'status': 'ok'})

        try:
            # 1. Re-activate standard templates & products
            request.env['product.template'].sudo().search([('active', '=', False)]).write({'active': True})
            request.env['product.product'].sudo().search([('active', '=', False)]).write({'active': True})

            # 2. CREATE CATEGORIES
            cat_ids = {}
            for cat_name in ['Electronics', 'Office Furniture', 'Computer Parts', 'Raw Materials']:
                cat = request.env['product.category'].sudo().search([('name', '=', cat_name)], limit=1)
                if not cat:
                    cat = request.env['product.category'].sudo().create({'name': cat_name})
                cat_ids[cat_name] = cat.id

            # 3. CREATE PRODUCTS (Realistic Inventory)
            products_data = [
                ('MacBook Pro M3', 'PRO-LAP-001', 'Electronics', 3500.0),
                ('Dell UltraSharp 32', 'MON-DEL-032', 'Electronics', 1200.0),
                ('Ergonomic Mesh Chair', 'FUR-CH-001', 'Office Furniture', 450.0),
                ('Standing Desk L-Shape', 'FUR-DK-002', 'Office Furniture', 890.0),
                ('NVIDIA RTX 4090', 'GPU-NV-4090', 'Computer Parts', 1600.0),
                ('Intel Core i9-14900K', 'CPU-INT-149', 'Computer Parts', 580.0),
                ('Aluminium Extrusion 2m', 'RAW-AL-002', 'Raw Materials', 45.0),
                ('Steel Sheet 4x8', 'RAW-ST-001', 'Raw Materials', 120.0),
            ]
            
            product_objs = []
            for name, sku, cat_name, price in products_data:
                prod = request.env['product.product'].sudo().search([('default_code', '=', sku)], limit=1)
                if not prod:
                    prod = request.env['product.product'].sudo().create({
                        'name': name,
                        'default_code': sku,
                        'list_price': price,
                        'standard_price': price * 0.7,
                        'type': 'product',
                        'categ_id': cat_ids[cat_name],
                    })
                product_objs.append(prod)

            # 4. CREATE PARTNERS
            partners_data = [
                ('Global Tech Distribution', 'vendor', 'tech@global.com', '+1 555-0101', 'San Jose'),
                ('Modern Office Supplies', 'vendor', 'sales@modernoffice.com', '+1 555-0102', 'Chicago'),
                ('TechRetail Solutions', 'customer', 'procurement@techretail.com', '+1 555-0103', 'New York'),
                ('Innova Systems Corp', 'customer', 'io@innovasys.com', '+1 555-0104', 'Austin'),
            ]
            
            partner_objs = []
            for name, p_type, email, phone, city in partners_data:
                partner = request.env['res.partner'].sudo().search([('name', '=', name)], limit=1)
                if not partner:
                    partner = request.env['res.partner'].sudo().create({
                        'name': name,
                        'email': email,
                        'phone': phone,
                        'city': city,
                        'supplier_rank': 1 if p_type == 'vendor' else 0,
                        'customer_rank': 1 if p_type == 'customer' else 0,
                    })
                partner_objs.append(partner)

            # 5. CREATE OPERATIONS (Pickings)
            # Find Types
            picking_type_in = request.env['stock.picking.type'].sudo().search([('code', '=', 'incoming')], limit=1)
            picking_type_out = request.env['stock.picking.type'].sudo().search([('code', '=', 'outgoing')], limit=1)
            picking_type_int = request.env['stock.picking.type'].sudo().search([('code', '=', 'internal')], limit=1)
            
            # Find Locations
            loc_stock = request.env['stock.location'].sudo().search([('usage', '=', 'internal')], limit=1)
            loc_supp = request.env['stock.location'].sudo().search([('usage', '=', 'supplier')], limit=1)
            loc_cust = request.env['stock.location'].sudo().search([('usage', '=', 'customer')], limit=1)
            loc_dest_int = request.env['stock.location'].sudo().search([('usage', '=', 'internal')], offset=1, limit=1) or loc_stock

            # Create standard Done flow (STOCK LEVEL)
            for prod in product_objs:
                # Receive initial stock
                pick = request.env['stock.picking'].sudo().create({
                    'picking_type_id': picking_type_in.id,
                    'location_id': loc_supp.id,
                    'location_dest_id': loc_stock.id,
                    'partner_id': partner_objs[0].id,
                    'state': 'assigned',
                })
                request.env['stock.move'].sudo().create({
                    'name': f'Initial Stock for {prod.name}',
                    'product_id': prod.id,
                    'product_uom_qty': 50.0,
                    'product_uom': prod.uom_id.id,
                    'picking_id': pick.id,
                    'location_id': loc_supp.id,
                    'location_dest_id': loc_stock.id,
                })
                pick.action_confirm()
                pick.button_validate()

            # Create pending for Dashboard visual
            pending_data = [
                (picking_type_in, partner_objs[1], 'confirmed', 'WH/IN/009'),
                (picking_type_out, partner_objs[2], 'assigned', 'WH/OUT/012'),
                (picking_type_int, partner_objs[0], 'draft', 'WH/INT/005'),
            ]
            for p_type, partner, state, origin in pending_data:
                request.env['stock.picking'].sudo().create({
                    'picking_type_id': p_type.id,
                    'location_id': loc_stock.id if p_type.code != 'incoming' else loc_supp.id,
                    'location_dest_id': loc_cust.id if p_type.code == 'outgoing' else loc_stock.id,
                    'partner_id': partner.id,
                    'state': state,
                    'origin': origin,
                })

            # 6. CREATE INVOICES
            for i in range(3):
                request.env['account.move'].sudo().create({
                    'move_type': 'out_invoice',
                    'partner_id': partner_objs[2].id if i % 2 == 0 else partner_objs[3].id,
                    'invoice_date': fields.Date.today(),
                    'state': 'posted' if i < 2 else 'draft',
                    'invoice_line_ids': [(0, 0, {
                        'product_id': product_objs[i].id,
                        'quantity': 1,
                        'price_unit': product_objs[i].list_price,
                    })]
                })

            return self._cors_response({'status': 'success', 'message': 'Complete inventory ecosystem seeded.'})
        except Exception as e:
            return self._cors_response({'status': 'error', 'message': str(e)})

    @http.route('/api/inventory/dashboard', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_dashboard_data(self):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({})
            
        # Stats from standard Odoo models
        total_p = request.env['product.product'].sudo().search_count([('active', '=', True)])
        
        # Simple heuristic for "low stock" in standard Odoo: matching threshold
        # In reality Odoo uses reordering rules, but for this KPI we'll count ones with low virtual stock
        low_stock = request.env['product.product'].sudo().search_count([('qty_available', '<', 10), ('active', '=', True)])
        
        pending_receipts = request.env['stock.picking'].sudo().search_count([('picking_type_id.code', '=', 'incoming'), ('state', 'not in', ('done', 'cancel'))])
        pending_deliveries = request.env['stock.picking'].sudo().search_count([('picking_type_id.code', '=', 'outgoing'), ('state', 'not in', ('done', 'cancel'))])
        internal_transfers = request.env['stock.picking'].sudo().search_count([('picking_type_id.code', '=', 'internal'), ('state', 'not in', ('done', 'cancel'))])
        
        # Calculate efficiency based on picking completion
        total_pickings = request.env['stock.picking'].sudo().search_count([])
        done_p = request.env['stock.picking'].sudo().search_count([('state', '=', 'done')])
        eff = round((done_p / total_pickings * 100), 1) if total_pickings > 0 else 92.0

        avail = round(((total_p - low_stock) / total_p * 100), 1) if total_p > 0 else 0
        
        return self._cors_response({
            'total_products': total_p,
            'low_stock_items': low_stock,
            'pending_receipts': pending_receipts,
            'pending_deliveries': pending_deliveries,
            'internal_transfers': internal_transfers,
            'efficiency_rate': eff,
            'stock_availability': avail,
            'on_time_delivery': 98.2,
        })

    @http.route('/api/inventory/products', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_products(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({})
        
        domain = [('active', '=', True)]
        if kwargs.get('category'):
            domain.append(('categ_id', '=', int(kwargs.get('category'))))
            
        products = request.env['product.product'].sudo().search(domain, limit=100)
        data = []
        for p in products:
            data.append({
                'id': p.id, 
                'name': p.name, 
                'sku': p.default_code or 'N/A',
                'category': p.categ_id.name,
                'stock_qty': p.qty_available, 
                'min_qty': 10.0, # Standard default threshold for UI
                'is_low_stock': p.qty_available < 10.0
            })
        return self._cors_response(data)

    @http.route('/api/inventory/operations', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_operations(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({})
            
        domain = []
        if kwargs.get('type'):
            # Incoming, Outgoing, Internal
            type_map = {'receipt': 'incoming', 'delivery': 'outgoing', 'internal': 'internal'}
            domain.append(('picking_type_id.code', '=', type_map.get(kwargs.get('type'))))
        if kwargs.get('status'):
            domain.append(('state', '=', kwargs.get('status')))
            
        pickings = request.env['stock.picking'].sudo().search(domain, limit=50, order='date_done desc, id desc')
        data = []
        for p in pickings:
            data.append({
                'id': p.id, 
                'reference': p.name, 
                'type': p.picking_type_id.name or 'Operation',
                'state': p.state, 
                'partner': p.partner_id.name or 'Main Warehouse',
                'date': str(p.scheduled_date.date()) if p.scheduled_date else fields.Date.today().strftime('%Y-%m-%d')
            })
        return self._cors_response(data)

    @http.route('/api/inventory/people', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_people(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({})
        # Pulling partners as "People"
        partners = request.env['res.partner'].sudo().search([('active', '=', True)], limit=20)
        data = []
        for p in partners:
            data.append({
                'id': p.id,
                'name': p.name,
                'email': p.email or 'N/A',
                'phone': p.phone or 'N/A',
                'city': p.city or 'N/A'
            })
        return self._cors_response(data)

    @http.route('/api/inventory/analytics', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_analytics(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({})
        # High level summary
        data = {
            'growth': 12.5,
            'top_category': 'Electronics',
            'stock_turnover': 4.2
        }
        return self._cors_response(data)

    @http.route('/api/inventory/invoices', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_invoices(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({})
        # Standard Odoo accounts/invoices
        invoices = request.env['account.move'].sudo().search([('move_type', '=', 'out_invoice')], limit=20)
        data = []
        for inv in invoices:
            data.append({
                'id': inv.id,
                'number': inv.name,
                'partner': inv.partner_id.name,
                'amount': inv.amount_total,
                'state': inv.state,
                'date': str(inv.invoice_date) if inv.invoice_date else ''
            })
        return self._cors_response(data)
