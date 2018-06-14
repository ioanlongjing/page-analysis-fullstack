import joi from 'joi'
import dynogels from 'dynogels'
import jwt_decode from 'jwt-decode'
import uuidv1 from 'uuid/v1'
import aws from 'aws-sdk'
import {credentials, testCredential} from '../lib/credentials'

dynogels.AWS.config.update(credentials)
if (process.env.IS_OFFLINE) {
	dynogels.AWS.config.update(testCredential)
	dynogels.dynamoDriver(new aws.DynamoDB(testCredential))
}

export default class dbService {

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


  getFromDb(dbObject, data) {
  	return new Promise((resolve, reject) => {
  		dbObject.get(data, (err, result) => {
	  		if (err) {
	  			reject({
	  				type: 'ERROR_GET_' + dbObject.tableName().toUpperCase(),
	  				message: err
	  			})
	  		} else {
	  			if (result) {
	  				resolve(result.get())
	  			} else {
	  				resolve(null)
	  			}
	  			
	  		}
	  	})
  	})
  }

  updateDb(dbObject, item, updateParams = {}) {
  	return new Promise((resolve, reject) => {
  		dbObject.update(item, updateParams, (err, result) => {
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

  listAllByHash(dbObject, hashValue) {
  	return new Promise((resolve, reject) => {
  		console.log(hashValue)
  		dbObject.query(hashValue).loadAll().exec((err, data) => {
  			if (err) {
  				reject({
  					type: 'ERROR_LIST_ALL' + dbObject.tableName().toUpperCase()
  				})
  			}
  			// const list = []
  			// for (var i = items.length - 1; i >= 0; i--) {
  			// 	list.push(items[i].get())
  			// }
  			resolve(data.Items)
  		});
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

}
