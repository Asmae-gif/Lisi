import React, { useState } from 'react';
import PrixDistinctionList from './PrixDistinctionList';
import PrixDistinctionForm from './PrixDistinctionForm';

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

const PrixDistinctionManager: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingPrix, setEditingPrix] = useState<PrixDistinction | null>(null);

    const handleAdd = () => {
        setEditingPrix(null);
        setShowForm(true);
    };

    const handleEdit = (prix: PrixDistinction) => {
        setEditingPrix(prix);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        // La suppression est gérée directement dans PrixDistinctionList
        console.log('Suppression du prix:', id);
    };

    const handleSave = () => {
        setShowForm(false);
        setEditingPrix(null);
        // Recharger la liste (géré par le composant enfant)
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingPrix(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Prix et Distinctions</h1>
                <p className="text-gray-600 mt-2">
                    Gérez les prix et distinctions obtenus par les membres du laboratoire
                </p>
            </div>

            {showForm ? (
                <PrixDistinctionForm
                    prix={editingPrix}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <PrixDistinctionList
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default PrixDistinctionManager; 