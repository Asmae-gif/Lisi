import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Chatbot from './Chatbot';

// Mock des composants UI pour éviter les problèmes d'imports
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/input', () => ({
  Input: React.forwardRef((props: any, ref: any) => <input {...props} ref={ref} />),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

// Mock des analytics pour éviter les erreurs
jest.mock('./ChatbotAnalytics', () => ({
  getChatbotAnalytics: () => ({
    trackMessage: jest.fn(),
    trackQuickAction: jest.fn(),
  }),
  cleanupChatbotAnalytics: jest.fn(),
}));

describe('Chatbot Component', () => {
  test('renders chatbot button', () => {
    render(<Chatbot />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('displays welcome message when opened', () => {
    render(<Chatbot />);
    const button = screen.getByRole('button');
    
    // Utiliser fireEvent pour déclencher le clic
    fireEvent.click(button);
    
    // Vérifier que le message de bienvenue s'affiche
    expect(screen.getByText(/Bonjour.*assistant virtuel.*LISI/i)).toBeInTheDocument();
  });
}); 