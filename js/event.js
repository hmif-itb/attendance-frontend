function eventPick(){
    let eventId = $('#eventId').val();
    if(eventId){
        window.location.href = 'attd.html#'+eventId;
    }
}

function eventStatus(){
    let eventId = $('#eventId').val();
    if(eventId){
        window.location.href = 'status.html#'+eventId;
    }
}


$( document ).ready(function() {
    let jwtKey = sessionStorage.getItem('jwt');

    if(!jwtKey){
        window.location.href = '/';
    }

    let serverUrl = localStorage.getItem('serverUrl');
    let eventsUrl = serverUrl + '/events';
    
    fetch(eventsUrl,{
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '+jwtKey, 
            'Content-Type':'application/JSON'
        }
    }).then((val)=>{
        val.json().then((content)=>{
            if(val.status==200){
                $('#eventId').empty();
                content.forEach(el => {
                    $('#eventId').append('<option value="'+el.id+'">'+el.name+'</option>');
                });
            }else{
                notice(content.detail,'OK',true);
            }
        });
    }).catch((err)=>{
        console.error(err);
        alert(err);
    });
});