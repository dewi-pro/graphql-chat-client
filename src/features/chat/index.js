import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { MESSAGES } from './queries'
import { MESSAGES_SUBSCRIPTION } from './subscription'
import { MessageList } from './components/MessageList'

const handleNewMessage = (subscribeToMore) => {
  subscribeToMore({
    document: MESSAGES_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev
      const newFeedItem = subscriptionData.data.messageSent

      return {
        messages: [...prev.messages, newFeedItem]
      }
    }
  })
}

export const Chat = () => {
  const { subscribeToMore, ...result } = useQuery(MESSAGES)

  return (
    <MessageList
      {...result}
      subscribeToNewMessages={() => handleNewMessage(subscribeToMore)}
    />
  )
}