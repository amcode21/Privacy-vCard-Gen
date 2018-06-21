let request = require('request');
let upath = require('upath');
let fs = require('fs');
let readlineSync = require('readline-sync');

let config = require('./config');
let status = require('./utils/log');
let createProfile = require('./utils/createProfile.js');

let profiles = {};

let preLogin = (callback) => {
	status.log('info', `Grabbing session ID`);

	request({
		url: 'https://privacy.com/login',
		method: 'POST',
		headers: {
	        'Accept': 'application/json, text/plain, */*',
	        'Accept-Encoding': 'gzip, deflate, br',
	        'Accept-Language': 'en-US,en;q=0.9',
	        'Connection': 'keep-alive',
	        'Content-Type': 'application/json;charset=UTF-8',
	        'Host': 'privacy.com',
	        'Origin': 'https://privacy.com',
	        'Referer': 'https://privacy.com/login',
	        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
	    }
	}, (err, resp, body) => {
		if (!err && resp.statusCode) {
			this.sessionID = resp.headers['set-cookie'][0].split('; ')[0].replace('sessionID=', '');
			
			return callback();
		}
	});
}

let login = (callback) => {
	status.log('info', `Logging in w/ email '${this.config.user}'`);

	request({
		url: 'https://privacy.com/auth/local',
		method: 'POST',
		headers: {
			'Accept': '*/*',
			'Accept-Encoding': 'br, gzip, deflate',
			'Accept-Language': 'en-us',
			'Connection': 'keep-alive',
			//'Content-Length': '51',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Host': 'privacy.com',
			'If-None-Match': 'W/"120-WWuW7GBku5IuNQANwWd9aw"',
			'sessionid': this.sessionID,
			'User-Agent': 'privacy-app/2.11.0.3 iOS/12.0',
			'x-device': 'eyJoYXJkd2FyZSI6eyJkZXZpY2VJZCI6IjIxMzc3NDJBLUI3MUQtNEFGNy1CM0MwLThBRkYyREYyNzAxQiIsImhvc3RuYW1lIjoiaVBob25lIiwiaXNFbXVsYXRvciI6ZmFsc2UsImJyYW5kIjoiQXBwbGUiLCJtb2RlbCI6ImlQaG9uZSJ9LCJ0aW1lc3RhbXAiOiIyMDE4LTA2LTE0VDE2OjM2OjU0LjczNloiLCJzb2Z0d2FyZSI6eyJvc1ZlcnNpb24iOiIxMi4wIn0sImxvY2FsZSI6eyJsYW5ndWFnZSI6ImVuLVVTIiwiY291bnRyeSI6IlVTIiwidGltZXpvbmUiOiJBbWVyaWNhL0xvc19BbmdlbGVzIn0sIm5ldHdvcmsiOnsic3NpZCI6IkNQLUNPUlAiLCJic3NpZCI6Ijg0OmQ0OjdlOmRkOmFlOjUxIn19',
		},
		form: {
			'email': this.config.user,
			'password': this.config.password
		},
		json: true
	}, (err, resp, account) => {
		if (resp.statusCode === 200) {
			if (typeof account.oneTimeCode !== 'undefined') {
				if (account.oneTimeCode === true) {
					status.log('error', account.message);

					this.userToken = account.userToken;
					this.code = readlineSync.question(`Please enter the code found in the e-mail '${this.config.user}': `);

					codeLogin.bind(this)(() => {
						return callback();
					});
				}
			}
			else {
				this.token = account.token;
				status.log('success', `Successfully logged in, ${account.fullName}! (I don't really know your name dw :D)`);

				return callback();
			}
		}
		else if (resp.statusCode === 401) {
			status.log('error', `Invalid email/password, change and try again`);
			console.log(account);
			process.exit();
		}
		else {
			status.log('error', `[${resp.statusCode}] Unhandled Error -> ${account.message}`);
		}
	});
}

let codeLogin = (callback) => {
	status.log('info', `Logging in w/ email '${this.config.email}' & code '${this.code}'`);

	request({
		url: 'https://privacy.com/auth/local/code',
		method: 'POST',
		headers: {
			'Accept': '*/*',
			'Accept-Encoding': 'br, gzip, deflate',
			'Accept-Language': 'en-us',
			'Connection': 'keep-alive',
			//'Content-Length': '51',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Host': 'privacy.com',
			'sessionid': this.sessionID,
			'User-Agent': 'privacy-app/2.11.0.3 iOS/12.0',
		},
		form: {
			'userToken': this.userToken,
			'code': this.code
		},
		json: true
	}, (err, resp, account) => {
		if (!err && resp.statusCode === 200) {
			this.token = account.token;
			status.log('success', `Successfully logged in, ${account.fullName}! (I don't really know your name dw :D)`);

			return callback();
		}
		else if (resp.statusCode === 401) {
			status.log('error', `Invalid email/password, change and try again`);
			process.exit();
		}
		else {
			status.log('error', `[${resp.statusCode}] Unhandled Error -> ${account.message}`);
		}
	});
}

let createCard = (callback) => {
	status.log('info', `Creating card w/ details`);

	this.cardName = `${this.config.cardName} ${Object.keys(profiles).length}`;

	request({
		url: 'https://privacy.com/api/v1/card',
		method: 'POST',
		headers: {
			'Accept': 'application/json, text/plain, */*',
    		'Accept-Encoding': 'gzip, deflate, br',
    		'Accept-Language': 'en-US,en;q=0.9',
    		'Authorization': `Bearer ${this.token}`,
		    'Cache-Control': 'no-cache',
		    'Cookie': `sessionID=${this.sessionID}; landing_page=extension-rewards-landing; token=${this.token}; ETag=ps26i5unssI=`,
		    'Connection': 'keep-alive',
		    'Content-Type': 'application/json;charset=UTF-8',
		    'DNT': '1',
		    'Host': 'privacy.com',
    		'Origin': 'https://privacy.com',
		    'Referer': 'https://privacy.com/home',
		    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'
		},
		json: {
			'type': 'MERCHANT_LOCKED',
			'spendLimitDuration': 'MONTHLY',
			'memo': this.cardName,
			'meta': {
				'hostname': ''
			},
			'style': null,
			'spendLimit': this.config.limit,
			'reloadable': true
		}
	}, (err, resp, body) => {
		if (!err && (resp.statusCode === 200 || 201 || 202)) {
			try {
				this.card = body.card;
				this.card.profileName = `${this.config.cardName.toUpperCase()} ${Object.keys(profiles).length}`;

				profiles[this.card.profileName] = createProfile(this.config, this.card);

				status.log('success', `Created new ${this.config.bot.toUpperCase()} profile: ${this.card.profileName}`);

				if (Object.keys(profiles).length !== config.amount) {
					setTimeout(() => createCard.bind(this)(callback), 500);
				}
				else {
					return callback();
				}
			}
			catch (e) {
				status.log('error', `[${resp.statusCode}] Unhandled Error -> ${body.message}`);
				status.log('info', `(Possibly) Saved the ${Object.keys(profiles).length} profile(s) already made!`);

				fs.writeFileSync(upath.normalize(`${__dirname}/profiles/${new Date().toISOString()}_${this.config.bot.toUpperCase()}_profiles.json`), JSON.stringify(profiles));
			}
		}
		else {
			status.log('error', `[${resp.statusCode}] Unhandled Error -> ${body.message}`);
		}
	});
}


let Main = () => {
	this.config = config;

	preLogin.bind(this)(() => {
		login.bind(this)(() => {
			createCard.bind(this)(() => {
				fs.writeFileSync(upath.normalize(`${__dirname}/profiles/${new Date().toISOString()}_${this.config.bot.toUpperCase()}_profiles.json`), JSON.stringify(profiles));
				status.log('info', `(Possibly) Saved ${Object.keys(profiles).length} profile(s)!`);

				console.log('\nPROFILES BELOW\n');
				console.log(profiles);
				console.log('\nPROFILES ABOVE\n');
			});
		});
	});
}

Main();


