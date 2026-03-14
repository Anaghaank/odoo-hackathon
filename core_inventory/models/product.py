from odoo import models, fields, api

class CoreProductCategory(models.Model):
    _name = 'core.product.category'
    _description = 'Product Category'

    name = fields.Char(string='Category Name', required=True)
    parent_id = fields.Many2one('core.product.category', string='Parent Category')

class CoreProduct(models.Model):
    _name = 'core.product'
    _description = 'Product'

    name = fields.Char(string='Product Name', required=True)
    sku = fields.Char(string='SKU / Code', required=True, copy=False)
    category_id = fields.Many2one('core.product.category', string='Category')
    uom_id = fields.Many2one('uom.uom', string='Unit of Measure')
    
    # Optional field since UOM might require "uom" module in standard odoo, but user did not mention "uom" module.
    # Let's simplify to a text field if UoM module is omitted, or we just rely on standard char.
    uom_char = fields.Char(string='Unit of Measure', default='Units')
    
    stock_qty = fields.Float(string='Available Stock', compute='_compute_stock_qty', store=False)
    
    def _compute_stock_qty(self):
        for prod in self:
            moves_in = self.env['core.stock.move'].search([
                ('product_id', '=', prod.id),
                ('state', '=', 'done'),
                ('location_dest_id.usage', '=', 'internal')
            ])
            moves_out = self.env['core.stock.move'].search([
                ('product_id', '=', prod.id),
                ('state', '=', 'done'),
                ('location_id.usage', '=', 'internal')
            ])
            qty_in = sum(moves_in.mapped('qty'))
            qty_out = sum(moves_out.mapped('qty'))
            prod.stock_qty = qty_in - qty_out
