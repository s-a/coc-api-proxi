#!/usr/bin/env node

'use strict'

require('dotenv').config()
var COC = require('./coc.js')
// var APIKEY = process.env.CLASH_OF_CLANS_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjBkYmFjY2FhLTVhMzUtNGExNi1hNzAwLWM4NGRkNmRlNjAyOSIsImlhdCI6MTUxMDQzMTYxOCwic3ViIjoiZGV2ZWxvcGVyL2EzMDM3MzllLWIxMzUtNTA4Yy1jZmExLTRkYWJjNTliM2JlZSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjk1LjkwLjI1NC4xNDIiXSwidHlwZSI6ImNsaWVudCJ9XX0.K73PpuWiEAT_maFIBpX5h1KMia3K03A5sG5TKERjBuiHqrFHcTHiCFut7Ni8LZYh3qhj0WCgEQmzvMeIGXd_Ng'
var IP = require('./ip.js')
var SetupIP = require('./setup-ip.js')
var ip = new IP()
const chalk = require('chalk')

var setupIP = new SetupIP()
/* setupIP.install(process.env.COC_API_EMAIL, process.env.COC_API_PASSWORD).then(function (env) {
	process.env.CLASH_OF_CLANS_API_KEY = env.token
}).catch(function (err) {
	console.log(err)
})
return */
/* ip.external().then(function (ip) {
	var setup = {
		apikey: process.env.COC_API_KEY,
		ip: ip,
		clanTag: '#8JR2QVUR'
	}
	var coc = new COC(setup)

	coc.members().then(function (members) {
		var protocol = []
		for (var i = 0; i < members.length; i++) {
			var player = members[i]
			var rushedTroops = []

			rushedTroops = rushedTroops.concat(coc.pickRushedUnits(player, 'heroes'))
			rushedTroops = rushedTroops.concat(coc.pickRushedUnits(player, 'troops'))
			rushedTroops = rushedTroops.concat(coc.pickRushedUnits(player, 'spells'))
			if (rushedTroops.length > 1) {
				protocol.push(chalk.cyan(player.clanRank + '. "' + player.name + '" (TH ' + player.townHallLevel + ') ' +
					rushedTroops.join(', ')))
			}
		}
		console.log(protocol.reverse().join('\n'))
	}).catch(function (err) {
		console.log(err)
	})
}) */

var Server = require('./server.js')
var server = new Server()
server.listen()