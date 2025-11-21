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
        title: 'Stores',
        translateKey: 'Stores',
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
                title: 'All Stores',
                translateKey: 'All Stores',
                icon: 'PiShoppingCartDuotone',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.stores.listDesc',
                        label: 'Browse and search stores',
                    },
                },
                subMenu: [],
            },
            {
                key: 'stores.admin',
                path: '/stores/admin',
                title: 'Manage Stores',
                translateKey: 'Manage Stores',
                icon: 'PiShoppingCartDuotone',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                meta: {
                    description: {
                        translateKey: 'nav.stores.adminDesc',
                        label: 'Create and edit stores',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default storesNavigationConfig