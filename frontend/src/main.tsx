
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/rtl.css' // Import RTL styles
import './styles/header.css' // Import header styles
import axiosClient from './services/axiosClient'
import './i18n' // Import i18n configuration

// Initialiser le CSRF avant de rendre l'application
const initCsrf = async () => {
  try {
    await axiosClient.get('/sanctum/csrf-cookie');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du CSRF:', error);
    return false;
  }
};

initCsrf().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
});
