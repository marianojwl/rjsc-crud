import React from 'react'
import ActionBar from './ActionBar';
import Table from './Table';
import useApiRequest from './useApiRequest';
import useRelationHooks from './useRelationHooks';
import Form from './Form';

export const ContextCrudApp3 = React.createContext();

function Crud({queryFormatter=null, order="ASC", orderBy=null, allowFilter=true, allowSearch=false, endpoint, tables, relations=[], columns, startOn='table', newFormPrefilledData={}, newFormCallbackOnInsertId=null,  overrideFormCloseHandler=null}) {
  
  const mainTablePrimaryKey = tables[0]?.columns.find(col => col?.Key === 'PRI')?.Field;

  const mainTableName = tables[0]?.table;

  const [queryParameters, setQueryParameters] = React.useState({page:1, rowsPerPage:20, orderBy:(orderBy??(mainTableName+'.'+mainTablePrimaryKey)), order:order, search:''});

  const queryString = (queryFormatter ? queryFormatter(queryParameters) : (qp=>{ return "&" + Object.keys(qp).map(k=>k+"="+qp[k]).join("&") })(queryParameters));

  const mainTableHook = useApiRequest(endpoint, false);

  React.useEffect(() => {
    mainTableHook.query(queryString);
  }, [queryString]);

  const relationHooks = useRelationHooks(relations, endpoint);

  const [section, setSection] = React.useState(startOn);

  const [selectedRows, setSelectedRows] = React.useState([]);

  const [editFormPrefilledData, setEditFormPrefilledData] = React.useState({});

  return ( (!endpoint || !tables?.length || !relations || !columns) ? <div className='alert alert-danger'>Bad Configuration</div> :
    !mainTableHook?.loading && mainTableHook?.getResponse ===null ? <div className='alert alert-warning'>Error de Conexión</div> :
    <ContextCrudApp3.Provider value={{queryFormatter, allowFilter, allowSearch, queryParameters, setQueryParameters, endpoint, editFormPrefilledData, setEditFormPrefilledData, mainTablePrimaryKey, endpoint, tables, relations, columns, mainTableHook, relationHooks, setSection, selectedRows, setSelectedRows}}>
      <div className='CrudApp3'>
        { section === 'table' && <><ActionBar /><Table /></> }
        { section === 'new-form' && <><Form callbackOnId={newFormCallbackOnInsertId} preFilledFormData={newFormPrefilledData} reloadMainTable={mainTableHook.fetchData} closeHandler={()=>setSection('table')} /></> }
        { section === 'edit-form' && <><Form isNew={false} callbackOnId={console.log} preFilledFormData={editFormPrefilledData} reloadMainTable={mainTableHook.fetchData} closeHandler={()=>setSection('table')} /></> }
        
      </div>
    </ContextCrudApp3.Provider>
  )
}

export default Crud