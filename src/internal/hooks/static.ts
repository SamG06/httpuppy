import { iServer, Server } from '../../types';
import { useFSHandler } from '../../request';

export function useStaticMount(
	config: Required<iServer.UserHTTPConfig>,
	server: Server,
	diagnostics
) {
	// mount configured FS path to the request handler
	server.on('request', (req, res) => {
		console.log(req.url);
		useFSHandler(req, res, config);
	});
}
