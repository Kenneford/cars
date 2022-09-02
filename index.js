const dotenv = require("dotenv");
dotenv.config();
const express = require("express");

const { Pool } = require("PG");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

const pool = new Pool({
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: true,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => {
  res.send(`<h1>Buy a Car</h1>`);
});

app.get("/car", (req, res) => {
  pool
    .query("SELECT * FROM cars;")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

//Params
app.get("/car/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM users WHERE id=$1;", [id])
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

app.post("/car", (req, res) => {
  console.log(req.body);
  pool
    .query(
      `
        insert into cars (model, color, year, country, number_doors)
        values ($1, $2, $3, $4, $5) returning *;
        `,
      [
        req.body.model,
        req.body.color,
        req.body.year,
        req.body.country,
        req.body.numberOfDoors,
      ]
    )
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(400).send({
        error: err.message,
      });
    });
});

console.log(process.env.PG_DATABASE);
app.listen(port, () => console.log(`Server listening at port ${port}`));
