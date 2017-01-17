$(document).ready(function() {

    var right = false;
    var difficulty = levelParam;
    var timer;
    var seconds = 60;
    var errors = 0;
    var levels = 0;
    
    
    function startTimer(){
        var step = 100/60;
        
        
        timer = setInterval(function(){
            $('.game_progress_done').css('width', (100 - seconds*step)+'%');
            seconds--;
            
            if (seconds < 0) {
                clearInterval(timer);
                document.body.removeEventListener('keydown', keyPressedHendler);
                
                var coins
                
                $('#brainCoinsGet').text(levels-errors);
                $('#errorsDone').text(errors);
                $('#startDifficulty').text(levelParam);
                
                setTimeout(()=>{
                    $('.main_game_wrapper').addClass('myHidden').delay(500).queue(function () { $(this).css('display', 'none'); $(this).dequeue();});
                $('.game_results').delay(600).queue(function () {$(this).removeClass('hide_results');});
                },1000);
                
                
                $('#nextGame').click(function(){
                    location.href = '/workout_check?errors='+ errors + '&difficulty=' + levelParam+ '&levels=' + levels + '&game=' + gameTitle;
                });
                
            }
        }, 1000);
    }

    function generateItem() {
        // switch (difficulty) {
        //     case 1:
        //     case 0:
        //         dimentions = 2;
        //         break;
        //     case 2:
        //         dimentions = 3;
        //         break;
        //     case 3:
        //         dimentions = 3;
        //         break;
        //     case 4:
        //         dimentions = 4;
        //         break;
        //     case 5:
        //         dimentions = 4;
        //         break;
        //     case 6:
        //         dimentions = 4;
        //         break;
        //     case 7:
        //         dimentions = 5;
        //         break;
        //     case 8:
        //         dimentions = 5;
        //         break;
        //     case 9:
        //         dimentions = 5;
        //         break;
        //     default:
        //         dimentions = 5;
        //         difficulty = 10;

        // }
        
         var text = Math.random() * 10;

        var DOMBoard = $('.board');
        
        var firstItem = Math.floor(Math.random() * 20) + 1;
        var secondItem = Math.floor(Math.random() * 20) + 1;
        
        var correct = Math.round(Math.random());
        var result = 0;
        
        var sign = Math.round(Math.random());
        
        if (sign == 0) { // опрерация сложения 
            text = firstItem + ' + ' + secondItem;
            result = firstItem + secondItem;
        } else {
            text = firstItem + ' - ' + secondItem;
            result = firstItem - secondItem;
        }
        
        if (correct) {
            text += ' = ' + result;
            right = true;
        } else {
            text += ' = ' + (result + Math.floor(Math.random() * 3) + 1);
            right = false;
        }
        
        console.log('новый пример ' + text + 'Решение ' + right);
        
        

       

        var card = $(document.createElement('div')).addClass('card').appendTo(DOMBoard);
        $(document.createElement('span')).text(text).appendTo(card);
        


    }
    function keyPressedHendler(e) {
        if (e.keyCode == 37) {

                if (!right) {
                    console.log('Правильно');
                    $('.card').first().addClass('good');
                }
                else {
                    console.log('Не правильно');
                    $('.card').first().addClass('bad');
                    errors++;
                }
                $('.card').first().addClass('move_left');

            }
            else if (e.keyCode == 39) {
                if (right) {
                    console.log('Правильно');
                    $('.card').first().addClass('good');
                }
                else {
                    console.log('Не правильно');
                    $('.card').first().addClass('bad');
                    errors++;
                }
                $('.card').first().addClass('move_right');
            }


            if (e.keyCode == 39 || e.keyCode == 37) {
                levels++;
                document.body.removeEventListener('keydown', keyPressedHendler);
                $('.correct span').text('Правильных ответов: ' + (levels - errors));
               // $('.errors span').text(errors);
                
                $('.board').children().first().delay(400).queue(function() {
                    $(this).remove();
                    document.body.addEventListener('keydown', keyPressedHendler);
                    generateItem();
                    $(this).dequeue();
                });
            }
    }

    function startGame() {
        var DOMBoard = $('.board');
        document.body.addEventListener('keydown', keyPressedHendler);

        //DOMBoard.children().remove();

        /*for (var i = 0; i < dimentions; i++) {
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
        }*/
    }


    $('#start_game').click(function() {
        $('.game_intro').addClass('hide_intro').delay(500).queue(function() {
            $(this).css('display', 'none');
            $(this).dequeue();
        });
        //$('.game_results').delay(600).queue(function () {$(this).removeClass('hide_results');});

        $('.main_game_wrapper').removeClass('myHidden');
        setTimeout(function(){
            startGame();
            generateItem();
            startTimer();
        }, 1000);


    })


    $('#nextGame').click(function() {
        location.href = '/workout_check?' + (1);
        // setTimeout(startGame, 1000);

    })

    // console.log(achivments);

});
