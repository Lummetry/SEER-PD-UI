## **LENS UX**

#

This repository contains 2 apps:

- JS app - this is the code that runs in your browser -> `client` folder
- Nim app - this is the backend app that the JS app gets its data from -> `server` folder

Please see the `README.md` files in the `client` and `server` folders in order to start the two apps.

# Using nginx

Assuming you started the JS app on port `3000` and the backend Nim app on port `5000` then all you need to do next is install a webserver like nginx. Then your nginx configuration in `nginx.conf` should look like this:

        server {
            listen       8080;
            server_name  localhost;

            location / {
                proxy_pass http://127.0.0.1:3000;
            }

            location /api/ {
                proxy_pass http://127.0.0.1:5000/;
            }
        }

You can then access the app by going to http://localhost:8080

# Not using nginx

If you don't want to install nginx then you can manually change the Nim app address. For more info, check `README.md` in the `client` folder and the `Using another address for the Nim app` section.
