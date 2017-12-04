'use strict'

// var Promise = require('bluebird')

var express = require('express')
var app = express()
var COC = require('./coc.js')
var IP = require('./ip.js')
var ip = new IP()
var SetupIP = require('./setup-ip.js')
var setupIP = new SetupIP()

var Server = function () {
	return this
}

Server.prototype.listen = function () {
	var self = this
	ip.external().then(function (ip) {
		var setup = {
			apikey: process.env.COC_API_KEY,
			ip: ip
		}
		self.coc = new COC(setup)

		app.get('favicon.ico', function (req, res) {
			res.jsonp(null)
			res.end()
		})
		app.get('*', function (req, res) {
			var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
			console.log(fullUrl)
			res.type('application/json')
			/* eslint-disable handle-callback-err */
			self.coc.request(req).then(function (data) {
				res.jsonp(data)
				res.end()
			}).catch(function (err) {
				setupIP.install(process.env.COC_API_EMAIL, process.env.COC_API_PASSWORD).then(function (env) {
					process.env.COC_API_KEY = env.token
					console.log(env)
					self.coc.request(req).then(function (data) {
						res.jsonp(data)
						res.end()
					}).catch(function (err) {
						console.error(err)
						res.jsonp(err)
						res.end()
						// process.exit(3)
					})
				}).catch(function (err) {
					console.error(err)
					res.jsonp(err)
					res.end()
					process.exit(2)
				})
			})
			/* eslint-enable handle-callback-err */
		})

		var port = process.env.PORT || 3000
		app.listen(port, function () {
			console.log('listening to port ' + port)
		})
	}).catch(function (err) {
		console.log(err)
	})
}

module.exports = Server