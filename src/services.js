const parseJSON = (res) => res.json().then(data => data)
export function apiCall(path) {
  return new Promise((resolve,reject) => {
  return fetch(path)
    .then(parseJSON)
    .then(json => {
      console.log(json)
      resolve(json)
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
  })
}
