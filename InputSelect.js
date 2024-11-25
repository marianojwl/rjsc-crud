import React, { useState, useEffect} from 'react'
import { ContextCrudApp3 } from './Crud'
import Loading from './Loading';

function InputSelect({field, value, rowId, primaryKeyName, mainTable, showValue, showField, showTable, disabled=false}) {
  const [inputValue, setInputValue] = useState(value);
  const [readOnly, setReadOnly] = useState(true);

  const {mainTableHook, relationHooks, columns} = React.useContext(ContextCrudApp3);

  const onDoubleClick = (e) => {
    setReadOnly(false);
  };

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
    mainTableHook.putData({ name:field, value:inputValue, rowId, table:mainTable, primaryKeyName }, ()=>{
      if(columns?.find(column => {
        const columnPathArray = column.split('.');
        const table = columnPathArray.length > 1 ? columnPathArray[columnPathArray.length-2] : mainTable;
        return (table !== showTable && table != mainTable);
      })) {
        mainTableHook?.fetchData();
      }
    });
  }

  useEffect(() => {
    setReadOnly(true);
    if(inputValue === value) return;
    saveChanges();
  }, [inputValue]);

  const options = relationHooks?.data?.find(relation => (relation?.table === showTable))?.rows;

  return ( 
    !options ? <Loading /> :
    mainTableHook?.putting ? <Loading /> :
    readOnly ? <div onDoubleClick={disabled?null:onDoubleClick}>{options?.find(row => row?.id==inputValue)?.name || "-"}</div> :
    <select 
      value={inputValue} 
      name={field} 
      className='form-select m-0' 
      onChange={(e)=>setInputValue(e.target.value)} 
      onSelect={onBlur}
      disabled={disabled}
      onBlur={onBlur} 
      onKeyUp={onKeyUp}>
      {
        options?.map((o, i) => (
          <option key={'option'+i} value={o?.id}>{o?.name}</option>
        ))
      }
    </select>
  )
}

export default InputSelect