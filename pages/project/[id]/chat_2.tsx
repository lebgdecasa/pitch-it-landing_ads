import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/supa_database/components/AuthProvider'; // Corrected import path
import { createClient } from '@supabase/supabase-js';
import * as ga from '@/lib/ga';
import { GetServerSideProps } from 'next';
import { Send, AtSign, Users, Bot, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import ProjectLayout from '@/components/layout/ProjectLayout_2';
import { useChatMessages } from '@/supa_database/hooks/useChatMessages'; // Add this import
import { PersonaModal } from '@/components/client-components/persona/PersonaModal'; // Import PersonaModal
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


interface Persona {
  id: string;
  name: string;
  role: string;
  company?: string;
  description: string;
  pain_points?: string[];
  goals?: string[];
  demographics?: Record<string, any>;
  project_id: string;
  ai_generated?: boolean;
  created_at?: string;
  updated_at?: string;
  avatar_color?: string;
  prompt?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  sender_type: 'user' | 'persona';
  timestamp: Date;
  persona_id?: string;
  mentions?: string[];
}

interface ChatPageProps {
  project: any;
  projectId: string;
  initialPersonas: Persona[];
}

export default function ChatPage({ project, projectId: initialProjectId, initialPersonas }: ChatPageProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { id: queryProjectId } = router.query;
  const projectId = queryProjectId || initialProjectId;

  const { profile, loading: authLoading } = useAuthContext();

  useEffect(() => {
    ga.trackChatPageView();
  }, []);

  useEffect(() => {
    if (!authLoading && profile && projectId) {
      if (profile.subscription_tier === 'premium' || profile.subscription_tier === 'enterprise') {
        router.push(`/project/${projectId}/chat`);
      }
    }
  }, [authLoading, profile, router, projectId]);

  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [page, setPage] = useState(1); // Add this line to define the page state
  const {
    messages: dbMessages,
    loading: messagesLoading,
    hasMore,
    loadMore,
    sendMessage
  } = useChatMessages(projectId as string);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [currentUser] = useState(t('you')); // You can replace this with actual user context
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);

  // State for Persona Details Modal
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [selectedPersonaForModal, setSelectedPersonaForModal] = useState<Persona | null>(null);

  // Function to open persona details modal
  const handlePersonaClick = (persona: Persona) => {
    ga.trackChatInteraction(`viewed_persona_${persona.name}`);
    setSelectedPersonaForModal(persona);
    setIsPersonaModalOpen(true);
  };

  if (project && project.locked) {
    return (
      <ProjectLayout>
        <div className="p-4 md:p-6 max-w-7xl mx-auto text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">{t('project_locked_title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('project_locked_description')}
          </p>
          <Button asChild className="mt-4">
              <Link href={`/project/${project.id}`}>{t('back_to_project')}</Link>
          </Button>
        </div>
      </ProjectLayout>
    );
  }

  if (authLoading || !profile) {
    return <div>{t('loading_user_info')}</div>;
  }

  if (profile.subscription_tier === 'premium' || profile.subscription_tier === 'enterprise') {
    return <div>{t('redirecting_for_plan')}</div>;
  }

  // Colors for persona avatars
  const avatarColors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500',
    'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];

  useEffect(() => {
    // Assign avatar colors to personas
    const personasWithColors = personas.map((persona, index) => ({
      ...persona,
      avatar_color: avatarColors[index % avatarColors.length]
    }));
    setPersonas(personasWithColors);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update the extractMentions function to match first names
  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Get the mentioned name
      const mentionedName = match[1].toLowerCase();
      // Find personas whose name starts with the mentioned text
      const matchingPersonas = personas.filter(p =>
        p.name.toLowerCase().split(' ')[0] === mentionedName
      );

      if (matchingPersonas.length > 0) {
        // Add the full name of matching personas
        mentions.push(matchingPersonas[0].name.toLowerCase());
      }
    }

    return mentions;
  };



  // Update the getPersonaByName function to match first names
  const getPersonaByName = (name: string): Persona | undefined => {
    return personas.find(p =>
      p.name.toLowerCase().split(' ')[0] === name.toLowerCase() ||
      p.name.toLowerCase() === name.toLowerCase()
    );
  };

  const generatePersonaResponse = async (
    persona: Persona,
    userMessage: string,
    chatHistory: ChatMessage[],
    otherResponses: { persona: string; response: string }[] = []
  ): Promise<string> => {
    try {
      // Build context from all chat history
      // Remove the slice(-10) to include all loaded messages
      const recentHistory = chatHistory.map(msg =>
        `${msg.sender}: ${msg.content}`
      ).join('\n');

      // Build context from other personas' responses in this round
      const otherResponsesText = otherResponses.length > 0
        ? '\n\nOther team members have responded:\n' + otherResponses.map(r =>
            `${r.persona}: ${r.response}`
          ).join('\n')
        : '';

      // Build persona context
      const painPointsText = persona.pain_points && persona.pain_points.length > 0
        ? `\nPain Points: ${persona.pain_points.join(', ')}`
        : '';

      const goalsText = persona.goals && persona.goals.length > 0
        ? `\nGoals: ${persona.goals.join(', ')}`
        : '';

      const companyText = persona.company ? `\nCompany: ${persona.company}` : '';

      const demographicsText = persona.demographics && Object.keys(persona.demographics).length > 0
        ? `\nBackground: ${Object.entries(persona.demographics).map(([key, value]) => `${key}: ${value}`).join(', ')}`
        : '';

      // Project context - add project details to give personas more context
      const projectContext = `
Project Information:
Name: ${project.name}
Description: ${project.description || 'N/A'}
Industry: ${project.industry || 'N/A'}
Stage: ${project.stage || 'N/A'}
${project.overview ? `
Problem: ${project.overview.Problem || 'N/A'}
Solution: ${project.overview.Solution || 'N/A'}
Target Market: ${project.overview.Target_Market || 'N/A'}
Business Model: ${project.overview.Business_Model || 'N/A'}
Competition: ${project.overview.Competition || 'N/A'}
Unique Selling Point: ${project.overview.Unique_selling_point || 'N/A'}
Marketing Strategy: ${project.overview.Marketing_Strategy || 'N/A'}` : ''}`;

      const personaDefinition = persona.prompt
        ? persona.prompt
        : `You are ${persona.name}, a team member with the following characteristics:
Role: ${persona.role}${companyText}
Description: ${persona.description}${painPointsText}${goalsText}${demographicsText}`;

      const prompt = `${personaDefinition}

You are working on the following project:${projectContext}

Recent conversation history:
${recentHistory}

User just said: "${userMessage}"
${otherResponsesText}

Respond as ${persona.name} in character. Keep responses conversational, under 20 words, and true to your role and background. Consider your pain points and goals when responding. If other team members have already responded, acknowledge their input when relevant.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.5,
            topK: 1,
            topP: 1,
            maxOutputTokens: 200,
          }
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || t('thinking');
    } catch (error) {
      console.error('Error generating response:', error);
      return t('error_responding');
    }
  };

  // In your handleSendMessage function, update to show optimistic UI
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    ga.trackChatMessageSent();

    const mentions = extractMentions(inputMessage);
    setIsLoading(true);

    try {
      // Save user message to database - sendMessage now updates local state immediately
      const { data: userMessageData, error: userMessageError } = await sendMessage(
        inputMessage,
        null,
        'user',
        currentUser,
        mentions
      );

      if (userMessageError) {
        console.error('Error saving user message:', userMessageError);
        return;
      }

      setInputMessage('');

      let responsivePersonas: Persona[] = [];

      if (mentions.length > 0) {
        // Only mentioned personas should respond
        responsivePersonas = mentions
          .map(mention => getPersonaByName(mention))
          .filter(persona => persona !== undefined) as Persona[];
      } else {
        // All personas respond
        responsivePersonas = personas;
      }

      if (responsivePersonas.length === 0) {
        setIsLoading(false);
        return;
      }

      // Generate responses sequentially so later personas can consider earlier ones
      const personaResponses: { persona: string; response: string }[] = [];

      for (const persona of responsivePersonas) {
        const response = await generatePersonaResponse(
          persona,
          inputMessage,
          messages,
          personaResponses
        );

        personaResponses.push({ persona: persona.name, response });

        // Save persona message to database - sendMessage updates local state immediately
        await sendMessage(
          response,
          persona.id,
          'persona',
          persona.name,
          []
        );

        // Small delay between responses for better UX
        if (responsivePersonas.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Update the insertMention function to use first names
  const insertMention = (personaName: string) => {
    const firstName = personaName.split(' ')[0];
    const currentValue = inputMessage;
    const cursorPosition = inputRef.current?.selectionStart || 0;
    const beforeCursor = currentValue.substring(0, cursorPosition);
    const afterCursor = currentValue.substring(cursorPosition);

    setInputMessage(`${beforeCursor}@${firstName} ${afterCursor}`);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Update the message content display to highlight mentions
  const renderMessageWithMentions = (content: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      // Add the mention with blue styling
      parts.push(
        <span key={match.index} className="text-blue-300 font-medium">
          {match[0]}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last mention
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  // Convert DB messages to your ChatMessage format
  useEffect(() => {
    if (dbMessages) {
      const formattedMessages = dbMessages.map(dbMsg => ({
        id: dbMsg.id,
        content: dbMsg.content,
        sender: dbMsg.sender,
        sender_type: dbMsg.sender_type,
        timestamp: new Date(dbMsg.created_at),
        persona_id: dbMsg.persona_id,
        mentions: dbMsg.mentions as string[] | undefined
      }));
      setMessages(formattedMessages);
    }
  }, [dbMessages]);

  // Add an intersection observer to detect when the user scrolls to the top
  useEffect(() => {
    if (!messagesTopRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // When top is visible and we have more messages, show the load more button
        if (entries[0].isIntersecting) {
          // User has scrolled to the top
          // We'll handle loading with a button click instead of auto-loading
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(messagesTopRef.current);

    return () => {
      observer.disconnect();
    };
  }, [messagesTopRef, hasMore]);

  // Handle loading more messages
  const handleLoadMore = () => {
    if (hasMore) {
      loadMore();
    }
  };

  return (
    <><Head>
      <title>{t('chat_page_title', { projectName: project.name })}</title>
      <meta name="description" content={t('chat_page_description')} />
    </Head><ProjectLayout>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar with Personas */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center mb-2">

                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h1>
                  <p className="text-sm text-gray-500">{t('project_chat')}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="mr-2 h-4 w-4" />
                {t('team_members', { count: personas.length })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {personas.map((persona) => (
                <div key={persona.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handlePersonaClick(persona)}>
                  <div className={`w-10 h-10 rounded-full ${persona.avatar_color} flex items-center justify-center text-white font-medium text-sm`}>
                    {persona.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{persona.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{persona.description}</p>
                    {/* <p className="text-xs text-blue-600 mt-1 truncate">{persona.expertise}</p> */}
                  </div>
                </div>
              ))}

              {personas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                  <p className="text-sm">{t('no_team_members_found')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('team_collaboration')}</h2>
                <p className="text-sm text-gray-500">
                  {personas.length > 0 ? t('chat_with_ai_team') : t('add_team_members_to_chat')}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={`/project/${project.id}/index_2`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('back_to_project')}
                </Link>
              </Button>
            </div>


            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div ref={messagesTopRef} />
              {hasMore && (
                <div className="text-center">
                  <Button onClick={handleLoadMore} variant="outline" size="sm">
                    {messagesLoading ? t('loading_more') : t('load_more_messages')}
                  </Button>
                </div>
              )}
              {messages.length === 0 && !messagesLoading && (
                <div className="text-center py-12 text-gray-500">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Send className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('start_conversation_title')}</h3>
                  <p className="max-w-md mx-auto text-sm">
                    {t('start_conversation_description')}
                    {personas.length > 0 && ` ${t('mention_prompt')}`}
                  </p>
                </div>
              )}

              {messages.map((message) => {
                const persona = message.persona_id ? personas.find(p => p.id === message.persona_id) : null;
                const isUser = message.sender_type === 'user';

                return (
                  <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                      {!isUser && (
                        <div className={`w-8 h-8 rounded-full ${persona?.avatar_color || 'bg-gray-400'} flex items-center justify-center text-white text-xs font-medium`}>
                          {message.sender.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className={`px-4 py-2 rounded-lg ${isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'}`}>
                        {!isUser && (
                          <div className="text-xs font-medium text-gray-600 mb-1">{message.sender}</div>
                        )}
                        <div className="text-sm whitespace-pre-wrap">
                          {message.sender_type === 'user' ? renderMessageWithMentions(message.content) : message.content}
                        </div>
                        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                          {currentUser.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">{t('team_typing')}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {personas.length > 0 && (
              <div className="bg-white border-t border-gray-200 p-4">
                {/* Mentions dropdown */}
                {showMentions && (
                  <div className="mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {personas.map((persona) => (
                      <div
                        key={persona.id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => insertMention(persona.name)}
                      >
                        <div className={`w-6 h-6 rounded-full ${persona.avatar_color} flex items-center justify-center text-white text-xs font-medium`}>
                          {persona.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{persona.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end space-x-2">
                  <button
                    onClick={() => setShowMentions(!showMentions)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={t('mention_team_member_title')}
                  >
                    <AtSign className="h-5 w-5" />
                  </button>

                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('chat_placeholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={1}
                      style={{ minHeight: '42px', maxHeight: '120px' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      } } />
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  {t('chat_send_instruction')}
                </div>
              </div>
            )}
          </div>

          {/* Persona Details Modal using imported component */}
          {isPersonaModalOpen && selectedPersonaForModal && (
            <PersonaModal
              isOpen={isPersonaModalOpen}
              onClose={() => setIsPersonaModalOpen(false)}
              persona={{
                id: selectedPersonaForModal.id,
                name: selectedPersonaForModal.name,
                role: 'user', // Provide a default valid role for ChatPersona.role tag
                // avatarUrl can be omitted; PersonaModal handles placeholder if not present
              }}
              jobTitle={selectedPersonaForModal.role}
              needsDetails={selectedPersonaForModal.description}
              background={selectedPersonaForModal.demographics
                ? Object.entries(selectedPersonaForModal.demographics)
                  .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: ${String(value)}`)
                  .join('; ')
                : undefined}
              goals={selectedPersonaForModal.goals || []}
              challenges={selectedPersonaForModal.pain_points || []}
            />
          )}
        </div>
      </ProjectLayout></>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  // Create Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch the project from Supabase
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  // Handle errors or missing project
  if (projectError || !project) {
    console.error('Error fetching project:', projectError);
    return {
      notFound: true
    };
  }

  // Fetch personas for this project
  const { data: personas, error: personasError } = await supabase
    .from('personas')
    .select('*')
    .eq('project_id', id);

  if (personasError) {
    console.error('Error fetching personas:', personasError);
  }

  // Fetch initial chat messages - limit to most recent 50
  const { data: initialMessages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: true })
    .limit(50); // Changed from 10 to 50

  if (messagesError) {
    console.error('Error fetching chat messages:', messagesError);
  }

  const locale = context.locale ?? 'en';
  const translations = await serverSideTranslations(locale, ['common']);

  return {
    props: {
      project,
      projectId: id as string,
      ...translations,
      initialPersonas: personas || [],
      initialMessages: initialMessages || []
    }
  };
};
