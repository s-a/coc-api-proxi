'use strict'

var Promise = require('bluebird')
const publicIp = require('public-ip')

var IP = function () {
	return this
}

IP.prototype.external = function () {
	return new Promise(function (resolve, reject) {
		publicIp.v4().then(ip => {
			resolve(ip)
		}).catch(reject)
	})
}

module.exports = IP