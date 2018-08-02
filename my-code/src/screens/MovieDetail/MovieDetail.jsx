import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Grid, Row, Col } from 'react-flexbox-grid'
import Button from 'antd/lib/button'
import 'antd/lib/button/style/css'
import GoBackImage from 'assets/icons/icon-arrow-grey.svg'
import ImageNotFound from 'assets/search/movie-card-image-not-found.gif'
import LogoIMDB from 'assets/logos/logo-imdb.svg'
import LogoRottenTomatoes from 'assets/logos/logo-rotten-tomatoes.svg'
import snakeCase from 'lodash/fp/snakeCase'
import { fetchMovie, fetchMovieSuccess as clearMovie, cancelGetMovieRequest } from 'ducks/movies'

import './MovieDetail.less'
import { toggleMovieFavourite } from '../../ducks/movies'

const RATINGS_ICONS = {
    'Internet Movie Database': LogoIMDB,
    'Rotten Tomatoes': LogoRottenTomatoes
}

class MovieDetail extends Component {
    static propTypes = {
        movieError: PropTypes.bool,
        movieDetail: PropTypes.object,
        match: PropTypes.object,
        isFetching: PropTypes.bool,

        fetchMovie: PropTypes.func,
        clearMovie: PropTypes.func,
        cancelGetMovieRequest: PropTypes.func,

        markedAsfavourite: PropTypes.bool,
        toggleMovieFavourite: PropTypes.func,

        intl: intlShape.isRequired
    }

    state = {
        imgLoaded: false,
        imgError: false
    }

    componentWillMount() {
        const {
            fetchMovie, // eslint-disable-line no-shadow
            match: { params: { movieId } }
        } = this.props

        fetchMovie( movieId )
    }

    componentWillUnmount() {
        const { clearMovie, cancelGetMovieRequest } = this.props // eslint-disable-line no-shadow

        cancelGetMovieRequest()
        clearMovie()
    }

    render() {
        const {
            movieDetail: {
                imdbID,
                Title,
                Ratings,
                Plot,
                Poster,
                Actors,
                Director,
                Genre,
                Year,
                Runtime,
                Rated
            },
            intl: {
                messages: {
                    movieDetailGoBackImageAlt
                }
            },
            movieError,
            isFetching,
            markedAsfavourite,
            toggleMovieFavourite // eslint-disable-line no-shadow
        } = this.props

        const {
            imgLoaded,
            imgError
        } = this.state

        return (
            <Grid
                fluid
                className="movie-detail"
            >
                <Row>
                    <Col
                        md={12}
                        className="navigation"
                    >
                        <Link
                            to="/"
                        >
                            <img
                                src={GoBackImage}
                                alt={movieDetailGoBackImageAlt}
                            />
                        </Link>
                    </Col>
                </Row>
                {
                    isFetching || movieError ? (
                        <FormattedMessage
                            id={
                                isFetching ? 'movieDetailMovieLoading' : 'movieDetailMovieNotFound'
                            }
                        />
                    ) : (
                        <Row>
                            <Col
                                md={5}
                                className="info"
                            >
                                <Col
                                    md={12}
                                    className="brief-info"
                                >
                                    <span>
                                        {Runtime}
                                    </span>
                                ·
                                    <span>
                                        {Year}
                                    </span>
                                ·
                                    <span>
                                        {Rated}
                                    </span>
                                </Col>
                                <Col
                                    md={12}
                                    className="title"
                                >
                                    <h1>
                                        {Title}
                                    </h1>
                                </Col>
                                <Col
                                    md={12}
                                    className="ratings"
                                >
                                    {
                                        Ratings && Ratings.map(
                                            ( {
                                                Source,
                                                Value
                                            } ) => (
                                                RATINGS_ICONS[Source] ? (
                                                    <div
                                                        key={`${Source}-${Value}`}
                                                    >
                                                        <p
                                                            className={`rating-${snakeCase( Source )}`}
                                                        >
                                                            <img
                                                                src={RATINGS_ICONS[Source]}
                                                                alt={Source}
                                                            />
                                                        </p>
                                                        <p>
                                                            {Value}
                                                        </p>
                                                    </div>
                                                ) : null
                                            )
                                        )
                                    }
                                    <div>
                                        <Button
                                            icon={markedAsfavourite ? 'heart' : 'heart-o'}
                                            onClick={() => toggleMovieFavourite( imdbID )}
                                            type="danger"
                                        >
                                            <FormattedMessage
                                                id="movieDetailMarkAsFavourite"
                                            />
                                        </Button>
                                    </div>
                                </Col>
                                <Col
                                    md={12}
                                    className="plot"
                                >
                                    <h4>
                                        <FormattedMessage
                                            id="movieDetailPlot"
                                        />
                                    </h4>
                                    <p>
                                        {Plot}
                                    </p>
                                </Col>
                                <Col
                                    md={12}
                                >
                                    <Row>
                                        <Col
                                            md={4}
                                            className="cast"
                                        >
                                            <h4>
                                                <FormattedMessage
                                                    id="movieDetailCast"
                                                />
                                            </h4>
                                            <p>
                                                {Actors}
                                            </p>
                                        </Col>
                                        <Col
                                            md={4}
                                            className="genre"
                                        >
                                            <h4>
                                                <FormattedMessage
                                                    id="movieDetailGenre"
                                                />
                                            </h4>
                                            <p>
                                                {Genre}
                                            </p>
                                        </Col>
                                        <Col
                                            md={4}
                                            className="director"
                                        >
                                            <h4>
                                                <FormattedMessage
                                                    id="movieDetailDirector"
                                                />
                                            </h4>
                                            <p>
                                                {Director}
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                            <Col
                                md={2}
                            />
                            <Col
                                md={5}
                            >
                                <img
                                    src={(
                                        imgLoaded && !imgError ? Poster : ( // eslint-disable-line no-nested-ternary
                                            imgError ? ImageNotFound : Poster
                                        )
                                    )}
                                    onLoad={() => this.setState( { imgLoaded: true } )}
                                    onError={() => this.setState( { imgError: true } )}
                                    alt={Title}
                                    style={{
                                        width: '100%',
                                        maxWidth: '100%'
                                    }}
                                />
                            </Col>
                        </Row>
                    )
                }
            </Grid>
        )
    }
}

export default
connect(
    ( {
        movies: {
            detail,
            detailError,
            isFetching,
            favourites
        }
    }, {
        match: {
            params: {
                movieId
            }
        }
    } ) => ( {
        movieDetail: detail,
        movieError: !!Object.keys( detailError ).length,
        isFetching,
        markedAsfavourite: favourites[movieId]
    } ),
    dispatch => ( {
        fetchMovie: ( ...args ) => dispatch( fetchMovie( ...args ) ),
        clearMovie: () => dispatch( clearMovie( {} ) ),
        cancelGetMovieRequest: () => dispatch( cancelGetMovieRequest() ),
        toggleMovieFavourite: ( ...args ) => dispatch( toggleMovieFavourite( ...args ) )
    } )
)( injectIntl( MovieDetail ) )
