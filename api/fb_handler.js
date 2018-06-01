import fbService, {fbPage} from './fbService'
import {success, failure} from './lib/response-lib'

exports.router = async (event) => {
	const FB = new fbService(event)
	let id
	if (event.resource === '/db/fb/page/{id}' && event.httpMethod === 'GET') {
		if (!checkIdExists(event)) {
			return failure({
				type: "ERROR_MISSING_FB_ID"
			})
		} else {
			id = event.pathParameters.id
		}
		try {
			const page = await FB.getFromDb(fbPage,id)
			return success(page)
		} catch (e) {
			console.log(e)
			return failure(e)
		}
	} else if (event.resource === '/fb/page/{id}' && event.httpMethod === 'GET') {
		if (!checkIdExists(event)) {
			return failure({
				type: "ERROR_MISSING_FB_ID"
			})
		} else {
			id = event.pathParameters.id
		}
		try {
			const page = await FB.getFbPageById(id)
			return success(page)
		} catch (e) {
			console.log(e)
			return failure(e)
		}
	} else if (event.resource === '/fb/page/{id}' && event.httpMethod === 'POST') {
		if (!checkIdExists(event)) {
			return failure({
				type: "ERROR_MISSING_FB_ID"
			})
		} else {
			id = event.pathParameters.id
		}
		try {
			const page = await FB.saveFbPage(id)
			return success(page)
		} catch (e) {
			console.log(e)
			return failure(e)
		}
	} else if (event.resource === '/fb/page/{id}/newCount' && event.httpMethod === 'PUT') {
		if (!checkIdExists(event)) {
			return failure({
				type: "ERROR_MISSING_FB_ID"
			})
		} else {
			id = event.pathParameters.id
		}
		try {
			const page = await FB.updateFbPageDailyCount(id)
			return success(page)
		} catch (e) {
			console.log(e)
			return failure(e)
		}
	} else if (event.resource === '/fb/pages/newCount' && event.httpMethod === 'PUT') {
		try {
			const pages = await FB.updateAllFbPageDailyCount(id)
			return success(pages)
		} catch (e) {
			console.log(e)
			return failure(e)
		}
	} else if (event.resource === '/db/fb/pages/listAll' && event.httpMethod === 'GET') {

		try {
			const pages = await FB.listAll(fbPage)
			console.log(pages)
			return success(pages)
		} catch (e) {
			console.log(e)
			return failure(e)
		}
	} else {
		return failure({
			type: 'ERROR_API_PATH_NOT_FOUND',
		  	message: 'no routes are defined on this api path'
		})
	}
}

function checkIdExists(event) {
	let id = null
	if (event.pathParameters && event.pathParameters.id) {
		id = event.pathParameters.id
	}

	if (!id ) {
		return false
	}
	return true
}
