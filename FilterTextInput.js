import React from 'react'

function FilterTextInput({filterText, setFilterText}) {
  const ref = React.useRef(null);
  const clearHandler = () => {
    setFilterText('');
    // put focus on the input
    ref.current.focus();
  };
  return (
    <div className='input-group my-2 d-inline-flex me-2' style={{width:'15rem'}}>
      <label className='input-group-text'>Filtrar</label>
      <input 
        ref={ref}
        type="text" 
        className='form-control input-filter'
        value={filterText} 
        onChange={(e)=>setFilterText(e.target.value)}  
        style={{backgroundColor:filterText ? 'lightyellow' : 'unset'}}
      />
      <label 
        className='input-group-text'
      >
        <button
          className='btn btn-sm btn-close'
          title='Limpiar Filtro'
          onClick={clearHandler}
          disabled={!filterText} >
        </button>
      </label>
    </div>
  )
}

export default FilterTextInput