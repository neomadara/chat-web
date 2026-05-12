import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatRooms } from '../shared/hooks/chat/useChatRooms'
import { getSupabase } from '../lib/supabaseWeb'
import styles from './ChatScreen.module.css'

const FILTERS = ['Todos', 'Sin leer', 'Leídos']

export default function ChatScreen({ session }) {
  const navigate = useNavigate()
  const { data: chatrooms, isLoading } = useChatRooms(session)
  console.log('session uid:', session?.user?.id)
  console.log('chatrooms:', JSON.stringify(chatrooms))
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')

  const filtered = (chatrooms || []).filter(room => {
    const matchSearch = room.friend_name?.toLowerCase().includes(search.toLowerCase())
    if (filter === 'Sin leer') return matchSearch && room.unread_count > 0
    if (filter === 'Leídos') return matchSearch && room.unread_count === 0
    return matchSearch
  })

  const handleLogout = async () => {
    await getSupabase().auth.signOut()
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Mensajes</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Salir</button>
        </div>

        <input
          className={styles.search}
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className={styles.filters}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {isLoading ? (
            <div className={styles.center}>Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className={styles.center}>No hay conversaciones</div>
          ) : (
            filtered.map(room => (
              <div
                key={room.chatroom_id}
                className={styles.roomItem}
                onClick={() => navigate(`/chat/${room.friend_id}`, {
                  state: { friendName: room.friend_name }
                })}
              >
                <div className={styles.avatar}>
                  {room.friend_name?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.roomInfo}>
                  <div className={styles.roomHeader}>
                    <span className={styles.friendName}>{room.friend_name}</span>
                    {room.last_message_at && (
                      <span className={styles.time}>
                        {new Date(room.last_message_at).toLocaleTimeString('es-CL', {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  <div className={styles.roomFooter}>
                    <span className={styles.lastMessage}>
                      {room.last_message || 'Sin mensajes aún'}
                    </span>
                    {room.unread_count > 0 && (
                      <span className={styles.badge}>{room.unread_count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.welcome}>
        <span>💬</span>
        <p>Selecciona una conversación para comenzar</p>
      </div>
    </div>
  )
}