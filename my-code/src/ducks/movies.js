/*
    https://github.com/erikras/ducks-modular-redux
*/
import { fromEvent, of } from 'rxjs'
import {
    map, catchError, debounceTime, switchMap, retryWhen, takeUntil
} from 'rxjs/operators'
import { ofType } from 'redux-observable'

import api from 'api'
import initialState from 'store/state'


const GET_MOVIES = 'GET_MOVIES'
const GET_MOVIES_SUCCESS = 'GET_MOVIES_SUCCESS'
const GET_MOVIES_ERROR = 'GET_MOVIES_ERROR'
const GET_MOVIES_CANCEL = 'GET_MOVIES_ERROR'

const GET_MOVIE = 'GET_MOVIE'
const GET_MOVIE_SUCCESS = 'GET_MOVIE_SUCCESS'
const GET_MOVIE_ERROR = 'GET_MOVIE_ERROR'
const GET_MOVIE_CANCEL = 'GET_MOVIE_ERROR'

const { movies: { search: defaultParams } } = initialState
export const fetchMovies = ( params = defaultParams ) => ( { type: GET_MOVIES, params } )
export const fetchMoviesSuccess = list => ( { type: GET_MOVIES_SUCCESS, list, lastUpdated: Date.now() } )
export const fetchMoviesError = error => ( { type: GET_MOVIES_ERROR, error } )
export const cancelGetMoviesRequest = () => ( { type: GET_MOVIES_CANCEL } )

export const fetchMovie = movieId => ( { type: GET_MOVIE, movieId } )
export const fetchMovieSuccess = detail => ( { type: GET_MOVIE_SUCCESS, detail, lastUpdated: Date.now() } )
export const fetchMovieError = error => ( { type: GET_MOVIE_ERROR, error } )
export const cancelGetMovieRequest = () => ( { type: GET_MOVIE_CANCEL } )


export default {

    epics: {
        getMoviesEpic: action$ => action$.pipe(
            ofType( GET_MOVIES ),
            debounceTime( 3000 ),
            switchMap(
                ( { params } ) => (
                    api.get( {
                        uri: 'http://www.omdbapi.com',
                        params
                    } ).pipe(
                        map(
                            ( { Error, Search } ) => Error ? (
                                fetchMoviesError( Error )
                            ) : (
                                fetchMoviesSuccess( Search )
                            )
                        ),
                        retryWhen( () => fromEvent( navigator, 'onLine' ) ),
                        takeUntil( action$.ofType( GET_MOVIES_CANCEL ) ),
                        catchError(
                            () => of(
                                fetchMoviesError( { action: GET_MOVIES } )
                            )
                        )
                    )
                )
            )
        ),
        getMovieEpic: action$ => action$.pipe(
            ofType( GET_MOVIE ),
            debounceTime( 3000 ),
            switchMap(
                ( { movieId } ) => (
                    api.get( {
                        uri: 'http://www.omdbapi.com',
                        params: {
                            i: movieId
                        }
                    } ).pipe(
                        map(
                            ( { Error, ...detail } ) => Error ? (
                                fetchMovieError( Error )
                            ) : (
                                fetchMovieSuccess( detail )
                            )
                        ),
                        retryWhen( () => fromEvent( navigator, 'onLine' ) ),
                        takeUntil( action$.ofType( GET_MOVIE_CANCEL ) ),
                        catchError(
                            () => of(
                                fetchMoviesError( { action: GET_MOVIE } )
                            )
                        )
                    )
                )
            )
        )
    },

    reducers: {

        [GET_MOVIES]: ( state, params ) => ( {
            ...state,
            isFetching: true,
            params: {
                ...state.params,
                ...params
            }
        } ),

        [GET_MOVIES_SUCCESS]: ( state, { list, lastUpdated } ) => ( {
            ...state,
            list,
            lastUpdated,
            error: null,
            isFetching: false
        } ),

        [GET_MOVIES_ERROR]: ( state, { error } ) => ( {
            ...state,
            error,
            isFetching: false
        } ),

        [GET_MOVIE]: state => ( {
            ...state,
            isFetching: true
        } ),

        [GET_MOVIE_SUCCESS]: ( state, { detail } ) => ( {
            ...state,
            detail,
            isFetching: false
        } ),

        [GET_MOVIE_ERROR]: ( state, { error } ) => ( {
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
