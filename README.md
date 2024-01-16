# Admin Portal Frontend

This README provides information about the Admin Portal, a frontend project. It covers how to run the project in development and production modes, details about the packages used, and some key functionalities of the application.

## Prerequisites

To run this project, it's recommended to have these installed on your computer.

- Node.js (v16.14.0 or higher)
  To install Node.js 18.\*, use the following command:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

- npm (v8.0.0 or higher)

## Running the Application

First, you need to install all the dependencies that are listed in package.json file.

```bash
npm install
```

### Development Mode

To run the application in development mode, use the following command:

```bash
npm run dev
```

This command will start the application on port 3001.
Please note that when running the project locally, you must change the backend URL in the **_config.ts_** file located in the **_utils_** folder. This is because CORS is implemented on the backend, and the deployed backend will reject all requests coming from the local development server. Make sure you are also running the backend locally and use that URL.

### Production Mode

To run the application in production mode, you first need to build the project:

```bash
npm run build
```

After the build process is complete, you can start the application:

```bash
npm start
```

The application will again start on port 3001.

For running the production build in a production environment(EC2 instance)

1. First get the **.pem** file and ip for the that instance:
2. Navigate to the folder where you put the **.pem** file and give it permission using your terminal

```bash
chmod 400 name.pem
```

3. SSH into the server

```bash
ssh -i name.pem ubuntu@123.45.67.89
```

4. Clone the project from github and do the necessary steps to install the dependecies and build the project
5. You can use **pm2**, a process manager for Node.js applications to run it

```bash
npm install pm2 -g
```

Then, you can start the application with **pm2**:

```bash
pm2 start npm --name "admin_portal" -- start
```

## Packages Used

This project uses several packages. The following are some of the key packages and their roles:

- @tanstack/react-query: Used for fetching, caching, synchronizing and updating server state in the application.
- **@tanstack/react-table**: Used for handling table view in the application.
- **next**: The core framework used for building the application.
- **react**: A JavaScript library for building user interfaces.
- **react-icons**: Used for including popular icons in the application.
- **react-secure-storage**: Used for securely storing the token from the backend when a user logs in.
- **js-cookie**: Used for handling cookies in the application.
- **typescript**: Used for writing typed JavaScript at any scale.

## Key Functionalities

When an unauthenticated user accesses the application, they will be directed to the login page. On this page, there is a "Remember me" checkbox. If this checkbox is ticked, the application will use cookies to store user data, and the session will not expire until the user signs out. If the checkbox is not ticked, the application will store user data in session storage, and all user data will be removed when the tab is closed. Also, the user will be logged out and redirected to the sign-in page after 15 minutes of inactivity.
The token received from the backend when a user logs in is stored in local storage using the **react-secure-storage** package. If a user signs in on another tab, the token stored in local storage will be overwritten, which may cause issues in the tab where the user signed in first.
Before attempting to log in make sure to create a user account with admin role and reset the password using the api endpoints(more information on the backend documentation).
