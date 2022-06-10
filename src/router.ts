/**
 * @module router
 * @description for adding custom routing to your server
 */
import {
	Runtime,
	HTTPuppyRouter,
	HTTPuppyCallback
} from './types';
import {
	useHTTPHandle
} from './internal';

/**
 * @function useRouter
 * @example
 * ```javascript
* const app = useServer({...});
* const router = useRouter(app);
* router.get('/test', (req, res) => res.end('hello'));
* ```
 * @param attachTo
 * @returns
 */
export function useRouter(
	server: Runtime, // server to attach the router to as a handler
	routerOptions ?: any // placeholder: planned feature
): HTTPuppyRouter {
	// router callback choices
	// todo: setup glob handler functionality if config option is set
	function get(
		url: string,
		cb: typeof HTTPuppyCallback
	): void {
		useHTTPHandle('GET', url, server, cb);
	}

	function post(
		url: string,
		cb: typeof HTTPuppyCallback
	): void {
		useHTTPHandle('POST', url, server, cb);
	}

	function head(
		url: string,
		cb: typeof HTTPuppyCallback
	): void {
		useHTTPHandle('HEAD', url, server, cb);
	}

	function put(
		url: string,
		cb: typeof HTTPuppyCallback
	): void {
		useHTTPHandle('PUT', url, server, cb);
	}

	function patch(
		url: string,
		cb: typeof HTTPuppyCallback
	): void {
		useHTTPHandle('PATCH', url, server, cb);
	}

	function _delete(
		url: string,
		cb: typeof HTTPuppyCallback
	): void {
		useHTTPHandle('DELETE', url, server, cb);
	}

	return <HTTPuppyRouter>{
		get,
		head,
		post,
		put,
		patch,
		delete: _delete,
	};
}
