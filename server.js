const express = require("express");
const mysql = require("mysql");

const DB_NAME = "book_shop";

const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

const isProduction = process.env.NODE_ENV == "production";

let connectionDetails = {
  host: "localhost",
  user: "root",
  password: "tiluck",
  socketPath: "/tmp/mysql.sock",
  database: DB_NAME
};

if (isProduction) {
  connectionDetails = {
    host: "us-cdbr-iron-east-02.cleardb.net",
    user: "b3dd679fbf3e46",
    password: "a87f5575",
    database: "heroku_33b24fdaceb1972"
  };
}

const con = mysql.createConnection(connectionDetails);

con.connect(err => {
  if (err) return console.log(err);
  console.log("connected to sql server  ");
});

// con.query("use " + DB_NAME, err => {
//   if (err) return console.log("database connection error : " + err);
//   console.log("using " + DB_NAME + " database");
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

app.use((req, res, next) => {
  console.log("request is" + req.url);
  next();
});

app.post("/msg", (req, res) => {
  res.send("I have recieved you message " + req.body);
});

app.post("/getAuthor", (req, res) => {
  let query = con.query(
    "select * from books where title = ?",
    [req.body],
    (err, rows, fields) => {
      if (err) return console.log(err);
      if (rows.length == 0) {
        res.send("Book not found ");
        return;
      }
      res.send(rows[0].author_fname + " " + row[0].author_lname);
    }
  );
  console.log(query.sql);
});

if (isProduction) {
  app.use(express.static("react-app/build"));
  app.get("*", (req, res) => {
    res.sendfile("react-app/build/index.html");
  });
  app.get("/", (req, res) => {
    res.sendfile("react-app/build/index.html");
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
