const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;
app.use(express.json());
  
let users = [
  { id: 1, nombre: "Miguel" },
  { id: 2, nombre: "Ana" },
  { id: 3, nombre: "Carlos" },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/users", (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  user ? res.json(user) : res.status(404).json({ error: "Usuario no encontrado" });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado
 */
app.post("/users", (req, res) => {
  const nuevoUsuario = { id: Date.now(), nombre: req.body.nombre };
  users.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
app.put("/users/:id", (req, res) => {
  const userIndex = users.findIndex((u) => u.id == req.params.id);
  if (userIndex !== -1) {
    users[userIndex].nombre = req.body.nombre;
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
app.delete("/users/:id", (req, res) => {
  const userIndex = users.findIndex((u) => u.id == req.params.id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({ message: "Usuario eliminado" });
  } else {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuarios",
      version: "1.0.0",
      description: "CRUD básico con Express y Swagger",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./index.js"], // Documentación en este archivo
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Documentación en http://localhost:${port}/api-docs`);
});
