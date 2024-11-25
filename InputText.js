import React, { useState, useEffect, useRef} from 'react'
import { ContextCrudApp3 } from './Crud'
import Loading from './Loading';

function InputText({field, value, rowId, primaryKeyName, mainTable, type="text", disabled=false}) {
  const [inputValue, setInputValue] = useState(value);
  const [readOnly, setReadOnly] = useState(true);

  const inputRef = useRef();

  const {mainTableHook} = React.useContext(ContextCrudApp3);

  const onDoubleClick = (e) => {
    setReadOnly(false);
  };

  useEffect(() => {
    if(!readOnly)
      inputRef.current.focus();
  }, [readOnly]);

  const onBlur = (e) => {
    setReadOnly(true);
    if(inputValue === value) return;
    saveChanges();
  };

  const onKeyUp = (e) => {
    if(e.key === 'Enter') {
      setReadOnly(true);
      if(inputValue === value) return;
      saveChanges();
    }
  };

  const saveChanges = () => {
    mainTableHook.putData({ name:field, value:inputValue, rowId, table:mainTable, primaryKeyName });
  }

  return ( 
    mainTableHook?.putting ? <Loading /> :
    readOnly ? <div onDoubleClick={disabled?null:onDoubleClick}>{inputValue || "-"}</div> :
    <input 
      ref={inputRef}
      type={type} 
      value={inputValue} 
      name={field}
      className='form-control m-0'
      readOnly={readOnly} 
      disabled={disabled}
      onChange={(e)=>setInputValue(e.target.value)} 
      onBlur={onBlur}
      onKeyUp={onKeyUp}
    />
  )
}

export default InputText