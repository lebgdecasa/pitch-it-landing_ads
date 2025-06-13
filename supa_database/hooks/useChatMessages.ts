// supa_database/hooks/useChatMessages.ts
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { ChatMessage } from '../types/database';

export function useChatMessages(projectId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [projectId]);

  const sendMessage = async (message: string, personaId?: string) => {
    if (!projectId) return { data: null, error: 'No project ID' };

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        project_id: projectId,
        persona_id: personaId,
        sender_type: 'user',
        message: message
      })
      .select()
      .single();

    if (!error && data) {
      setMessages(prev => [...prev, data]);
    }

    return { data, error };
  };

  return { messages, loading, sendMessage };
}
