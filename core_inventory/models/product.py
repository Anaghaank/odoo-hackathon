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
    barcode = fields.Char(string='Barcode')
    category_id = fields.Many2one('core.product.category', string='Category')
    low_stock_threshold = fields.Float(string='Low Stock Threshold', default=10.0)
    # Using a simple text field for UoM to avoid complexity with the standard 'uom' module.
    uom_char = fields.Char(string='Unit of Measure', default='Units')
    
    stock_qty = fields.Float(string='Total Available Stock', compute='_compute_stock_qty', store=False)
    is_low_stock = fields.Boolean(string='Is Low Stock', compute='_compute_stock_qty')
    
    def _compute_stock_qty(self):
        for prod in self:
            # Optimize: Sum all moves in one go (in a real system we'd use SQL/Quant table)
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
            prod.is_low_stock = prod.stock_qty <= prod.low_stock_threshold

    def action_view_stock_locations(self):
        """ Opens a view showing stock distribution across locations """
        self.ensure_one()
        # This would normally link to a quant-like view
        return {
            'name': 'Stock per Location',
            'type': 'ir.actions.act_window',
            'res_model': 'core.stock.move',
            'view_mode': 'list',
            'domain': [('product_id', '=', self.id), ('state', '=', 'done')],
            'context': {'search_default_group_by_location': 1}
        }

class CoreReorderingRule(models.Model):
    _name = 'core.reordering.rule'
    _description = 'Reordering Rule'

    product_id = fields.Many2one('core.product', string='Product', required=True)
    location_id = fields.Many2one('core.location', string='Location', required=True)
    min_qty = fields.Float(string='Minimum Quantity', default=0.0)
    max_qty = fields.Float(string='Maximum Quantity', default=0.0)
