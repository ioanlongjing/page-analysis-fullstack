
export const fbOptions = {
  version: 'v2.11',
  appId: '183863815555068',
  appSecret: '37958f89764130c672d9194d33b0dfa5'
};

export const testCredential = {
  apiVersion: '2016-04-18',
  region: 'ap-northeast-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'AKID',
  secretAccessKey: 'SECRET'
}

export const prodCredential = {
  apiVersion: '2016-04-18',
  region: 'ap-northeast-1',
  accessKeyId: '',
  secretAccessKey: ''
}

let awsCredentials


if (process.env.NODE_ENV === 'test' || process.env.IS_OFFLINE) {
  awsCredentials = testCredential
} else {
  awsCredentials = prodCredential
}

export const credentials = awsCredentials
