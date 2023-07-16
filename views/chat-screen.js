const inputField=document.getElementById('input-box');
const messageButton=document.getElementById('message-button');
const token=localStorage.getItem('token');

async function submitHandler(e) {

    try {
        e.preventDefault();
        const message=  inputField.value;
        const data={
            "message":message
        }

        await axios.post('http://localhost:3000/message/add-message',data, { headers: { "Authorization": token } })
            .then(res=>{
                console.log(res.data.response)
            })
            .catch(err=>{
                throw new Error(err);
            })
    }
    catch (err) {
        console.log(err);
    }


}