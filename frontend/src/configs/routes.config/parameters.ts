import { lazy } from 'react'
import { SETTINGS_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const parametersRoute: Routes = [
    {
        key: 'settings.parameters.countries',
        path: `${SETTINGS_PREFIX_PATH}/parameters/countries`,
        component: lazy(() => import('@/views/parameters/countries/CountryList')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
]
export default parametersRoute