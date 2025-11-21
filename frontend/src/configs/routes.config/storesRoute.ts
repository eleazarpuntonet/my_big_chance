import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const storesRoute: Routes = [
    {
        key: 'stores.list',
        path: '/stores',
        component: lazy(() => import('@/views/stores/views/StoresList')),
        authority: [],
        meta: {
            pageContainerType: 'default',
        },
    },
    {
        key: 'stores.detail',
        path: '/stores/:id',
        component: lazy(() => import('@/views/stores/views/StoreDetail')),
        authority: [],
        meta: {
            pageContainerType: 'default',
        },
    },
    {
        key: 'stores.admin',
        path: '/stores/admin',
        component: lazy(() => import('@/views/stores/views/StoresAdmin')),
        authority: [], // Should require admin authority
        meta: {
            pageContainerType: 'default',
        },
    },
]

export default storesRoute