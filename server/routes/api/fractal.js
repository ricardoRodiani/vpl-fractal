const express = require('express')
const mongodb = require('mongodb')
const LivyClient = require('livy-client')

const start = async (stmt) => {

	// Create client
	const livy = new LivyClient({
		host: 'localhost',
		port: '8998'
	})

	// Get sessions
	const sessions = await livy.sessions()
	for (session of sessions) {
		const status = await session.status()
		console.log(`Session id: ${status.id}, state: ${status.state}`)
	}

	// Create session
	const newSession = await livy.createSession({
        kind: 'spark'
	})

	// Listen event of a session
	newSession
		.on('starting', status => {
			console.log('Session starting... ' + status.log.slice(0, -1).slice(-1)[0].replace(/\n/g, ' '))
		})
		// Once ready, execute a code and kill the session
		.once('idle', async status => {
			const statement = await newSession.run({code: stmt})
			statement
				.on('running', status => {
					console.log(`Statement running... ${Math.round(status.progress*100)}/100%`)
				}).once('available', response => {
					console.log(`Statement completed. Result: `)
					console.log(response.output)
					// newSession.kill()
				})
		})

}


const router = express.Router()

// Request handler/endpoint
router.post("/upload", (req, res) => {
	if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
     // accessing the file
	 const myFile = req.files.file;
    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
});

module.exports = router
