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













// Modal window for group members

const membersModal = document.querySelector('.modal-members');
const overlayMembers = document.querySelector('.overlay-members');
const btnCloseModalMembers = document.querySelector('.close-modal-members');
const btnsOpenModalMembers = document.querySelector('.show-modal-members');

const openModalMembers = function () {
    membersModal.classList.remove('hidden');
    overlayMembers.classList.remove('hidden');
};

const closeModalMembers = function () {
    membersModal.classList.add('hidden');
    overlayMembers.classList.add('hidden');
};


btnsOpenModalMembers.addEventListener('click', openModalMembers);
btnsOpenModalMembers.addEventListener('click', async () => {
    try {
        if (!selectedGroup) {
            alert("Please select a group first");
        } else {
            axios.get("http://localhost:3000/group/isAdmin", { headers: { "Authorization": token, "groupId": selectedGroup } })
                .then(response => {
                    const isAdmin = response.data.isAdmin;

                    // Logging users
                    const groupUsers = document.getElementById("group-users");
                    groupUsers.innerHTML = "";
                    axios.get("http://localhost:3000/group/getUsers", { headers: { "Authorization": token, "groupId": selectedGroup } })
                        .then(response => {
                            const users = response.data.users;
                            for (let i = 0; i < users.length; i++) {
                                const user = users[i].userId;
                                axios.get(`http://localhost:3000/users/getSingleUser/${user}`)
                                    .then(response => {
                                        const userInfo = response.data.userInfo;

                                        // Creating list item
                                        const li = document.createElement("li");
                                        li.classList.add("group-members-list-item");
                                        li.appendChild(document.createTextNode(`${userInfo.name}`));

                                        // Remove user button
                                        const removeButton = document.createElement("button");
                                        removeButton.classList.add("remove-user-button");
                                        removeButton.appendChild(document.createTextNode("Remove User"))

                                        removeButton.onclick = async () => {
                                            if (!isAdmin) {
                                                alert("Only admin can make changes");
                                            } else {
                                                const userId = user;
                                                const groupId = selectedGroup;
                                                const data = {
                                                    userId: userId,
                                                    groupId: groupId
                                                }
                                                axios.post("http://localhost:3000/group/removeMember", data)
                                                    .then(response => {
                                                        groupUsers.removeChild(li);
                                                    })
                                                    .catch(err => {
                                                        throw new Error(err);
                                                    })

                                            }
                                        }

                                        li.appendChild(removeButton);

                                        // Make admin button
                                        const adminButton = document.createElement("button");
                                        adminButton.classList.add("make-admin-button");
                                        adminButton.appendChild(document.createTextNode("Make admin"))

                                        adminButton.onclick = async () => {
                                            if (!isAdmin) {
                                                alert("Only admin can make changes");
                                            } else {
                                                const userId = user;
                                                const groupId = selectedGroup;
                                                const data = {
                                                    userId: userId,
                                                    groupId: groupId
                                                }
                                                axios.post("http://localhost:3000/group/makeAdmin", data)
                                                    .then(response => {
                                                        alert(`${userInfo.name} is now an admin`);
                                                    })
                                                    .catch(err => {
                                                        throw new Error(err);
                                                    })
                                            }
                                        }

                                        li.appendChild(adminButton);

                                        // Adding li to the unordered list
                                        groupUsers.appendChild(li);

                                    })
                                    .catch(err => {
                                        throw new Error(err);
                                    })
                            }
                        })
                        .catch(err => {
                            throw new Error(err);
                        })
                })
                .catch(err => {
                    throw new Error(err);
                })

        }
    } catch (err) {
        throw new Error(err);
    }
});

btnCloseModalMembers.addEventListener('click', closeModalMembers);
overlayMembers.addEventListener('click', closeModalMembers);

document.addEventListener('keydown', function (e) {

    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModalMembers();
    }
});







// Application functionality
const socket = io.connect('http://localhost:3000')


// Handler for when a user joins a group
// socket.emit("joinGroup",selectedGroup);

// Handler for sending message in a group
// socket.emit('sendMessageToGroup', { groupName, message: messageToSend });

// k at any point is the starting point for the messages
let k = 0;
// Receiving messages in the group
socket.on('message', (messageInfo) => {

    // console.log(messageInfo.userName, messageInfo.message);

    const li = document.createElement('li');
    if (k % 2 === 0) {
        li.classList.add("even-message");
    }

    li.innerHTML = `${messageInfo.userName}-${messageInfo.message}`;

    const br = document.createElement('br');
    li.appendChild(br);
    messageList.appendChild(li);
    k++;
});

// function for adding participant
async function addParticipant(e) {
    try {
        e.preventDefault();
        const userListField = document.getElementById('user-list');
        const users = userListField.selectedOptions;
        if (!selectedGroup) {
            alert("Select a group first");
        } else {
            axios.get("http://localhost:3000/group/isAdmin", { headers: { "Authorization": token, "groupId": selectedGroup } })
                .then(response => {
                    const isAdmin = response.data.isAdmin;
                    if (!isAdmin) {
                        alert("Only admins can modify groups");
                    }
                    else {
                        for (let i = 0; i < users.length; i++) {
                            console.log(users[i].value);
                            const data = {
                                user: users[i].value,
                                group: selectedGroup
                            }
                            axios.post("http://localhost:3000/group/addMember", data)
                                .then()
                                .catch(err => {
                                    console.log(err);
                                })
                        }
                        window.location.reload();
                    }
                })
                .catch(err => {
                    throw new Error(err);
                })
        }


        //


    } catch (err) {
        console.log(err);
    }
}



// Function for adding group
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

// localStorage.removeItem("oldMessages");
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


// initial function
async function init() {
    try {
        messageList.innerHTML = '';
        // Getting user info
        await axios.get('http://localhost:3000/users/getUser', { headers: { "Authorization": token } }).
            then(response => {
                userName = response.data.name;
                welcomeMessage.innerHTML = `Welcome ${userName}!!!`;
            })
            .catch(err => {
                throw new Error(err);
            })
        // Getting groups for the user
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
                        // We are emitting an event for user joining the group
                        socket.emit("joinGroup", selectedGroup);
                        welcomeMessage.innerHTML = groups[i].name;

                        // backend-call to get the messages for a particular group
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
                                    if (element.groupId !== selectedGroup) {
                                        return;
                                    }
                                    if (element.type === "text") {
                                        createTextElement(element);

                                    } else {
                                        const mediaElement = createMediaElement(element.content, element.type);

                                        const li = document.createElement('li');
                                        li.classList.add('current-user');
                                        if (k % 2 === 0) {
                                            li.classList.add("even-message");
                                        }
                                        k++;
                                        // We are adding a tag for user who sent the image before adding the image to li

                                        if (element.userName === userName) {
                                            li.appendChild(document.createTextNode('You-'));
                                        } else {
                                            li.appendChild(document.createTextNode(`${element.userName.split(" ")[0]}-`));
                                        }
                                        li.appendChild(document.createElement('br'));
                                        li.appendChild(mediaElement);
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

function createTextElement(element) {

    if (element.groupId === selectedGroup) {
        const li = document.createElement('li');
        if (k % 2 === 0) {
            li.classList.add("even-message");
        }
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
        k++;
    }
}

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
                    socket.emit('sendMessageToGroup', { groupName: selectedGroup, userName, message: message });

                    // creating a li and adding to to messageList
                    const li = document.createElement('li');

                    if (k % 2 === 0) {
                        li.classList.add("even-message");
                    }
                    k++;
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

// Handling multimedia chats


function createMediaElement(url, type) {
    let mediaElement;

    if (type.startsWith('image')) {
        mediaElement = document.createElement('img');
        mediaElement.src = url;
    } else if (type.startsWith('audio')) {
        mediaElement = document.createElement('audio');
        mediaElement.controls = true;
        mediaElement.src = url;
    } else if (type.startsWith('video')) {
        mediaElement = document.createElement('video');
        mediaElement.controls = true;
        mediaElement.src = url;
    } else {
        // Unsupported media type
        mediaElement = document.createElement('p');
        mediaElement.textContent = 'Unsupported file type';
    }

    return mediaElement;
}

function uploadFiles() {
    const uploadForm = document.getElementById('uploadForm');
    const formData = new FormData();

    // Get the file input elements
    const fileInput = document.getElementById('fileInput');

    // Append the files to the formData
    formData.append('media', fileInput.files[0]);


    // You can now send the formData to the server using fetch or XMLHttpRequest.
    // Replace 'your_upload_url' with the URL where you want to handle the file upload on the server-side.

    axios.post("http://localhost:3000/message/upload", formData, { headers: { "Authorization": token, "groupId": selectedGroup } })
        .then(response => {
            // Handle the server response here if needed
            const userName = response.data.userName;
            const content = response.data.content;
            const type = response.data.type;

            console.log(userName, content, type);
            const mediaElement = createMediaElement(content, type);

            const li = document.createElement('li');
            li.classList.add('current-user');

            li.appendChild(document.createTextNode('You-'));
            li.appendChild(document.createElement('br'));
            li.appendChild(mediaElement);
            messageList.appendChild(li);
            // document.getElementById('status').innerText = 'Files uploaded successfully!';
        })
        .catch(error => {
            // Handle any errors that occurred during the upload process
            // document.getElementById('status').innerText = 'Error uploading files.';
            console.error('Error:', error);
        });
}


