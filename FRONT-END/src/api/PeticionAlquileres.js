const baseUrl = 'http://localhost:8090';

export const fetchReservas = async (username, jwtToken) => {
    const response = await fetch(`${baseUrl}/alquileres/usuarios/${username}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (response.status === 404) {
        return { error: 'No reservations or rentals found' };
    } else if (!response.ok) {
        throw new Error('Error al realizar la solicitud fetchReservas.');
    } else {
        return await response.json();
    }
};

export const fetchBici = async (jwtToken) => {
    const response = await fetch(`${baseUrl}/estaciones/bicicletas`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Error fetching bikes.');
    }

    return await response.json();
};

export const fetchEstaciones = async (jwtToken) => {
    const response = await fetch(`${baseUrl}/estaciones/listado?nombre=&codPostal=&numPuestos=&page=0&size=-1`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al realizar la solicitud fetchBicis.');
    }

    const data = await response.json();
    if (data.hasOwnProperty('_embedded')) {
        return data._embedded.estacionDTOList;
    } else {
        throw new Error('Error: no se encontraron estaciones en la respuesta.');
    }
};

export const aparcarBici = async (username, estacionId, jwtToken) => {
    const response = await fetch(`${baseUrl}/alquileres/usuarios/${username}/estaciones/${estacionId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Error parking the bike.');
    }

    // Handle empty response body
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};
};
