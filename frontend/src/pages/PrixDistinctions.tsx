import React, { useEffect, useState } from 'react';
import { PrixDistinction } from '../types/prixDistinction';
import api from '../lib/axios';

export default function PrixDistinctions() {
    const [prixDistinctions, setPrixDistinctions] = useState<PrixDistinction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrixDistinctions = async () => {
            try {
                console.log('Fetching prix et distinctions...');
                const response = await api.get('/api/prix-distinctions');
                console.log('Prix et distinctions response:', response);
                if (response.data.success) {
                    setPrixDistinctions(response.data.data);
                } else {
                    setError('Erreur lors du chargement des prix et distinctions');
                }
                setError(null);
            } catch (error) {
                console.error('Error fetching prix et distinctions:', error);
                setError('Erreur lors du chargement des prix et distinctions');
            } finally {
                setLoading(false);
            }
        };

        fetchPrixDistinctions();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: '#333', fontSize: '2rem', textAlign: 'center' }}>Chargement des prix et distinctions...</h1>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
                <h1 style={{ color: '#333', fontSize: '2rem' }}>Erreur</h1>
                <p style={{ color: '#e74c3c' }}>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#3498db', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '20px' }}>Prix et Distinctions</h1>
            
            {prixDistinctions.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                    {prixDistinctions.map((prix) => (
                        <div key={prix.id} style={{ 
                            backgroundColor: 'white', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            border: '1px solid #ddd'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '8px' }}>
                                        {prix.nom}
                                    </h3>
                                    <p style={{ color: '#666', fontSize: '1rem' }}>
                                        Attribué à{' '}
                                        <span style={{ fontWeight: 'bold' }}>
                                            {prix.membres && prix.membres.length > 0
                                                ? prix.membres.map(m => `${m.prenom} ${m.nom}${m.role ? ` (${m.role})` : ''}`).join(', ')
                                                : 'Aucun membre'
                                            }
                                        </span>
                                    </p>
                                </div>
                                <span style={{ 
                                    padding: '5px 10px', 
                                    backgroundColor: '#fff3e0', 
                                    color: '#f57c00', 
                                    borderRadius: '15px', 
                                    fontSize: '0.9rem',
                                    marginLeft: '15px'
                                }}>
                                    {prix.membres && prix.membres.length > 1 ? 'Prix collectif' : 'Prix individuel'}
                                </span>
                            </div>
                            
                            <div style={{ color: '#666', fontSize: '0.95rem', marginBottom: '15px' }}>
                                <p>{prix.description}</p>
                            </div>
                            
                            <div style={{ color: '#999', fontSize: '0.9rem' }}>
                                <strong>Date d'obtention:</strong>{' '}
                                {new Date(prix.date_obtention).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Aucun prix ou distinction n'est disponible pour le moment.
                    </p>
                </div>
            )}
        </div>
    );
} 