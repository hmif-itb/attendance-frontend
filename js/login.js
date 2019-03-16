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
                if(content.jwt){
                    sessionStorage.setItem('jwt',content.jwt);
                    window.location.replace('event.html');
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
    if(sessionStorage.getItem('jwt')){
        window.location.replace('event.html');
    }
});