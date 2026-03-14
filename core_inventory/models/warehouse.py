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
    warehouse_id = fields.Many2one('core.warehouse', string='Warehouse', required=True, ondelete='cascade')
    usage = fields.Selection([
        ('internal', 'Internal Location'),
        ('customer', 'Customer Location'),
        ('supplier', 'Supplier / Vendor Location'),
        ('inventory', 'Inventory Loss/Adjustment'),
    ], string='Location Type', default='internal', required=True)
