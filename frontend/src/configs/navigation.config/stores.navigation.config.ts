import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const storesNavigationConfig: NavigationTree[] = [
    {
        key: 'stores',
        path: '',
        title: 'Tiendas',
        translateKey: 'Tiendas',
        icon: 'PiShoppingCartDuotone',
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
                key: 'stores.list',
                path: '/stores',
                title: 'Todas las Tiendas',
                translateKey: 'Todas las Tiendas',
                icon: 'PiShoppingCartDuotone',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.stores.listDesc',
                        label: 'Explorar y buscar tiendas',
                    },
                },
                subMenu: [],
            },
            {
                key: 'stores.admin',
                path: '/stores/admin',
                title: 'Administrar Tiendas',
                translateKey: 'Administrar Tiendas',
                icon: 'PiShoppingCartDuotone',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                meta: {
                    description: {
                        translateKey: 'nav.stores.adminDesc',
                        label: 'Crear y editar tiendas',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default storesNavigationConfig