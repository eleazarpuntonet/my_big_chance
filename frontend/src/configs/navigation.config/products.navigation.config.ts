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
        title: 'Productos',
        translateKey: 'Productos',
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
                key: 'products.list',
                path: '/products',
                title: 'Todos los Productos',
                translateKey: 'Todos los Productos',
                icon: 'PiPackageDuotone',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.products.listDesc',
                        label: 'Explorar y buscar productos',
                    },
                },
                subMenu: [],
            },
            {
                key: 'products.admin',
                path: '/products/admin',
                title: 'Administrar Productos',
                translateKey: 'Administrar Productos',
                icon: 'PiPackageDuotone',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                meta: {
                    description: {
                        translateKey: 'nav.products.adminDesc',
                        label: 'Crear y editar productos',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default productsNavigationConfig