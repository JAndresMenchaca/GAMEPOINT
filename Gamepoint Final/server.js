const express = require('express');
const mysql2 = require('mysql2');
const util = require('util');

const pool = mysql2.createPool({
    host: 'localhost',
    database: 'registros',
    user: 'root',
    password: ''
})

// Habilitando el soporte para trabajar con promises en las consultas
const query = util.promisify(pool.query).bind(pool);

const app = express();
app.use(express.json());

// Configurar la carpeta resources como contenido estático
app.use(express.static('./resources'));
app.use(express.static('./resources/vistas'));
app.use(express.static('./resources/vistas'));

const generateJsonResponse = (res, obj) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
}

app.get('/users', async (req, res) => {
    try {
        // Esperar a que el servidor de BD devuelva el resultado:
        let rows = await query('SELECT id, nombre, contrasenia, correo FROM usuarios');

        // Devolvemos los resultados
        generateJsonResponse(res, rows);
    } catch (e) {
        generateJsonResponse(res, { error: 'There was an error' });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        let rows = await query('SELECT id, nombre, contrasenia, correo FROM usuarios WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            generateJsonResponse(res, {error: 'El registro no existe'});
            return
        }

        generateJsonResponse(res, rows[0]);
    } catch (e) {
        generateJsonResponse(res, { error: e.message });
    }
})

app.post('/users', async (req, res) => {
    try {
        let user = req.body;
        let result = await query('INSERT INTO usuarios (nombre, contrasenia, correo) VALUES (?, ?, ?, ?)', 
                                 [ user.nombre, user.contrasenia, user.correo ]);
        generateJsonResponse(res, result);
    } catch (e) {
        generateJsonResponse(res, { error: e.message });
    }
})

app.put('/users', async (req, res) => {
    try {
        let user = req.body;
        let result = await query('UPDATE usuarios SET nombre = ?, contrasenia = ?, correo = ? WHERE id = ?', 
                                 [ user.nombre, user.contrasenia, user.correo, user.id ]);
        generateJsonResponse(res, result);
    } catch (e) {
        generateJsonResponse(res, { error: e.message });
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        let result = await query('DELETE FROM usuarios WHERE id = ?', [ req.params.id ]);
        generateJsonResponse(res, result);
    } catch (e) {
        generateJsonResponse(res, { error: e.message });
    }
})

app.listen(3000, () => {
    console.log('Servidor activo')
});
