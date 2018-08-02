import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-flexbox-grid'
import {
    Link
} from 'react-router-dom'

import { fetchMovies, cancelGetMoviesRequest } from 'ducks/movies'
import './MovieSearch.less'

class MovieSearch extends Component {
    static propTypes = {
        moviesError: PropTypes.object,
        moviesList: PropTypes.array,
        moviesSearch: PropTypes.object,
        cancelGetMoviesRequest: PropTypes.func,
        fetchMovies: PropTypes.func
    }

    componentWillUnmount() {
        const { cancelGetMoviesRequest } = this.props // eslint-disable-line no-shadow

        cancelGetMoviesRequest()
    }

    render() {
        const {
            fetchMovies, moviesList // eslint-disable-line no-shadow
        } = this.props

        return (
            <Grid
                fluid
                className="movie-search"
            >
                <Row>
                    <Col
                        md={12}
                    >
                        <input
                            type="text"
                            onChange={e => fetchMovies( { s: e.target.value } )}
                        />
                    </Col>
                </Row>
                <Row>
                    {
                        moviesList.map(
                            ( {
                                Title,
                                Poster,
                                imdbID
                            } ) => (
                                <Col
                                    xs={6}
                                    md={2}
                                >
                                    <Link
                                        to={`/movie/${imdbID}`}
                                    >
                                        <img
                                            src={Poster}
                                            alt={Title}
                                            style={{
                                                width: '100%',
                                                maxWidth: '100%'
                                            }}
                                        />
                                    </Link>
                                </Col>
                            )
                        )
                    }
                </Row>
            </Grid>
        )
    }
}

export default connect(
    ( {
        movies: {
            list,
            search,
            error
        }
    } ) => ( {
        moviesList: list,
        moviesSearch: search,
        moviesError: error
    } ),
    dispatch => ( {
        fetchMovies: ( ...args ) => dispatch( fetchMovies( ...args ) ),
        cancelGetMoviesRequest: () => dispatch( cancelGetMoviesRequest() )
    } )
)( MovieSearch )
