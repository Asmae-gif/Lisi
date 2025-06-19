import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MemberFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddMember: () => void;
}

export default function MemberFilters({ 
  searchTerm, 
  onSearchChange, 
  onAddMember,
}: MemberFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher par nom, email ou grade..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button onClick={onAddMember}>
        Ajouter un membre
      </Button>
    </div>
  );
}

