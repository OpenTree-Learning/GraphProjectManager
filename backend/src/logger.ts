import Logger, {LoggerOptions} from "@ptkdev/logger"

const options: LoggerOptions = {
	language: "en",
	colors: true,
	debug: true,
	info: true,
	warning: true,
	error: true,
	sponsor: true,
	write: true,
	type: "log",
	rotate: {
		size: "10M",
		encoding: "utf8",
	},
	path: {
		debug_log: "./debug.log",
		error_log: "./errors.log",
	},
};

const logger = new Logger(options);

export default logger;
