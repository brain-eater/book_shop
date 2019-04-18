const express = require("express");
const mysql = require("mysql");

const DB_NAME = "book_shop";

const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

const _isProduction = process.env.NODE_ENV == "production";

const connectServer = function(req, res, next) {
  let connectionDetails = {
    host: "localhost",
    user: "root",
    password: "tiluck",
    socketPath: "/tmp/mysql.sock",
    database: DB_NAME
  };

  if (_isProduction) {
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

  req.con = con;
  next();
};

app.use(connectServer);
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
  const query = req.con.query(
    "select * from books where title = ?",
    [req.body],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        return res.end();
      }
      if (rows.length == 0) {
        res.send("Book not found ");
        return;
      }

      console.log(rows);
      res.send(rows[0].author_fname + " " + rows[0].author_lname);
    }
  );
  console.log(query.sql);
});

if (_isProduction) {
  app.use(express.static("react-app/build"));
  app.get("*", (req, res) => {
    res.sendfile("react-app/build/index.html");
  });
  app.get("/", (req, res) => {
    res.sendfile("react-app/build/index.html");
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
