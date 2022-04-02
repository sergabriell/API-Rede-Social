const express = require('express');
const route = express();

const users = require('./controllers/users');
const login = require('./controllers/login');
const verifyLogin = require('./middleware/verifyLogin');
const posts = require('./controllers/posts');

// users 
route.post('/users', users.registerUser);
route.post('/login', login.login);

// posts
route.get('/', posts.listAllPosts);
route.use(verifyLogin)
route.post('/posts', posts.registerPost);
route.put('/posts/:id', posts.updatePost);
route.get('/posts', posts.listPosts);
route.delete('/posts/:id', posts.deletePost);

module.exports = route;