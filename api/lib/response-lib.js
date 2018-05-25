export function success (body) {
  return buildResponse(200, {
    payload: body,
    success: true
  })
}

export function failure (body) {
  return buildResponse(body.statusCode, {
    success: false,
    payload: null,
    error: body
  })
}

function buildResponse (statusCode = 500, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  }
}
