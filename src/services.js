const parseJSON = (res) => res.json().then(data => data)
export function apiCall(path) {
  return new Promise((resolve,reject) => {
  let headers = new Headers();
  headers.set("no-referrer-when-downgrade","")
  return fetch(path,headers)
    .then(parseJSON)
    .then(json => {
      resolve(json)
    })
    .catch(err => {
      reject(err)
    })
  })
}
