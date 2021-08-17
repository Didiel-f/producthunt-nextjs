import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import { Layout } from '../components/layout/Layout';
import { Campo, Error, Formulario, InputSubmit } from '../components/ui/Formulario';
import { useValidacion } from '../hooks/useValidacion';
import { validarIniciarSesion } from '../validacion/validarIniciarSesion';

import firebase from '../firebase';

const STATE_INICIAL = {
  email: '',
  password: ''
};

export default function Login() {

  const [error, setError] = useState(false);
  
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur} = useValidacion( STATE_INICIAL, validarIniciarSesion, iniciarSesion );

    const { email, password } = valores;
    
    async function iniciarSesion() {
      try {
        const usuario = await firebase.login(email, password);
        console.log(usuario);
        Router.push('/');
      } catch (error) {
        console.log('Hubo un error al autenticar el usuario', error.message);
        setError(error.message);  
      }
    }
  
  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Iniciar sesión</h1>
          <Formulario
            onSubmit={ handleSubmit }
          >
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
              value="Iniciar sesión"
            />
            
          </Formulario>
        </>
      </Layout>
    </div>
  )
}