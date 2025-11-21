import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const productsNavigationConfig: NavigationTree[] = [
    {
        key: 'products',
        path: '',
        title: 'Products',
        translateKey: 'Products',
        icon: 'PiPackageDuotone',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'columns',
                columns: 2,
            },
        },
        subMenu: [
            {
                key: 'products.admin',
                path: '/products/admin',
                title: 'Manage Products',
                translateKey: 'Manage Products',
                icon: 'PiPackageDuotone',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                meta: {
                    description: {
                        translateKey: 'nav.products.adminDesc',
                        label: 'Create and edit products',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default productsNavigationConfig