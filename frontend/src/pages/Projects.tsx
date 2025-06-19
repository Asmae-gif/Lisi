import React, { useEffect, useState } from 'react';
import { projectApi } from '../services/projectApi';

interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                console.log('Fetching projects...');
                const response = await projectApi.getAll();
                console.log('Projects response:', response);
                setProjects(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Erreur lors du chargement des projets');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: '#333', fontSize: '2rem', textAlign: 'center' }}>Chargement des projets...</h1>
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
            <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '20px' }}>Nos Projets</h1>
            
            {projects.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {projects.map((project) => (
                        <div key={project.id} style={{ 
                            backgroundColor: 'white', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            border: '1px solid #ddd'
                        }}>
                            <h3 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '10px' }}>
                                {project.title}
                            </h3>
                            <p style={{ color: '#666', marginBottom: '15px' }}>
                                {project.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ 
                                    padding: '5px 10px', 
                                    backgroundColor: '#e8f5e8', 
                                    color: '#2d5a2d', 
                                    borderRadius: '15px', 
                                    fontSize: '0.9rem' 
                                }}>
                                    {project.status}
                                </span>
                                <span style={{ color: '#999', fontSize: '0.9rem' }}>
                                    Créé le: {new Date(project.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Aucun projet n'est disponible pour le moment.
                    </p>
                </div>
            )}
        </div>
    );
} 