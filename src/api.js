import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_API_WS_URL,
  options: {
    reconnect: true,
    connectionParams: () => ({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    })
  }
})

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API_URL,
  // It is possible to set headers here too:
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

const link = split(({ query }) => {
  const definition = getMainDefinition(query)
  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation === 'subscription'
  )
},
  wsLink,
  httpLink
)

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})
