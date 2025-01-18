import { useState, useEffect } from 'react';

function useRelationHooks(relations=[], endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelations() {
      setLoading(true);
      try {
        const results = await Promise.all(
          relations.map(ref => 
            fetch( endpoint + '&options=' + ref.ref_table)
              .then(response => response.json())
          )
        );
        
        setData(results.map(result => result?.data));
        
      } catch (error) {
        console.error("Error fetching relations:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRelations();
  }, [relations]);

  return { data, loading };
}

export default useRelationHooks;