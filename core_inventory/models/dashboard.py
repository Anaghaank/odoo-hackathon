from odoo import models, fields, api

class CoreDashboard(models.TransientModel):
    _name = 'core.dashboard'
    _description = 'Inventory Dashboard'

    total_products = fields.Integer(string='Total Products in Stock', compute='_compute_kpi')
    low_stock_items = fields.Integer(string='Low Stock / Out of Stock', compute='_compute_kpi')
    pending_receipts = fields.Integer(string='Pending Receipts', compute='_compute_kpi')
    pending_deliveries = fields.Integer(string='Pending Deliveries', compute='_compute_kpi')
    internal_transfers = fields.Integer(string='Internal Transfers Scheduled', compute='_compute_kpi')

    def _compute_kpi(self):
        for rec in self:
            products = self.env['core.product'].search([])
            rec.total_products = sum(1 for p in products if p.stock_qty > 0)
            rec.low_stock_items = sum(1 for p in products if p.stock_qty <= 0)  # Simply 0 or less
            
            rec.pending_receipts = self.env['core.picking'].search_count([('picking_type', '=', 'receipt'), ('state', 'in', ['draft', 'waiting', 'ready'])])
            rec.pending_deliveries = self.env['core.picking'].search_count([('picking_type', '=', 'delivery'), ('state', 'in', ['draft', 'waiting', 'ready'])])
            rec.internal_transfers = self.env['core.picking'].search_count([('picking_type', '=', 'internal'), ('state', 'in', ['draft', 'waiting', 'ready'])])
    
    @api.model
    def open_dashboard(self):
        record = self.create({})
        return {
            'type': 'ir.actions.act_window',
            'name': 'Inventory Dashboard',
            'res_model': 'core.dashboard',
            'res_id': record.id,
            'view_mode': 'form',
            'target': 'current',
        }
