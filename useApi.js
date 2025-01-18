import { useState, useEffect } from 'react';

function useApi(endpoint) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const handleFecthError = (e) => {
    alert('Error de conexión.  No se pudo completar la solicitud.  Verifique su conexión a internet y, si el problema persiste, contacte al administrador del sistema.');
  }
  const get = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(`${endpoint}${query ? `${query}` : ''}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResponse(data);
      return data;
    } catch (error) {
      handleFecthError(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const post = async (body, callback = null) => {
    try {
      setLoading(true);
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResponse(data);

      if (callback) {
        try {
          callback();
        } catch (callbackError) {
          console.error("Error in callback:", callbackError);
        }
      }
      
      return data;
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { get, post, loading, error, response };
}

export default useApi;
