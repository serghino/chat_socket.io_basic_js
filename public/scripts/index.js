$(document).ready(
    function(){

        function updateMessages(messages){
            $("#chat").empty();
            $.each(messages, 
                function(index, item){
                    $("#chat").append("<div id='user'>"+item.body +"</div>"+"<br>"+"<br>");
                })
        }

        const socket = io();
        socket.on("join", function (messages){
            updateMessages(messages);
        });
         socket.on("update", function (messages){
            updateMessages(messages);
        });
        socket.on("received", function (messages){
            console.log(messages);
        });

        $("#btnsnd").click(function(){
            socket.emit("message", $("#txtMessage").val());
            $("#txtMessage").val('');
        })
    }
)