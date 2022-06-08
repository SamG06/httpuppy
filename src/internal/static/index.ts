import { useVirtualRequestHandler } from './mount-fs';
// import { isMainThread } from 'worker_threads';
import {
	Runtime,
	HTTPuppyRequest,
	HTTPuppyResponse
 } from '../../types';

export function useStaticHandler(
	server: Runtime
) {
	server.on('request', (
		req: HTTPuppyRequest,
		res: HTTPuppyResponse
	) => {
		req._process = server;
		res._process = server;
		if(server.pConfig.static && req.method === 'GET') {
			//console.log(isMainThread);
			// static only handles get requests, so after validating those check on the path and if its there, send it
			const hasValidPath = req._process._vfs.mountedFiles.map(file => file.hrefs).flat().includes(<string>req.url);
			if(hasValidPath) {
				useVirtualRequestHandler(req, res);
			}
			// todo check for api path
		}
	});
}

export * from './mount-fs';
export * from './url';
