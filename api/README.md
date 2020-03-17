# Install
```
$ yarn
```

# Dependencies
Was installed and configured the `eslint` and `prettier` to keep the code clean and patterned.

# Databases
The application use one databases: MongoDB. For the fastest setup is recommended to use docker, see how to do it below.
> Windows users using Docker Toolbox, maybe be necessary in your `env` file set the MongoDB' host to `192.168.99.100` (docker machine IP) instead of `localhost` or `127.0.0.1`

## MongoDB
```
$ docker run --name iheroes-mongo -d -p 27017:27017 -d mongo
$ docker start iheroes-mongo
```

# .env
Rename the `.env.example` to `.env` then just update with yours settings.

# Start Up
```
$ yarn dev
```
