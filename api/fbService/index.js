import joi from 'joi'
import dynogels from 'dynogels'
import jwt_decode from 'jwt-decode'
import uuidv1 from 'uuid/v1'
import aws from 'aws-sdk'
import FB from 'fb'
import {fbOptions, credentials, testCredential} from '../lib/credentials'

dynogels.AWS.config.update(credentials)
if (process.env.IS_OFFLINE) {
	dynogels.AWS.config.update(testCredential)
	dynogels.dynamoDriver(new aws.DynamoDB(testCredential))
}
FB.options({
  version: 'v2.11',
  appId: '183863815555068',
  appSecret: '37958f89764130c672d9194d33b0dfa5'
});

export const fbPage = dynogels.define('fb-page', {
	hashKey: 'id',
	timestamps: true,
	schema: {
		id: joi.string().required(),
		name: joi.string(),
		about: joi.string(),
		dailyLikes: joi.array().items(joi.object({
			date: joi.string(),
			count: joi.number()
		}))
	}
})

export default class fbService {
  constructor (event) {
  	FB.setAccessToken("EAACnOSFpxZCwBAKzOdy3qwGC3DfUGVVlwNuLrrqjvBOFnWWUrLRRQZCNsnZAd3U1sAc1U06jGBmuZCOsZCDxrKfIai5ZCwZC5ytkgZCBkZANZA0wJ8AZA5MreJ21rZCFyjWwKSVXYnrollsPbFDjRhtf63Uo48sUPAsZAOZAuLWJZCkdyg2pwZDZD");
  }

  getFbPageById(id) {
  	return new Promise((resolve, reject) => {

  		FB.api(id, {fields: ['id','name', 'about', 'fan_count']}, (res) => {
	      if (!res.error) {
	      	resolve(res)
	      } else {
	      	reject({
	      		type: 'ERROR_FB_FIND_PAGE',
	      		message: res.error
	      	})
	      }
	    })
  	})
  }

  saveToDb(dbObject, item) {
  	return new Promise((resolve, reject) => {
  		dbObject.create(item, {overwrite: false}, (err, result) => {
	  		if (err) {
	  			reject({
	  				type: 'ERROR_CREATE_' + dbObject.tableName().toUpperCase(),
	  				message: err
	  			})
	  		} else {
	  			resolve(result.get())
	  		}
	  	})
  	})
  }


  getFromDb(dbObject, id) {

  	return new Promise((resolve, reject) => {
  		dbObject.get({id}, (err, result) => {
	  		if (err) {
	  			reject({
	  				type: 'ERROR_GET_' + dbObject.tableName().toUpperCase(),
	  				message: err
	  			})
	  		} else {
	  			resolve(result.get())
	  		}
	  	})
  	})
  }

  updateDb(dbObject, item, updateParams) {
  	return new Promise((resolve, reject) => {

  		let params = {
  			expected: { 
  				id: {
  					Exists: true 
  				}
  			}
  		}

  		if (updateParams) {
  			params = Object.assign({}, params, updateParams)
  		}

  		dbObject.update(item, params, (err, result) => {
	  		if (err) {
	  			reject({
	  				type: 'ERROR_UPDATE_' + dbObject.tableName().toUpperCase(),
	  				message: err
	  			})
	  		} else {
	  			resolve(result.get())
	  		}
	  	})
  	})
  }

  listAll(dbObject) {
  	return new Promise((resolve, reject) => {
  		dbObject.scan().loadAll().exec((err, data) => {
  			if (err) {
  				reject({
  					type: 'ERROR_LIST_ALL' + dbObject.tableName().toUpperCase()
  				})
  			}
  			// const list = []
  			// for (var i = items.length - 1; i >= 0; i--) {
  			// 	list.push(items[i].get())
  			// }
  			resolve(data)
  		});
  	})

  	
  }

  async updateAllFbPageDailyCount() {
  	return new Promise(async (resolve, reject) => {
  		try {
  			const dbData = await this.listAll(fbPage)
	  		const promiseItems = dbData.Items.map((dbItem) => {
	  			return this.updateFbPageDailyCount(dbItem.attrs.id)
	  		})
	  		const updateResults = await Promise.all(promiseItems)

	  		resolve(updateResults)
  		} catch (e) {
  			reject(e)
  		}
  		
  	})
  }

  async updateFbPageDailyCount(id) {
  	return new Promise(async (resolve, reject) => {
  		try {
  			const page = await this.getFbPageById(id)
		  	const dbItem = await this.getFromDb(fbPage, id)

		  	// for testing purpose
		  	const ranMonth = Math.floor(Math.random()*10)
		  	const ranDay = Math.floor(Math.random()*10)
		  	const date = new Date('2019/' + ranMonth + '/' + ranDay).toLocaleDateString()
		  	let duplicate = false
		  	for (var i = dbItem.dailyLikes.length - 1; i >= 0; i--) {
		  		if (dbItem.dailyLikes[i].date === date) {
		  			duplicate = false
		  		}
		  	}
		  	if (!duplicate) {
		  		dbItem.dailyLikes.push({
		  			count: page.fan_count,
		  			date
		  		})
		  		const updatedItem = await this.updateDb(fbPage, dbItem)
		  		resolve(updatedItem)
		  	} else {
		  		reject({
		  			type: 'ERROR_UPDATE_DATE_EXIST_' + fbPage.tableName().toUpperCase(),
		  			message: 'date existsed in this fb page'
		  		})
		  	}
  		} catch (e) {
  			reject(e)
  		}
  		
  	})

  }

  async saveFbPage(id) {
  	return new Promise(async (resolve, reject) => {
  		try {
	  		let page = await this.getFbPageById(id)
	  		const savedPage = await this.saveToDb(fbPage, {
	  			id: page.id,
	  			about: page.about,
	  			name: page.name,
	  			dailyLikes: [{
	  				date: new Date().toLocaleDateString(),
	  				count: page.fan_count
	  			}]
	  		})
	  		resolve(savedPage)
	  	} catch (e) {
	  		reject(e)
	  	}
  	})
  }
}
