import  { useEffect, useState } from 'react';
import api from '@/lib/api';
import { PublicationsTable, Publication } from '@/components/publications-table';
import PublicationForm from '@/components/PublicationForm';

interface User {
  id: number;
  name: string;
  email: string;
  roles: { name: string }[];
}

export default function AdminPublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editPublication, setEditPublication] = useState<Publication | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Charger l'utilisateur connecté
  useEffect(() => {
    api.get('/user').then(res => setUser((res.data as unknown as { user: User }).user || res.data)).catch(() => setUser(null));
  }, []);

  // Charger les publications
  const fetchPublications = () => {
    setLoading(true);
    setError(null);
    api.get('/publications')
      .then(res => {
        if (Array.isArray(res.data)) {
          setPublications(res.data);
        } else {
          setError('Format de données invalide');
        }
      })
      .catch(err => {
        console.error('Erreur lors du chargement des publications:', err);
        setError('Erreur lors du chargement des publications.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchPublications, []);

  // Ajouter une publication
  const handleAdd = () => {
    setEditPublication(null);
    setShowForm(true);
  };

  // Modifier une publication
  const handleEdit = (pub: Publication) => {
    setEditPublication(pub);
    setShowForm(true);
  };

  // Supprimer une publication
  const handleDelete = (pub: Publication) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette publication ?')) {
      setFormLoading(true);
      api.delete(`/publications/${pub.id}`)
        .then(fetchPublications)
        .catch(err => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression.');
        })
        .finally(() => setFormLoading(false));
    }
  };

  // Soumettre le formulaire (ajout ou édition)
  const handleFormSubmit = async (data: Omit<Publication, 'id'>) => {
    setFormLoading(true);
    try {
      if (editPublication) {
        await api.put(`/publications/${editPublication.id}`, data);
      } else {
        await api.post('/publications', data);
      }
      setShowForm(false);
      fetchPublications();
    } catch (err) {
      console.error('Erreur lors de l\'ajout ou de la modification:', err);
      alert("Erreur lors de l'ajout ou de la modification.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Chargement des publications...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestion des publications</h1>
      <button className="btn btn-primary mb-4" onClick={handleAdd}>Ajouter une publication</button>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 className="text-xl font-semibold mb-4">{editPublication ? 'Modifier' : 'Ajouter'} une publication</h2>
            <PublicationForm
              initialData={editPublication || {}}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </div>
        </div>
      )}
      {publications.length > 0 ? (
        <>
          <PublicationsTable
            publications={publications}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={formLoading}
          />
          <div className="mt-4 text-sm text-muted-foreground">
            Double-cliquez sur une ligne pour modifier, ou utilisez le menu d'actions.
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucune publication trouvée
        </div>
      )}
    </div>
  );
}
