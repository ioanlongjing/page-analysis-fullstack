import joi from 'joi'
import dynogels from 'dynogels'
import jwt_decode from 'jwt-decode'
import uuidv1 from 'uuid/v1'
import aws from 'aws-sdk'
import FB from 'fb'
import {fbOptions, credentials, testCredential} from '../lib/credentials'
import dbService from './dbService'

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
	hashKey: 'userEmail',
	rangeKey: 'id',
	timestamps: true,
	schema: {
		userEmail: joi.string().email().required(),
		id: joi.string().required(),
		name: joi.string(),
		about: joi.string(),
		likeHistory: joi.any(),
		order: joi.number(),
		annotation: joi.string()
	}
})

export default class fbService {
  constructor (event) {
  	this.dbService = new dbService()
  	FB.setAccessToken("EAACnOSFpxZCwBAKzOdy3qwGC3DfUGVVlwNuLrrqjvBOFnWWUrLRRQZCNsnZAd3U1sAc1U06jGBmuZCOsZCDxrKfIai5ZCwZC5ytkgZCBkZANZA0wJ8AZA5MreJ21rZCFyjWwKSVXYnrollsPbFDjRhtf63Uo48sUPAsZAOZAuLWJZCkdyg2pwZDZD");
  }

  getFbPageById(id) {
  	return new Promise((resolve, reject) => {

  		FB.api(id, {fields: ['id','name', 'about', 'fan_count', 'picture', 'description']}, (res) => {
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

  updatePages(pages) {
  	return new Promise(async (resolve, reject) => {
  		try {
	  		const promiseItems = pages.map((page) => {
	  			return this.dbService.updateDb(fbPage, page, { expected: { id: { Exists: true } } })
	  		})
	  		const updateResults = await Promise.all(promiseItems)

	  		resolve(updateResults)
  		} catch (e) {
  			reject(e)
  		}  	
  	})
  }

  updateAllFbPageDailyCount(userEmail) {
  	return new Promise(async (resolve, reject) => {
  		try {
  			const dbData = await this.dbService.listAllByHash(fbPage, userEmail)
	  		const promiseItems = dbData.Items.map((dbItem) => {
	  			return this.updateFbPageDailyCount({userEmail, id: dbItem.attrs.id})
	  		})
	  		const updateResults = await Promise.all(promiseItems)

	  		resolve(updateResults)
  		} catch (e) {
  			reject(e)
  		}
  		
  	})
  }

  updateFbPageDailyCount(data) {
  	return new Promise(async (resolve, reject) => {
  		try {
  			const page = await this.getFbPageById(id)
		  	const dbItem = await this.dbService.getFromDb(fbPage, data)

		  	// for testing purpose
		  	const ranMonth = Math.floor(Math.random()*10)
		  	const ranDay = Math.floor(Math.random()*10)
		  	const date = new Date('2019/' + ranMonth + '/' + ranDay).toLocaleDateString()
	  		dbItem.likeHistory[date] = page.fan_count
	  		const updatedItem = await this.dbService.updateDb(fbPage, dbItem, {
	  			expected: { 
	  				id: {
	  					Exists: true 
	  				}
	  			}
	  		})
	  		resolve(updatedItem)

  		} catch (e) {
  			reject(e)
  		}
  		
  	})
  }

  saveFbPage(data) {
  	return new Promise(async (resolve, reject) => {
  		try {
	  		let page = await this.getFbPageById(data.id)
	  		let likeHistory = {}
	  		likeHistory[new Date().toLocaleDateString().replace(/\//g, '-')] = page.fan_count
	  		const savedPage = await this.dbService.saveToDb(fbPage, {
	  			id: page.id,
	  			userEmail: data.userEmail,
	  			about: page.about,
	  			name: page.name,
	  			likeHistory
	  		})
	  		resolve(savedPage)
	  	} catch (e) {
	  		reject(e)
	  	}
  	})
  }

}
