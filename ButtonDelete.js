import React from 'react'
import { ContextCrudApp3 } from './Crud'
import Loading from './Loading';

function ButtonDelete() {
  const { endpoint, selectedRows, tables, mainTablePrimaryKey, mainTableHook } = React.useContext(ContextCrudApp3);
  const [deleting, setDeleting] = React.useState(false);
  const mainTable = tables[0];
  
  const onClick = () => {
    // confirm with user
    if(!window.confirm('¿Estás seguro de que deseas eliminar los registros seleccionados? Esta acción no se puede deshacer.')) return;
    fetch( process.env.REACT_APP_BASE_DIR + endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({table: mainTable?.table , primaryKeyName:mainTablePrimaryKey,  ids:selectedRows})
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data?.success) {
        mainTableHook?.fetchData();
      } else {
        alert('Error: ' + data?.error);
      }
    })
    .catch(error => console.log(error));
  };

  return ( mainTable?.allowDelete === false ? null :
    deleting ? <Loading /> :
    <button 
      className='ms-2 btn btn-danger'
      disabled={!selectedRows?.length || deleting}
      onClick={onClick}
    >Eliminar</button>
  )
}

export default ButtonDelete