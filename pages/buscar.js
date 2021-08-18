import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DetallesProducto } from '../components/layout/DetallesProducto';
import { Layout } from '../components/layout/Layout';
import useProductos from '../hooks/useProductos';

export default function Buscar() {

  const router = useRouter();
  const { query: { q} } = router;

  // Todos los productos
  const { productos } = useProductos('creado');
  const [resultado, setResultado] = useState([]);

  useEffect(() => {
    const busqueda = q.toLocaleLowerCase();
    const filtro = productos.filter( producto => {
      return (
        producto.nombre.toLocaleLowerCase().includes(busqueda) || producto.descripcion.toLocaleLowerCase().includes(busqueda)
      )
    } );
    setResultado(filtro);  
  }, [q, productos]);
  
  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              { resultado.map( producto => (
                <DetallesProducto 
                  key={ producto.id }
                  producto={ producto }
                />
              ) ) }
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}