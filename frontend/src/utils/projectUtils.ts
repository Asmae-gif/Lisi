export const PROJECT_STATUSES = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'suspendu', label: 'Suspendu' },
    { value: 'termine', label: 'Terminé' },
    { value: 'annule', label: 'Annulé' },
    { value: 'publie', label: 'Publié' },
    { value: 'archive', label: 'Archivé' },
    { value: 'rejete', label: 'Rejeté' }
];

export const PROJECT_TYPES = [
    { value: 'finance', label: 'Finance' },
    { value: 'incube', label: 'Incubé' }
];

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'en_attente': return 'bg-yellow-100 text-yellow-800';
        case 'en_cours': return 'bg-blue-100 text-blue-800';
        case 'termine': return 'bg-green-100 text-green-800';
        case 'annule': return 'bg-red-100 text-red-800';
        case 'publie': return 'bg-teal-100 text-teal-800';
        case 'archive': return 'bg-gray-100 text-gray-800';
        case 'suspendu': return 'bg-orange-100 text-orange-800';
        case 'rejete': return 'bg-red-300 text-red-900';
        default: return 'bg-gray-100 text-gray-600';
    }
};

export const getTypeColor = (type: string) => {
    switch (type) {
        case 'finance': return 'bg-purple-100 text-purple-800';
        case 'incube': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-600';
    }
};

export const formatStatus = (status: string) => {
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
}; 