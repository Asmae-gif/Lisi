import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  ChevronUp, 
  ChevronDown,
  Building2,
  FileText,
  Users,
  Award,
  Camera,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { getChatbotAnalytics, cleanupChatbotAnalytics } from './ChatbotAnalytics';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuickAction {
  id: string;
  text: string;
  icon: React.ReactNode;
  action: () => void;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis l\'assistant virtuel du Laboratoire LISI. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const analytics = getChatbotAnalytics();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback: (responseTime: number) => void) => {
    setIsTyping(true);
    const startTime = Date.now();
    setTimeout(() => {
      setIsTyping(false);
      const responseTime = Date.now() - startTime;
      callback(responseTime);
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, 'user');
    setInputValue('');

    // Simuler la réponse du bot avec tracking
    simulateTyping((responseTime) => {
      const response = generateBotResponse(userMessage);
      addMessage(response, 'bot');
      
      // Tracer l'interaction
      analytics.trackMessage(userMessage, response, responseTime);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Réponses basées sur les mots-clés
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return 'Bonjour ! Ravi de vous rencontrer. Je peux vous aider à découvrir notre laboratoire, nos projets, nos publications, ou répondre à vos questions. Que souhaitez-vous savoir ?';
    }

    if (lowerMessage.includes('laboratoire') || lowerMessage.includes('lisi') || lowerMessage.includes('qui êtes-vous')) {
      return 'Le Laboratoire LISI (Laboratoire d\'Informatique, Signaux et Systèmes) est un centre de recherche spécialisé dans l\'informatique, les signaux et les systèmes. Nous menons des projets innovants dans divers domaines technologiques.';
    }

    if (lowerMessage.includes('projet') || lowerMessage.includes('recherche')) {
      return 'Nous menons de nombreux projets dans différents domaines : finance, recherche, développement, formation et incubation. Vous pouvez consulter notre section "Projets" pour plus de détails sur nos activités actuelles.';
    }

    if (lowerMessage.includes('publication') || lowerMessage.includes('article')) {
      return 'Nos chercheurs publient régulièrement dans des revues scientifiques et participent à des conférences internationales. Consultez notre section "Publications" pour découvrir nos derniers travaux.';
    }

    if (lowerMessage.includes('membre') || lowerMessage.includes('équipe') || lowerMessage.includes('chercheur')) {
      return 'Notre équipe est composée de chercheurs, enseignants-chercheurs, doctorants et ingénieurs. Vous pouvez découvrir notre équipe dans la section "Membres" du site.';
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('contacter') || lowerMessage.includes('adresse')) {
      return 'Vous pouvez nous contacter via notre formulaire de contact, par téléphone ou par email. Toutes nos coordonnées sont disponibles dans la section "Contact" du site.';
    }

    if (lowerMessage.includes('prix') || lowerMessage.includes('distinction') || lowerMessage.includes('récompense')) {
      return 'Nos chercheurs et équipes ont reçu de nombreuses distinctions et prix pour leurs travaux. Consultez notre section "Prix et Distinctions" pour en savoir plus.';
    }

    if (lowerMessage.includes('galerie') || lowerMessage.includes('photo') || lowerMessage.includes('image')) {
      return 'Nous avons une galerie d\'images qui présente nos activités, événements et installations. Vous pouvez la consulter dans la section "Galerie" du site.';
    }

    if (lowerMessage.includes('partenaire') || lowerMessage.includes('collaboration')) {
      return 'Nous collaborons avec de nombreux partenaires institutionnels et industriels. Découvrez nos partenaires dans la section "Partenaires" du site.';
    }

    if (lowerMessage.includes('merci') || lowerMessage.includes('thanks')) {
      return 'De rien ! N\'hésitez pas à revenir vers moi si vous avez d\'autres questions.';
    }

    // Réponse par défaut
    return 'Je ne suis pas sûr de comprendre votre question. Pouvez-vous reformuler ou me poser une question sur notre laboratoire, nos projets, nos publications, notre équipe, ou nos contacts ?';
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      text: 'Découvrir le laboratoire',
      icon: <Building2 className="w-4 h-4" />,
      action: () => {
        addMessage('Découvrir le laboratoire', 'user');
        simulateTyping((responseTime) => {
          const response = 'Le Laboratoire LISI est un centre de recherche spécialisé dans l\'informatique, les signaux et les systèmes. Nous menons des projets innovants dans divers domaines technologiques et collaborons avec de nombreux partenaires.';
          addMessage(response, 'bot');
          analytics.trackQuickAction('Découvrir le laboratoire', response, responseTime);
        });
      }
    },
    {
      id: '2',
      text: 'Nos projets',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        addMessage('Nos projets', 'user');
        simulateTyping((responseTime) => {
          const response = 'Nous menons des projets dans différents domaines : finance, recherche, développement, formation et incubation. Chaque projet contribue à l\'avancement de la technologie et de la science.';
          addMessage(response, 'bot');
          analytics.trackQuickAction('Nos projets', response, responseTime);
        });
      }
    },
    {
      id: '3',
      text: 'Notre équipe',
      icon: <Users className="w-4 h-4" />,
      action: () => {
        addMessage('Notre équipe', 'user');
        simulateTyping((responseTime) => {
          const response = 'Notre équipe est composée de chercheurs, enseignants-chercheurs, doctorants et ingénieurs passionnés par l\'innovation et la recherche. Nous travaillons ensemble pour faire avancer la science.';
          addMessage(response, 'bot');
          analytics.trackQuickAction('Notre équipe', response, responseTime);
        });
      }
    },
    {
      id: '4',
      text: 'Nous contacter',
      icon: <Phone className="w-4 h-4" />,
      action: () => {
        addMessage('Nous contacter', 'user');
        simulateTyping((responseTime) => {
          const response = 'Vous pouvez nous contacter via notre formulaire de contact, par téléphone ou par email. Nous serons ravis de répondre à vos questions et de discuter de collaborations potentielles.';
          addMessage(response, 'bot');
          analytics.trackQuickAction('Nous contacter', response, responseTime);
        });
      }
    }
  ];

  // Nettoyer les analytics quand le composant est démonté
  useEffect(() => {
    return () => {
      if (!isOpen) {
        cleanupChatbotAnalytics();
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* Bouton flottant du chatbot */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Interface du chatbot */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-xl z-50 border-0">
          <CardHeader className="bg-blue-600 text-white pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <CardTitle className="text-lg">Assistant LISI</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-blue-500 text-white">
                En ligne
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 h-full flex flex-col">
            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Indicateur de frappe */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Actions rapides */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Actions rapides :</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="text-xs h-8"
                    >
                      {action.icon}
                      <span className="ml-1">{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Zone de saisie */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot; 