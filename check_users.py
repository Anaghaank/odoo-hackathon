users = env['res.users'].search([('active', '=', True)])
for u in users:
    print(f"User: {u.login} (ID: {u.id})")
