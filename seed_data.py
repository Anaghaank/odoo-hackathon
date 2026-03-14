import sys
import os

# Set up paths
sys.path.append(r'C:\odoo')
import odoo
from odoo.tools import config

# Load config
config.parse_config([r'C:\odoo\odoo.conf'])

# Start Odoo
odoo.netsvc.init_logger()
registry = odoo.registry.get('hackathon')

with registry.cursor() as cr:
    env = odoo.api.Environment(cr, odoo.SUPERUSER_ID, {})
    
    # 1. Categories
    cat_obj = env['core.product.category']
    cat_raw = cat_obj.search([('name', '=', 'Raw Materials')], limit=1) or cat_obj.create({'name': 'Raw Materials'})
    cat_elec = cat_obj.search([('name', '=', 'Electronics')], limit=1) or cat_obj.create({'name': 'Electronics'})
    
    # 2. Warehouse/Locations
    wh_obj = env['core.warehouse']
    wh = wh_obj.search([], limit=1) or wh_obj.create({'name': 'Main Warehouse', 'code': 'WH'})
    
    loc_obj = env['core.location']
    loc_stock = loc_obj.search([('usage', '=', 'internal'), ('warehouse_id', '=', wh.id)], limit=1) or loc_obj.create({
        'name': 'Stock', 'usage': 'internal', 'warehouse_id': wh.id
    })
    loc_supp = loc_obj.search([('usage', '=', 'supplier')], limit=1) or loc_obj.create({
        'name': 'Vendors', 'usage': 'supplier', 'warehouse_id': wh.id
    })
    
    # 3. Products
    prod_obj = env['core.product']
    if not prod_obj.search_count([]):
        p1 = prod_obj.create({'name': 'Steel Rods (12mm)', 'sku': 'STR-001', 'category_id': cat_raw.id, 'low_stock_threshold': 50.0})
        p2 = prod_obj.create({'name': 'Enterprise Laptop V4', 'sku': 'LAP-099', 'category_id': cat_elec.id, 'low_stock_threshold': 5.0})
        p3 = prod_obj.create({'name': 'Wireless Mouse Pro', 'sku': 'MSE-011', 'category_id': cat_elec.id, 'low_stock_threshold': 10.0})
        
        # 4. Stock Moves
        move_obj = env['core.stock.move']
        move_obj.create([
            {'name': 'Init', 'product_id': p1.id, 'qty': 150, 'location_id': loc_supp.id, 'location_dest_id': loc_stock.id, 'state': 'done'},
            {'name': 'Init', 'product_id': p2.id, 'qty': 12, 'location_id': loc_supp.id, 'location_dest_id': loc_stock.id, 'state': 'done'},
            {'name': 'Init', 'product_id': p3.id, 'qty': 3, 'location_id': loc_supp.id, 'location_dest_id': loc_stock.id, 'state': 'done'}
        ])
    
    cr.commit()
    print("DEMO DATA SEEDED SUCCESSFULLY")
