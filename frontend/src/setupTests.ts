import '@testing-library/jest-dom';
import React from 'react';

// Mock pour les modules qui ne peuvent pas être testés
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'fr',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock simple pour les icônes Lucide
jest.mock('lucide-react', () => ({
  MessageCircle: () => 'MessageCircle',
  X: () => 'X',
  Send: () => 'Send',
  Bot: () => 'Bot',
  User: () => 'User',
  Search: () => 'Search',
  Users: () => 'Users',
  ChevronDown: () => 'ChevronDown',
  Mail: () => 'Mail',
  ExternalLink: () => 'ExternalLink',
  Building2: () => 'Building2',
  FileText: () => 'FileText',
  Phone: () => 'Phone',
  MapPin: () => 'MapPin',
  Award: () => 'Award',
  Camera: () => 'Camera',
}));

// Mock global pour import.meta.env (Vite)
Object.defineProperty(globalThis, 'import', {
  value: {},
  writable: true,
});

Object.defineProperty(globalThis.import, 'meta', {
  value: {
    env: {
      VITE_API_URL: 'http://localhost:8000',
      VITE_API_BASE_URL: 'http://localhost:8000',
    }
  },
  writable: true,
}); 