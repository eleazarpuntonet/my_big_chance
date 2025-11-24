import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const productsRoute: Routes = [
    {
        key: 'products.list',
        path: '/products',
        component: lazy(() => import('@/views/products/views/ProductsList')),
        authority: [],
        meta: {
            pageContainerType: 'default',
        },
    },
    {
        key: 'products.detail',
        path: '/products/:id',
        component: lazy(() => import('@/views/products/views/ProductDetail')),
        authority: [],
        meta: {
            pageContainerType: 'default',
        },
    },
    {
        key: 'products.admin',
        path: '/products/admin',
        component: lazy(() => import('@/views/products/views/ProductAdmin')),
        authority: [], // Should require admin authority
        meta: {
            pageContainerType: 'default',
        },
    },
]

export default productsRoute