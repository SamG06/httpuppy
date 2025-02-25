const { useServer, useRouter } = require('../lib');

const app = useServer({
	static: {
		path: './examples/files'
	},
	log: {
		logLevel: 'base'
	},
	port: 3000,
	clustered: true,
	onMount: () => console.log('server started, open browser to port 3000')
});

const endpoint = useRouter(app);
endpoint.get('/test', (req, res) => res.send('hello'));
endpoint.get('/test1', (req, res) => res.json({foo: "bar"}));
app.start();
