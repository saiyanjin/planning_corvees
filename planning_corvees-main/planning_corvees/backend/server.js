require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connect } = require("./config/mongo");

const app = express();

app.use(cors());
app.use(express.json());

connect();

app.use("/api/planning", require("./routes/planning.routes"));
app.use("/api/stats", require("./routes/stats.routes"));
app.use("/api/users", require("./routes/users.routes"));

const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend"))); 

app.get("/", (req, res) => {
  res.redirect("/views/index.html"); 
});


app.listen(3000, () => {
  console.log("-> Serveur lancée sur http://localhost:3000");
});





