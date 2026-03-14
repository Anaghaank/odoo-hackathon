from odoo import models, fields, api

class CoreWarehouse(models.Model):
    _name = 'core.warehouse'
    _description = 'Warehouse'

    name = fields.Char(string='Warehouse Name', required=True)
    code = fields.Char(string='Short Name', required=True)
    location_ids = fields.One2many('core.location', 'warehouse_id', string='Locations')

class CoreLocation(models.Model):
    _name = 'core.location'
    _description = 'Inventory Location'

    name = fields.Char(string='Location Name', required=True)
    complete_name = fields.Char(string='Full Location Name', compute='_compute_complete_name', store=True)
    warehouse_id = fields.Many2one('core.warehouse', string='Warehouse', required=True, ondelete='cascade')
    parent_id = fields.Many2one('core.location', string='Parent Location', index=True, ondelete='cascade')
    
    usage = fields.Selection([
        ('internal', 'Internal Location'),
        ('customer', 'Customer Location'),
        ('supplier', 'Supplier / Vendor Location'),
        ('inventory', 'Inventory Loss/Adjustment'),
        ('production', 'Production'),
    ], string='Location Type', default='internal', required=True)

    barcode = fields.Char(string='Barcode', help="Used for scanner-based operations")
    scrap_location = fields.Boolean(string='Is a Scrap Location?', default=False)
    
    # Logistics
    removal_strategy = fields.Selection([
        ('fifo', 'First In First Out (FIFO)'),
        ('lifo', 'Last In First Out (LIFO)'),
        ('closest', 'Closest Location'),
        ('least_packages', 'Least Packages'),
    ], string='Removal Strategy', help="Defines how products are picked from this location")

    # Inventory Counting
    inventory_frequency = fields.Integer(string='Inventory Frequency (Days)', default=0)
    last_inventory_date = fields.Date(string='Last Inventory')
    next_inventory_date = fields.Date(string='Next Expected Inventory', compute='_compute_next_inventory', store=True)

    @api.depends('name', 'parent_id.complete_name')
    def _compute_complete_name(self):
        for location in self:
            if location.parent_id:
                location.complete_name = f"{location.parent_id.complete_name}/{location.name}"
            else:
                location.complete_name = location.name

    @api.depends('last_inventory_date', 'inventory_frequency')
    def _compute_next_inventory(self):
        from datetime import timedelta
        for rec in self:
            if rec.last_inventory_date and rec.inventory_frequency > 0:
                rec.next_inventory_date = rec.last_inventory_date + timedelta(days=rec.inventory_frequency)
            else:
                rec.next_inventory_date = False
