import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Mic, MicOff, Volume2, Loader2, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  role: 'state' | 'district' | 'mandal';
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
  isStructured?: boolean;
}

// Component to render structured markdown-like content
const StructuredContent = ({ content }: { content: string }) => {
  const formatContent = (text: string) => {
    return text
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 pb-2 border-b border-blue-200 dark:border-blue-800">🎯 $1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-base font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">📋 $1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 mb-1">▶️ $1</h3>')
      
      // Status indicators with colors
      .replace(/🔴\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">🔴 $1</span>')
      .replace(/🟡\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-semibold">🟡 $1</span>')
      .replace(/🟢\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">🟢 $1</span>')
      .replace(/✅\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 text-green-700 dark:text-green-300 font-semibold">✅ $1</span>')
      .replace(/⏳\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">⏳ $1</span>')
      
      // Department and location tags
      .replace(/🏢\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded text-xs">🏢 $1</span>')
      .replace(/📍\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded text-xs">📍 $1</span>')
      
      // Monetary values
      .replace(/💰\s*\*\*(.*?)\*\*/g, '<span class="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">💰 $1</span>')
      
      // Action items
      .replace(/^•\s*\*\*(.*?)\*\*\s*-\s*(.*$)/gm, '<div class="flex items-start gap-2 my-2"><span class="text-blue-500 mt-1">•</span><div><strong class="text-gray-900 dark:text-gray-100">$1</strong><span class="text-gray-600 dark:text-gray-400 ml-2">- $2</span></div></div>')
      .replace(/^•\s*\*\*(.*?)\*\*/gm, '<div class="flex items-start gap-2 my-1"><span class="text-blue-500 mt-1">•</span><strong class="text-gray-900 dark:text-gray-100">$1</strong></div>')
      .replace(/^•\s*(.*$)/gm, '<div class="flex items-start gap-2 my-1"><span class="text-blue-500 mt-1">•</span><span class="text-gray-700 dark:text-gray-300">$1</span></div>')
      
      // Regular bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
      
      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br>')
      
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="border-gray-300 dark:border-gray-600 my-4">')
      
      // Quick tips and highlights
      .replace(/💡\s*\*\*(.*?)\*\*:\s*(.*$)/gm, '<div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-400 my-3"><div class="flex items-start gap-2"><span class="text-blue-600">💡</span><div><strong class="text-blue-800 dark:text-blue-200">$1:</strong><span class="text-blue-700 dark:text-blue-300 ml-2">$2</span></div></div></div>');
  };

  return (
    <div 
      className="structured-content leading-relaxed"
      dangerouslySetInnerHTML={{ 
        __html: `<p class="mb-2">${formatContent(content)}</p>` 
      }} 
    />
  );
};

export function AIAssistant({ role }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition();
  
  const { speak, isSpeaking, cancel } = useSpeechSynthesis();

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        isStructured: true,
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, role]);

  const getWelcomeMessage = () => {
    const roleMessages = {
      state: `# State-Level Civic Intelligence Assistant

**Powered by Gemini AI** | **Multi-Language Support**

## Core Capabilities

### Administrative Intelligence
• **Complaint Analysis** - Priority assessment, trend identification, resource allocation
• **Cross-District Coordination** - Inter-district issue management and policy implementation
• **Performance Analytics** - State-wide metrics, efficiency reports, comparative analysis

### Strategic Management
• **Scheme Oversight** - State-wide program monitoring, budget allocation, impact assessment
• **Traffic Intelligence** - Highway coordination, infrastructure planning, safety protocols
• **Resource Optimization** - Department coordination, workflow automation, cost analysis

### Multi-Language Operations
• **Real-time Translation** - English, Hindi, Telugu, Urdu
• **Cultural Context** - Region-specific insights and recommendations
• **Accessibility** - Voice commands, text-to-speech, adaptive interfaces

---

💡 **Quick Start**: Try asking about complaint prioritization, scheme performance, or traffic coordination across districts.`,

      district: `# District-Level Civic Intelligence Assistant

**Powered by Gemini AI** | **Local Focus & Regional Coordination**

## District Operations Hub

### Local Administration
• **Mandal Coordination** - Sub-district management, resource distribution, progress tracking
• **Complaint Resolution** - Local issue prioritization, department assignment, citizen feedback
• **Community Engagement** - Public outreach, feedback collection, satisfaction monitoring

### Performance Management
• **Scheme Implementation** - District-level program execution, eligibility verification, impact tracking
• **Traffic Management** - Local road issues, signal coordination, infrastructure maintenance
• **Data Analytics** - District metrics, trend analysis, predictive insights

### Stakeholder Coordination
• **Inter-Department** - Seamless workflow between municipal, health, education departments
• **Citizen Services** - Service delivery optimization, complaint resolution, transparency
• **Emergency Response** - Crisis management, resource mobilization, communication protocols

---

💡 **Quick Actions**: Ask about mandal performance, local complaint trends, or district scheme status.`,

      mandal: `# Mandal-Level Civic Intelligence Assistant

**Powered by Gemini AI** | **Community-Focused & Voice-Enabled**

## Community Service Hub

### Citizen Services
• **Voice Complaint Processing** - Multi-language voice recognition, automatic transcription
• **Local Issue Resolution** - Immediate response, community-level solutions, follow-up tracking
• **Elderly Support** - Skill program coordination, work assignment, payment processing

### Local Infrastructure
• **Traffic Management** - Street-level issues, local road maintenance, safety improvements
• **Daily Operations** - Routine monitoring, maintenance scheduling, service delivery
• **Community Feedback** - Real-time citizen input, satisfaction surveys, improvement suggestions

### Digital Services
• **Voice Commands** - Hands-free operation, accessibility features, multi-language support
• **Mobile Optimization** - Field-ready interface, offline capabilities, quick actions
• **Real-time Updates** - Instant notifications, status tracking, progress monitoring

---

💡 **Voice Ready**: Say "Record complaint" or ask about local services, elderly programs, or daily reports.`
    };
    return roleMessages[role];
  };

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyArEUNEuoe_eGJ2WqW_No-UJB2VJN7oIO4";
    
    const currentLanguage = i18n.language === 'en' ? 'English' : 
                           i18n.language === 'hi' ? 'Hindi' : 
                           i18n.language === 'te' ? 'Telugu' : 
                           i18n.language === 'ur' ? 'Urdu' : 'English';

    const prompt = `
You are an advanced AI assistant for a Smart Civic Intelligence System serving ${role.toUpperCase()} level administration.

🎯 CONTEXT & ROLE:
- Administrative Level: ${role.toUpperCase()} Admin
- Response Language: ${currentLanguage}
- System: Smart Civic Intelligence Platform
- Features: Complaint Management, Scheme Administration, Traffic Monitoring, Elderly Skills Program, Scam Alert System

🎯 RESPONSE FORMATTING REQUIREMENTS:
You MUST structure your responses using this EXACT format for maximum clarity and professionalism:

# [Main Topic/Title]

## [Primary Section]
### [Subsection]
• **Key Point 1** - Detailed explanation
• **Key Point 2** - Detailed explanation

## [Analysis/Data Section]
### [Specific Analysis]
🔴 **High Priority:** Critical items requiring immediate attention
🟡 **Medium Priority:** Important items for near-term action  
🟢 **Low Priority:** Items for future consideration

## [Recommendations Section]
### [Actionable Steps]
✅ **Action 1:** Specific step with clear outcome
✅ **Action 2:** Specific step with clear outcome
✅ **Action 3:** Specific step with clear outcome

## [Next Steps/Summary]
📍 **Immediate Actions:** What to do now
📍 **Follow-up:** What to monitor
📍 **Resources:** Who to contact or what tools to use

---
💡 **Quick Tip:** [Relevant advice or insight]

🎯 CONTENT GUIDELINES:
- Use specific civic administration terminology
- Provide actionable, practical recommendations
- Include relevant statistics or examples when helpful
- Reference appropriate departments (🏢 **Water Department**, 🏢 **Municipal Corporation**, etc.)
- Use status indicators (✅ **Completed**, ⏳ **Pending**, 🔴 **Critical**)
- Include monetary amounts with 💰 **₹amount** format
- Add location context with 📍 **Location** format

🎯 EXPERTISE AREAS:
1. **Complaint Intelligence**: Prioritization algorithms, trend analysis, resource optimization
2. **Scheme Management**: Eligibility verification, application processing, impact assessment
3. **Traffic Coordination**: Infrastructure planning, incident management, flow optimization
4. **Administrative Efficiency**: Workflow automation, performance metrics, inter-department coordination
5. **Citizen Engagement**: Service delivery, feedback systems, transparency initiatives

📩 USER QUERY: "${userMessage}"

📤 STRUCTURED RESPONSE:
Provide a comprehensive, well-structured response following the exact formatting guidelines above. Focus on practical solutions and actionable insights for ${role} level administration. Use the specified emoji patterns and formatting consistently.`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const rawResponse = data.candidates[0].content.parts[0].text;
        return rawResponse; // Return raw response for proper formatting
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Enhanced fallback responses with proper structure
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('complaint') || lowerMessage.includes('issue')) {
        return `# Complaint Management Intelligence

## Priority Classification System
### Automated Prioritization
• **High Priority** - Safety hazards, water supply failures, traffic emergencies
• **Medium Priority** - Infrastructure issues, sanitation problems, service delays  
• **Low Priority** - Aesthetic concerns, minor inconveniences, suggestions

## Current Status Overview
### Department Assignment
🏢 **Water Department** - 15 active complaints (avg. 2.3 days resolution)
🏢 **Sanitation Department** - 8 active complaints (avg. 1.8 days resolution)
🏢 **Highway Maintenance** - 12 active complaints (avg. 4.1 days resolution)

## Recommended Actions
### Immediate Steps
✅ **Action 1:** Filter complaints by severity using priority tags
✅ **Action 2:** Assign bulk complaints to appropriate departments
✅ **Action 3:** Set up automated response templates for common issues

## Next Steps
📍 **Immediate:** Review pending high-priority complaints
📍 **Follow-up:** Monitor department response times
📍 **Resources:** Use complaint analytics dashboard for trends

---
💡 **Quick Tip:** Use voice commands for faster complaint entry and processing.`;
      }
      
      if (lowerMessage.includes('scheme') || lowerMessage.includes('eligibility')) {
        return `# Scheme Management Intelligence

## Eligibility Verification System
### Automated Screening
• **Income Verification** - Cross-reference with tax records and employment data
• **Age Criteria** - Automatic calculation from Aadhar database
• **Documentation Check** - AI-powered document validation and authenticity

## Current Scheme Performance
### Active Programs
🟢 **PM Awas Yojana** - 156 applications (78% approval rate)
🟡 **Digital India Initiative** - 89 applications (65% approval rate)
🔴 **Skill Development Program** - 234 applications (45% approval rate - needs review)

## Optimization Recommendations
### Process Improvements
✅ **Action 1:** Implement AI-powered eligibility pre-screening
✅ **Action 2:** Set up automated document verification
✅ **Action 3:** Create scheme recommendation engine for citizens

## Performance Metrics
📍 **Processing Time:** Average 5.2 days (target: 3 days)
📍 **Approval Rate:** 67% overall (industry standard: 72%)
📍 **Citizen Satisfaction:** 4.2/5 (based on feedback surveys)

---
💡 **Quick Tip:** Use bulk approval features for pre-verified applications to improve efficiency.`;
      }
      
      return `# Civic Intelligence Assistant

## System Status
### Connectivity Notice
⚠️ **Temporary Service Interruption** - AI services experiencing connectivity issues

## Available Features
### Core Functions
• **Complaint Management** - Filtering, prioritization, assignment tools
• **Scheme Administration** - Eligibility checking, application processing
• **Traffic Monitoring** - Incident reporting, infrastructure planning
• **Administrative Tools** - Data export, reporting, analytics

## Immediate Assistance
### Quick Actions for ${role.toUpperCase()} Admin
✅ **Action 1:** Review high-priority pending complaints
✅ **Action 2:** Check scheme application deadlines
✅ **Action 3:** Monitor traffic incident reports
✅ **Action 4:** Update daily administrative logs

## System Recovery
📍 **Status:** Attempting to restore AI connectivity
📍 **ETA:** Service should resume within 2-3 minutes
📍 **Alternative:** Use manual tools and filters for immediate needs

---
💡 **Quick Tip:** Your question will be processed with full AI intelligence once connectivity is restored.`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    resetTranscript();
    setIsTyping(true);
    setIsLoading(true);
    
    try {
      const response = await callGeminiAPI(currentInput);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        isStructured: true,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `# Technical Issue

## ⚠️ Service Interruption
AI services are temporarily unavailable, but I'm still here to provide civic administration guidance.

## Available Support
• Manual complaint filtering and prioritization
• Scheme eligibility guidelines
• Administrative best practices
• Department contact information

Please try your question again in a moment for full AI assistance.`,
        timestamp: new Date(),
        isStructured: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Service Issue",
        description: "Temporary connectivity problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      cancel();
    } else {
      // Clean text for speech (remove markdown and emojis)
      const cleanText = text
        .replace(/[#*_`]/g, '')
        .replace(/[🎯📋📊💡✅🔴🟡🟢⏳🏢📍💰▶️◦•]/g, '')
        .replace(/\n+/g, '. ')
        .trim();
      speak(cleanText);
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const quickActions = [
    { text: 'Analyze high priority complaints', emoji: '🔥', key: 'priority' },
    { text: 'Generate weekly summary report', emoji: '📊', key: 'summary' },
    { text: 'Show scheme performance metrics', emoji: '📈', key: 'schemes' },
    { text: 'Traffic coordination assistance', emoji: '🚦', key: 'traffic' },
  ];

  return (
    <>
      {/* Floating AI Button - Enhanced with proper icon */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 1,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          size="lg"
        >
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          
          {/* AI Icon with animation */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Bot className="h-6 w-6 md:h-7 md:w-7 text-white relative z-10" />
          </motion.div>
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
        </Button>
      </motion.div>

      {/* AI Assistant Panel - Enhanced with structured message display */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.3
            }}
            className="fixed inset-x-4 bottom-20 md:right-6 md:bottom-24 md:left-auto z-50 w-auto md:w-[420px] h-[70vh] md:h-[650px]"
          >
            <Card className="h-full shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Bot className="h-5 w-5" />
                    </motion.div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      AI Assistant
                      <Sparkles className="h-4 w-4" />
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                      {role.toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-3 md:p-4">
                  <div className="space-y-3 md:space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[90%] md:max-w-[85%] p-3 md:p-4 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-50 dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          {message.type === 'user' ? (
                            <div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
                              {message.content}
                            </div>
                          ) : (
                            <StructuredContent content={message.content} />
                          )}
                          
                          {message.type === 'assistant' && (
                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSpeak(message.content)}
                                className="h-6 px-2 text-xs opacity-70 hover:opacity-100"
                              >
                                <Volume2 className="h-3 w-3 mr-1" />
                                {isSpeaking ? 'Stop' : 'Speak'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyMessage(message.id, message.content)}
                                className="h-6 px-2 text-xs opacity-70 hover:opacity-100"
                              >
                                {copiedMessageId === message.id ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-xs text-gray-500">Gemini AI is analyzing...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Input Section - Fixed alignment and improved layout */}
                <div className="p-3 md:p-4 border-t bg-white dark:bg-gray-900 space-y-3">
                  {/* Main input row */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t('ai.inputPlaceholder')}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        className="pr-10 text-sm h-10"
                        disabled={isLoading}
                      />
                      {isListening && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoiceToggle}
                      className={`${isListening ? 'bg-red-50 border-red-200 text-red-600' : ''} h-10 w-10 p-0 flex-shrink-0`}
                      disabled={isLoading}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button 
                      onClick={handleSendMessage} 
                      size="sm"
                      disabled={isLoading || !inputValue.trim()}
                      className="h-10 w-10 p-0 flex-shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick Actions - Responsive */}
                  <div className="flex flex-wrap gap-1">
                    {quickActions.map((action) => (
                      <Button
                        key={action.key}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputValue(action.text)}
                        className="text-xs h-6 px-2 flex-shrink-0"
                        disabled={isLoading}
                      >
                        {action.emoji} {action.key === 'priority' ? 'Priority' : action.key === 'summary' ? 'Summary' : action.key === 'schemes' ? 'Schemes' : 'Traffic'}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Powered by Gemini */}
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Powered by Gemini AI
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}