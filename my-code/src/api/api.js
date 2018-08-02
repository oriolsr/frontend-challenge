import { ajax } from 'rxjs/ajax'
import { stringify } from 'query-string'
import { RFC } from './errors'

const defaultQueryParams = {
    apikey: '42a1d080'
}

class Api {
    get( { uri = '', params = {}, headers = {} } ) {
        return ajax.getJSON(
            `${uri}?${stringify( { ...defaultQueryParams, ...params } )}`,
            headers
        )
    }

    rxError( action, { status, request: { url: uri, method, ...request }, ...response } ) {
        return {
            status,
            method,
            uri,
            message: ( RFC[status.toString()] ? `${action} - ${RFC[status.toString()]}` : `${RFC['500']}*` ),
            response: {
                ...response,
                request: {
                    ...request,
                    url: uri,
                    method
                },
                status
            }
        }
    }
}

export default new Api()
