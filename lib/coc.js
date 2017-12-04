'use strict'

var Promise = require('bluebird')
var https = require('https')

var COCLevels = require('clash-of-clans-unit-levels')
var cocLevels = new COCLevels()

var COC = function (setup) {
	this.setup = setup
	return this
}

COC.prototype.map = function (player, unitname) {
	var result = {}
	if (unitname === 'Archer Queen') {
		// debugger
	}
	for (var index = 0; index < player[unitname].length; index++) {
		var unit = player[unitname][index]
		if (unit.village === 'home') {
			var u = {
				level: unit.level,
				maxedOutLevel: unit.maxLevel,
				maxLevelBefore: cocLevels.max(player.townHallLevel - 1, unitname, unit.name),
				maxLevel: cocLevels.max(player.townHallLevel, unitname, unit.name)
			}
			// debugger
			if (u) {
				result[unit.name] = u
			}
		}
	}
	return result
}

const chalk = require('chalk')

COC.prototype.pickRushedUnits = function (player, units) {
	var result = []
	var ignoreList = ['Witch', 'Minion', 'Goblin', 'Hog Rider']

	for (var key in player[units]) {
		if (ignoreList.indexOf(key) === -1 && player[units].hasOwnProperty(key)) {
			var unit = player[units][key]
			unit.name = key
			unit.spell = unit.name.indexOf('Spell') !== -1

			var perc = ((unit.level * 100) / unit.maxLevel).toFixed(2)
			if (perc < 50 && unit.maxLevel > 2) {
				var color = chalk.gray
				var unitColor = chalk.white
				if (perc < 40) {
					color = chalk.red
				}
				if (unit.name === 'Golem') {
					unitColor = chalk.white.bgRed
				}
				if (unit.name === 'Valkyrie') {
					unitColor = chalk.white.bgRed
				}
				if (unit.name === 'Archer Queen') {
					unitColor = chalk.white.bgRed
				}
				if (unit.name === 'Barbarian King') {
					unitColor = chalk.white.bgRed
				}
				if (unit.name === 'Grand Warden') {
					unitColor = chalk.white.bgRed
				}
				if (unit.level === 1 && !unit.spell) {
					color = chalk.red.underline
					unitColor = chalk.red.underline
				}
				result.push(unitColor(unit.name.replace(' Spell', '')) + ' ' + color(unit.level + '/' + unit.maxLevel + '(' + perc + '%)'))
			}
		}
	}

	return result
}

COC.prototype.members = function () {
	var self = this
	return new Promise(function (resolve, reject) {
		self.clanMembers().then(function (members) {
			var result = []
			// require('fs').writeFileSync('filename.json', JSON.stringify(members, '\t', 1))
			if (members) {
				Promise.each(members, function (member) {
					return self.player(member.tag).then(function (player) {
						var p = {
							name: player.name,
							clanRank: member.clanRank,
							townHallLevel: player.townHallLevel,
							troops: self.map(player, 'troops'),
							spells: self.map(player, 'spells'),
							heroes: self.map(player, 'heroes')
						}
						result.push(p)
					}).catch(reject)
				}).then(function () {
					resolve(result)
				}).catch(reject)
			}
		}).catch(reject)
	})
}

COC.prototype.clanMembers = function () {
	var self = this
	return new Promise(function (resolve, reject) {
		var req = {
			url: '/v1/clans/' + encodeURI(self.setup.clanTag) + '/members'
		}
		self.request(req).then(function (members) {
			resolve(members.items)
		}).catch(reject)
	})
}

COC.prototype.player = function (playerTag) {
	var self = this
	return new Promise(function (resolve, reject) {
		var req = {
			url: '/v1/players/' + encodeURI(playerTag)
		}
		self.request(req).then(function (player) {
			// console.log("x", player)
			resolve(player)
		}).catch(reject)
	})
}

COC.prototype.request = function (req) {
	var self = this
	console.log(req.originalUrl)
	return new Promise(function (resolve, reject) {
		var request = {
			hostname: 'api.clashofclans.com',
			path: req.originalUrl,
			headers: {
				Authorization: 'Bearer ' + process.env.COC_API_KEY,
				Accept: 'application/json'
			},
			'Remote-Addr': self.setup.ip
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
					e.bodyText = body
					reject(e)
				}

				if (parsed.reason && parsed.message) {
					var err = new Error(parsed.message)
					err.name = parsed.reason

					console.warn(err.name)
					if (parsed.reason === 'accessDenied') {
						reject(err)

					} else {
						resolve(parsed)
					}

				} else {
					resolve(parsed)
				}
			})
			response.on('error', function (err) {
				reject(err)
			})
		})
	})
}

module.exports = COC