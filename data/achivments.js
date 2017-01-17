module.exports = [{
    title: "Вот так просто",
    game: "power_brain",
    description: "Просто пройди игру Power Brain, этого будет достаточно чтобы заработать немного монет)",
    prize: 15,
    cryteria: true
}, {
    title: "Набираем высоту",
    game: "airplanes",
    description: "Дать минимум 50 правильных ответов в игре.",
    prize: 27,
    cryteria: "levels - errors >= 50"
}, {
    title: "Безошибочный",
    game: "fast_math",
    description: "Не допустить ни одной ошибки в игре Математик.",
    prize: 27,
    cryteria: "errors == 0"
}, {
    title: "Дуэлянт",
    game: "duel",
    description: "Первый раз победить в дуэли",
    prize: 27,
    cryteria: null
}, {
    title: "Утешительный приз",
    game: "duel",
    description: "На случай, когда впервые проиграл дуэль",
    prize: 27,
    cryteria: null
}, {
    title: "Будущий гений",
    game: "main",
    description: "Пройти первую тренировку",
    prize: 27,
    cryteria: "userOld.statistic.workoutsComplete == 0 && findedUser.statistic.workoutsComplete == 1"
}, {
    title: "Красавчик",
    game: "main",
    description: "Ты достиг 2 уровня, продолжай в том же духе!",
    prize: 150,
    cryteria: "userOld.statistic.level == 1 && findedUser.statistic.level == 2"
}, {
    title: "Лучший друг",
    game: "main",
    description: "Ты достиг 5 уровня: ты и друг, тебя пригласивший, получаете по 150 brain coins",
    prize: 150,
    unique: "findedUser.payment += 30", // сделать в некоторых случаях допольнительные штукиЮ кроме приза-монеток
    cryteria: "userOld.statistic.level == 4 && findedUser.statistic.level == 5 && findedUser.ref"
}];