import fbService, {fbPage} from './fbService'
import {success, failure} from './lib/response-lib'
import dynogels from 'dynogels'
import {credentials, testCredential} from './lib/credentials'
import aws from 'aws-sdk'
import joi from 'joi'

dynogels.AWS.config.update(credentials)
if (process.env.IS_OFFLINE) {
	dynogels.AWS.config.update(testCredential)
	dynogels.dynamoDriver(new aws.DynamoDB(testCredential))
}

exports.router = async (event) => {
	if (event.resource === '/signin/{email}' && event.httpMethod === 'GET') {
		const email = event.pathParameters.email || ''
		try {
			const user = await getorCreateUser({email})
			return success(user)
		} catch (e) {
			return failure(e)
		}
	}
}

export function getorCreateUser(data) {
	return new Promise((resolve, reject) => {
		user.get(data, (err, result) => {
			if (err) {
				reject({
					type: 'ERROR_GET_USER',
					message: err
				})
			} else {
				if (result) {
					resolve(result)
				} else {
					user.create(data, (err, result) => {
						if (err) {
							reject({
								type: 'ERROR_CREATE_NEW_USER',
								message: err
							})
						} else {
							resolve(result)
						}
					})
				}
			}
		})
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