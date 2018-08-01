import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import './index.css'
import App from './App'
import { store, persistor } from 'store/store'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
    (
        <Provider
            store={store}
        >
            <IntlProvider
                locale="en"
            >
                <PersistGate
                    persistor={persistor}
                >
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </PersistGate>
            </IntlProvider>
        </Provider>
    ),
    document.getElementById( 'root' )
)

registerServiceWorker()
