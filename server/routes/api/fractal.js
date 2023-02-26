const express = require("express");
const LivyClient = require("livy-client");
const router = express.Router();
const path = require("path");

let pathFileUploaded;

router.post("/runcode", async (req, res) => {
  start(req, res);
});

router.post("/upload", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let file = req.files.file;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      file.mv("./public/" + file.name);

      //send response
      res.send({
        status: true,
        message: `File "${file.name}" was uploaded`,
        data: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
        },
      });
      pathFileUploaded = "/" + file.name;
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

const start = async (req, res) => {
  let relativePath = "./public";
  let absolutePath = path.resolve(relativePath);
  const stmt = req.body.stmt.replace(
    "REPLACE_PATH",
    absolutePath + pathFileUploaded
  );
  // Create client
  const livy = new LivyClient({
    host: "localhost",
    port: "8998",
  });

  // Get sessions
  const sessions = await livy.sessions();
  for (session of sessions) {
    const status = await session.status();
    console.log(`Session id: ${status.id}, state: ${status.state}`);
  }

  // Create session
  const newSession = await livy.createSession({
    kind: "spark",
    name: "fractal_client",
    jars: [
      "/home/unix/libs_tcc/fractal/fractal-core/build/libs/fractal-core-SPARK-2.2.0.jar",
      "/home/unix/libs_tcc/spark/jars/scala-library-2.11.8.jar",
    ],
  });

  // Listen event of a session
  newSession
    .on("starting", (status) => {
      console.log(
        "Session starting... " +
          status.log.slice(0, -1).slice(-1)[0].replace(/\n/g, " ")
      );
    })
    // Once ready, execute a code and kill the session
    .once("idle", async (status) => {
      const statement = await newSession.run({ code: stmt });
      statement
        .on("running", (status) => {
          console.log(
            `Statement running... ${Math.round(status.progress * 100)}/100%`
          );
        })
        .once("available", (response) => {
          console.log(`Statement completed. Result: `);
          console.log(response.output);
          newSession.kill();
          res.send(response.output);
        });
    });
};

module.exports = router;
