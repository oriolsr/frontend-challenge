import _ from 'lodash'
import {
    createStore, combineReducers, applyMiddleware, compose
} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineEpics, createEpicMiddleware } from 'redux-observable'

import { movies } from '../ducks'
import initialState from './state'

const persistConfig = {
    key: 'root',
    storage
}

const createReducer = ( defaultState, actionHandlers ) => ( state, action ) => {
    let newState = state

    if ( newState === undefined ) newState = defaultState

    const reduceFn = actionHandlers[action.type]

    if ( !reduceFn ) return newState

    return Object.assign( {}, newState, reduceFn( newState, action ) )
}

const reducers = combineReducers( Object.assign(
    {},
    { movies: createReducer( initialState.movies, movies.reducers ) }
) )

const epics = combineEpics(
    ...( _.map( movies.epics, v => v ) )
)

const epicMiddleware = createEpicMiddleware()

export const store = createStore(
    persistReducer( persistConfig, reducers ),
    initialState,
    compose(
        applyMiddleware( epicMiddleware )
    )
)

epicMiddleware.run( epics )

export const persistor = persistStore( store )
