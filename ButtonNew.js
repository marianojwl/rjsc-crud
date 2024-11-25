import React from 'react'
import { ContextCrudApp3 } from './Crud'

function ButtonNew() {
  const { setSection } = React.useContext(ContextCrudApp3);

  const onClick = () => {
    setSection('new-form');
  };
  return (
    <button className='btn btn-primary' onClick={onClick}>Nuevo</button>
  )
}

export default ButtonNew