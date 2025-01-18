import React, { useEffect } from 'react'
import { ContextCrudApp3 } from './Crud'
import Loading from './Loading';
import useApi from './useApi';

function Form({isNew=true, closeHandler, reloadMainTable, preFilledFormData=null, callbackOnId=null}) {
  const [data, setData] = React.useState(preFilledFormData);

  const {queryFormatter, endpoint, mainTablePrimaryKey, tables, relations, columns, mainTableHook, relationHooks, setSection, selectedRows} = React.useContext(ContextCrudApp3);

  const apiGet = useApi(endpoint);

  const saveButtonDisabled = mainTableHook?.posting || mainTableHook?.putting;

  useEffect(() => {
    if(isNew) return;
    if(selectedRows?.length !== 1) return;
    apiGet.get('/'+mainTablePrimaryKey+'/'+selectedRows[0]);
  }, [selectedRows]);

  useEffect(() => {
    if(isNew) return;
    setData(apiGet?.response?.data);
  }, [apiGet?.response?.data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isNew) {
      mainTableHook.postData({...data, table:tables[0]?.table}, ()=>{
        reloadMainTable();
        closeHandler();
      }, callbackOnId);
    } else {
      mainTableHook.putData({data, table:tables[0]?.table}, ()=>{
        reloadMainTable();
        closeHandler();
      });
    }
  };

  const cols = tables[0]?.columns.filter(col => {
    if(col?.Key === 'PRI') return false;
    if(col?.Extra?.includes('on update')) return false;
    if(col?.Type === 'timestamp' && col?.Default === 'CURRENT_TIMESTAMP') return false;
    return true; 
  });

  return ( !isNew && !data ? <Loading /> :
    <div>
      <form onSubmit={handleSubmit} disabled={mainTableHook?.posting}>
        {
          cols?.map((column, index) => {
            const field = column?.Field;
            const label = column?.Label || field;
            const relation = relations?.find(relation => (relation?.table === tables[0]?.table && relation?.column === field));
            const required = column?.Null === 'NO';
            return ( relation
              ?
              <div key={'div'+index} className='input-group mb-2'>
                <label className='input-group-text'>{label}</label>
                <select className='form-select w-auto' name={field} value={data[field] || ''} onChange={(e)=>setData({...data, [field]:e.target.value})} required={required}>
                  <option value=''>-</option>
                  {
                    relationHooks?.data?.find(r => (r?.table === relation?.ref_table))?.rows?.map(row => (
                      <option key={row?.id} value={row?.id}>{row?.name}</option>
                    ))
                  }
                </select>
              </div>
              :
              (()=>{
                switch(column?.Type) {
                  case 'text':
                    
                    return (column?.isHTML ? // show in two columns: textarea and preview
                      <div className='row' key={'div'+index}>
                        <div className='col-6'>
                          <div className='input-group mb-2 h-100'>
                            <textarea 
                              style={{ whiteSpace: column?.isHTML ? 'nowrap' : 'normal' }}
                              required={required}
                              className='form-control w-auto h-100'
                              name={field} 
                              value={data[field] || ''} 
                              disabled={column?.Key === 'PRI'}
                              onChange={(e)=>setData({...data, [field]:e.target.value})} 
                              />
                          </div>
                        </div>
                        <div className='col-6'>
                          <div className='input-group mb-2'>
                            <div dangerouslySetInnerHTML={{__html:data[field]}}></div>
                          </div>
                        </div>
                    </div>

                      : // show only textarea
                      <div>
                      <div key={'div'+index} className='input-group mb-2'>
                        <label className='input-group-text'>{label}</label>
                        <textarea 
                          style={{ whiteSpace: column?.isHTML ? 'nowrap' : 'normal' }}
                          required={required}
                          className='form-control w-auto' 
                          name={field} 
                          value={data[field] || ''} 
                          disabled={column?.Key === 'PRI'}
                          onChange={(e)=>setData({...data, [field]:e.target.value})} 
                          />
                      </div>
                    </div>);
                  break;
                  case 'varchar':
                    return (
                      <div key={'div'+index} className='input-group mb-2'>
                        <label className='input-group-text'>{label}</label>
                        <input 
                          type='text' 
                          maxLength={column?.Length??255}
                          className='form-control w-auto' 
                          name={field} 
                          value={data[field] || ''} 
                          disabled={column?.Key === 'PRI'}
                          required={required}
                          onChange={(e)=>setData({...data, [field]:e.target.value})} 
                        />
                      </div>
                    );
                  break;
                  case 'tinyint':
                    return (
                      <div key={'div'+index} className='form-check form-switch mb-2'>
                        <label className='form-check-label'>{label}</label>
                        <input 
                          type='checkbox' 
                          className='form-check-input' 
                          name={field} 
                          checked={data[field] || false} 
                          disabled={column?.Key === 'PRI'}
                          required={false}
                          onChange={(e)=>setData({...data, [field]:e.target.checked})} 
                        />
                      </div>
                    );
                  break;
                  case 'int':
                    return (
                      <div key={'div'+index} className='input-group mb-2'>
                        <label className='input-group-text'>{label}</label>
                        <input 
                          type='number' 
                          maxLength={column?.Length??255}
                          className='form-control w-auto' 
                          name={field} 
                          value={data[field] || ''} 
                          disabled={column?.Key === 'PRI'}
                          required={required}
                          onChange={(e)=>setData({...data, [field]:e.target.value})} 
                        />
                      </div>
                    );
                  break;
                  default:
                    return (
                      <div key={'div'+index} className='input-group mb-2'>
                        <label className='input-group-text'>{label}</label>
                        <input 
                          type='text' 
                          className='form-control w-auto' 
                          name={field} 
                          value={data[field] || ''} 
                          disabled={column?.Key === 'PRI'}
                          required={required}
                          onChange={(e)=>setData({...data, [field]:e.target.value})} 
                        />
                      </div>
                    );
                  break;
                }
                
              })()
              
            )
          })
        }
        { mainTableHook?.posting ? <Loading /> : 
        <>
          <button disabled={saveButtonDisabled} type="submit" className='btn btn-primary me-2'>Guardar</button>
          <button disabled={saveButtonDisabled} className='btn btn-secondary' onClick={closeHandler}>Cancelar</button>
        </>
        }
      </form>
    </div>
  );
}

export default Form