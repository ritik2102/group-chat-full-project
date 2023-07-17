const inputField=document.getElementById('input-box');
const messageButton=document.getElementById('message-button');
const token=localStorage.getItem('token');
const welcomeMessage=document.getElementById('welcome-message');
const messageList=document.getElementById('messages');
let userName;
async function init(){
    try{
        messageList.innerHTML='';
        await axios.get('http://localhost:3000/users/getUser', { headers: { "Authorization": token } }).
            then(response=>{
                // console.log(response.data.name);
                userName=response.data.name;
                welcomeMessage.innerHTML=`Welcome ${userName}!!!`;
            })
            .catch(err=>{
                throw new Error(err);
            })
        await axios.get('http://localhost:3000/message/get-message',{ headers: { "Authorization": token } })
            .then(response=>{
                const messages=response.data.response;
                messages.forEach(element => {
                    console.log(element);
                    const li=document.createElement('li');
                    // const li=document.createElement('p');
                    if(element.userName===userName){
                        li.classList.add('current-user');
                        li.innerHTML=`You-${element.content}`;
                    } else{
                        li.classList.add('other-user');
                        li.innerHTML=`${element.userName.split(" ")[0]}-${element.content}`;
                    }
                    const br=document.createElement('br');
                    li.appendChild(br);
                    messageList.appendChild(li);
                });
            })
            .catch(err=>{
                throw new Error(err);
            })
    } catch(err){
        throw new Error(err);
    }
}

init();

setInterval(()=>init(),1000);

async function submitHandler(e) {

    try {
        e.preventDefault();
        const message=  inputField.value;
        const data={
            "message":message
        }

        await axios.post('http://localhost:3000/message/add-message',data, { headers: { "Authorization": token } })
            .then(res=>{
                const message=res.data.response.content;
                // creating a li and adding to to messageList
                const li=document.createElement('li');
                li.classList.add('current-user');
                li.innerHTML=`You-${message}`;
                messageList.appendChild(li);
            })
            .catch(err=>{
                throw new Error(err);
            })
    }
    catch (err) {
        console.log(err);
    }


}