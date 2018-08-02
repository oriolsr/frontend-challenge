/*
    https://github.com/erikras/ducks-modular-redux
*/
import { fromEvent, of } from 'rxjs'
import {
    map, catchError, debounceTime, switchMap, retryWhen, take, takeUntil
} from 'rxjs/operators'
import { ofType } from 'redux-observable'

import api from 'api'
import initialState from 'store/state'


const GET_MOVIES = 'GET_MOVIES'
const GET_MOVIES_SUCCESS = 'GET_MOVIES_SUCCESS'
const GET_MOVIES_ERROR = 'GET_MOVIES_ERROR'
const GET_MOVIES_CANCEL = 'GET_MOVIES_CANCEL'

const GET_MOVIE = 'GET_MOVIE'
const GET_MOVIE_SUCCESS = 'GET_MOVIE_SUCCESS'
const GET_MOVIE_ERROR = 'GET_MOVIE_ERROR'
const GET_MOVIE_CANCEL = 'GET_MOVIE_CANCEL'

const { movies: { search: defaultParams } } = initialState
export const fetchMovies = ( searchParams = defaultParams ) => ( { type: GET_MOVIES, searchParams } )
export const fetchMoviesSuccess = list => ( { type: GET_MOVIES_SUCCESS, list, lastUpdated: Date.now() } )
export const fetchMoviesError = listError => ( { type: GET_MOVIES_ERROR, listError } )
export const cancelGetMoviesRequest = () => ( { type: GET_MOVIES_CANCEL } )

export const fetchMovie = movieId => ( { type: GET_MOVIE, movieId } )
export const fetchMovieSuccess = detail => ( { type: GET_MOVIE_SUCCESS, detail, lastUpdated: Date.now() } )
export const fetchMovieError = detailError => ( { type: GET_MOVIE_ERROR, detailError } )
export const cancelGetMovieRequest = () => ( { type: GET_MOVIE_CANCEL } )


export default {

    epics: {
        getMoviesEpic: action$ => action$.pipe(
            ofType( GET_MOVIES ),
            debounceTime( 1000 ),
            switchMap(
                ( { searchParams } ) => (
                    api.get( {
                        uri: 'http://www.omdbapi.com',
                        params: searchParams
                    } ).pipe(
                        map(
                            ( { Error, Search } ) => Error ? (
                                fetchMoviesError( Error )
                            ) : (
                                fetchMoviesSuccess( Search )
                            )
                        ),
                        take( 1 ),
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
            debounceTime( 1000 ),
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
                        take( 1 ),
                        retryWhen( () => fromEvent( navigator, 'onLine' ) ),
                        takeUntil( action$.ofType( GET_MOVIE_CANCEL ) ),
                        catchError(
                            () => of(
                                fetchMovieError( { action: GET_MOVIE } )
                            )
                        )
                    )
                )
            )
        )
    },

    reducers: {

        [GET_MOVIES]: ( state, { searchParams } ) => ( {
            ...state,
            isFetching: true,
            search: {
                ...state.search,
                ...searchParams
            }
        } ),

        [GET_MOVIES_SUCCESS]: ( state, { list, lastUpdated } ) => ( {
            ...state,
            list,
            lastUpdated,
            error: null,
            isFetching: false
        } ),

        [GET_MOVIES_ERROR]: ( state, { listError } ) => ( {
            ...state,
            listError,
            list: [],
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

        [GET_MOVIE_ERROR]: ( state, { detailError } ) => ( {
            ...state,
            detailError,
            isFetching: false
        } )
    }
}


export const actions = {
    GET_MOVIES,
    GET_MOVIES_SUCCESS,
    GET_MOVIES_ERROR
}
