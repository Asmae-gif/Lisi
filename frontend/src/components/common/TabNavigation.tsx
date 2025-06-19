import React, { useMemo, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/**
 * Composant de navigation par onglets réutilisable
 * Gère l'affichage et la navigation entre différents onglets avec support pour le contenu personnalisé
 */
interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  showBadge?: boolean;
}

const TabNavigation = React.memo(({
  tabs,
  activeTab,
  onTabChange,
  orientation = 'horizontal',
  className = "",
  tabsListClassName = "",
  tabsTriggerClassName = "",
  tabsContentClassName = "",
  showBadge = true
}: TabNavigationProps) => {

  // Optimisation avec useCallback pour la gestion du changement d'onglet
  const handleTabChange = useCallback((value: string) => {
    onTabChange(value);
  }, [onTabChange]);

  // Optimisation avec useMemo pour le rendu des onglets
  const renderedTabs = useMemo(() => {
    return tabs.map((tab) => (
      <TabsTrigger
        key={tab.value}
        value={tab.value}
        disabled={tab.disabled}
        className={tabsTriggerClassName}
      >
        <span className="flex items-center gap-2">
          {tab.label}
          {showBadge && tab.badge && (
            <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {tab.badge}
            </span>
          )}
        </span>
      </TabsTrigger>
    ));
  }, [tabs, showBadge, tabsTriggerClassName]);

  // Optimisation avec useMemo pour le rendu du contenu
  const renderedContent = useMemo(() => {
    return tabs.map((tab) => (
      <TabsContent
        key={tab.value}
        value={tab.value}
        className={tabsContentClassName}
      >
        {tab.content}
      </TabsContent>
    ));
  }, [tabs, tabsContentClassName]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      orientation={orientation}
      className={className}
    >
      <TabsList className={tabsListClassName}>
        {renderedTabs}
      </TabsList>
      {renderedContent}
    </Tabs>
  );
});

TabNavigation.displayName = 'TabNavigation';

export default TabNavigation; 