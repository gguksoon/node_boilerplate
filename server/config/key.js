if(process.env.NODE_ENV === 'production') { // deploy
    module.exports = require('./prod');
} else { // dev
    module.exports = require('./dev');
}