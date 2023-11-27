# Purpose of this project
The process of exiting a plane can be dramatically improved. This project exists to prove that fact.

I've called the process "Fill & Flush" to represent the way the limited resource, plane aisle space, can be more effectively used by "filling" the aisle, then "flushing" the aisle.

# High Level Individual De-Planing Lifecycle:
- plane connects to jetbridge, and passengers are allowed to stand
- passenger gathers belongings
- passenger stands idle for some period of time (sometimes 0 seconds in status quo, if they're in an aisle seat and are first to stand)
- person in front of passenger leaves
- passenger places some time buffer between themselves and that aisle neighbor that just left
- passenger walks plane with belongings

# Order of deplaning (current):
- Deplaning order is row by row in quasi middle out - 1C -> 1B -> 1A -> 1D -> 1E -> 1F -> 2C...

# Order of deplaning (future):
- Deplaning order is column by column, middle out - 1C -> 2C -> ... -> 60C -> 1D -> ... -> 1F ...

# (TODO) Addressing various objections:
- what about the elderly and people with children?
  - they should exit in later flushes or in the final flush
  - how do you model the final "flush" if it's all these oddball cases?
    - not sure!
- what about groups who wish to exit together?
  - make "trades" with individuals in outside rows, wait for later flushes
- what about car-traffic style accordion effects in the aisle as passengers walk the aisle?
- how to model the randomness of time:
  - it takes to gather belongings
  - any one passenger places as a buffer between themselves and the person leaving ahead of them
- should there really a "gather belongings" penalty in Fill & Flush. i.e. - do you actually take longer to gather belongings with aisle neighbors relative to status quo? if there is, what's the discount in later flushes (currently 5% speedup for each wave - less baggage in overhead)
- what about massive international flights with 2 exit rows?
- what about first class?
  - you can still let them off first and apply this system in coach and get the improvement
- Won't the person in 1F get mad watching people go by?
  - got to have education. this makes everyone better off. lives are at stake
- why go strictly column by column? why not be MORE laissez-faire and say just manage waves? wave 1, wave 2, wave 3, etc.?
  - this could be an even further improvement and in a way can solve the 1F problem by letting 1F occupy space if it is there - I suspect a few more people can fit the aisle than there are rows so you may lose some value being strict. OTOH could lead to conflict

# About Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

navigate to root, then

### `npm run test`

Verify test suite passes

### `npm run build`
### `npm run deploy`

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
