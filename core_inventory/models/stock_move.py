from odoo import models, fields

class CoreStockMove(models.Model):
    _name = 'core.stock.move'
    _description = 'Stock Move History'

    name = fields.Char(string='Reference/Document')
    picking_id = fields.Many2one('core.picking', string='Associated Operation')
    product_id = fields.Many2one('core.product', string='Product', required=True)
    qty = fields.Float(string='Quantity', required=True)
    location_id = fields.Many2one('core.location', string='From Location', required=True)
    location_dest_id = fields.Many2one('core.location', string='To Location', required=True)
    date = fields.Datetime(string='Date', default=fields.Datetime.now)
    state = fields.Selection([
        ('draft', 'Draft'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')
    ], string='Status', default='draft')
