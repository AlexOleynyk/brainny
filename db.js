var mongoose =  require('mongoose');

var dbUrl = process.env.MONGOLAB_URI;

mongoose.connect(dbUrl, function(err){
    if(err) {
        console.log(err);
    }
});

module.exports = mongoose.connection;