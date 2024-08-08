let friendRequestNb;
let friendRequestId = [];

async function checkFriendRequest() {
  friendRequestNb = 0;

  try {
    const data = await fetchFriendRequest();

    if (data.length !== 0) {
      // console.log("Check Request Data = ", data);

      for (let i = 0; i < data.length; i++) {
        if (data[i].is_accepted === false) {
          const requested_name = await fetchUsername(data[i].friend2);

          if (requested_name === sessionUsername) {
            const requester_name = await fetchUsername(data[i].friend1);
            friendRequestNb++;
            // friendRequestId.push(data[i].id);
            manageFriendRequest(requester_name, data[i].id);
          }
        }
      }

      // Mettez à jour le texte du bouton après la boucle
      const requestBtn = document.getElementById("seeFriendRequest");
      requestBtn.textContent = 'Friend Request ' + friendRequestNb;

      // Affichez ou masquez le bouton en fonction du nombre de demandes d'amis
      if (friendRequestNb > 0) {
        requestBtn.classList.remove("hidden-element");
      } else {
        requestBtn.classList.add("hidden-element");
      }
    }
  } catch (error) {
    console.error("Error in checkFriendRequest:", error);
  }
}

async function fetchFriendRequest() {
  // console.log("Fetch friend request function");
  verifyToken();

  try {
    const response = await fetch(domainPath + "/api/friend_management/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });

    if (!response.ok) {
      console.error("Error : Check Request " + response.status);
      const errorData = await response.json();
      // console.log("Error : Check Request", errorData);
      throw new Error("Error : Check Request");
    }
    // console.log("Check Request Ok !");
    return await response.json();
  } catch (error) {
    console.error("Error : ", error);
  }
}

async function checkPendingRequest(username) {
    try {
        const data = await fetchFriendRequest();

        if (data.length !== 0) {
          // console.log("checkPendingRequest() Data = ", data);

          for (let i = 0; i < data.length; i++) {
            if (data[i].is_accepted === false) {
              const requester_name = await fetchUsername(data[i].friend1);
              // console.log('requester name = ' + requester_name);
              // console.log('session name = ' + sessionUsername);

              if (requester_name === sessionUsername) {
                const requested_name = await fetchUsername(data[i].friend2);

                if (requested_name === username) {
                    // console.log('requester name = ' + requester_name);
                    // console.log('username = ' + username);
                    return true;
                }
              }
            }
          }
          return false;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error in checkPendingRequest:", error);
    }
}

function manageFriendRequest(requesterName, requestId) {
  // console.log("Friend request from: " + requesterName);
  // console.log("Request id : " + requestId);

  if (friendRequestId.includes(requestId)) {
    return;
  }
  const requestBtn = document.getElementById("seeFriendRequest");
  requestBtn.classList.remove("hidden-element");
  requestBtn.textContent = "Friend Request " + friendRequestNb;
  friendRequestId.push(requestId);
  friendRequest_createContent(requesterName, requestId);
}

function friendRequest_createContent(requesterName, requestId) {
  const mainDiv = document.createElement("div");
  mainDiv.id = "requestDiv" + requestId;
  mainDiv.classList = "col-auto";

  const mainCol = document.createElement("div");
  mainCol.classList = "col-auto";

  const row1 = document.createElement("div");
  row1.classList =
    "row p-3 m-3 mx-auto rounded-3 d-felx justify-content-center rounded-3 shadow";
  row1.style.maxWidth = "300px";

  const col1 = document.createElement("div");
  col1.classList = "col-auto my-auto";
  const img = document.createElement("img");
  img.classList = "rounded-3 shadow";
  img.style.maxHeight = "150px";
  getAvatar(requesterName)
    .then((imageURL) => {
      img.src = imageURL;
    })
    .catch((error) => {
      console.error(
        "Error : download avatar imgage 'createFriendsContent()' !",
        error
      );
    });
  img.alt = "avatar-img";
  col1.appendChild(img);
  row1.appendChild(col1);

  const col2 = document.createElement("div");
  col2.classList = "col-auto my-auto";
  const row2 = document.createElement("div");
  row2.classList = "row";
  const username = document.createElement("h5");
  username.classList = "text-info text-center text-uppercase fs-3 mb-2 mt-1";
  username.textContent = requesterName;
  row2.appendChild(username);
  col2.appendChild(row2);

  const row3 = document.createElement("div");
  row3.classList = "row";

  const deny = document.createElement("h5");
  deny.id = "denyBtn" + requestId;
  deny.classList = "py-1 rounded shadow text-warning text-center fs-5";
  deny.role = "button";
  deny.textContent = "Deny";
  row3.appendChild(deny);

  const accept = document.createElement("h5");
  accept.id = "acceptBtn" + requestId;
  accept.classList = "py-1 rounded shadow mt-2 text-center fs-5";
  accept.style.color = "rgb(0, 218, 4)";
  accept.role = "button";
  accept.textContent = "Accept";
  row3.appendChild(accept);

  col2.appendChild(row3);
  row1.appendChild(col2);
  mainCol.appendChild(row1);
  mainDiv.appendChild(mainCol);

  document.getElementById("requestDiv").appendChild(mainDiv);

  document.getElementById("denyBtn" + requestId).addEventListener("click", function () {
    // console.log('deny pushed !');
      responseFriendRequest(requesterName, requestId, false)
      // getDashboardInfos();

    });
  document.getElementById("acceptBtn" + requestId).addEventListener("click", function () {
    // console.log('accept pushed !');
      responseFriendRequest(requesterName, requestId, true)
      // getDashboardInfos();

    });
}

function seeFriendRequest() {
  const friendTextInfo = document.getElementById("friendsTextInfo");
  if (!friendTextInfo.classList.contains("hidden-element")) {
    friendTextInfo.classList.add("hidden-element");
  } else {
    const friendListDiv = document.getElementById('friendShipList-dashboard');
    if (friendListDiv) {
      friendListDiv.classList.add("hidden-element");
    }

  }
  document.getElementById("seeFriendRequest").classList.add("icon-disabled");
  document
    .getElementById("seeFriendRequestCloseBtn")
    .classList.remove("hidden-element");
  const requestDiv = document.getElementById("requestDiv");
  if (requestDiv) {
    requestDiv.classList.remove("hidden-element");
  }
}

function closeFriendRequest() {

  const childCount_friendListDiv = document.getElementById('friendShipList-dashboard').childElementCount;
  if (childCount_friendListDiv > 0) {
    document.getElementById('friendShipList-dashboard').classList.remove('hidden-element');
    document.getElementById('friendsTextInfo').classList.add('hidden-element');
  } else {
    document.getElementById('friendsTextInfo').classList.remove('hidden-element');
  }
  document.getElementById("seeFriendRequest").classList.remove("icon-disabled");
  document.getElementById("seeFriendRequestCloseBtn").classList.add("hidden-element");
  document.getElementById("requestDiv").classList.add("hidden-element");

  getDashboardInfos();
}

async function responseFriendRequest(requesterName, requestId, response) {
  // console.log("responseFriendRequest()" + requestId);
  await fetchResponseRequest(requesterName, response);
  document.getElementById("requestDiv" + requestId).remove();

  friendRequestNb--;
  const requestBtn = document.getElementById("seeFriendRequest");
  requestBtn.textContent = "Friend Request " + friendRequestNb;

  const childCount_requestDiv = document.getElementById('requestDiv').childElementCount;
  if (childCount_requestDiv === 0) {
    document.getElementById("seeFriendRequest").classList.add("hidden-element");
    document.getElementById("seeFriendRequestCloseBtn").classList.add("hidden-element");
    const childCount_friendListDiv = document.getElementById('friendShipList-dashboard').childElementCount;
    if (childCount_friendListDiv > 0) {
      document.getElementById('friendShipList-dashboard').classList.remove('hidden-element');
      document.getElementById('friendsTextInfo').classList.add('hidden-element');
    } else {
      document.getElementById('friendsTextInfo').classList.remove('hidden-element');
    }
    getDashboardInfos();
  }
}

async function fetchResponseRequest(requesterName, boolResponse) {
  verifyToken();
  try {
    const response = await fetch(domainPath + "/api/friend_management/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        friend: requesterName,
        is_accepted: boolResponse,
      }),
    });

    if (!response.ok) {
      console.error("Error : Response Request " + response.status);
      const errorData = await response.json();
      // console.log("Error : Accept Request", errorData);
      throw new Error("Error : Response Request");
    }
    // console.log("Response Request Ok !");
    return await response.json();
  } catch (error) {
    console.error("Error : ", error);
  }
}

async function fetchRemoveFriendship(friendToRemove) {
  verifyToken();
  try {
    const response = await fetch(domainPath + "/api/friend_management/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        friend: friendToRemove,
      }),
    });

    if (!response.ok) {
      console.error("Error : Remove Friend " + response.status);
      const errorData = await response.json();
      // console.log("Error : move Friend", errorData);
      throw new Error("Error : Remove Friend");
    }
    // console.log("Remove Friend Ok !");

    return await response.json();
  } catch (error) {
    console.error("Error : ", error);
  }
}

function askFriend(toAskAsFriend) {
  // console.log("to ask as friend = " + toAskAsFriend);
  verifyToken();

  return fetch(domainPath + "/api/friend_management/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
    body: JSON.stringify({
      friend: toAskAsFriend,
    }),
  })
  .then((response) => {
    if (response.ok) {
      // Demande d'ami réussie
      // console.log("asking " + toAskAsFriend + " as friend ok !", response);
      return response.json();
    } else {
      // Gestion des erreurs
      console.error("Error : asking " + toAskAsFriend + " as friend !");
      return response.json();
    }
  })
  .then((data) => {
    return data; // Renvoyez les données pour les manipuler dans le prochain .then
  })
  .catch((error) => {
    console.error("Error : ", error);
    throw error; // Propagez l'erreur pour la gestion ultérieure
  });
}

