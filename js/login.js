function login(){
    let loginUrl = localStorage.getItem('serverUrl');
    if(loginUrl){
        loginUrl += '/auth/login';
        
        let postData = {
            username: $('#username').val(),
            password: $('#userPass').val()
        };
        
        fetch(loginUrl,{
            method: 'POST',
            headers: {
                "Content-Type":"application/JSON"
            },
            body: JSON.stringify(postData)
        }).then((val)=>{
            val.json().then((content)=>{
                if(val.status==200){
                    if(content.jwt){
                        sessionStorage.setItem('jwt',content.jwt);
                        sessionStorage.setItem('jwtTime',new Date().getTime());
                        window.location.href = 'event.html';
                    }else{
                        notice('Unknown error','',false);
                    }
                }else{
                    notice(content.detail,'OK',true);
                }
            })
        }).catch((err)=>{
            console.error(err);
            alert(err);
        });
    }else{
        alert('Error, URL not supplied');
    }
}

$( document ).ready(function() {
    if(sessionStorage.getItem('jwtTime')){
        if(Date.now()-sessionStorage.getItem('jwtTime') > 3600000){
            sessionStorage.clear();
        }else{
            window.location.href = 'event.html';
        }
    }
});