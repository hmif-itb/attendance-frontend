let eventId = '';
let serverUrl = '';
let jwtKey = '';

let enterAction = ()=>{check();};
let onAction = false;

const NIM_REGEX = /[a-zA-Z0-9]{5,}/;

function closeDialogEnter(name){
    closeDialog(name);
    if(!onAction && name=='notice'){
        enterAction = ()=>{check();};
    }
    $('#nimInput').focus();
}

function send(){
    onAction = true;
    closeDialogEnter('cek');
    notice('Loading','',false);
    enterAction = ()=>{closeDialogEnter('notice');};
    
    let nimData =  $('#nimInput').val();
    let attendUrl = serverUrl+'/events/'+eventId+'/attend';
    
    let postData = {
        nim: nimData
    }
    
    fetch(attendUrl,{
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+jwtKey, 
            'Content-Type':'application/JSON'
        },
        body: JSON.stringify(postData)
    }).then((val)=>{
        closeDialogEnter('notice');
        onAction = false;
        if(val.status==200){
            $('#nimInput').val('');
            setTimeout(()=>{
                notice('Success','OK',true);
            },50);
        }else{
            val.json().then((content)=>{
                setTimeout(()=>{
                    notice(content.detail,'OK',true);
                },50);
            });
        }
        setTimeout(()=>{
            enterAction = ()=>{
                closeDialogEnter('notice');
            };
        },50);
    }).catch((err)=>{
        console.error(err);
        alert(err);
        onAction = false;
    });
}

function check(){
    $('#nimInput').blur();
    onAction = true;
    let nimData = $('#nimInput').val();
    
    if(NIM_REGEX.test(nimData)){
        notice('Loading','',false);
        
        let nimUrl = serverUrl + '/students/'+nimData;
        
        fetch(nimUrl,{
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+jwtKey, 
                'Content-Type':'application/JSON'
            }
        }).then((val)=>{
            val.json().then((content)=>{
                closeDialogEnter('notice');
                if(val.status==200){
                    $('#nameCheck').text(content[0].name);
                    openDialog('cek');
                    onAction = false;
                    enterAction = ()=>{send();};
                }else if(val.status==404){
                    openDialog('name');
                    onAction = false;
                    enterAction = ()=>{register();};
                    setTimeout(()=>{$('#regisName').focus();},50);
                }else{
                    setTimeout(()=>{
                        $('#nimInput').val('');
                        onAction = false;
                        notice(content.detail,'OK',true);
                        enterAction = ()=>{closeDialogEnter('notice');};
                    },50);
                }
            });
        }).catch((err)=>{
            console.error(err);
            alert(err);
            onAction = false;
        });
        
    }else {
        onAction = false;
        notice('Invalid NIM','OK',true);
        enterAction = ()=>{closeDialogEnter('notice');};
    };
}

async function register(){
    $('#regisName').blur();
    onAction = true;
    let nimData = $('#nimInput').val();
    let nameData = $('#regisName').val();

    if(nameData!==''){
        closeDialog('name');
        notice('Loading','',false);
    
        let res = await addStudent(nameData,nimData);
        closeDialogEnter('notice');
        onAction = false;
        try{
            if(res.status==200){
                send();
            }else{
                res.json().then((content)=>{
                    setTimeout(()=>{
                        notice(content.detail,'OK',true);
                    },50);
                })
            }
            setTimeout(()=>{
                enterAction = ()=>{
                    closeDialogEnter('notice');
                };
            },50);
        }catch(err){
            notice(err.detail,'',false);
            enterAction = ()=>{
                closeDialogEnter('notice');
            };
        }
    }
}

async function addStudent(name, nim) {
    let response = await fetch(serverUrl + '/students', {
        method: 'POST',
        body: JSON.stringify({name: name, nim: nim}),
        headers: {
            'Authorization': 'Bearer '+jwtKey,
            'Content-Type':'application/JSON'
        }
    });

    return response;
}

$( document ).ready(function() {
    if(localStorage.getItem('serverUrl')){
        serverUrl = localStorage.getItem('serverUrl');
        
        if(sessionStorage.getItem('jwt')){
            jwtKey = sessionStorage.getItem('jwt');
            if(window.location.hash.length==21){
                eventId = window.location.hash.substr(1,20);
                
                let eventsUrl = serverUrl + '/events/'+eventId;
                
                fetch(eventsUrl,{
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer '+jwtKey, 
                        'Content-Type':'application/JSON'
                    }
                }).then((val)=>{
                    val.json().then((content)=>{
                        if(val.status==200){
                            $('#eventName').text(content.name);
                        }
                    });
                }).catch((err)=>{
                    console.error(err);
                    alert(err);
                });
                
            }else{
                window.location.replace('/event.html');
            }
        }else{
            window.location.replace('/');
        }
    }else{
        alert('Error, URL not supplied');
    }
});

$(document).keypress(function(event){
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        if(!onAction){
            enterAction();
        }
    }
});