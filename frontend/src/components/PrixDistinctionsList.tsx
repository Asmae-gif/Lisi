import React, { useEffect, useState } from 'react';
import fetchPrixDistinctions from "../services/prixDistinctionApi";


const PrixDistinctionsList = () => {
  const [prix, setPrix] = useState([]);

  useEffect(() => {
    fetchPrixDistinctions().then(res => setPrix(res.data));
  }, []);

  return (
    <div>
      <h2>Prix & Distinctions</h2>
      <ul>
        {prix.map((item: any) => (
          <li key={item.id}>{item.titre || item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PrixDistinctionsList;