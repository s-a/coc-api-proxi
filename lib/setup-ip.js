'use strict'

var IP = require('./ip.js')
var ip = new IP()

var APIKeyInstaller = function () {
	return this
}

var deleteOldApiKeys = function (horseman) {
	return new Promise(function (resolve, reject) {
		horseman
			.log('wait for old keys display')
			.waitForSelector('.api-key__headline')
			.then(function () {
				horseman
					.log(' old keys in view')
					.click('.api-key__headline')
					.log('old key in view')
					.waitForSelector("button:submit:contains('Delete Key')")
					.click("button:submit:contains('Delete Key')")
					.log('Delete Key pressed')
					.then(function () {
						deleteOldApiKeys(horseman)
					})
			}).catch(resolve)
	})
}

APIKeyInstaller.prototype.setupNewAPIKeyAtCOC = function (currentIP, email, password) {
	return new Promise(function (resolve, reject) {
		var Horseman = require('node-horseman')
		var horseman = new Horseman()
		horseman
			.userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36')
			.viewport(1366, 662)
			.on('consoleMessage', function (msg) {
				console.log(msg)
			})
			.open('https://developer.clashofclans.com/#/login')
			.log('login')
			.waitForSelector('#email').type('#email', email)
			.waitForSelector('#password').type('#password', password)
			.waitForSelector("button:contains('Log In')").click("button:contains('Log In')")
			.log('home page')

			.log('try to click dropdown button')
			.waitForSelector('button.btn.btn-default.dropdown-toggle')
			.click("a[href='#/account']:last")
			.waitForSelector('.create-key-btn')
			.log('dashboard reached')

			.then(function () {
				horseman.log('try to delete all keys')
				deleteOldApiKeys(horseman).then(function () {
					horseman
						.waitForSelector('.create-key-btn')
						.click('.create-key-btn')
						.log('create key page')
						.log('type name')
						.waitForSelector('#name').type('#name', currentIP + ' by wailord')
						.log('type description')
						.waitForSelector('#description').type('#description', currentIP)
						.log('type ip range')
						.waitForSelector('#range-0').type('#range-0', currentIP)
						.log('wait submit button')
						.waitForSelector("button:submit:contains('Create Key')").click("button:submit:contains('Create Key')")
						.log('done')

						.waitForSelector('li.api-key')
						.log('dashboard')
						.log('-> will fetch new API key')
						.waitForSelector("p.api-key__description:contains('" + currentIP + "')").click("p.api-key__description:contains('" + currentIP + "')")
						.log('edit key page')
						.log('fetch key')
						.waitForSelector('.form-control.input-lg:first').text('.form-control.input-lg:first').then(function (token) {
							horseman
								// .log(token)
								// .screenshot("test.png")
								.close().then(function () {
									resolve(token)
								}).catch(reject)
						}).catch(reject)
				}).catch(reject)
			}).catch(reject)
	})
}

APIKeyInstaller.prototype.install = function (email, password) {
	var self = this
	return new Promise(function (resolve, reject) {
		ip.external().then(function (ip) {
			console.log('current ' + ip)
			self.setupNewAPIKeyAtCOC(ip, email, password).then(function (token) {
				resolve({
					ip: ip,
					token: token
				})
			}).catch(reject)
		}).catch(reject)
	})
}

module.exports = APIKeyInstaller