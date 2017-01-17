$(document).ready(function() {

    var board = [];
    var difficulty = levelParam;
    // var difficulty = 18
    var dimentions = 0;
    var levels = 3;
    var level = 1;
    var clickLeft = 0;
    var errors = 0;
    var figures = ['cir_blue', 'cir_green', 'cir_red', 'cir_yellow', 'sq_blue', 'sq_green', 'sq_red', 'sq_yellow', 'sqr_blue', 'sqr_green', 'sqr_red', 'sqr_yellow', 'star_blue', 'star_green', 'star_red', 'star_yellow', 'tr_blue', 'tr_green', 'tr_red', 'tr_yellow'];

    var localFigures;
    var usedFigures = [];
    loadFigures();
    function loadFigures() {
        dimentions = 5;
        board = [];

        var DOMBoard = $('.board');

        DOMBoard.children().remove();


        for (var i = 0; i < dimentions; i++) {
            var innerArray = []
            for (var j = 0; j < dimentions; j++) {
                var active = Math.random() > 0.9 ? 1 : 0;
                // if (active == 1) {
                //     clickLeft++;
                // }
                innerArray.push(0);

            }
            board.push(innerArray);
        }



        localFigures = figures.slice();
        usedFigures = [];

        for (var k = 0; k < figures.length; k++) {
            do {
                var i = Math.floor(Math.random() * dimentions)
                var j = Math.floor(Math.random() * dimentions)
            } while (board[i][j] != 0)

            var figureIndex = Math.floor(Math.random() * localFigures.length)
            board[i][j] = localFigures[figureIndex];
            usedFigures.push(localFigures[figureIndex]);
            localFigures.splice(figureIndex, 1);

        }

        for (var i = 0; i < dimentions; i++) {
            // var innerArray = []
            var row = $(document.createElement('div')).addClass('row_cells');
            for (var j = 0; j < dimentions; j++) {
                var cell = board[i][j];


                if (cell != 0) {
                    $(document.createElement('span')).text('').addClass('cell').css('background', 'url(../../img/figures/' + cell + '.png)').css('border-radius', '0px').attr('data-i', i).attr('data-j', j).appendTo(row);
                }
                else {
                    $(document.createElement('span')).text('').addClass('cell').attr('data-i', i).attr('data-j', j).appendTo(row);
                }

                // innerArray.push(0);
                // row.add('span').text(board[i][j])
            }
            row.appendTo(DOMBoard);
            DOMBoard.children().remove();
            // DOMBoard.add
            // board.push(innerArray);
        }
    }

    function startGame() {

        dimentions = 5;
        board = [];

        var DOMBoard = $('.board');

        DOMBoard.children().remove();


        for (var i = 0; i < dimentions; i++) {
            var innerArray = []
            for (var j = 0; j < dimentions; j++) {
                var active = Math.random() > 0.9 ? 1 : 0;
                // if (active == 1) {
                //     clickLeft++;
                // }
                innerArray.push(0);

            }
            board.push(innerArray);
        }



        localFigures = figures.slice();
        usedFigures = [];

        for (var k = 0; k < difficulty; k++) {
            do {
                var i = Math.floor(Math.random() * dimentions)
                var j = Math.floor(Math.random() * dimentions)
            } while (board[i][j] != 0)

            var figureIndex = Math.floor(Math.random() * localFigures.length)
            board[i][j] = localFigures[figureIndex];
            usedFigures.push(localFigures[figureIndex]);
            localFigures.splice(figureIndex, 1);

        }

        for (var i = 0; i < dimentions; i++) {
            // var innerArray = []
            var row = $(document.createElement('div')).addClass('row_cells');
            for (var j = 0; j < dimentions; j++) {
                var cell = board[i][j];


                if (cell != 0) {
                    $(document.createElement('span')).text('').addClass('cell').css('background', 'url(../../img/figures/' + cell + '.png)').css('border-radius', '0px').attr('data-i', i).attr('data-j', j).appendTo(row);
                }
                else {
                    $(document.createElement('span')).text('').addClass('cell').attr('data-i', i).attr('data-j', j).appendTo(row);
                }

                // innerArray.push(0);
                // row.add('span').text(board[i][j])
            }
            row.appendTo(DOMBoard);
            // DOMBoard.add
            // board.push(innerArray);
        }
        
        // console.log(localFigures);
        // console.log(usedFigures);
        // console.log(figures);

        /* switch (difficulty) {
             case 1:
             case 0:
                 dimentions = 2;
                 break;
             case 2:
                 dimentions = 3;
                 break;
             case 3:
                 dimentions = 3;
                 break;
             case 4:
                 dimentions = 4;
                 break;
             case 5:
                 dimentions = 4;
                 break;
             case 6:
                 dimentions = 4;
                 break;
             case 7:
                 dimentions = 5;
                 break;
             case 8:
                 dimentions = 5;
                 break;
             case 9:
                 dimentions = 5;
                 break;
             default:
                 dimentions = 5;
                 difficulty = 10;
                 
         }
         clickLeft = difficulty + 1;
         board = [];



         


        */
         showLevel();
         console.log('Ta-da!');
    }



    function showLevel() {
        setTimeout(function() {

            dimentions = 5;
            board = [];

            var DOMBoard = $('.board');

            DOMBoard.children().remove();

            for (var i = 0; i < dimentions; i++) {
                var innerArray = []
                for (var j = 0; j < dimentions; j++) {
                    innerArray.push(0);
                }
                board.push(innerArray);
            }

            //localFigures = figures;
            //usedFigures = [];

            for (var k = 0; k < usedFigures.length; k++) {
                do {
                    var i = Math.floor(Math.random() * dimentions)
                    var j = Math.floor(Math.random() * dimentions)
                } while (board[i][j] != 0)

                //var figureIndex = Math.floor(Math.random() * localFigures.length)

                board[i][j] = usedFigures[k];
                //usedFigures.push(localFigures[k]);
                //localFigures.splice(k, 1);

            }

            do {
                var i = Math.floor(Math.random() * dimentions)
                var j = Math.floor(Math.random() * dimentions)
            } while (board[i][j] != 0)

            //var figureIndex = Math.floor(Math.random() * localFigures.length)

            board[i][j] = localFigures[Math.floor(Math.random() * localFigures.length)];
            

            for (var i = 0; i < dimentions; i++) {
                // var innerArray = []
                var row = $(document.createElement('div')).addClass('row_cells');
                for (var j = 0; j < dimentions; j++) {
                    var cell = board[i][j];


                    if (cell != 0) {
                        $(document.createElement('span')).text('').addClass('cell').css('background', 'url(../../img/figures/' + cell + '.png)').css('border-radius', '0px').attr('data-i', i).attr('data-j', j).appendTo(row);
                    }
                    else {
                        $(document.createElement('span')).text('').addClass('cell').attr('data-i', i).attr('data-j', j).appendTo(row);
                    }

                    // innerArray.push(0);
                    // row.add('span').text(board[i][j])
                }
                row.appendTo(DOMBoard);
                // DOMBoard.add
                // board.push(innerArray);
            }
            
            $('.cell').click(function() {
                var i = $(this).attr('data-i');
                var j = $(this).attr('data-j');
                // console.log(i, j, board[i][j])
                var figure = board[i][j];

                if (localFigures.indexOf(figure) != -1) {
                    //$(this).addClass('flip');
                    difficulty++;
                    console.log('win')
                } else {
                    console.log('lose');
                    errors++;
                }
                //level++;
                checkLevel();
            })

            // $('.cell').removeClass('active');

            // // обработка клика по ячейке
            // $('.cell').click(function() {
            //     var i = $(this).attr('data-i');
            //     var j = $(this).attr('data-j');
            //     // console.log(i, j, board[i][j])

            //     if (board[i][j] == 1) {
            //         $(this).addClass('active flip');
            //         clickLeft--;

            //     }
            //     else {
            //         $(this).addClass('fail flip');
            //         for (var i = 0; i < dimentions; i++) {

            //             for (var j = 0; j < dimentions; j++) {
            //                 if (board[i][j] == 1) {
            //                     $('.cell[data-i=' + i + '][data-j=' + j + ']').addClass('active flip');
            //                 }

            //             }
            //         }
            //         clickLeft = 0;
            //         difficulty--;
            //         errors++;

            //     };

            //     checkLevel();
            //     //checkWin();
            //     console.log(clickLeft);
            // });

        }, 2000);
    }


    function checkLevel() {
        console.log('level ' + level)

        
            if (level == levels) {
                if (errors != 0) {
                    // alert('Ошибок: ' + errors);

                }
                else {
                    //alert('Нет ошибок');
                    levelParam++;
                }

                $('#brainCoinsGet').text(levels - errors);
                $('#errorsDone').text(errors);
                $('#startDifficulty').text(levelParam);


                setTimeout(() => {
                    $('.main_game_wrapper').addClass('myHidden').delay(500).queue(function() {
                        $(this).css('display', 'none');
                        $(this).dequeue();
                    });
                    $('.game_results').delay(600).queue(function() {
                        $(this).removeClass('hide_results');
                    });
                }, 1000);


                // Установка ссылки на кнопку 
                $('#nextGame').click(function() {
                    location.href = '/workout_check?errors=' + errors + '&difficulty=' + levelParam + '&levels=' + levels + '&game=' + gameTitle;
                    // setTimeout(startGame, 1000);

                })

            }
            else {
                level++;
                difficulty++;
                //alert('win');

                setTimeout(startGame, 1000)
                    // startGame();
            }

        
    }

    $('#start_game').click(function() {
        $('.game_intro').addClass('hide_intro').delay(500).queue(function() {
            $(this).css('display', 'none');
            $(this).dequeue();
        });
        $('.main_game_wrapper').removeClass('myHidden');
        setTimeout(startGame, 1000);

    })



})
