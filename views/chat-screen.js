const inputField = document.getElementById('input-box');
const messageButton = document.getElementById('message-button');
const token = localStorage.getItem('token');
const welcomeMessage = document.getElementById('welcome-message');
const messageList = document.getElementById('messages');
const groupNameField = document.getElementById('group-name');
const groupsContainer = document.getElementById("groups-container");
let userName;
let selectedGroup;






//Modal window functionality for adding group
// 'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelector('.show-modal');

const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};


btnsOpenModal.addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {

    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});





// Modal window for adding participants


const modalAdd = document.querySelector('.modal-add');
const overlayAdd = document.querySelector('.overlay-add');
const btnCloseModalAdd = document.querySelector('.close-modal-add');
const btnsOpenModalAdd = document.querySelector('.show-modal-add');
const userList = document.getElementById('user-list');

const openModalAdd = function () {
    modalAdd.classList.remove('hidden');
    overlayAdd.classList.remove('hidden');
};

const closeModalAdd = function () {
    modalAdd.classList.add('hidden');
    overlayAdd.classList.add('hidden');
};

btnsOpenModalAdd.addEventListener('click', openModalAdd);
btnsOpenModalAdd.addEventListener('click', async () => {

    try {
        await axios.get("http://localhost:3000/users/getUsers")
            .then(response => {
                userList.innerHTML = "";
                const users = response.data.users;

                for (let i = 0; i < users.length; i++) {
                    var option = document.createElement("option");

                    // // Set the value and text of the option
                    option.value = users[i].id;
                    option.text = users[i].name;

                    // // Append the option to the select element
                    userList.appendChild(option);
                }
            })
            .catch(err => {
                console.log(err);
            })
    } catch (err) {
        console.log(err);
    }

});

btnCloseModalAdd.addEventListener('click', closeModalAdd);
overlayAdd.addEventListener('click', closeModalAdd);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModalAdd();
    }
});





// Application functionality

async function addParticipant(e) {
    try {
        e.preventDefault();
        const userListField = document.getElementById('user-list');
        const users = userListField.selectedOptions;
        if (!selectedGroup) {
            alert("Select a group first");
        } else {
            console.log(selectedGroup);
            for (let i = 0; i < users.length; i++) {
                console.log(users[i].value);
                const data={
                    user:users[i].value,
                    group:selectedGroup
                }
                axios.post("http://localhost:3000/group/addMember",data)
                    .then(res=>{

                    })
                    .catch(err=>{
                        console.log(err);
                    })
            }
        }


    } catch (err) {
        console.log(err);
    }
}


async function addGroup(e) {
    try {
        e.preventDefault();
        const groupName = groupNameField.value;
        console.log(groupName);
        const data = {
            name: groupName
        }
        await axios.post("http://localhost:3000/group/addGroup", data, { headers: { "Authorization": token } })
            .then(response => {
                if (response.data.success === true) {
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(err);
            })
    } catch (err) {
        throw new Error(err);
    }
}



// Access to old messages from local storage
let lastMessageId;

const oldMessages = JSON.parse(localStorage.getItem("oldMessages"));
// If no old messages object exists in local storage
if (!oldMessages) {
    lastMessageId = 0;
}
// If old messages exist in local storage
else if (oldMessages.length > 0) {
    const length = oldMessages.length;
    lastMessageId = oldMessages[length - 1].messageID;
}

async function init() {
    try {
        messageList.innerHTML = '';
        await axios.get('http://localhost:3000/users/getUser', { headers: { "Authorization": token } }).
            then(response => {
                userName = response.data.name;
                welcomeMessage.innerHTML = `Welcome ${userName}!!!`;
            })
            .catch(err => {
                throw new Error(err);
            })

        await axios.get("http://localhost:3000/group/getGroups", { headers: { "Authorization": token } })
            .then(response => {
                const groups = response.data.response;

                // Logging each group on the left side of the screen
                for (let i = 0; i < groups.length; i++) {

                    const li = document.createElement("li");
                    li.innerHTML = groups[i].name;
                    li.classList.add("group-list-item");
                    // Adding event-listener to each group
                    li.addEventListener("click", async () => {
                        messageList.innerHTML = "";
                        selectedGroup = groups[i].id;
                        welcomeMessage.innerHTML = groups[i].name;

                        // backend-call to get the messages
                        await axios.get(`http://localhost:3000/message/get-message?lastMessageId=${lastMessageId}`, { headers: { "Authorization": token, "groupId": selectedGroup } })
                            .then(response => {
                                messageList.innerHTML = "";
                                if (lastMessageId === 0) {
                                    const data = response.data.response;
                                    const lastElements = data.slice(-10);
                                    localStorage.setItem("oldMessages", JSON.stringify(lastElements));
                                }
                                else {
                                    const newArray = oldMessages.concat(response.data.response);
                                    const lastElements = newArray.slice(-10);
                                    localStorage.setItem("oldMessages", JSON.stringify(lastElements));
                                }
                                const messages = JSON.parse(localStorage.getItem("oldMessages"));

                                messages.forEach(element => {
                                    if (element.groupId === selectedGroup) {
                                        const li = document.createElement('li');
                                        if (element.userName === userName) {
                                            li.classList.add('current-user');
                                            li.innerHTML = `You-${element.content}`;
                                        } else {
                                            li.classList.add('other-user');
                                            li.innerHTML = `${element.userName.split(" ")[0]}-${element.content}`;
                                        }
                                        const br = document.createElement('br');
                                        li.appendChild(br);
                                        messageList.appendChild(li);
                                    }
                                });
                            })
                            .catch(err => {
                                throw new Error(err);
                            })


                    })
                    const hr = document.createElement("hr");
                    groupsContainer.appendChild(li);
                    groupsContainer.appendChild(hr);
                }

            })
            .catch(err => {
                console.log(err);
            })
    } catch (err) {
        throw new Error(err);
    }
}

init();

// setInterval(()=>init(),1000);

async function submitHandler(e) {

    try {
        e.preventDefault();
        const message = inputField.value;
        const data = {
            "message": message
        }
        if (!selectedGroup) {
            alert("Please select a group first to send a message");
        } else {
            await axios.post('http://localhost:3000/message/add-message', data, { headers: { "Authorization": token, "groupId": selectedGroup } })
                .then(res => {
                    const message = res.data.response.content;
                    // creating a li and adding to to messageList
                    const li = document.createElement('li');
                    li.classList.add('current-user');
                    li.innerHTML = `You-${message}`;
                    messageList.appendChild(li);
                })
                .catch(err => {
                    throw new Error(err);
                })
        }

    }
    catch (err) {
        console.log(err);
    }


}