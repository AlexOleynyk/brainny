$(document).ready(function() {

    var board = [];
    var difficulty = levelParam;
    var dimentions = 0;
    var levels = 3;
    var level = 1;
    var clickLeft = 0;
    var errors = 0;


    function startGame() {

        switch (difficulty) {
            case 1:
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

        for (var i = 0; i < clickLeft; i++) {

        }

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

        for (var k = 0; k < clickLeft; k++) {
            do {
                var i = Math.floor(Math.random() * dimentions)
                var j = Math.floor(Math.random() * dimentions)
            } while (board[i][j] == 1)
            board[i][j] = 1;
        }

        var DOMBoard = $('.board');

        DOMBoard.children().remove();

        for (var i = 0; i < dimentions; i++) {
            // var innerArray = []
            var row = $(document.createElement('div')).addClass('row_cells');
            for (var j = 0; j < dimentions; j++) {
                var cell = board[i][j];


                if (cell == 1) {
                    $(document.createElement('span')).text('').addClass('cell active').attr('data-i', i).attr('data-j', j).appendTo(row);
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



        showLevel();
        console.log(clickLeft);
    }

    

    function showLevel() {
        setTimeout(function() {
            $('.cell').removeClass('active');

            $('.cell').click(function() {
                var i = $(this).attr('data-i');
                var j = $(this).attr('data-j');
                // console.log(i, j, board[i][j])

                if (board[i][j] == 1) {
                    $(this).addClass('active flip');
                    clickLeft--;

                }
                else {
                    $(this).addClass('fail flip');
                    for (var i = 0; i < dimentions; i++) {

                        for (var j = 0; j < dimentions; j++) {
                            if (board[i][j] == 1) {
                                $('.cell[data-i=' + i + '][data-j=' + j + ']').addClass('active flip');
                            }

                        }
                    }
                    clickLeft = 0;
                    difficulty--;
                    errors++;

                };

                checkLevel();
                checkWin();
                console.log(clickLeft);
            });

        }, 1000);
    }


    function checkLevel() {
        console.log('level ' + level)
        if (clickLeft == 0) {
            if (level == levels) {
                if (errors != 0) {
                    // alert('Ошибок: ' + errors);

                }
                else {
                    //alert('Нет ошибок');
                     levelParam++;
                }
                
                $('#brainCoinsGet').text(levels-errors);
                $('#errorsDone').text(errors);
                $('#startDifficulty').text(levelParam);
                
                
                $('.main_game_wrapper').addClass('myHidden').delay(500).css('display','none');
                $('.game_results').removeClass('hide_results');

            }
            
            else {
                level++;
                difficulty++;
                //alert('win');

                setTimeout(startGame, 1000)
                    // startGame();
            }

        }
    }

    $('#start_game').click(function(){
        $('.game_intro').addClass('hide_intro').delay(500).css('display','none');
        $('.main_game_wrapper').removeClass('myHidden');
        setTimeout(startGame, 1000);
        
    })
    $('#nextGame').click(function(){
        location.href = '/workout_check?coins='+ (levels-errors) + '&difficulty=' + levelParam;
        // setTimeout(startGame, 1000);
        
    })
    
    
    })


