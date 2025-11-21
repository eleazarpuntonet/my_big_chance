import type { NavigationTree } from '@/@types/navigation'

const productsNavigationConfig: NavigationTree[] = [
    {
        key: 'products',
        path: '',
        title: 'Products',
        translateKey: 'nav.products.products',
        icon: 'PiPackageDuotone',
        type: 'title',
        authority: [],
        subMenu: [
            {
                key: 'products.admin',
                path: '/products/admin',
                title: 'Manage Products',
                translateKey: 'nav.products.admin',
                icon: 'PiPackageDuotone',
                type: 'item',
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default productsNavigationConfig