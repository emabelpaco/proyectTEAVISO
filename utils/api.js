class Api {

    searchMessagePicto = async (mensaje) => {
        console.log("Ingrese a la api....")
        const url = 'http://sesat.fdi.ucm.es:8080/servicios/rest/pictograma/frase/';
        //const method = "api/users/login/";

        const endpoint = `${url}${mensaje}`;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'text/html', Accept: 'text/html' }
            //body: JSON.stringify({ email: nombreUsuario, password: password })
        };
        await fetch(endpoint, requestOptions)
            .then((response) => {
                
                if (response.status === 200) {
                    console.log("devolviooo: ", response)
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(response, 'text/html');
                    console.log("devolviooo html : ", htmlDoc)
                    return htmlDoc;
                }
                throw new Error(response.status);
            // }).then(responseData => {
            //     // console.log("respuesta bruta",responseData);
            //     //Obtengo resultados
            //     const results = responseData.user;
            //     resultadoLogin(results, null);
            }).catch(error => {
                console.log(error);
                resultadoLogin(null, error);
            });
    }

    // login(nombreUsuario, password, resultadoLogin) {
    //     const url = 'https://my-budget-backend.herokuapp.com/';
    //     const method = "api/users/login/";

    //     const endpoint = `${url}${method}`;
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //         body: JSON.stringify({ email: nombreUsuario, password: password })
    //     };
    //     fetch(endpoint, requestOptions)
    //         .then((response) => {
    //             if (response.status === 201) {
    //                 return response.json();
    //             }
    //             throw new Error(response.status);
    //         }).then(responseData => {
    //             // console.log("respuesta bruta",responseData);
    //             //Obtengo resultados
    //             const results = responseData.user;
    //             resultadoLogin(results, null);
    //         }).catch(error => {
    //             console.log(error);
    //             resultadoLogin(null, error);
    //         });
    // }

    // registro(mail, nombre, apellido, password, resultadoRegistro) {
    //     const url = 'https://my-budget-backend.herokuapp.com/';
    //     const method = "api/users/registration/";

    //     const endpoint = `${url}${method}`;
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //         body: JSON.stringify({ email: mail, password: password, nombre: nombre, apellido, apellido })
    //     };
    //     fetch(endpoint, requestOptions)
    //         .then((response) => {
    //             if (response.status === 201) {
    //                 return response.json();
    //             }
    //             throw new Error(response);
    //         }).then(responseData => {
    //             // console.log("respuesta bruta",responseData);
    //             //Obtengo resultados
    //             const results = responseData.user;
    //             resultadoRegistro(results, null);
    //         }).catch(error => {
    //             // console.log(error);
    //             resultadoRegistro(null, error);
    //         });
    // }

    // enviarMail(nombreUsuario, egresos, cuentas, ingresos, presupuestos, prestamos, tarjetas, inversiones, resumenes, resultadoMail) {
    //     const url = 'https://my-budget-backend.herokuapp.com/';
    //     const method = "api/users/enviarMail/";
    //     console.log(tarjetas);
    //     const endpoint = `${url}${method}`;
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //         body: JSON.stringify({ email: nombreUsuario, egresos: egresos, cuentas: cuentas, ingresos: ingresos, presupuestos: presupuestos, prestamos: prestamos, tarjetas: tarjetas, inversiones: inversiones, resumenes: resumenes})
    //     };
    //     fetch(endpoint, requestOptions)
    //         .then((response) => {
    //             if (response.status === 200) {
    //                 return response.json();
    //             }
    //             throw new Error(response.status);
    //         }).then(responseData => {
    //             // console.log("respuesta bruta",responseData);
    //             //Obtengo resultados
    //             const results = responseData.backup;
    //             resultadoMail(results, null);
    //         }).catch(error => {
    //             // console.log(error);
    //             resultadoMail(null, error);
    //         });
    // }

}
export default new Api();