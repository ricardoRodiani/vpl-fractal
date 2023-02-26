const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const sessions = require("express-session");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(
  sessions({
    secret: "____frkt",
    cookie: {
      maxAge: 200000,
      secure: false,
    },
    saveUninitialized: false,
    resave: false,
    unset: "destroy",
  })
);
const fractal = require("./routes/api/fractal");

app.use("/fractal", fractal);

const port = process.env.PORT || 3080;

app.listen(port, () => console.log(`Sever started on port ${port}`));
