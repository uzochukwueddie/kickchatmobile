const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const _ = require('lodash');
const favicon = require('serve-favicon');
const path = require('path');
const passport = require('passport');

require('dotenv').config();

const { User } = require('./helpers/userClass');
const { Global } = require('./helpers/globalRoom');
const admin = require('./controllers/adminCtrl');
const index = require('./controllers/indexCtrl');

// Routes
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const users = require('./routes/user');
const rooms = require('./routes/rooms');
const group = require('./routes/groupchat');
const friends = require('./routes/friends');
const profile = require('./routes/profile');
const files = require('./routes/files');
const messages = require('./routes/messages');
const reset = require('./routes/reset');

const app = express();

app.use(compression());
app.use(helmet());

app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(cors());

require('./socket/global')(io, Global, _);
// require('./socket/streams')(io, User, _);
require('./socket/groupchat')(io, User, _);
require('./socket/private')(io);
require('./socket/poststream')(io);
require('./socket/profileImg')(io);

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true});
// mongoose.connect('mongodb://localhost/chatapp', { useNewUrlParser: true});

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(passport.initialize());
require('./passport/passport-google');
require('./passport/passport-facebook');

app.use('/admin', admin);
app.use('/', index);
app.use('/api', auth);
app.use('/api', posts);
app.use('/api', users);
app.use('/api', rooms);
app.use('/api', group);
app.use('/api', friends);
app.use('/api', profile);
app.use('/api', files);
app.use('/api', messages);
app.use('/api', reset);

server.listen(process.env.PORT || 3000, function() {
    console.log('kickchatapp running on port 3000');
});