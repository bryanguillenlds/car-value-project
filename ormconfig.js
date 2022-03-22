var dbConfig = {
	synchronize: false,
	//migrations will be js files
	migrations: ['migrations/*.js'],
	//tell cli to generate migrations on this folder
	cli: {
		migrationsDir: 'migrations'
	}
};

//switch depending of environment
switch(process.env.NODE_ENV) {
	case 'development':
		Object.assign(dbConfig, {
			type: 'sqlite',
			database: 'db.sqlite',
			//js files work just fine on development, so we can look for them in
			//the dist folder of the project
			entities: ['**/*.entity.js'],
		});
		break;
	case 'test':
		Object.assign(dbConfig, {
			type: 'sqlite',
			database: 'test.sqlite',
			//Testing with Jest on Nest require us to use TS files
			//to run tests
			entities: ['**/*.entity.ts'],
			//cause migrations to run for each test
			migrationsRun: true
		});
	case 'production':
		break;
	default:
		throw new Error('Unknown Environment')
}

module.exports = dbConfig;