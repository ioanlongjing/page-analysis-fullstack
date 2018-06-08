import fbService, {fbPage} from './fbService'
import {success, failure} from './lib/response-lib'
import dynogels from 'dynogels'
import {credentials, testCredential} from './lib/credentials'
import aws from 'aws-sdk'
import joi from 'joi'
import dbService from './services/dbService'

dynogels.AWS.config.update(credentials)
if (process.env.IS_OFFLINE) {
	dynogels.AWS.config.update(testCredential)
	dynogels.dynamoDriver(new aws.DynamoDB(testCredential))
}

exports.router = async (event) => {
	if (event.resource === '/signin' && event.httpMethod === 'POST') {
		const body = JSON.parse(event.body)
		const email = body.email || ''
		try {
			const user = await getorCreateUser({email})
			return success(user)
		} catch (e) {
			return failure(e)
		}
	} else if (event.resource === '/updateUser' && event.httpMethod === 'PUT') {
		const body = JSON.parse(event.body)
		try {
			const db = new dbService()
			const updatedUser = await db.updateDb(user, body)
			return success(updatedUser)
		} catch (e) {
			return failure(e)
		}
	}
}

export function getorCreateUser(data) {
	return new Promise(async (resolve, reject) => {
		try {
			const db = new dbService()
			const ExistingUser = await db.getFromDb(user, data)
			if (ExistingUser) {
				resolve(ExistingUser)
			} else {
				const newUser = await db.saveToDb(user, data)
				resolve(newUser)
			}
		} catch (err) {
			reject({
				type: 'ERROR_CREATE_NEW_USER',
				message: err
			})			
		}


		// user.get(data, (err, result) => {
		// 	if (err) {
		// 		reject({
		// 			type: 'ERROR_GET_USER',
		// 			message: err
		// 		})
		// 	} else {
		// 		if (result) {
		// 			resolve(result)
		// 		} else {
		// 			user.create(data, (err, result) => {
		// 				if (err) {
		// 					reject({
		// 						type: 'ERROR_CREATE_NEW_USER',
		// 						message: err
		// 					})
		// 				} else {
		// 					resolve(result)
		// 				}
		// 			})
		// 		}
		// 	}
		// })
	})

}


export const user = dynogels.define('users', {
	hashKey: 'email',
	timestamps: true,
	schema: {
		email: joi.string().email(),
		fbId: joi.string(),
		fbToken: joi.string()
	}
})