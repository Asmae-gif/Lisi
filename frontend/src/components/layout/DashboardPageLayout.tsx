import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, LucideIcon } from "lucide-react";

interface DashboardPageLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  onAdd?: () => void;
  addButtonText?: string;
  addButtonClassName?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showFilter?: boolean;
  filterOptions?: { value: string; label: string }[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  statsCards?: {
    title: string;
    value: number | string;
    icon: LucideIcon;
    iconColor?: string;
  }[];
  children: React.ReactNode;
  showStats?: boolean;
}

export default function DashboardPageLayout({
  title,
  description,
  icon: Icon,
  iconColor = "text-blue-600",
  onAdd,
  addButtonText = "Ajouter",
  addButtonClassName,
  showSearch = true,
  searchPlaceholder = "Rechercher...",
  searchValue = "",
  onSearchChange,
  showFilter = false,
  filterOptions = [],
  filterValue = "",
  onFilterChange,
  statsCards = [],
  children,
  showStats = true
}: DashboardPageLayoutProps) {
  return (
    <div className="p-6 space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Icon className={`w-8 h-8 ${iconColor}`} />
            {title}
          </h1>
          <p className="text-gray-600 mt-1">
            {description}
          </p>
        </div>
        {onAdd && (
          <Button onClick={onAdd} className={addButtonClassName || "bg-blue-600 hover:bg-blue-700"}>
            <Plus className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
        )}
      </div>

      {/* Filtres et recherche */}
      {(showSearch || showFilter) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {showSearch && (
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchValue}
                      onChange={(e) => onSearchChange?.(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              {showFilter && filterOptions.length > 0 && (
                <Select value={filterValue} onValueChange={onFilterChange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      {showStats && statsCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor || "text-blue-600"}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contenu principal */}
      {children}
    </div>
  );
} 