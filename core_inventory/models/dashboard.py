from odoo import models, fields, api

class CoreDashboard(models.TransientModel):
    _name = 'core.dashboard'
    _description = 'Inventory Dashboard'

    total_products   = fields.Integer(string='Total Products in Stock',   compute='_compute_kpi')
    low_stock_items  = fields.Integer(string='Low / Out of Stock',         compute='_compute_kpi')
    pending_receipts = fields.Integer(string='Pending Receipts',           compute='_compute_kpi')
    pending_deliveries = fields.Integer(string='Pending Deliveries',       compute='_compute_kpi')
    internal_transfers = fields.Integer(string='Internal Transfers',       compute='_compute_kpi')

    def _compute_kpi(self):
        for rec in self:
            products = self.env['core.product'].search([])
            rec.total_products = len(products.filtered(lambda p: p.stock_qty > 0))
            rec.low_stock_items = len(products.filtered(lambda p: p.is_low_stock))

            picking_stats = self.env['core.picking'].read_group(
                [('state', 'in', ['draft', 'waiting', 'ready'])],
                ['picking_type'], ['picking_type']
            )
            stats_map = {d['picking_type']: d['picking_type_count'] for d in picking_stats}
            rec.pending_receipts    = stats_map.get('receipt', 0)
            rec.pending_deliveries  = stats_map.get('delivery', 0)
            rec.internal_transfers  = stats_map.get('internal', 0)

    # ── Navigation actions called by KPI tile buttons ──────────────
    def action_view_all_products(self):
        return {
            'type': 'ir.actions.act_window',
            'name': 'Products',
            'res_model': 'core.product',
            'view_mode': 'kanban,list,form',
        }

    def action_view_low_stock(self):
        return {
            'type': 'ir.actions.act_window',
            'name': 'Low Stock Products',
            'res_model': 'core.product',
            'view_mode': 'list,kanban,form',
            'domain': [('is_low_stock', '=', True)],
        }

    def action_view_receipts(self):
        return {
            'type': 'ir.actions.act_window',
            'name': 'Pending Receipts',
            'res_model': 'core.picking',
            'view_mode': 'list,form',
            'domain': [('picking_type', '=', 'receipt'),
                       ('state', 'in', ['draft', 'waiting', 'ready'])],
            'context': {'default_picking_type': 'receipt'},
        }

    def action_view_deliveries(self):
        return {
            'type': 'ir.actions.act_window',
            'name': 'Pending Deliveries',
            'res_model': 'core.picking',
            'view_mode': 'list,form',
            'domain': [('picking_type', '=', 'delivery'),
                       ('state', 'in', ['draft', 'waiting', 'ready'])],
            'context': {'default_picking_type': 'delivery'},
        }

    def action_view_transfers(self):
        return {
            'type': 'ir.actions.act_window',
            'name': 'Internal Transfers',
            'res_model': 'core.picking',
            'view_mode': 'list,form',
            'domain': [('picking_type', '=', 'internal'),
                       ('state', 'in', ['draft', 'waiting', 'ready'])],
            'context': {'default_picking_type': 'internal'},
        }

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
