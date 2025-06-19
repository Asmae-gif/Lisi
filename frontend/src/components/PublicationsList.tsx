import React, { useEffect, useState } from 'react';
import fetchPublications from '../services/publicationApi';

const PublicationsList = () => {
  const [publications, setPublications] = useState([]);
  useEffect(() => {
    fetchPublications.getAll().then(res => setPublications(res.data));
  }, []);

  return (
    <div>
      <h2>Publications</h2>
      <ul>
        {publications.map((pub: any) => (
          <li key={pub.id}>{pub.titre || pub.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PublicationsList;