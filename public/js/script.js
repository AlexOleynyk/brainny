console.log('my js is working!');

$(document).ready(function() {
    var notifications = notificationsArray;

    // обработка нотификаций

    notifications = notifications.splice(0, 1);
    console.log('Еще уведомлений ' + notifications.length);

    //   if ()
    
    $('.next_notification').click(function(){
        $(this).parent().hide(500)
        .next().removeClass('popup_hidden').show(500);
        readMessage();
    });
    
    $('.close_notifications').click(function(){
        readMessage();
        $(this).parent().parent().hide(500)
    });

    $('.popup_container').click(function() {
        //   console.log(notifications);

            $(this).hide(500);
        
    });

    $('.popup_message').click(function(event) {
        event.stopPropagation();
    });
    
    
    

    function readMessage() {
        $.ajax( {
            url: '/message_read',
            type: 'POST',
            success: function(data){
                //alert('сщщбщение прочитано '+ data);
            }
        });
        
        
    }



    // конец 
});
