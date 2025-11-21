import dashboardsNavigationConfig from './dashboards.navigation.config'
import uiComponentNavigationConfig from './ui-components.navigation.config'
import conceptsNavigationConfig from './concepts.navigation.config'
import authNavigationConfig from './auth.navigation.config'
import guideNavigationConfig from './guide.navigation.config'
import type { NavigationTree } from '@/@types/navigation'
import parametersNavigationConfig from './parameters.navigation.config'
import storesNavigationConfig from './stores.navigation.config'
import productsNavigationConfig from './products.navigation.config'

const navigationConfig: NavigationTree[] = [
    ...storesNavigationConfig,
    ...productsNavigationConfig
]

export default navigationConfig
