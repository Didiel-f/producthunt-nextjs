import React, { useEffect, useState } from 'react';

export const useValidacion = (stateInicial, validar, fn) => {

    const [valores, setValores] = useState(stateInicial);
    const [errores, setErrores] = useState({});
    const [submitForm, setSubmitForm] = useState(false);
    
    useEffect(() => {
        if (submitForm) {
            const noErrores = Object.keys(errores).length === 0;

            if (noErrores) {
                fn(); // Función que se ejecuta en el componente.
            }

            setSubmitForm(false);
            
        }
    }, [errores]);

    // Función que se ejecuta cuando el usuario va escribiendo
    const handleChange = e => {
        setValores({
            ...valores,
            [e.target.name]: e.target.value
        });
    };
    
    // Función que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
        setSubmitForm(true);
    };

    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion)
    }
    
    
    return {
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleBlur
    };
};
