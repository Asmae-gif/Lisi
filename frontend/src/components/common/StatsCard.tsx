import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

/**
 * Composant de carte de statistiques réutilisable
 * Affiche une statistique avec un titre, une valeur, une icône et un style variant
 */
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning";
  subtitle?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = React.memo(({
  title,
  value,
  icon: Icon,
  variant = "default",
  subtitle,
  className = ""
}) => {
  const variants = {
    default: "border-muted text-muted-foreground",
    success: "border-green-100 text-green-600 bg-green-50",
    danger: "border-red-100 text-red-600 bg-red-50",
    warning: "border-yellow-100 text-yellow-600 bg-yellow-50",
  };

  return (
    <Card className={`${variants[variant]} transition-all hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard; 