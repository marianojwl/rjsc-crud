import React from 'react'
import { ContextCrudApp3 } from './Crud'

function ButtonEdit() {
  const { setSection, selectedRows } = React.useContext(ContextCrudApp3);
  const onClick = () => setSection('edit-form');
  return (
    <button 
      onClick={onClick}
      className='ms-2 btn btn-secondary'
      disabled={selectedRows?.length !== 1}
    >Editar</button>
  )
}

export default ButtonEdit