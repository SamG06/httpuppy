#! /usr/bin/env node
const { useCLIConfigFinder } = require('../lib/internal/config');
const { useColorTag } = require('../lib/internal/include');
const { useServer } = require('../lib');
const cluster = require('cluster');
const { log } = console;

useCLIConfigFinder().then(config => {
	if((!config.log || config.log.log_level !== 'silent') && cluster.isPrimary) {
		log(useColorTag('blue', 'httpuppy config:'))
		log(config);
		if(cluster.isWorker) log(useColorTag('green', 'worker setup'));
	}
	if(config.config) {
		useServer({
			...config.config,
			...config.static
		}).start();
	}
	else {
		useServer({
			...config
		}).start();
	}
});
