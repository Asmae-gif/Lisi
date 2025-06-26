export interface ChatbotInteraction {
  id: string;
  timestamp: Date;
  userMessage: string;
  botResponse: string;
  sessionId: string;
  pageUrl: string;
  userAgent: string;
  interactionType: 'message' | 'quick_action' | 'session_start';
  responseTime: number;
}

export interface ChatbotSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  totalMessages: number;
  pageUrl: string;
  userAgent: string;
}

class ChatbotAnalytics {
  private sessionId: string;
  private session: ChatbotSession;
  private interactions: ChatbotInteraction[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.session = {
      id: this.sessionId,
      startTime: new Date(),
      totalMessages: 0,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Sauvegarder la session dans localStorage
    this.saveSession();
    
    // Envoyer l'événement de début de session
    this.trackSessionStart();
  }

  private generateSessionId(): string {
    return `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveSession(): void {
    try {
      localStorage.setItem('chatbot_session', JSON.stringify(this.session));
      localStorage.setItem('chatbot_interactions', JSON.stringify(this.interactions));
    } catch (error) {
      console.warn('Impossible de sauvegarder les données du chatbot:', error);
    }
  }

  private trackSessionStart(): void {
    const interaction: ChatbotInteraction = {
      id: `session_${Date.now()}`,
      timestamp: new Date(),
      userMessage: '',
      botResponse: 'Session démarrée',
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      interactionType: 'session_start',
      responseTime: 0
    };

    this.interactions.push(interaction);
    this.saveSession();
    this.sendToAnalytics(interaction);
  }

  public trackMessage(userMessage: string, botResponse: string, responseTime: number): void {
    const interaction: ChatbotInteraction = {
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
      userMessage,
      botResponse,
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      interactionType: 'message',
      responseTime
    };

    this.interactions.push(interaction);
    this.session.totalMessages++;
    this.saveSession();
    this.sendToAnalytics(interaction);
  }

  public trackQuickAction(actionText: string, botResponse: string, responseTime: number): void {
    const interaction: ChatbotInteraction = {
      id: `action_${Date.now()}`,
      timestamp: new Date(),
      userMessage: actionText,
      botResponse,
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      interactionType: 'quick_action',
      responseTime
    };

    this.interactions.push(interaction);
    this.session.totalMessages++;
    this.saveSession();
    this.sendToAnalytics(interaction);
  }

  public endSession(): void {
    this.session.endTime = new Date();
    this.saveSession();
    
    // Envoyer un résumé de la session
    this.sendSessionSummary();
  }

  private sendToAnalytics(interaction: ChatbotInteraction): void {
    // Envoyer les données à votre backend ou service d'analytics
    try {
      // Exemple d'envoi à votre API Laravel
      fetch('/api/chatbot/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(interaction)
      }).catch(error => {
        console.warn('Erreur lors de l\'envoi des analytics:', error);
      });
    } catch (error) {
      console.warn('Impossible d\'envoyer les analytics:', error);
    }
  }

  private sendSessionSummary(): void {
    const sessionDuration = this.session.endTime 
      ? this.session.endTime.getTime() - this.session.startTime.getTime()
      : 0;

    const summary = {
      sessionId: this.sessionId,
      duration: sessionDuration,
      totalMessages: this.session.totalMessages,
      pageUrl: this.session.pageUrl,
      userAgent: this.session.userAgent,
      startTime: this.session.startTime,
      endTime: this.session.endTime
    };

    try {
      fetch('/api/chatbot/session-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(summary)
      }).catch(error => {
        console.warn('Erreur lors de l\'envoi du résumé de session:', error);
      });
    } catch (error) {
      console.warn('Impossible d\'envoyer le résumé de session:', error);
    }
  }

  public getSessionStats(): { totalMessages: number; sessionDuration: number } {
    const now = new Date();
    const duration = now.getTime() - this.session.startTime.getTime();
    
    return {
      totalMessages: this.session.totalMessages,
      sessionDuration: duration
    };
  }

  public getPopularQuestions(): { question: string; count: number }[] {
    const questionCounts: { [key: string]: number } = {};
    
    this.interactions
      .filter(i => i.interactionType === 'message')
      .forEach(interaction => {
        const question = interaction.userMessage.toLowerCase().trim();
        questionCounts[question] = (questionCounts[question] || 0) + 1;
      });

    return Object.entries(questionCounts)
      .map(([question, count]) => ({ question, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

// Instance singleton
let analyticsInstance: ChatbotAnalytics | null = null;

export const getChatbotAnalytics = (): ChatbotAnalytics => {
  if (!analyticsInstance) {
    analyticsInstance = new ChatbotAnalytics();
  }
  return analyticsInstance;
};

export const initializeChatbotAnalytics = (): ChatbotAnalytics => {
  analyticsInstance = new ChatbotAnalytics();
  return analyticsInstance;
};

export const cleanupChatbotAnalytics = (): void => {
  if (analyticsInstance) {
    analyticsInstance.endSession();
    analyticsInstance = null;
  }
}; 