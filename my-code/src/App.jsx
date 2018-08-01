import React, { Component } from 'react'
import {
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import { MovieSearch, MovieDetail } from 'screens'
import './App.css'

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    Header
                </header>
                <section>
                    <Switch>
                        <Route exact path="/movies" component={MovieSearch} />
                        <Route path="/movie/:id" component={MovieDetail} />
                        <Redirect to="/movies" />
                    </Switch>
                </section>
            </div>
        )
    }
}

export default App
