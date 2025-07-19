import { User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <header className="w-full flex items-center justify-end bg-white border-lisiGold p-4 shadow">
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center border-2 border-[hsl(var(--secondary))]">
            <User size={20} className="text-white" />
          </div>
          <span className="text-base font-medium text-[hsl(var(--primary))]">
            {user?.membre?.prenom ?? user?.name ?? 'Admin'}
          </span>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg border py-2 z-50">
            <a
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
            >
              Mon Profil
            </a>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[hsl(var(--muted))] transition-colors"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
