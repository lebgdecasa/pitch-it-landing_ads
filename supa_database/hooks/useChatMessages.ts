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
  const [hasMore, setHasMore] = useState(false);
  const initialLimit = 50; // Changed from 10 to 50
  const [page, setPage] = useState(1);
  
  // Function to fetch messages with pagination
  const fetchMessages = async (page = 1, limit = initialLimit) => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // First, count total messages to determine if there are more
      const { count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);
      
      // Then fetch the paginated messages
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }) // Newest first for pagination
        .range(from, to);
        
      if (error) throw error;
      
      const newMessages = data || [];
      newMessages.reverse(); // Reverse to get chronological order
      
      // Update state based on whether it's the first page or loading more
      if (page === 1) {
        setMessages(newMessages);
      } else {
        setMessages(prev => [...newMessages, ...prev]);
      }
      
      // Check if there are more messages to load
      setHasMore(count ? from + newMessages.length < count : false);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of messages
  useEffect(() => {
    if (projectId) {
      setPage(1);
      fetchMessages(1);
      
      // Set up real-time subscription for new messages
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

      // Clean up subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [projectId]);
  
  // Function to load more messages
  const loadMore = async () => {
    const nextPage = page + 1;
    await fetchMessages(nextPage);
    setPage(nextPage);
  };

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

      // Add the message to state immediately
      setMessages(prev => [...prev, optimisticMessage]);

      // Send to server
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (err) {
      console.error('Error sending message:', err);
      return { error: err as Error };
    }
  };

  return { messages, loading, hasMore, loadMore, sendMessage };
}
