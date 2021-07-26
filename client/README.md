## **Lens UX client app**

# Install dependencies

Run `npm install` in this folder (`client`) to install the dependencies.

# Run the app:

Run `npm start` to start the application. It will start on port `3000` by default.

The default port is 3000 but you can change it to something else (like 4000) modifying this line in the `.env` file in this folder:

    PORT=4000

# Using another address for the Nim app

If you plan to access the backend Nim app at another address (and not have to install nginx to configure the `/api` route) then see the `src/data/api.js` file:

    export const nimAPI = axios.create({
        baseURL: `${document.location.origin}/api`
    });

What this means is: if you are going to http://localhost:8080 in your browser to access the app then the JS app will comunicate with the Nim backend app will be accessed using `http://localhost:8080/api`

The `/api` route is defined in the Nginx configuration file: `nginx.conf` and you can check the `readme.md` file in the upper folder for more info on configuring Nginx. You can also change the `baseURL` to a value of your choice and skip installing nginx.
