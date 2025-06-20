import React, { useEffect, useState } from 'react';
import { partenaireApi } from '../services/partenaireApi';

interface Partenaire {
    id: number;
    nom: string;
    logo?: string;
    lien?: string;
    created_at: string;
  updated_at: string;
}

export default function Partenaires() {
    const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPartenaires = async () => {
            try {
                console.log('Fetching partenaires...');
                const response = await partenaireApi.getAll();
                console.log('Partenaires response:', response);
                setPartenaires(response.data.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching partenaires:', error);
                setError('Erreur lors du chargement des partenaires');
            } finally {
                setLoading(false);
            }
        };

        fetchPartenaires();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: '#333', fontSize: '2rem', textAlign: 'center' }}>Chargement des partenaires...</h1>
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
    console.log('partenaires state:', partenaires);
    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
            <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '20px' }}>Nos Partenaires</h1>
            
            {partenaires.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                    {partenaires.map((partenaire) => (
                        <div key={partenaire.id} style={{ 
                            backgroundColor: 'white', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            border: '1px solid #ddd',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '15px' }}>
                                {partenaire.nom}
                            </h3>
                            
                            {partenaire.logo && (
                                <div style={{ 
                                    width: '100%', 
                                    height: '120px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    backgroundColor: 'white', 
                                    borderRadius: '8px', 
                                    marginBottom: '15px',
                                    border: '1px solid #eee'
                                }}>
                                    <img
                                        src={partenaire.logo}
                                        alt={`Logo ${partenaire.nom}`}
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '100%', 
                                            objectFit: 'contain' 
                                        }}
                                    />
                                </div>
                            )}
                            
                            
                            {partenaire.lien && (
                                <a
                                    href={partenaire.lien}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ 
                                        padding: '10px 20px', 
                                        backgroundColor: '#27ae60', 
                                        color: 'white', 
                                        textDecoration: 'none', 
                                        borderRadius: '5px', 
                                        fontWeight: 'bold',
                                        transition: 'background-color 0.3s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#229954'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
                                >
                                    Visiter le site web
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Aucun partenaire n'est disponible pour le moment.
                    </p>
                </div>
            )}
        </div>
    );
} 