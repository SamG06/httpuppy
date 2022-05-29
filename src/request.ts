import {
	HTTP_INCMSG,
	HTTP_RES,
	HTTPuppyOptions,
	iPuppy
} from './types';
import { useVFSResponse } from './url';
import { emitWarning } from 'process';
import { useHeaders } from './middleware';
import { createReadStream } from 'fs';
import useContentType from './internal/hooks/content-type';
import { MountedFile } from './types/server';

const bufferTypes = [
	'png',
	'jpg',
	'jpeg',
	'apng',
	'webp',
	'gif',
	'avif',
	'mp4',
	'mp3',
	'wav',
	'webm',
	'bmp',
	'ico',
	'tiff'
];

function isBufferType(file: string) {
	return bufferTypes.filter((el) => file.includes(el)).length > 0;
}

/**
 *
 * @param res internal response to be written to
 * @returns nothing
 */
function use404(
	res: HTTP_RES
): void {
	res.writeHead(404, '404: page not found');
	res.end('404: page not found');
	return;
}
/**
 *
 * @param res the response to write to
 * @param config the config to base the write on
 * @param options the writer instance options
 * @returns
 */
function useWrite(
	res: HTTP_RES,
	config: HTTPuppyOptions.UserHTTPConfig,
	options: iPuppy.HTTPuppyWriterOptions
): void {
	res.writeHead(options.status, options.statusText, useHeaders(options, config));
	return useStreamReader(options.virtualFile, res);
}

function useStreamReader(
	pathData: MountedFile,
	res: HTTP_RES
): void {
	const stream = createReadStream(pathData.symLink);
	stream.on('data', (chunk) => {
		// get content type of
		res.writeHead(200, 'ok', useContentType(pathData.symLink));
		res.write(chunk);
	});
	// end response when data is done streaming from file
	stream.on('end', _ => res.end());
	return;
}
/**
 *
 * @param req incoming message to handle args from
 * @param res response message to send
 * @param config config from server
 * @returns
 */
export function useFSHandler(
	req		: HTTP_INCMSG,
	res		: HTTP_RES,
	config	: HTTPuppyOptions.UserHTTPConfig
): void {
	const pathData = useVFSResponse(req, config);
	if(isBufferType(req.url)) {
		// handle as stream reader
		return useStreamReader(pathData, res);
	}
	else {
		try {
			return useWrite(res, config, {
				status: 200,
				statusText: 'ok',
				type: pathData.contentType,
				virtualFile: pathData
			});
		}
		catch(e) {
			emitWarning(e);
			return use404(res);
		}
	}
}
