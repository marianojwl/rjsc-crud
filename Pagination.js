import React, { useEffect, useState } from 'react';
import { ContextCrudApp3 } from './Crud';

function IconoInfo({color='white'}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill={color} d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>
  )
}


function IconoRefrescar({color='white'}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill={color} fillRule="evenodd" d="M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12S17.937 22.75 12 22.75S1.25 17.937 1.25 12m10.738-4.25c-2.287 0-4.04 1.532-4.243 3.334a.75.75 0 0 1-1.49-.168c.301-2.69 2.821-4.666 5.733-4.666c1.67 0 3.198.644 4.262 1.697V7.5a.75.75 0 0 1 1.5 0v1.622a1.35 1.35 0 0 1-1.35 1.35h-1.906a.75.75 0 0 1 0-1.5h.658c-.77-.74-1.89-1.222-3.164-1.222m.024 8.5c2.146 0 4.018-1.828 4.24-4.317a.75.75 0 0 1 1.495.134c-.28 3.126-2.682 5.683-5.735 5.683c-1.708 0-3.219-.807-4.262-2.062v.712a.75.75 0 0 1-1.5 0v-2.177c0-.746.604-1.35 1.35-1.35h1.906a.75.75 0 0 1 0 1.5h-.873c.79 1.158 2.027 1.877 3.38 1.877" clipRule="evenodd"/></svg>
  )
}

function Pagination({ info=null, reloadFunction=null, page, setPage, rowsPerPage, setRowsPerPage, totalRows }) {
  const { setQueryParameters } = React.useContext(ContextCrudApp3);
  const [pageButtons, setPageButtons] = useState([]);
  const [inforPressed, setInfoPressed] = useState(false);

  useEffect(() => {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    let buttons = [];

    if (page > 1) {
      buttons.push(1);
    }
    if (page > 3) {
      buttons.push('...');
    }
    for (let i = page - 2; i <= page + 2; i++) {
      if (i > 0 && i <= totalPages) {
        if (!buttons.includes(i)) {
          buttons.push(i);
        }
      }
    }
    if (page + 2 < totalPages) {
      buttons.push('...');
    }
    if (page < totalPages) {
      if (!buttons.includes(totalPages))
        buttons.push(totalPages);
    }

    setPageButtons(buttons);
  }, [page, rowsPerPage, totalRows]);

  return (
    <React.Fragment>
    <nav aria-label="Page navigation example">
      <ul className="pagination my-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPage(page - 1)} aria-label="Anterior" disabled={page === 1}>
            &laquo;
          </button>
        </li>
        {pageButtons.map((button, index) => (
          <li key={index} className="page-item">
            {typeof button === 'number' ? (
              <button className={`page-link ${button === page ? 'active' : ''}`} onClick={() => setPage(button)}>
                {button === page ? 'Página ': ''}{button}
              </button>
            ) : (
              <span className="page-link">{button}</span>
            )}
          </li>
        ))}
        <li className={`page-item ${page === Math.ceil(totalRows / rowsPerPage) ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPage(page + 1)} aria-label="Siguiente" disabled={page === Math.ceil(totalRows / rowsPerPage)}>
            &raquo;
          </button>
        </li>

        <li className={`ms-2 page-item disabled`}>
          <button className="page-link" disabled={true}>
           {totalRows} resultados
          </button>
        </li>
        <li className="ms-2 page-item">
          <select className="form-select" value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))}>
            <option value="10">Mostrar de a 10</option>
            <option value="20">Mostrar de a 20</option>
            <option value="50">Mostrar de a 50</option>
            <option value="100">Mostrar de a 100</option>
          </select>
        </li>
        {
          reloadFunction && (
            <li className="ms-2 page-item">
              <button className="btn btn-primary" onClick={reloadFunction}>
                <IconoRefrescar /> Recargar Resultados
              </button>
            </li>
          )
        }
        {
          info && (
            <li className="ms-2 page-item">
              <button className="btn btn-primary" onClick={() => setInfoPressed(!inforPressed)}>
                <IconoInfo color={inforPressed ? 'gray' : 'white'} /> Info
              </button>
            </li>
          )
        }
        
      </ul>
    </nav>
    {
      (info && inforPressed) && (
        info
      )
    }
    </React.Fragment>
  );
}

export default Pagination;
