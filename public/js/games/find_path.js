$(document).ready(function(){
   
   $('#start_game').click(function(){
        $('.game_intro').addClass('hide_intro').delay(500).queue(function () { $(this).css('display', 'none'); $(this).dequeue();});
        $('.game_results').delay(600).queue(function () {$(this).removeClass('hide_results');});
        
    })
    $('#nextGame').click(function(){
        location.href = '/workout_check?coins='+ (1);
        // setTimeout(startGame, 1000);
        
    })
    
    // console.log(achivments);
    
});