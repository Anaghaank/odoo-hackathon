# Standard Odoo Models to cleanup
models_to_clean = [
    "stock.picking",
    "stock.move",
    "stock.quant",
    "stock.inventory",
    "product.product",
    "product.template",
    "res.partner",
]

for model_name in models_to_clean:
    try:
        records = env[model_name].search([])
        if records:
            print(f"Cleaning {len(records)} from {model_name}")
            if model_name == "res.partner":
                records = records.filtered(lambda r: not r.parent_id and r.name not in ["OdooBot", "YourCompany", "Public User", "Administrator"])
            
            # Simple direct deletion, might need multiple passes for linked records
            records.unlink()
            env.cr.commit()
    except Exception as e:
        print(f"Skipping {model_name} due to: {e}")
