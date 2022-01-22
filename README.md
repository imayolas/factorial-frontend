# @imayolas Factorial case - Frontend
![image](https://user-images.githubusercontent.com/6229037/150638041-500d0e45-830d-4597-b8ac-c4445a7726be.png)

## Case statement

> We want a Frontend + Backend application that allows you to post and visualize metrics. Each metric will have: Timestamp, name, and value. The metrics will be shown in a timeline and must show averages per minute/hour/day The metrics will be persisted in the database.

## Architectural highlights

- React as a frontend engine: Simple, elegant, scalabale and massively adopted by the engineering community.
- App local state via React's own `useReducer` hook: Enough for the simplicity of the app + minimizes external dependencies
- App's data state handled by `swr` and custom hooks: Swr caches external data by its url key, minimizing the wiring between remote data and its consumers. By using custom hooks to fetch the remote data, we decouple the data fetching from its consumption, making the code easier to read, test and maintain.

## Getting started

1. Clone this repo
2. Install dependencies: `yarn`
3. Since this is a React App based on a `create-react-app` you can use its default commands:
   - `yarn start` to run the project in dev mode
   - `yarn build` to create a production bundle

## Next steps

- Add Error Boundary before the <Main/> component, to display friendly errors if something goes wrong
- Persist state in the querystring
- Add testing
- Fix line to make it continuous when using "minutes"
- Replace moment.js for a lighter library
