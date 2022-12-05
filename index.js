//Imports
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
dotenv.config({ path: "./.env" });

//App
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Routes
const home_routes = require("./routes/homeRoutes");
const user_routes = require("./routes/userRoutes");
const detail_routes = require("./routes/detailsRouter");
const favorite_routes = require("./routes/favoriteRoutes");
const games_routes = require("./routes/gamesRouter");
app.use("/", user_routes);
app.use("/home", home_routes);
app.use("/details", detail_routes);
app.use("/favorites", favorite_routes);
app.use("/games", games_routes);

//Mongoose
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MonogoDb Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error connecting to MongoDb: ${err}`);
  }
};
connectDb();

//Server
const PORT = 8080;
app.listen(PORT, console.log(`Server running on ${PORT}`));
