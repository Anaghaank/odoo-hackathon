{
    'name': 'CoreInventory',
    'version': '1.0',
    'summary': 'Modular Inventory Management System (IMS)',
    'description': 'Digitizes and streamlines all stock-related operations.',
    'category': 'Inventory',
    'author': 'Hackathon Team',
    'depends': ['base', 'web'],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'data/sequence.xml',
        'views/dashboard_views.xml',
        'views/menu.xml',
        'views/warehouse_views.xml',
        'views/product_views.xml',
        'views/picking_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'core_inventory/static/src/css/core_inventory.css',
        ],
    },
    'demo': [
        'data/demo_data.xml',
    ],
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
