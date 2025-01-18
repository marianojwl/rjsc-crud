import React from 'react'
import { ContextCrudApp3 } from './Crud'
import Loading from './Loading';
import TableCell from './TableCell';
import FilterTextInput from './FilterTextInput';
import SearchboxTimeout from './external-modules/rjsc-searchbox-timeout/SearchboxTimeout';
import Pagination from './Pagination';

function Table() {
  const {allowFilter, allowSearch, queryParameters, setQueryParameters, endpoint, tables, relations, columns, mainTableHook, selectedRows, setSelectedRows} = React.useContext(ContextCrudApp3);

  const hookResponse = mainTableHook?.getResponse;

  const rows = hookResponse?.data?.rows;

  const primaryKeyName = tables[0]?.columns?.find(column => column?.Key === 'PRI')?.Field;
  
  const allowUpdate = tables[0]?.allowUpdate;

  const [filterText, setFilterText] = React.useState('');
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    setQueryParameters(prev=>({...prev, search:searchText}));
  }, [searchText]);

  const rowsShowing = rows?.filter(r => JSON.stringify(r).toLowerCase().
  replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u').replace(/ü/g,'u').
  includes(filterText.toLowerCase().replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u').replace(/ü/g,'u')));

  const handleCheckAll = (e) => {
    if(e.target.checked) {
      setSelectedRows(rowsShowing.map(r => r[primaryKeyName]));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckOne = (e, id) => {
    if(e.target.checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(r => r !== id));
    }
  };

  console.log('hookResponse', hookResponse);

  return ( 
  <div>
    <div className='flex'>
      { allowSearch &&
        <SearchboxTimeout value={searchText} setValue={setSearchText} placeholder='Buscar...' />
      }

      {
        mainTableHook?.loading ? <Loading /> :<div>

          <Pagination page={queryParameters.page} setPage={page=>setQueryParameters(prev=>({...prev, page}))} rowsPerPage={queryParameters.rowsPerPage} setRowsPerPage={rowsPerPage=>setQueryParameters(prev=>({...prev, rowsPerPage}))} totalRows={mainTableHook?.getResponse?.data?.totalRows} />
          { allowFilter && <div className='mb-2'>
            <FilterTextInput filterText={filterText} setFilterText={setFilterText} />
            <div className='input-group my-2 w-auto d-inline-flex me-2'>
              <label className='input-group-text'>Mostrando</label>
              <input type="text" className='form-control' value={rowsShowing?.length+' de '+rows?.length+' registros'} disabled={true} />
            </div>
          </div>}
          { selectedRows?.length > 0 && 
          <div className='input-group my-2 w-auto d-inline-flex'>
            <label className='input-group-text'>Seleccionados</label>
            <input type="text" className='form-control' value={selectedRows?.length+' de '+rows?.length+' registros'} disabled={true} />
          </div>
          }
        </div>
      }
     
    </div>
    { mainTableHook?.loading ? <Loading /> : <>
    <div className='table-responsive mt-2'>
      <table className='table table-striped table-hover table-bordered'>
        <thead className='sticky-top'>
          <tr>
          <th className='px-1 px-2 text-center'><input type="checkbox" onChange={handleCheckAll} /></th>
            {
              columns?.map((column, index) => {
                // if column is not a string
                if(typeof column !== 'string') return <th key={'th'+index}>-</th>;

                // if string...
                const columnPathArray = column.split('.');
                const field = columnPathArray[columnPathArray.length-1];
                const table = columnPathArray.length > 1 ? columnPathArray[columnPathArray.length-2] : tables[0]?.table;
                const label = tables?.find(t => t?.table === table)?.columns?.find(c => c?.Field === field)?.Label || field;
                return (
                <th key={'th'+index}>{label}</th>
              )})
            }
          </tr>
        </thead>
        <tbody>
          {
            rowsShowing?.map((row, i) => (
              <tr key={'tr'+i+'-'+row[primaryKeyName]}>
                <td className='p-1 px-2 text-center'><input type="checkbox" checked={selectedRows.includes(row[primaryKeyName])} onChange={(e)=>handleCheckOne(e, row[primaryKeyName])} /></td>
                {
                  columns?.map((column, j) => {
                    // if column is not a string
                    if(typeof column !== 'string') return <td key={'tr'+i+'td'+j}>{column(row)}</td>;

                    // if string...
                    return (
                    <td key={'tr'+i+'td'+j}><TableCell allowUpdate={allowUpdate} row={row} columnPath={column} primaryKeyName={primaryKeyName} /></td>
                  )})
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    <Pagination page={queryParameters.page} setPage={page=>setQueryParameters(prev=>({...prev, page}))} rowsPerPage={queryParameters.rowsPerPage} setRowsPerPage={rowsPerPage=>setQueryParameters(prev=>({...prev, rowsPerPage}))} totalRows={mainTableHook?.getResponse?.data?.totalRows} />
    </>
    }
  </div>
  )
}

export default Table