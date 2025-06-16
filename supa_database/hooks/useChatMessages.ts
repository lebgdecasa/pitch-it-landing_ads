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

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`public:chat_messages:project_id=eq.${projectId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `project_id=eq.${projectId}`
        }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new as DBChatMessage]);
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  // Function to send a message with optimistic updates
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

      // Create a temporary message for optimistic UI updates
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: DBChatMessage = {
        id: tempId,
        project_id: projectId,
        content,
        persona_id: persona_id || undefined,
        sender_type,
        sender,
        mentions: mentions || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add the message to state immediately for a responsive UI
      setMessages(prev => [...prev, optimisticMessage]);

      // Send to server
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;

      // If successful server response and we're NOT using realtime, 
      // replace the optimistic message with the actual one
      // Note: With proper realtime setup, this replacement isn't necessary
      // as the subscription will add the real message
      return { data };
    } catch (err) {
      console.error('Error sending message:', err);
      return { error: err as Error };
    }
  };

  return { messages, loading, sendMessage };
}
