import type { NavigationTree } from '@/@types/navigation'

const storesNavigationConfig: NavigationTree[] = [
    {
        key: 'stores',
        path: '',
        title: 'Stores',
        translateKey: 'nav.stores.stores',
        icon: 'PiShoppingCartDuotone',
        type: 'title',
        authority: [],
        subMenu: [
            {
                key: 'stores.list',
                path: '/stores',
                title: 'All Stores',
                translateKey: 'nav.stores.list',
                icon: 'PiShoppingCartDuotone',
                type: 'item',
                authority: [],
                subMenu: [],
            },
            {
                key: 'stores.admin',
                path: '/stores/admin',
                title: 'Manage Stores',
                translateKey: 'nav.stores.admin',
                icon: 'PiShoppingCartDuotone',
                type: 'item',
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default storesNavigationConfig