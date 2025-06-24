export interface Finance {
    id: number;
    // Add other properties if known, e.g., amount, date, description
    // For now, keeping it minimal
}

export interface Incubation {
    id: number;
    // Add other properties if known, e.g., date, status, description
    // For now, keeping it minimal
}

export interface Project {
    id: number;
    name: string; // Keep for fallback or initial data
    name_fr?: string;
    name_en?: string;
    name_ar?: string;
    description: string; // Keep for fallback or initial data
    description_fr?: string;
    description_en?: string;
    description_ar?: string;
    type_projet: 'finance' | 'incube';
    status: string;
    date_debut?: string;
    date_fin?: string;
    created_at: string;
    updated_at: string;
    finances?: Finance[];
    incubations?: Incubation[];
} 