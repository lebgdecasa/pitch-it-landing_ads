// supa_database/hooks/useChatMessages.ts
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DBChatMessage {
  id: string;
  project_id: string;
  content: string;
  sender: string;
  sender_type: 'user' | 'persona';
  persona_id?: string;
  created_at: string;
  updated_at: string;
  mentions?: string[] | null;
}

export function useChatMessages(projectId: string | undefined) {
  const [messages, setMessages] = useState<DBChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (error) throw new Error(error.message);
        setMessages(data || []);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel(`chat_messages:project_id=eq.${projectId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `project_id=eq.${projectId}` 
        }, 
        (payload) => {
          // Add the new message to state
          setMessages(prev => [...prev, payload.new as DBChatMessage]);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [projectId]);

  // Function to send a message
  const sendMessage = async (
    content: string, 
    persona_id: string | null,
    sender_type: 'user' | 'persona',
    sender: string,
    mentions?: string[]
  ) => {
    if (!projectId) return { error: new Error('No project ID provided') };

    try {
      const newMessage = {
        project_id: projectId,
        content,
        persona_id: persona_id || null,
        sender_type,
        sender,
        mentions: mentions || []
      };

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (err: any) {
      console.error('Error sending message:', err);
      return { error: err };
    }
  };

  return { messages, loading, error, sendMessage };
}
