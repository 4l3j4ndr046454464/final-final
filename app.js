// app.js
// Código con errores intencionales para análisis en Jenkins y SonarQube

const http = require("http");
const url = require("url");
const fs = require("fs");

// Variable global (mala práctica)
let usuarios = [];

// Función insegura: no valida entradas, no usa try/catch
function guardarUsuario(nombre, edad) {
    usuarios.push({ nombre: nombre, edad: edad });
    fs.writeFileSync("usuarios.txt", JSON.stringify(usuarios)); // bloqueo y inseguro
}

// Servidor web vulnerable
http.createServer(function (req, res) {
    const query = url.parse(req.url, true).query;

    // XSS: devuelve entrada sin sanitizar
    if (query.nombre) {
        guardarUsuario(query.nombre, query.edad);
        res.write("<h1>Usuario guardado: " + query.nombre + "</h1>");
    }

    // Ruta insegura: expone información del sistema
    if (req.url === "/logs") {
        const logs = fs.readFileSync("usuarios.txt", "utf8");
        res.write("<pre>" + logs + "</pre>");
    }

    res.end();
}).listen(3000);

// Falta validación, sanitización, manejo de errores, separación por capas,
// uso seguro de archivos, y muchas buenas prácticas más.
