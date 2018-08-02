import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Grid, Row, Col } from 'react-flexbox-grid'
import Input from 'antd/lib/input'
import 'antd/lib/input/style/css'
import Icon from 'antd/lib/icon'
import 'antd/lib/icon/style/css'
import { MovieCard } from 'components'
import NoResultsImage from 'assets/search/illustration-empty-state.png'
import { fetchMovies, cancelGetMoviesRequest } from 'ducks/movies'
import './MovieSearch.less'

class MovieSearch extends Component {
    static propTypes = {
        moviesError: PropTypes.object,
        moviesList: PropTypes.array,
        moviesSearch: PropTypes.object,
        moviesFetching: PropTypes.bool,
        cancelGetMoviesRequest: PropTypes.func,
        fetchMovies: PropTypes.func,
        intl: intlShape.isRequired
    }

    componentWillUnmount() {
        const { cancelGetMoviesRequest } = this.props // eslint-disable-line no-shadow

        cancelGetMoviesRequest()
    }

    render() {
        const {
            fetchMovies, // eslint-disable-line no-shadow
            moviesSearch: { s },
            moviesList,
            moviesFetching,
            intl: {
                messages: {
                    movieSearchErrorImageAlt
                }
            }
        } = this.props

        return (
            <Grid
                fluid
                className="movie-search"
            >
                <Row>
                    <Col
                        md={12}
                        className="search-bar"
                    >
                        <Input
                            defaultValue={s}
                            prefix={(
                                <Icon
                                    type={moviesFetching ? 'loading' : 'search'}
                                />
                            )}
                            suffix={null}
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
                                Year,
                                imdbID
                            } ) => (
                                <MovieCard
                                    key={imdbID}
                                    Title={Title}
                                    Poster={Poster}
                                    Year={Year}
                                    imdbID={imdbID}
                                />
                            )
                        )
                    }
                    {
                        !moviesList.length ? (
                            <React.Fragment>
                                <Col md={4} xs={0} />
                                <Col
                                    md={4}
                                    className="no-results"
                                >
                                    <img
                                        src={NoResultsImage}
                                        alt={movieSearchErrorImageAlt}
                                    />
                                    <h2>
                                        <FormattedMessage
                                            id="movieSearchErrorTitle"
                                        />
                                    </h2>
                                    <p>
                                        <FormattedMessage
                                            id="movieSearchErrorHint"
                                        />
                                    </p>
                                </Col>
                                <Col md={4} xs={0} />
                            </React.Fragment>
                        ) : null
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
            listError,
            isFetching
        }
    } ) => ( {
        moviesList: list,
        moviesSearch: search,
        moviesError: listError,
        moviesFetching: isFetching
    } ),
    dispatch => ( {
        fetchMovies: ( ...args ) => dispatch( fetchMovies( ...args ) ),
        cancelGetMoviesRequest: () => dispatch( cancelGetMoviesRequest() )
    } )
)( injectIntl( MovieSearch ) )
