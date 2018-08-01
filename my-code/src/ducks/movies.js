/*
    https://github.com/erikras/ducks-modular-redux
*/
import { fromEvent, of } from 'rxjs'
import {
    map, catchError, debounceTime, switchMap, retryWhen, takeUntil
} from 'rxjs/operators'
import { ofType } from 'redux-observable'

import api from 'api'


const GET_MOVIES = 'GET_MOVIES'
const GET_MOVIES_SUCCESS = 'GET_MOVIES_SUCCESS'
const GET_MOVIES_ERROR = 'GET_MOVIES_ERROR'
const GET_MOVIES_CANCEL = 'GET_MOVIES_ERROR'

export const fetchMovies = params => ( { type: GET_MOVIES, params } )
export const fetchMoviesSuccess = page => ( { type: GET_MOVIES_SUCCESS, page, lastUpdated: Date.now() } )
export const fetchMoviesError = error => ( { type: GET_MOVIES_ERROR, error } )
export const cancelGetMoviesRequest = () => ( { type: GET_MOVIES_CANCEL } )


export default {

    epics: {
        getMoviesEpic: action$ => action$.pipe(
            ofType( GET_MOVIES ),
            debounceTime( 200 ),
            switchMap(
                ( { params } = {} ) => (
                    api.get( {
                        uri: `http://www.omdbapi.com/?i=tt3896198&apikey=42a1d080`,
                        params
                    } ).pipe(
                        map( movies => fetchMoviesSuccess( movies ) ),
                        retryWhen( () => fromEvent( navigator, 'onLine' ) ),
                        takeUntil( action$.ofType( GET_MOVIES_CANCEL ) ),
                        catchError(
                            response => of(
                                fetchMoviesError( api.rxError( GET_MOVIES, response ) )
                            )
                        )
                    )
                )
            )
        )
    },

    reducers: {

        [GET_MOVIES]: ( state, { params: { sort } } ) => ( {
            ...state,
            isFetching: true,
            sort
        } ),

        [GET_MOVIES_SUCCESS]: ( state, { movies, lastUpdated } ) => ( {
            ...state,
            movies,
            lastUpdated,
            error: null,
            isFetching: false
        } ),

        [GET_MOVIES_ERROR]: ( state, { error } ) => ( {
            ...state,
            error,
            isFetching: false
        } )
    }
}


export const actions = {
    GET_MOVIES,
    GET_MOVIES_SUCCESS,
    GET_MOVIES_ERROR
}
