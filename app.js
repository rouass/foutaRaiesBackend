require('dotenv').config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());
// Connect to MongoDB
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI,

  )
  .then(() => {
    console.log("Connected to database!");
   })

  .catch((err) => {
    console.error("Connection failed:", err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  next();
});


const subcategoriesRoute = require('./routes/subcategories');
const foutaRoute = require('./routes/fouta');
const subModelRoute = require('./routes/subModel');
const devisRoute = require('./routes/devis');
const usersRoute = require('./routes/user')

app.use('/categories', categoryRoutes);
app.use('/subcategories', subcategoriesRoute);
app.use('/foutas', foutaRoute);
app.use('/submodels', subModelRoute);
app.use('/devis', devisRoute);
app.use('/users', usersRoute);




module.exports = app;
