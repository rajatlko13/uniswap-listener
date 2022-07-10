
# Backend

There are 2 important files - 
- **index.js** - to start to REST API server
- **event-listener.js** - to fetch and cache the historical 'Swap' events

Create a **.env** file similar to **.env.example**


## Commands

- To run the server -

```bash
  npm run start
```


- Make sure redis-server is active in the device. Then run this command  to fetch and cache the events -

```bash
  npm run listen
```

- To run both the scripts concurrently - 

```bash
  npm run build
```