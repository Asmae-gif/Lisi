import React, { useEffect, useState } from 'react';
import { publicationApi } from '../services/publicationApi';

interface Publication {
    id: number;
    title: string;
    authors: string;
    journal: string;
    year: string;
    type: string;
    doi?: string;
    created_at: string;
}

export default function Publications() {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                console.log('Fetching publications...');
                const response = await publicationApi.getAll();
                console.log('Publications response:', response);
                setPublications(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching publications:', error);
                setError('Erreur lors du chargement des publications');
            } finally {
                setLoading(false);
            }
        };

        fetchPublications();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: '#333', fontSize: '2rem', textAlign: 'center' }}>Chargement des publications...</h1>
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
            <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '20px' }}>Nos Publications</h1>
            
            {publications.length > 0 ? (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {publications.map((publication) => (
                        <div key={publication.id} style={{ 
                            backgroundColor: 'white', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            border: '1px solid #ddd',
                            marginBottom: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '8px' }}>
                                        {publication.title}
                                    </h3>
                                    <p style={{ color: '#666', fontSize: '1rem', fontStyle: 'italic' }}>
                                        {publication.authors}
                                    </p>
                                </div>
                                <span style={{ 
                                    padding: '5px 10px', 
                                    backgroundColor: '#e3f2fd', 
                                    color: '#1976d2', 
                                    borderRadius: '15px', 
                                    fontSize: '0.9rem',
                                    marginLeft: '15px'
                                }}>
                                    {publication.type}
                                </span>
                            </div>
                            
                            <div style={{ color: '#666', fontSize: '0.95rem' }}>
                                <p style={{ marginBottom: '5px' }}>
                                    <strong>Journal/Conférence:</strong> {publication.journal}
                                </p>
                                <p style={{ marginBottom: '5px' }}>
                                    <strong>Année:</strong> {publication.year}
                                </p>
                                {publication.doi && (
                                    <p>
                                        <strong>DOI:</strong>{' '}
                                        <a 
                                            href={`https://doi.org/${publication.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#3498db', textDecoration: 'underline' }}
                                        >
                                            {publication.doi}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Aucune publication n'est disponible pour le moment.
                    </p>
                </div>
            )}
        </div>
    );
} 