import { StackNavigator, TabNavigator } from 'react-navigation'
import { createReduxBoundAddListener, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'


import {
    Login,
    MainFlow
} from '../screens'

export const routes = {
    loginFlow: {
        screen: StackNavigator( {
            // Splash: { screen: null },
            Login: { screen: Login }
            // ForgotPassword: { screen: null }
        } )
    },
    mainFlow: {
        screen: MainFlow
    }
}

const AppNavigator = StackNavigator(
    routes,
    {
        navigationOptions: {
            header: null
        }
    }
)

const navInitialState = AppNavigator.router.getStateForAction( AppNavigator.router.getActionForPathAndParams( 'mainFlow/NearMe' ) )

const navReducer = ( state = navInitialState, action ) => {
    const nextState = AppNavigator.router.getStateForAction( action, state )

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state
}

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
const navMiddleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav,
)
const addListener = createReduxBoundAddListener( 'root' )

export {
    navReducer,
    navMiddleware,
    addListener,
    navInitialState,
    AppNavigator
}
