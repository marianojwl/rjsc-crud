import React from 'react'
import { ContextCrudApp3 } from './Crud'
import InputSelect from './InputSelect';
import InputText from './InputText';
import InputSwitch from './InputSwitch';

function TableCell({row, columnPath, primaryKeyName, allowUpdate}) {
  const {tables, relations, columns} = React.useContext(ContextCrudApp3);
  const mainTable = tables[0]?.table;
  const columnPathArray = columnPath.split('.');
  const field = columnPathArray[columnPathArray.length-1];
  const table = columnPathArray.length > 1 ? columnPathArray[columnPathArray.length-2] : mainTable;

  const idField = relations?.find(relation => (relation?.table === mainTable && relation?.ref_table === table && relation?.ref_show === field))?.column;

  return ( !mainTable ? <div>No Main Table</div> :
    <div>
      {
        table === mainTable
        ? 
        (()=>{
          switch(tables[0]?.columns?.find(c => c?.Field === field)?.Type) {
            case 'bool':
            case 'tinyint':
              return (<InputSwitch disabled={!allowUpdate} field={field} value={row[field]} primaryKeyName={primaryKeyName} rowId={row[primaryKeyName]} mainTable={mainTable} /> )
            break;
            default:
              return (<InputText disabled={!allowUpdate} field={field} value={row[field]} primaryKeyName={primaryKeyName} rowId={row[primaryKeyName]} mainTable={mainTable} /> )
            break;
          }
        })()
        : 
        ( 
          idField
          ?
          <InputSelect disabled={!allowUpdate} field={idField} value={row[idField]} primaryKeyName={primaryKeyName} rowId={row[primaryKeyName]} mainTable={mainTable} showValue={row[field]} showField={field} showTable={table} /> 
          :
          row[field]
        )
      }
    </div>
  )
}

export default TableCell