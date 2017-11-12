'use strict'

// var Promise = require('bluebird')

var express = require('express')
var https = require('https')
var app = express()
var cocKey = process.env.CLASH_OF_CLANS_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjBkYmFjY2FhLTVhMzUtNGExNi1hNzAwLWM4NGRkNmRlNjAyOSIsImlhdCI6MTUxMDQzMTYxOCwic3ViIjoiZGV2ZWxvcGVyL2EzMDM3MzllLWIxMzUtNTA4Yy1jZmExLTRkYWJjNTliM2JlZSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjk1LjkwLjI1NC4xNDIiXSwidHlwZSI6ImNsaWVudCJ9XX0.K73PpuWiEAT_maFIBpX5h1KMia3K03A5sG5TKERjBuiHqrFHcTHiCFut7Ni8LZYh3qhj0WCgEQmzvMeIGXd_Ng'

var Server = function () {
	return this
}

Server.prototype.listen = function () {
	var port = process.env.PORT || 3000
	app.listen(port, function () {
		console.log('listening to port ' + port)
	})
}

module.exports = Server

function getJSON(req, done) {
	var key = cocKey
	var request = {
		hostname: 'api.clashofclans.com',
		path: req.url,
		headers: {
			Authorization: 'Bearer ' + key,
			Accept: 'application/json'
		},
		localAddress: '95.90.254.142'
	}
	https.get(request, function (response) {
		var body = ''
		response.on('data', function (d) {
			body += d
		})
		response.on('end', function () {
			var parsed = {}
			try {
				if (body !== '') {
					parsed = JSON.parse(body)
				}
			} catch (e) {
				console.log(e, body)
			}
			done(parsed)
		})
		response.on('error', function () {
			console.log(arguments)
		})
	})
}

app.get('/info/:key', function (req, res) {
	cocKey = req.params.key
	res.writeHead(200, {
		'Content-Type': 'application/json'
	})
	res.write(JSON.stringify({
		key: req.params.key
	}, null, 4))
	res.end()
})

app.get('*', function (req, res) {
	getJSON(req, function (data) {
		res.type('application/json')
		res.jsonp(data)
		res.end()
	})
})