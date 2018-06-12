var dynogels = require('dynogels')
var joi = require('joi')
var fb_exist = require('./fb_exist_6_12')

dynogels.AWS.config.update({
	apiVersion: '2016-04-18',
  region: 'ap-northeast-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'AKID',
  secretAccessKey: 'SECRET'
})

var fbSchema = {
	userEmail: joi.string().email().required(),
	id: joi.string().required(),
	name: joi.string(),
	about: joi.string(),
	likeHistory: joi.any(),
	order: joi.number(),
	annotation: joi.string()
}

var fbPage = dynogels.define('fb-page', {
	hashKey: 'userEmail',
	rangeKey: 'id',
	timestamps: true,
	schema: fbSchema
})


for (var page in fb_exist) {
	if (page && fb_exist[page]){
		fb_exist[page].userEmail = 'ichenwu01@gmail.com'
		var validatedPage = joi.validate(fb_exist[page], fbSchema, {stripUnknown: true})
		if (!validatedPage.error) {
			fbPage.create(validatedPage.value, function(error, result) {
				console.log(error)
			})
		}
	}
}


// for (var page in fb_exist) {
// 	if (page && fb_exist[page]){
// 		fb_exist[page].userEmail = 'ichenwu01@gmail.com'
// 		fb_exist[page].dailyLikes = []

// 		let likeHistory = fb_exist[exist].likeHistory
// 		for(let history in likeHistory) {
// 			fb_exist[page].dailyLikes.push({
// 				date: history,
// 				count: likeHistory[history]
// 			})
// 		}

// 		var validatedPage = joi.validate(fb_exist[page], fbSchema, {stripUnknown: true})
// 		if (!validatedPage.error) {
// 			fbPage.create(validatedPage.value, function(error, result) {
// 				console.log(error)
// 			})
// 		}
// 	}
// }
