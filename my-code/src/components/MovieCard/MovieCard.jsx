import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Col } from 'react-flexbox-grid'
import Card from 'antd/lib/card'
import 'antd/lib/card/style/css'
import IconHeartGrey from 'assets/icons/icon-heart-white.svg'
import ImageNotFound from 'assets/search/movie-card-image-not-found.gif'
import { injectIntl, intlShape } from 'react-intl'

import './MovieCard.less'

class MovieCard extends Component {
    static propTypes = {
        Title: PropTypes.string,
        Poster: PropTypes.string,
        Year: PropTypes.string,
        imdbID: PropTypes.string,
        intl: intlShape.isRequired
    }

    state = {
        imgLoaded: false,
        imgError: false
    }

    render() {
        const {
            Title,
            Poster,
            Year,
            imdbID,
            intl: {
                messages: {
                    movieCardMarkAsFavouriteImageAlt
                }
            }
        } = this.props

        const {
            imgLoaded,
            imgError
        } = this.state


        return (
            <Col
                md={2}
                key={imdbID}
                className="movie-card"
            >
                <Card
                    hoverable
                    bordered={false}
                >
                    <Link
                        to={`/movie/${imdbID}`}
                    >
                        <div
                            className="keep-aspect-ratio"
                        />
                        <img
                            src={(
                                imgLoaded && !imgError ? Poster : ( // eslint-disable-line no-nested-ternary
                                    imgError ? ImageNotFound : Poster
                                )
                            )}
                            alt={Title}
                            onLoad={() => this.setState( { imgLoaded: true } )}
                            onError={() => this.setState( { imgError: true } )}
                            className="movie-image"
                        />
                        <div
                            className="hover"
                        >
                            <div>
                                <div
                                    className="header"
                                >
                                    <img // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, max-len
                                        src={IconHeartGrey}
                                        alt={movieCardMarkAsFavouriteImageAlt}
                                        onClick={e => e.preventDefault()}
                                    />
                                </div>
                                <div
                                    className="footer"
                                >
                                    <h3>
                                        {Title}
                                    </h3>
                                    <p>
                                        {Year}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </Card>
            </Col>
        )
    }
}

export default injectIntl( MovieCard )
