import { useState, useEffect } from 'react';


function useApiRequest(endpoint, autoFetch=true) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [putting, setPutting] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postResponse, setPostResponse] = useState(null);
  const [putResponse, setPutResponse] = useState(null);
  const [getResponse, setGetResponse] = useState(null);
  const handleFecthError = (e) => {
    alert('Error de conexión.  No se pudo completar la solicitud.  Verifique su conexión a internet y, si el problema persiste, contacte al administrador del sistema.');
  };
  const clearPost = () => {
    setPostResponse(null);
  };

  const postData = (body, callback=null, callbackOnId=null) => {
    setPosting(true);
    fetch(endpoint, { // + '/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        setPostResponse(data);
        if (data?.success) {
          if(callbackOnId) callbackOnId(data?.data?.insert_id);
          if(callback) callback();
        } else {
          setError(data?.message + ' ' + data?.error);
          alert(data?.message + ' ' + data?.error);
        }
      })
      .catch(error => {
        handleFecthError(error);
        setError(error.message);
      })
      .finally(() => {
        setPosting(false);
      });
  };

  const query = queryString => {
    setGetResponse(null);
    setLoading(true);
    fetch(endpoint + queryString)
      .then(response => response.json())
      .then(data => {
        setGetResponse(data);
        if (data?.success) {
        } else {
          setError(data?.message + ' ' + data?.error);
        }
      })
      .catch(error => {
        handleFecthError(error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const fetchData = () => {
    setLoading(true);
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        setGetResponse(data);
        if (data?.success) {
        } else {
          setError(data?.message + ' ' + data?.error);
        }
      })
      .catch(error => {
        handleFecthError(error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const putData =  (body, callback = null) => {
    setPutResponse(null);
    setPutting(true);
    fetch(endpoint, { // + '/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        setPutResponse(data);
        if (data?.success) {
          if(callback) callback();
        } else {
          setError(data?.message + ' ' + data?.error);
        }
      })
      .catch(error => {
        handleFecthError(error);
        setError(error.message);
      })
      .finally(() => {
        setPutting(false);
      });
  };

  useEffect(() => {
    if (autoFetch)
    fetchData();
  }, [endpoint, autoFetch]);

  return { query, getResponse, loading, error, fetchData, putData, putting, postData, posting, postResponse, putResponse, clearPost };
}


export default useApiRequest