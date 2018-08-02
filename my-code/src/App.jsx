import React, { Component } from 'react'
import {
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { MovieSearch, MovieDetail } from 'screens'
import logo from 'assets/logos/logo.png'
import './App.css'

class App extends Component {
    render() {
        return (
            <Grid
                fluid
                className="app"
            >
                <Row>
                    <Col
                        md={1}
                    />
                    <Col
                        md={10}
                    >
                        <Row>
                            <Col
                                md={12}
                                className="header"
                            >
                                <img
                                    src={logo}
                                    className="logo"
                                    alt={'What\'s in'}
                                />
                            </Col>
                            <Col
                                md={12}
                                className="content"
                            >
                                <section>
                                    <Switch>
                                        <Route exact path="/movies" component={MovieSearch} />
                                        <Route path="/movie/:movieId" component={MovieDetail} />
                                        <Redirect to="/movies" />
                                    </Switch>
                                </section>
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        md={1}
                    />
                </Row>
            </Grid>
        )
    }
}

export default App
