import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Grid, Row, Col } from 'react-flexbox-grid'
import GoBackImage from 'assets/icons/icon-arrow-grey.svg'
import ImageNotFound from 'assets/search/movie-card-image-not-found.gif'
import { fetchMovie, fetchMovieSuccess as clearMovie, cancelGetMovieRequest } from 'ducks/movies'

import './MovieDetail.less'

class MovieDetail extends Component {
    static propTypes = {
        movieError: PropTypes.bool,
        movieDetail: PropTypes.object,
        match: PropTypes.object,
        isFetching: PropTypes.bool,

        fetchMovie: PropTypes.func,
        clearMovie: PropTypes.func,
        cancelGetMovieRequest: PropTypes.func,

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
            isFetching
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
                            >
                                <Col
                                    md={12}
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
                                >
                                    <h1>
                                        {Title}
                                    </h1>
                                </Col>
                                <Col
                                    md={12}
                                >
                                    <Row>
                                        {
                                            Ratings && Ratings.map(
                                                ( {
                                                    Source,
                                                    Value
                                                } ) => (
                                                    <div
                                                        key={`${Source}-${Value}`}
                                                    >
                                                        <span>
                                                            {Source}
                                                        </span>
                                                        <br />
                                                        <span>
                                                            {Value}
                                                        </span>
                                                    </div>
                                                )
                                            )
                                        }
                                    </Row>
                                </Col>
                                <Col
                                    md={12}
                                >
                                    <FormattedMessage
                                        id="movieDetailPlot"
                                    />
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
            isFetching
        }
    } ) => ( {
        movieDetail: detail,
        movieError: !!Object.keys( detailError ).length,
        isFetching
    } ),
    dispatch => ( {
        fetchMovie: ( ...args ) => dispatch( fetchMovie( ...args ) ),
        clearMovie: () => dispatch( clearMovie( {} ) ),
        cancelGetMovieRequest: () => dispatch( cancelGetMovieRequest() )
    } )
)( injectIntl( MovieDetail ) )
