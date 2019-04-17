const express = require("express");

const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

app.use((req, res, next) => {
  console.log("request is" + req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Ha Ha I am here and up");
});

app.post("/msg", (req, res) => {
  console.log(req.body);
  res.send("I have recieved you message " + req.body);
});

const isProduction = process.env.NODE_ENV !== "production";
if (isProduction) {
  app.use(express.static("/react-app/build"));
  app.get("*", (req, res) => {
    res.sendfile("/react-app/build/index.html");
  });
}
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
