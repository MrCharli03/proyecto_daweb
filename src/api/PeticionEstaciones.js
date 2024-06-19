// src/api/PeticionEstaciones.js

export const fetchEstaciones = async (jwtToken, nombre, codPostal, numPuestos, page, size) => {
    try {
        const response = await fetch(`http://localhost:8090/estaciones/listado?nombre=${nombre}&codPostal=${codPostal}&numPuestos=${numPuestos}&page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al realizar la solicitud.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const modificarEstacion = async (jwtToken, id, estacionData) => {
    try {
        const response = await fetch(`http://localhost:8090/estaciones/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(estacionData)
        });

        return response;
    } catch (error) {
        console.error('Error al modificar la estación:', error);
        throw error;
    }
};

export const eliminarEstacion = async (jwtToken, id) => {
    try {
        const response = await fetch(`http://localhost:8090/estaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        return response;
    } catch (error) {
        console.error('Error al eliminar la estación:', error);
        throw error;
    }
};

export const agregarEstacion = async (jwtToken, nuevaEstacion) => {
    try {
        const response = await fetch('http://localhost:8090/estaciones/estacionesBicicletas', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaEstacion)
        });

        return response;
    } catch (error) {
        console.error('Error al agregar la estación:', error);
        throw error;
    }
};

export const fetchBicicletasEstacion = async (jwtToken, idEstacion) => {
    try {
        const response = await fetch(`http://localhost:8090/estaciones/${idEstacion}/bicicletas?page=0&size=-1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las bicicletas');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const agregarBici = async (jwtToken, nuevaBici) => {
    try {
        const response = await fetch('http://localhost:8090/estaciones/bicicletas', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaBici)
        });

        return response;
    } catch (error) {
        console.error('Error al crear la bici:', error);
        throw error;
    }
};

export const alquilarBici = async (jwtToken, username, idBici) => {
    try {
        const response = await fetch(`http://localhost:8090/alquileres/usuarios/${username}/bicicletas/${idBici}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });

        return response;
    } catch (error) {
        console.error('Error al alquilar la bici:', error);
        throw error;
    }
};

export const reservarBici = async (jwtToken, username, idBici) => {
    try {
        const formData = new URLSearchParams();
        formData.append('idUsuario', username);
        formData.append('idBici', idBici);

        const response = await fetch(`http://localhost:8090/alquileres/reservas`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        return response;
    } catch (error) {
        console.error('Error al reservar la bici:', error);
        throw error;
    }
};

export const darBajaBici = async (jwtToken, idBici, motivo) => {
    try {
        const response = await fetch(`http://localhost:8090/estaciones/bicicletas/${idBici}?motivo=${motivo}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ motivo })
        });

        return response;
    } catch (error) {
        console.error('Error al dar de baja la bici:', error);
        throw error;
    }
};
