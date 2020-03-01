=> React Blog

This is a MERN stack based fully functioning blog system, which supports features of signing up, signing up, making authenticated requests, updating profile, changing password, publishing/editing/deleting blog post, making comments, etc.

=>Front-end

* The front-end client is built as a simple-page-application using React.
* React-Router is used for navigation.
* Bootstrap 4 is used for page styling.

=>Back-end

* The back-end server is built with Express.js and Node.js, which provides completed REST APIs for data interaction.
* Passport.js is used as an authentication middleware in the sever.
*  User signing and making authenticated requests.

=> Database

* MongoDB is used as the back-end database, which include different data models/schemas (i.e., User, Post and Comment).
* Mongoose is used to access the MongoDB for CRUD actions (create, read, update and delete).

=>Usage

Running locally you need 3 terminals open: one for client, one for server, and another one for MongoDB back-end. Below are the steps:

1. Install Node.js;
2. Install MongoDB;
3. git clone
4. Go to directory `client`, and run `npm install`;
5. Go to directory `server`, and run `npm install`;
6. In one terminal, run `mongod`;
7. In `server` directory, run `npm run dev`;
8. In `client` directory, run `npm run start`;

Go to `http://localhost:3000/` to check the live application.

Some screenshots from the website :
![image](https://user-images.githubusercontent.com/35595041/75632953-fe1c4680-5c26-11ea-88f7-571c65a54df1.png)


