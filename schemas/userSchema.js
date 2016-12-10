var mongoose =  require('mongoose');

module.exports = mongoose.model("User", {
    username: {type: String, unique: true},
    password: String,
    email: {type: String, unique: true},
    ref: String,
    braincoins: {type: Number, default: 0},
    dailyWorkout: {type: Number, default: 0},
    completeDailyQuest: {type: Boolean, default: false},
    completeDailyWorkout: {type: Boolean, default: false},
    achivments:  {type: Array, default: []},
    statistic: {
      workoutsComplete: {type: Number, default: 0}, 
      level: {type: Number, default: 1},
      experience: {type: Number, default: 0}
    },
    messages: {type: Array, default: [
        {
            title: 'Добро пожаловать в Brainny!',
            text: 'Надеемся, тебе здесь понравится, чувствуй себя как дома',
            image: 'complete-game.png',
            buttonText: 'Хорошо'
        }
        ]},
    games: {}
});