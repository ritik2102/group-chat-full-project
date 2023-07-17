const inputField=document.getElementById('input-box');
const messageButton=document.getElementById('message-button');
const token=localStorage.getItem('token');
const welcomeMessage=document.getElementById('welcome-message');
const messageList=document.getElementById('messages');
let userName;

let lastMessageId;
// localStorage.removeItem("oldMessages");
const oldMessages=JSON.parse(localStorage.getItem("oldMessages"));
if(!oldMessages){
    // console.log("Here");
    lastMessageId=0;
} else{
    // console.log("Here 1");
    const length=oldMessages.length;
    lastMessageId=oldMessages[length-1].messageID
    // // lastMessageId=oldMessages.length;
    // console.log(lastMessageId);
    // console.log(oldMessages);
}

async function init(){
    try{
        messageList.innerHTML='';
        await axios.get('http://localhost:3000/users/getUser', { headers: { "Authorization": token } }).
            then(response=>{
                userName=response.data.name;
                welcomeMessage.innerHTML=`Welcome ${userName}!!!`;
            })
            .catch(err=>{
                throw new Error(err);
            })
            await axios.get(`http://localhost:3000/message/get-message?lastMessageId=${lastMessageId}`,{ headers: { "Authorization": token } })
            .then(response=>{
                if(lastMessageId===0){
                    const data=response.data.response;
                    const lastElements=data.slice(-10);
                    localStorage.setItem("oldMessages",JSON.stringify(lastElements));
                }
                else{
                    const newArray=oldMessages.concat(response.data.response);
                    const lastElements=newArray.slice(-10);
                    localStorage.setItem("oldMessages",JSON.stringify(lastElements));
                }
                const messages=JSON.parse(localStorage.getItem("oldMessages"));

                messages.forEach(element => {
                    const li=document.createElement('li');
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

// setInterval(()=>init(),1000);

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