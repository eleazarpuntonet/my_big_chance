export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
    enableMock: boolean
    activeNavTranslation: boolean
}

const appConfig: AppConfig = {
    apiPrefix: import.meta.env.VITE_APIURL,
    authenticatedEntryPath: '/stores',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'es',
    accessTokenPersistStrategy: 'localStorage',
    enableMock: true,
    activeNavTranslation: true,
}

export default appConfig
