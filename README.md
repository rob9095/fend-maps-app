## Udacity FEND Google Maps App

See demo at http://surfcast-rt.herokuapp.com, need to load app on http becuase surf forcast data is provided via http only. The demo is hosted on a free plan so you will need to refresh after visiting once to wake the app up :)

### Description
React app that displays live surf forecasts, wind, and tide information for more than 100 surf spots in California. The app is bootstrapped with `create-react-app` and uses [`google-map-react`](https://www.npmjs.com/package/google-map-react) to display the Google map. All forecast and location data is provided by the [Spit Cast API](http://www.spitcast.com/api/docs/).

### How to Launch App
Download or clone the repo. From the root directory...
- run `npm install` to install dependencies
- run `npm start` to start the development server at `localhost:3000`

### Service Worker
The app uses the default `create-react-app` service worker. The service worker is only registered in the production build.

### Production Build
To create an optimized production build, from the root directory
- run `npm run build`

The project is built assuming it will be hosted at the server root. You can control this with the homepage field in the `package.json`. For example, add this to build it for GitHub Pages:
`
  "homepage" : "http://myname.github.io/myapp",
`
To serve the build file on a static server you can use `serve`. To install `serve` globally
- run `npm install -g serve`

Then from the root project directory
- run `serve -s build` to start the production server at `localhost:5000`

Learn more about deployment [here](http://bit.ly/CRA-deploy)
