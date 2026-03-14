from odoo import models, fields, api, _

class CorePicking(models.Model):
    _name = 'core.picking'
    _description = 'Inventory Operation (Picking/Adjustment)'

    name = fields.Char(string='Reference', required=True, copy=False, default=lambda self: _('New'))
    partner_id = fields.Many2one('res.partner', string='Contact (Supplier/Customer)')
    warehouse_id = fields.Many2one('core.warehouse', string='Warehouse')
    location_id = fields.Many2one('core.location', string='Source Location')
    location_dest_id = fields.Many2one('core.location', string='Destination Location')
    
    picking_type = fields.Selection([
        ('receipt', 'Receipt'),
        ('delivery', 'Delivery'),
        ('internal', 'Internal Transfer'),
        ('adjustment', 'Stock Adjustment')
    ], string='Operation Type', required=True)
    
    state = fields.Selection([
        ('draft', 'Draft'),
        ('waiting', 'Waiting'),
        ('ready', 'Ready'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')
    ], string='Status', default='draft')

    scheduled_date = fields.Datetime(string='Scheduled Date', default=fields.Datetime.now)
    line_ids = fields.One2many('core.picking.line', 'picking_id', string='Operations')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('name', 'New') == 'New':
                picking_type = vals.get('picking_type')
                if picking_type == 'receipt':
                    vals['name'] = self.env['ir.sequence'].next_by_code('core.receipt') or 'WH/IN/NEW'
                elif picking_type == 'delivery':
                    vals['name'] = self.env['ir.sequence'].next_by_code('core.delivery') or 'WH/OUT/NEW'
                elif picking_type == 'internal':
                    vals['name'] = self.env['ir.sequence'].next_by_code('core.internal') or 'WH/INT/NEW'
                elif picking_type == 'adjustment':
                    vals['name'] = self.env['ir.sequence'].next_by_code('core.adjustment') or 'WH/ADJ/NEW'
        return super(CorePicking, self).create(vals_list)

    def action_confirm(self):
        for rec in self:
            rec.state = 'ready'

    def action_validate(self):
        for rec in self:
            for line in rec.line_ids:
                if line.qty_done <= 0:
                    line.qty_done = line.qty_demand
                
                # Create stock move
                self.env['core.stock.move'].create({
                    'name': rec.name,
                    'picking_id': rec.id,
                    'product_id': line.product_id.id,
                    'qty': line.qty_done,
                    'location_id': rec.location_id.id,
                    'location_dest_id': rec.location_dest_id.id,
                    'date': fields.Datetime.now(),
                    'state': 'done'
                })
            rec.state = 'done'


class CorePickingLine(models.Model):
    _name = 'core.picking.line'
    _description = 'Picking Operation Line'

    picking_id = fields.Many2one('core.picking', string='Operation', required=True, ondelete='cascade')
    product_id = fields.Many2one('core.product', string='Product', required=True)
    qty_demand = fields.Float(string='Demand Quantity', default=1.0)
    qty_done = fields.Float(string='Done Quantity', default=0.0)

