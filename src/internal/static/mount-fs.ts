/**
 * @internal mount-fs
 * @description virtual file system mount hooks
 */
import { join, resolve } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { HTTPuppyServer } from '../../types';
import useContentType from '../content-type';
import { HTTPuppyRequest, HTTPuppyResponse, MountedFile, UserStaticConfig, VirtualFileSystem } from '../../types/server';
import { useStaticURLParser } from './url';
import {
	isBufferType,
	useVirtualStreamReader,
	useWriter
} from '../writer';
import { HTTPHeader } from 'src/types/http';

/**
 * @function useCleanPaths
 * @description list possible hrefs to be used for given vpath
 * @param file the path of the file to check any aliases for
 * @param _static the static config options of the calling process
 * @returns list of strings defining possible hrefs
 */
function useCleanPaths(
	file	: string,
	_static : HTTPuppyServer.UserStaticConfig
): string[] {
	const pathOptions = [
		`${_static.href ?? ''}${file}`
	];
	if(file === 'index.html') {
		pathOptions.push(`${_static.href ?? ''}`);
	}
	return pathOptions;
}

/**
 * @param server config options for the runtime that wants to mount an FS
 * @returns
 */
export function useMountedFS(
	server : HTTPuppyServer.Runtime
): VirtualFileSystem {
	// mountedPath is the path to retrieve filesMounted from
	const mountedPath = join(server.pConfig.static?.path ?? '');
	// filesMounted is the accessible file tree that can be used against the upcoming handlers
	const mountedFiles = readdirSync(mountedPath).map(file => {
	const symLink = resolve(mountedPath, file);
		return <MountedFile>{
			fileName: file,
			symLink,
			contentType: <HTTPHeader>useContentType(symLink),
			content: readFileSync(symLink),
			hrefs: useCleanPaths(file, <UserStaticConfig>server.pConfig.static)
		};

	});
	return {
		mountedPath,
		mountedFiles
	};
}

export function useVirtualRequestHandler(
	req		: HTTPuppyRequest,
	res		: HTTPuppyResponse
): void {
	const virtualFile = useStaticURLParser(req, res);
	if(isBufferType(<string>req.url)) {
		return useVirtualStreamReader(virtualFile, res);
	}
	else {
		return useWriter(res, res._process.pConfig, {
			status: 200,
			statusText: 'ok',
			type: virtualFile.contentType[1],
			virtualFile
		});
	}
}
