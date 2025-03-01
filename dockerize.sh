docker build . --no-cache -t whitelist_backend_server
docker stop whitelist_backend_container
docker rm whitelist_backend_container
docker run --network=host --name whitelist_backend_container -p 49160:3006 -d whitelist_backend_server
