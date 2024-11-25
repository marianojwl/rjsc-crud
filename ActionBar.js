import React from 'react'
import { ContextCrudApp3 } from './Crud'
import ButtonNew from './ButtonNew'
import ButtonEdit from './ButtonEdit'
import ButtonDelete from './ButtonDelete'

function ActionBar() {
  const {tables} = React.useContext(ContextCrudApp3);
  const allowInsert = tables[0]?.allowInsert;
  const allowUpdate = tables[0]?.allowUpdate;
  const allowDelete = tables[0]?.allowDelete;
  
  return (
    <div className='my-2'>
      { allowInsert && <ButtonNew /> }
      { allowUpdate && <ButtonEdit /> }
      { allowDelete && <ButtonDelete /> }
    </div>
  )
}

export default ActionBar