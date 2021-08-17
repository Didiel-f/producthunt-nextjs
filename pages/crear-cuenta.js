import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import { Layout } from '../components/layout/Layout';
import { Campo, Error, Formulario, InputSubmit } from '../components/ui/Formulario';
import { useValidacion } from '../hooks/useValidacion';
import { validarCrearCuenta } from '../validacion/validarCrearCuenta';

import firebase from '../firebase';

const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
};

export default function CrearCuenta() {

  const [error, setError] = useState(false);
  
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur} = useValidacion( STATE_INICIAL, validarCrearCuenta, crearCuenta );

    const { nombre, email, password } = valores;
    
  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.log('Hubo un error al crear el usuario', error.message);
      setError(error.message);
    }
  };
  
  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Crear cuenta</h1>
          <Formulario
            onSubmit={ handleSubmit }
          >
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input 
                type="text"
                id="nombre"
                placeholder="Tu nombre"
                name="nombre"
                value={ nombre }
                onChange={ handleChange }
                onBlur={handleBlur}
              />
            </Campo>

            { errores.nombre && <Error>{ errores.nombre }</Error> }
    
            <Campo>
              <label htmlFor="email">Email</label>
              <input 
                type="text"
                id="email"
                placeholder="Tu email"
                name="email"
                value={ email }
                onChange={ handleChange }
                onBlur={handleBlur}
              />
            </Campo>

            { errores.email && <Error>{ errores.email }</Error> }


            <Campo>
              <label htmlFor="password">Password</label>
              <input 
                type="password"
                id="password"
                placeholder="Tu password"
                name="password"
                value={ password }
                onChange={ handleChange }
                onBlur={handleBlur}
              />
            </Campo>

            { errores.password && <Error>{ errores.password }</Error> }
            { error && <Error>{ error }</Error> }


            <InputSubmit 
              type="submit"
              value="Crear cuenta"
            />
            
          </Formulario>
        </>
      </Layout>
    </div>
  )
}