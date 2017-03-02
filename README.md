# Chat
This is project using express server, socket.io to communicate back to the client.</br>
Data is persistence between chat windows is done with Redis locally.</br>
The app uses jade templating engine as a front-end layer on client-side.</br></br>
`main.js` is the entry point for client-side code, server and client sockets connected in `app.js`.

## Prerequisites
Must have: 
- Remember: Socket listening/connecting on the app port/server, in this case: port `:3004`.
- Node and npm installed.
- Redis locally [installation](https://redis.io/topics/quickstart).

App running on port `:3004` and Redis DB on port `:6379`.

## Scripts

<b>*Start the project*</b>
`npm run dev`

Dev mode: `npm run dev`.
Build assets: `npm run build` and `dist` dir will be served.
Production: `npm run prod`.
Create database: `npm run database`.

## Improvements
- Server-side rendering
- Styling
- Unit tests
- Badges

