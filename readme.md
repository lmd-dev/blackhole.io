# BlackHole.io
Sandbox to create an Agar.IO like from scratch

## Install

- Download GitHub repository
- Download depedencies

  ```
  npm i
  ```
- Go to folder `/dist/server`

   ```
   cd dist/server
   ```
- Start server with NodeJS

   ```
   node index.js
   ```
- Run an Internet browser and connect to your server address

   ```
   http://localhost
   ```

## Setting

A `.env` file is available in folder `/dist/server` to define the listening port of the webserver used by the application :
```
WEBSERVER_PORT=80
```

## Development

### Transpile TypeScript server source code
```
tsc -p tsconfig-server.json
```

### Transpile TypeScript client source code
```
tsc -p tsconfig-client.json
```

### Run server with nodemon
```
cd dist/server
nodemon
```