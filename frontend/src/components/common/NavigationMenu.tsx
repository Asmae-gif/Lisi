import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

/**
 * Composant de menu de navigation réutilisable
 * Affiche un menu de navigation responsive avec support pour les sous-menus
 */
interface NavigationItem {
  label: string;
  href?: string;
  children?: NavigationItem[];
  external?: boolean;
}

interface NavigationMenuProps {
  items: NavigationItem[];
  className?: string;
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

const NavigationMenu: React.FC<NavigationMenuProps> = React.memo(({
  items,
  className = "",
  mobileBreakpoint = "lg"
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  // Optimisation avec useCallback pour les handlers
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const toggleSubmenu = useCallback((label: string) => {
    setOpenSubmenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setOpenSubmenus(new Set());
  }, []);

  const renderMenuItem = useCallback((item: NavigationItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSubmenuOpen = openSubmenus.has(item.label);

    if (hasChildren) {
      return (
        <div key={index} className="relative group">
          <button
            className="flex items-center text-gray-700 hover:text-[#3ea666] transition-colors py-2"
            onClick={() => toggleSubmenu(item.label)}
          >
            {item.label} <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${mobileBreakpoint}:group-hover:opacity-100 ${mobileBreakpoint}:group-hover:visible`}>
            {item.children!.map((child, childIndex) => (
              <Link
                key={childIndex}
                to={child.href || '#'}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                onClick={closeMenu}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    if (item.external && item.href) {
      return (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-[#3ea666] transition-colors py-2"
          onClick={closeMenu}
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link
        key={index}
        to={item.href || '#'}
        className="text-gray-700 hover:text-[#3ea666] transition-colors py-2"
        onClick={closeMenu}
      >
        {item.label}
      </Link>
    );
  }, [openSubmenus, toggleSubmenu, closeMenu, mobileBreakpoint]);

  const renderMobileMenuItem = useCallback((item: NavigationItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSubmenuOpen = openSubmenus.has(item.label);

    if (hasChildren) {
      return (
        <div key={index}>
          <button
            onClick={() => toggleSubmenu(item.label)}
            className="flex items-center text-gray-700 hover:text-[#3ea666] py-2 w-full"
          >
            {item.label} <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          {isSubmenuOpen && (
            <div className="ml-4 mt-2 space-y-2">
              {item.children!.map((child, childIndex) => (
                <Link
                  key={childIndex}
                  to={child.href || '#'}
                  className="block text-gray-600 hover:text-[#3ea666] py-1"
                  onClick={closeMenu}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (item.external && item.href) {
      return (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-[#3ea666] py-2 block"
          onClick={closeMenu}
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link
        key={index}
        to={item.href || '#'}
        className="text-gray-700 hover:text-[#3ea666] py-2 block"
        onClick={closeMenu}
      >
        {item.label}
      </Link>
    );
  }, [openSubmenus, toggleSubmenu, closeMenu]);

  return (
    <nav className={className}>
      {/* Navigation desktop */}
      <div className={`hidden ${mobileBreakpoint}:flex items-center space-x-6`}>
        {items.map(renderMenuItem)}
      </div>

      {/* Menu mobile button */}
      <button
        className={`${mobileBreakpoint}:hidden p-2`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Navigation mobile */}
      {isMenuOpen && (
        <div className={`${mobileBreakpoint}:hidden border-t py-4`}>
          <div className="flex flex-col space-y-3">
            {items.map(renderMobileMenuItem)}
          </div>
        </div>
      )}
    </nav>
  );
});

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu; 