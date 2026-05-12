import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useChatMessages } from '../shared/hooks/chat/useChatMessages'
import { useSendMessage } from '../shared/hooks/chat/useSendMessage'
import { chatService } from '../shared/services/chatService'
import styles from './ChatRoomScreen.module.css'

const MAX_CHARS = 300

export default function ChatRoomScreen({ session }) {
  const { friendId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const friendName = location.state?.friendName || 'Chat'
  const messagesEndRef = useRef(null)
  const [text, setText] = useState('')
  const hasScrolledRef = useRef(false)

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useChatMessages(friendId, session)

  const { mutate: sendMessage, isPending } = useSendMessage()

  const allGroups = (data?.pages ? [...data.pages].reverse().flatMap(page => page.groups || []) : [])
  .reduce((acc, group) => {
    const last = acc[acc.length - 1]
    const groupDay = new Date(group.date_trunc).toDateString()
    const lastDay = last ? new Date(last.date_trunc).toDateString() : null

    if (last && groupDay === lastDay) {
      last.mensajes_list = [...last.mensajes_list, ...(group.mensajes_list || [])]
    } else {
      acc.push({
        ...group,
        mensajes_list: [...(group.mensajes_list || [])]
      })
    }

    return acc
  }, [])

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  useEffect(() => {
  if (allGroups.length && !hasScrolledRef.current) {
    hasScrolledRef.current = true
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }, 100)
  }
}, [allGroups.length])

  useEffect(() => {
    hasScrolledRef.current = false
  }, [friendId])

  const handleSend = useCallback(() => {
    if (!text.trim() || isPending || !friendId) return
    const mensajito = {
      remitente: session.user.id,
      destinatario: friendId,
      body: text.trim(),
      msg_type: 1,
      id_ref: null,
      msg_extra_data: {}
    }
    sendMessage(mensajito, { onSuccess: scrollToBottom })
    setText('')
  }, [text, isPending, friendId, session, sendMessage, scrollToBottom])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDelete = (messageId) => {
    if (window.confirm('¿Eliminar este mensaje?')) {
      chatService.deleteMessage(messageId)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.center}>Cargando mensajes...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>←</button>
        <div className={styles.avatar}>
          {friendName.charAt(0).toUpperCase()}
        </div>
        <span className={styles.headerName}>{friendName}</span>
      </div>

      <div className={styles.messages}>
        {hasNextPage && (
          <button
            className={styles.loadMoreBtn}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Cargando...' : '↑ Cargar mensajes anteriores'}
          </button>
        )}

        {allGroups.map((group, gIndex) => (
          <div key={`${group.date_trunc}_${gIndex}`}>
            <div className={styles.dateSeparator}>
              {new Date(group.date_trunc).toLocaleDateString('es-CL', {
                weekday: 'long', day: 'numeric', month: 'long'
              })}
            </div>
            {(group.mensajes_list || []).map(msg => {
              const isOwn = msg.remitente === session.user.id
              return (
                <div
                  key={msg.id}
                  className={`${styles.bubble} ${isOwn ? styles.own : styles.other}`}
                  onDoubleClick={() => isOwn && handleDelete(msg.id)}
                  title={isOwn ? 'Doble click para eliminar' : ''}
                >
                  <p className={styles.bubbleText}>{msg.body}</p>
                  <span className={styles.bubbleTime}>
                    {new Date(msg.created_at).toLocaleTimeString('es-CL', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                    {isOwn && (
                      <span className={styles.readStatus}>
                        {msg.is_leido ? ' ✓✓' : ' ✓'}
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <textarea
          className={styles.input}
          placeholder="Escribe un mensaje... (Enter para enviar)"
          value={text}
          onChange={e => e.target.value.length <= MAX_CHARS && setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        {text.length > 250 && (
          <span className={styles.counter}>{MAX_CHARS - text.length}</span>
        )}
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!text.trim() || isPending}
        >
          ➤
        </button>
      </div>
    </div>
  )
}