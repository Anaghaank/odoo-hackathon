try:
    p_count = env['product.product'].search_count([])
    picking_count = env['stock.picking'].search_count([])
    print(f"Products: {p_count}")
    print(f"Pickings: {picking_count}")
except Exception as e:
    print(f"Error: {e}")
