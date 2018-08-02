import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-flexbox-grid'

import { fetchMovie, cancelGetMovieRequest } from 'ducks/movies'

class MovieDetail extends Component {
    static propTypes = {
        movieError: PropTypes.object,
        movieDetail: PropTypes.object,
        match: PropTypes.object,
        isFetching: PropTypes.bool,

        fetchMovie: PropTypes.func,
        cancelGetMovieRequest: PropTypes.func
    }

    componentWillMount() {
        const {
            fetchMovie,
            match: { params: { movieId } }
        } = this.props

        fetchMovie( movieId )
    }

    componentWillUnmount() {
        const { cancelGetMovieRequest } = this.props

        cancelGetMovieRequest()
    }

    render() {
        const {
            isFetching,
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
            fetchMovie,
            movieError
        } = this.props

        return (
            <Grid fluid>
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
                                            <div>
                                                {Source}
                                                <br />
                                                {Value}
                                            </div>
                                        )
                                    )
                                }
                            </Row>
                        </Col>
                        <Col
                            md={12}
                        >
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
                                        Cast
                                    </h4>
                                    <p>
                                        {Actors}
                                    </p>
                                </Col>
                                <Col
                                    md={4}
                                >
                                    <h4>
                                        Genre
                                    </h4>
                                    <p>
                                        {Genre}
                                    </p>
                                </Col>
                                <Col
                                    md={4}
                                >
                                    <h4>
                                        Director
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
                            src={Poster}
                            alt={Title}
                            style={{
                                width: '100%',
                                maxWidth: '100%'
                            }}
                        />
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default
connect(
    ( {
        movies: {
            detail,
            error,
            isFetching
        }
    } ) => ( {
        movieDetail: detail,
        movieError: error,
        isFetching
    } ),
    dispatch => ( {
        fetchMovie: ( ...args ) => dispatch( fetchMovie( ...args ) ),
        cancelGetMovieRequest: () => dispatch( cancelGetMovieRequest() )
    } )
)( MovieDetail )
