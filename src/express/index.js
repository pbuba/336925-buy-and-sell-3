"use strict";

const express = require(`express`);
const path = require(`path`);

const mainRoutes = require(`./routes/mainRoutes`);
const registerRoutes = require(`./routes/register`);
const loginRoutes = require(`./routes/login`);
const myRoutes = require(`./routes/my`);
const offersRoutes = require(`./routes/offers`);
const searchRoutes = require(`./routes/search`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/register`, registerRoutes);
app.use(`/login`, loginRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);
app.use(`/search`, searchRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT, () => {
  console.log(`Сервер запущен на порту ${DEFAULT_PORT}`);
});
