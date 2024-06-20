const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000; 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/usuarios/register', async (req, res) => {
    try {
        const userData = req.body;

        const registerResponse = await fetch('http://localhost:8090/usuarios/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (registerResponse.status === 204) {
            return res.status(204).send();
        } else {
            return res.status(400).send('Error en el registro. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error en la conexión o en el servidor.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor intermediario ejecutándose en el puerto ${PORT}`);
});
