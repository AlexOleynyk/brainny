module.exports = 
    [{
        game: "power_brain",
        description: "Просто пройди игру Power Brain, этого будет достаточно чтобы заработать немного монет)",
        prize: 15,
        cryteria: "gameTitle == 'power_brain'"
    }, {
        game: "main",
        description: "Пройди ежедневную тренировку",
        prize: 32,
        cryteria: "findedUser.statistic.workoutsComplete - userOld.statistic.workoutsComplete  == 1"
    }, {
        game: "airplanes",
        description: "Заработай более 30 правильных ответов в игре Самолетики",
        prize: 111,
        cryteria: "gameTitle == 'airplanes' && levels >= 30"
    }]
;
