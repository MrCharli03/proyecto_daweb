export const fetchReservas = async (username, jwtToken) => {
    try {
        const response = await fetch(`http://localhost:8090/alquileres/usuarios/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { status: 404, data: null };
            } else {
                throw new Error('Error al realizar la solicitud fetchReservas.');
            }
        }

        const data = await response.json();
        return { status: response.status, data: data.reservas };

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const fetchBicis = async (jwtToken) => {
    try {
        const response = await fetch(`http://localhost:8090/estaciones/bicicletas`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al realizar la solicitud fetchBicis.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const fetchEstaciones = async (jwtToken) => {
    try {
        const response = await fetch(`http://localhost:8090/estaciones/listado?nombre=&codPostal=&numPuestos=&page=0&size=-1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al realizar la solicitud fetchEstaciones.');
        }

        const data = await response.json();
        if (data.hasOwnProperty('_embedded')) {
            return data._embedded.estacionDTOList;
        } else {
            throw new Error('Error al obtener las estaciones');
        }

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
