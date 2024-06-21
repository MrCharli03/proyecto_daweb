import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GitHubCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const base64Credenciales = params.get('credenciales');

        if (base64Credenciales) {
            const jsonResponse = atob(base64Credenciales);
            const { token, rol, username } = JSON.parse(jsonResponse);

            if (token) {
                sessionStorage.setItem('jwtToken', token);
                sessionStorage.setItem('userRole', rol);
                sessionStorage.setItem('username', username);
                navigate('/principal');
            }
        }
    }, [location, navigate]);

    return (
        <div>
            Redirigiendo...
        </div>
    );
}

export default GitHubCallback;
