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

app.listen(3000, () => {
  console.log("-> API lancée sur http://localhost:3000");
});
