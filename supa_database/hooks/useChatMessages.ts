// supa_database/hooks/useChatMessages.ts
import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { ChatMessage } from '../types/database'

export const useChatMessages = (projectId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchMessages()
      subscribeToMessages()
    }
  }, [projectId])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`chat_messages:project_id=eq.${projectId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages', filter: `project_id=eq.${projectId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as ChatMessage])
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(m => m.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new as ChatMessage : m))
          }
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  const sendMessage = async (messageData: Omit<ChatMessage, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(messageData)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete message'
      setError(errorMsg)
      return { error: errorMsg }
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    refetch: fetchMessages
  }
}
