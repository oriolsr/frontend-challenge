import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from 'store/store'
import labels from 'i18n'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
    (
        <Provider // eslint-disable-line react/jsx-filename-extension
            store={store}
        >
            <IntlProvider
                locale="en"
                messages={labels}
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
