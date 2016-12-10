module.exports = [{
    title: "Вот так просто",
    game: "power_brain",
    description: "Просто пройди игру, этого будет достаточно чтобы заработать немного монет)",
    prize: 15,
    cryteria: null
}, {
    title: "Сам дурак",
    game: "find_path",
    description: "Дурацкое описание Задания",
    prize: 27,
    cryteria: null
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
    cryteria: "userOld.statistic.level == 4 && findedUser.statistic.level == 5 && findedUser.ref"
}];