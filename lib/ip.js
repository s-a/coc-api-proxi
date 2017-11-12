'use strict'

var Promise = require('bluebird')
var extIP = require('external-ip')
var IP = function () {
	return this
}

var getExternalIP = extIP({
	replace: true,
	services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
	timeout: 600,
	getIP: 'parallel'
})

IP.prototype.external = function () {
	return new Promise(function (resolve, reject) {
		getExternalIP(function (err, ip) {
			if (err) {
				reject(err)
			} else {
				resolve(ip)
			}
		})
	})
}

module.exports = IP