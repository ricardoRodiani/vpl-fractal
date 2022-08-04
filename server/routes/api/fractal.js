const express = require('express')
const LivyClient = require('livy-client')

const router = express.Router();

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

router.post('/', (req, res) => {
	
})


router.post('/upload', async (req, res) =>  {
	try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let file = req.files.file;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            file.mv('./public/' + file.name);

            //send response
            res.send({
                status: true,
                message: `File "${file.name}" was uploaded`,
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

function validateCookie(req, res, next){
	const { cookies } = req;
	if('session_id' in cookies){
		console.log('Session ID Exists.')
		if(cookies.session_id === '1234'){
			next()
		}else{
			res.status(403).send({msg: 'Not auth'})
		}
	}
	next()
}

router.get('/signin', validateCookie, (req, res) => {
	res.cookie('session_id', '1234')
	res.status(200).json({msg: 'Logged In.'})
})

module.exports = router
