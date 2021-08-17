import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import { Layout } from '../components/layout/Layout';
import { Campo, Error, Formulario, InputSubmit } from '../components/ui/Formulario';
import { useValidacion } from '../hooks/useValidacion';
import { validarCrearCuenta } from '../validacion/validarCrearCuenta';

import firebase, { FirebaseContext } from '../firebase';
import { validarCrearProducto } from '../validacion/validarCrearProducto';
import { Error404 } from '../components/layout/404';


const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  // imagen: '',
  url: '',
  descripcion: ''
};

export default function NuevoProducto() {

  // State de las imagenes
  const [nombreimagen, setNombreimagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlimagen, setUrlimagen] = useState('');

  const [error, setError] = useState(false);
  
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur} = useValidacion( STATE_INICIAL, validarCrearProducto, crearProducto );

  const { nombre, empresa, url, descripcion } = valores;
    
  // Hook de routing para redireccionar
  const router = useRouter();
  
  // Context con las operaciones CRUD de Firebase
  const { usuario, firebase } = useContext(FirebaseContext);
    
  async function crearProducto() {

    // Si el usuario no está autenticado llevar al login
    if (!usuario) {
      return router.push('/login');
    }

    // Crear el objeto de nuevo producto
    const producto = {
      nombre, 
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    }

    // Insertar en la base de datos
    firebase.db.collection('productos').add(producto);

    return router.push('/');
  };

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };
 
  const handleProgress = progreso => setProgreso({ progreso });
 
  const handleUploadError = error => {
    setSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = (nombre) => {
    setProgreso(100);
    setSubiendo(false);
    setNombreimagen(nombre)
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then( url => {
        console.log(url)
        setUrlimagen(url);
      } );
  };
  
  
  return (
    <div>
      <Layout>
        { !usuario ? <Error404 /> : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo producto</h1>
            <Formulario
              onSubmit={ handleSubmit }
            >
              <fieldset>
                <legend>Información general</legend>
                
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text"
                    id="nombre"
                    placeholder="Nombre del producto"
                    name="nombre"
                    value={ nombre }
                    onChange={ handleChange }
                    onBlur={handleBlur}
                  />
                </Campo>

                { errores.nombre && <Error>{ errores.nombre }</Error> }
        
                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input 
                    type="text"
                    id="empresa"
                    placeholder="Nombre empresa o compañía"
                    name="empresa"
                    value={ empresa }
                    onChange={ handleChange }
                    onBlur={handleBlur}
                  />
                </Campo>
                { errores.empresa && <Error>{ errores.empresa }</Error> }

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader 
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input 
                    type="url"
                    id="url"
                    placeholder="URL de tu producto"
                    name="url"
                    value={ url }
                    onChange={ handleChange }
                    onBlur={handleBlur}
                  />
                </Campo>
                { errores.url && <Error>{ errores.url }</Error> }
              </fieldset>

              <fieldset>
                <legend>Sobre tu producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripcion</label>
                  <input 
                    type="descripcion"
                    id="descripcion"
                    name="descripcion"
                    value={ descripcion }
                    onChange={ handleChange }
                    onBlur={handleBlur}
                  />
                </Campo>
                { errores.descripcion && <Error>{ errores.descripcion }</Error> }
              
              </fieldset>

              { error && <Error>{ error }</Error> }


              <InputSubmit 
                type="submit"
                value="Crear producto"
              />
              
            </Formulario>
          </>
        ) }
      </Layout>
    </div>
  )
}