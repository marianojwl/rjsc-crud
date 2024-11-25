import React from 'react'
import { ContextCrudApp3 } from './Crud'
import Loading from './Loading';

function InputSwitch({field, value, rowId, primaryKeyName, mainTable, disabled=false}) {

  const [inputValue, setInputValue] = React.useState(value);

  const {mainTableHook} = React.useContext(ContextCrudApp3);

  React.useEffect(() => {
    if(inputValue === value) return;
    saveChanges();
  }, [inputValue]);

  const saveChanges = () => {
    mainTableHook.putData({ name:field, value:inputValue, rowId, table:mainTable, primaryKeyName });
  }

  return ( mainTableHook?.putting ? <Loading /> :
    <div className='form-check form-switch'>
      <input disabled={disabled} className='form-check-input' type='checkbox' checked={inputValue}  onChange={(e)=>setInputValue(e.target.checked)} />
    </div>
  )
}

export default InputSwitch