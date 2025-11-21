import { SETTINGS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const parametersNavigationConfig: NavigationTree[] = [{
        key: 'settings',
        path: '',
        title: 'Configuraciones',
        translateKey: 'Configuraciones',
        icon: 'settings',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'columns',
                columns: 4,
            },
        },
        subMenu: [
            {
                key: 'settings.parameters',
                path: `${SETTINGS_PREFIX_PATH}/parameters`,
                title: 'Parámetros',
                translateKey: 'Parámetros',
                icon: 'projects',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                // authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.countryDesc',
                        label: 'Manage your emails',
                    },
                },
                subMenu: [
                    {
                        key: 'settings.parameters.countries',
                        path: `${SETTINGS_PREFIX_PATH}/parameters/countries`,
                        title: 'Paises',
                        translateKey: 'nav.settings.parameters',
                        icon: 'country',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.settings.parameters.countriesDesc',
                                label: 'Gestiona los paises',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
        ]
    }
]

export default parametersNavigationConfig
