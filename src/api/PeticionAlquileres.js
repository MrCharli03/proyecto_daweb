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
        throw new Error('Error fetching reservations.');
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
        const errorDetails = await response.json();
        throw new Error(`Error fetching stations: ${errorDetails.message || 'Unknown error'}`);
    }

    const data = await response.json();
    if (data.hasOwnProperty('_embedded')) {
        return data._embedded.estacionDTOList;
    } else {
        throw new Error('Error: no stations found in the response.');
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

    return await response.json();
};
