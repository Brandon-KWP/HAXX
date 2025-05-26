const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const connectDb = require("./src/database/connect.js");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const session = require("express-session");

const locals = require('./src/middleware/locals.js');

const PORT = process.env.PORT || 3008;

/* ------------------------------ */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", "views/pages");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.use(locals);

/* ------------------------------ */

// database
connectDb();

/* ------------------------------ */

// importation et appel de la route
const adminRoute = require("./src/routes/admin.js");
app.use(adminRoute);

const authRoute = require("./src/routes/auth.js");
app.use('/',authRoute);

const eventRoute = require("./src/routes/event.js");
app.use(eventRoute);

const mainRoute = require("./src/routes/main.js");
app.use(mainRoute);

const notificationRoute = require('./src/routes/notification.js');
app.use(notificationRoute);

const projetRoute = require("./src/routes/projet.js");
app.use(projetRoute);

const userRoute = require('./src/routes/user.js');
app.use(userRoute);

/* ------------------------------ */

// demarrage su serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
