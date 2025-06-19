import React, { useState, useEffect } from 'react';
import api from '../lib/axios';

interface PrixDistinction {
    id: number;
    nom: string;
    description: string;
    date_obtention: string;
    membre_id: number;
    membre?: {
        nom: string;
        prenom: string;
    };
    created_at: string;
    updated_at: string;
}

interface PrixDistinctionListProps {
    onEdit: (prix: PrixDistinction) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}

const PrixDistinctionList: React.FC<PrixDistinctionListProps> = ({ onEdit, onDelete, onAdd }) => {
    const [prixDistinctions, setPrixDistinctions] = useState<PrixDistinction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'nom' | 'date_obtention'>('date_obtention');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        fetchPrixDistinctions();
    }, []);

    const fetchPrixDistinctions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/prix-distinctions');
            if (response.data.success) {
                setPrixDistinctions(response.data.data);
            } else {
                setError('Erreur lors du chargement des prix et distinctions');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur lors du chargement des prix et distinctions');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce prix/distinction ?')) {
            try {
                const response = await api.delete(`/api/prix-distinctions/${id}`);
                if (response.data.success) {
                    setPrixDistinctions(prev => prev.filter(prix => prix.id !== id));
                    alert('Prix/distinction supprimé avec succès');
                } else {
                    alert('Erreur lors de la suppression');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const filteredAndSortedPrix = prixDistinctions
        .filter(prix => 
            prix.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prix.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (prix.membre && `${prix.membre.nom} ${prix.membre.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            let aValue = sortBy === 'nom' ? a.nom : a.date_obtention;
            let bValue = sortBy === 'nom' ? b.nom : b.date_obtention;
            
            if (sortOrder === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

    if (loading) {
        return <div className="text-center py-8">Chargement...</div>;
    }

    if (error) {
        return <div className="text-red-600 text-center py-8">{error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Prix et Distinctions</h2>
                <button
                    onClick={onAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Ajouter un Prix
                </button>
            </div>

            {/* Filtres et recherche */}
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, description ou membre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'nom' | 'date_obtention')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="date_obtention">Date d'obtention</option>
                        <option value="nom">Nom</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            {/* Liste des prix */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nom du Prix
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Membre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date d'obtention
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedPrix.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    Aucun prix ou distinction trouvé
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedPrix.map((prix) => (
                                <tr key={prix.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{prix.nom}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {prix.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {prix.membre ? `${prix.membre.nom} ${prix.membre.prenom}` : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(prix.date_obtention).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEdit(prix)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(prix.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                Total: {filteredAndSortedPrix.length} prix/distinction(s)
            </div>
        </div>
    );
};

export default PrixDistinctionList; 