function getDashboardInfos() {
  // console.log('function getDashboardInfos()');

  verifyToken();
  fetch(domainPath + '/api/account/profile/', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    }
  })
  .then(response => {
    if (response.status === 200) {

      return response.json();
    } else if (response.status === 401) {
      console.error('Error : expired access token', response.status);
    } else {
      console.error('Erreur lors de la récupération du dashboard :', response.status);
      throw new Error('Échec de la récupération du dashboard');
    }
  })
  .then(data => {

    initDashboard(data);
  })
  .catch(error => {
    console.error('Erreur lors de la récupération du dashboard :', error);
  });
}

function initDashboard(data) {

  const historyList = document.getElementById('historyList');
  if (!historyList.classList.contains('hidden-element')) {
    historyList.classList.add('hidden-element');
  }
  cleanElement('historyList');
  cleanElement('friendShipList-dashboard');             // A Remettre sur ON !!!!!!!
  checkFriendRequest();
  get_users_data();

  document.getElementById('firstNameDash').textContent = data.user.first_name;
  document.getElementById('lastNameDash').textContent = data.user.last_name;
  document.getElementById('userNameDash').textContent = data.user.username;
  document.getElementById('emailDash').textContent = data.user.email;
  if (data.mobile_number !== "") {
    document.getElementById('mobileDash').textContent = data.mobile_number;
  } else {
    document.getElementById('mobileDash').textContent = "Mobile not provided";
  }
  document.getElementById('bioDash').textContent = data.bio;
  document.getElementById('joinedDash').textContent = 'joined on : ' + handleDates(data.user.date_joined);
  document.getElementById('lastLoginDash').textContent = 'last login : ' + handleDates(data.user.last_login);
  document.getElementById('friendsNumberDash').textContent = data.friend.length;
  document.getElementById('victoriesNumberDash').textContent = data.win;
  document.getElementById('defeatsNumberDash').textContent = data.lose;
  document.getElementById('playedNumberDash').textContent = data.games_id.length;
  if (data.games_id.length === 0) {
    document.getElementById('messageGameHistory').classList.remove('hidden-element');
  } else {
    document.getElementById('messageGameHistory').classList.add('hidden-element');
    displaySpinner_dash('gameHistory-cardBody');
    getGamesInfos(data.games_id);
  }

  setPieChart(data.win, data.lose);
  getAvatar(data.user.username)
  .then(imageURL => {
    document.getElementById('avatar-img_dash').src = imageURL;
    manageFriends(data);
  })
  .catch(error => {
    console.error("Error : download avatar imgage 'initDashboard()' !", error);
  });

}

function manageFriends(data) {
  // console.log('manageFriends()');
  displaySpinner_dash('friendShipBody-dashboard');
  createFriendArray(data)
  .then(friendsArray => {
    if (friendsArray.length === 0) {
      document.getElementById('spinner' + 'friendShipBody-dashboard').remove();
      document.getElementById('friendsTextInfo').classList.remove('hidden-element');
      // console.log('No friendship to display in dashboard');
    } else {
      if (!document.getElementById('friendsTextInfo').classList.contains('hidden-element')) {
        document.getElementById('friendsTextInfo').classList.add('hidden-element');
      }
      friends_createContent(friendsArray);
    }
  })
  .catch(error => {
    console.error("Error in manageFriends():", error);
  });
}

function friends_createContent(friendsArray) {

  sortFriendsArray(friendsArray);

  for (let i = 0; i < friendsArray.length; i++) {

    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row py-3 px-3 mb-3 shadow-sm rounded-3 bg-info bg-opacity-10 fade-in';
    rowDiv.id = 'friendList' + i;

    //*********************************************************************************

    const imgDiv = document.createElement('div');
    imgDiv.classList = 'col-auto mx-auto mx-sm-0 my-auto';

    const img = document.createElement('img');
    img.id = 'friendship-img';
    img.classList = 'rounded-3';
    img.style.maxWidth = '80px';
    getAvatar(friendsArray[i][0])
    .then(imageURL => {
      img.src = imageURL;
    })
    .catch(error => {
      console.error("Error : download avatar imgage 'createFriendsContent()' !", error);
    });
    img.alt = 'friendAvatar';
    imgDiv.appendChild(img);
    rowDiv.appendChild(imgDiv);

    //*********************************************************************************

    const infosDiv = document.createElement('div');
    infosDiv.classList = 'col-auto mx-auto mx-sm-0';

    const userName = document.createElement('h5');
    userName.classList = 'text-info text-center text-uppercase text-sm-start fs-3 mb-2 mt-1';
    userName.textContent = friendsArray[i][0];
    infosDiv.appendChild(userName);

    const isOnline = document.createElement('p');
    if (friendsArray[i][3] === true) {
      isOnline.classList = 'lead text-success fw-bold text-center text-sm-start fst-italic fs-6 mb-0';
      isOnline.textContent = 'Online';
    } else {
      isOnline.classList = 'lead text-danger text-center text-sm-start fst-italic fs-6 mb-0';
      isOnline.textContent = 'Offline';
    }
    infosDiv.appendChild(isOnline);

    const isPlaying = document.createElement('p');
    if (friendsArray[i][4] === true) {
      isPlaying.classList = 'lead text-success fw-bold text-center text-sm-start fst-italic fs-6 mb-2';
      isPlaying.textContent = 'Playing';
    } else {
      isPlaying.classList = 'lead text-danger text-center text-sm-start fst-italic fs-6 mb-2';
      isPlaying.textContent = 'Not playing';
    }
    infosDiv.appendChild(isPlaying);
    rowDiv.appendChild(infosDiv);

    //*********************************************************************************

    const bioDiv = document.createElement('div');
    bioDiv.classList = 'col-sm-4 col-md-6 col-xxl-7 mt-2 m-sm-auto bg-white bg-opacity-75 rounded-3 shadow-sm border';
    bioDiv.style.overflowY = 'auto';
    bioDiv.style.height = '80px';
    bioDiv.style.maxWidth = '780px';

    const bio = document.createElement('p');
    bio.classList = 'pt-1 lead fs-6 text-secondary text-center';
    bio.style.wordBreak = 'break-all';

    const small = document.createElement('small');
    small.textContent = friendsArray[i][2];
    rowDiv.appendChild(bioDiv);

    bio.appendChild(small);
    bioDiv.appendChild(bio);
    const iconDiv = document.createElement('div');
    iconDiv.classList = 'col-auto my-sm-auto mx-auto mx-md-0 ml-md-auto mt-2';
    const icon = document.createElement('i');
    icon.classList = 'btn border-0 fa-solid fa-ellipsis-vertical text-secondary';
    icon.id = 'friendExpand' + i;
    iconDiv.appendChild(icon);
    rowDiv.appendChild(iconDiv);

    //************************************************************************
    const friendObject = getUserObject(friendsArray[i][0]);
    const expandInfos = friendExpandInfos_createContent(friendObject, i);
    rowDiv.appendChild(expandInfos);
    //************************************************************************

    // mainDiv.appendChild(rowDiv);

    setTimeout(function() {

      document.getElementById('friendShipList-dashboard').appendChild(rowDiv);

      document.getElementById('friendExpand' + i).addEventListener('click', function() {
        const expandInfos = document.getElementById('expand' + i);
        if (expandInfos.classList.contains('hidden-element')) {
          expandInfos.classList.remove('hidden-element');
        } else {
          expandInfos.classList.add('hidden-element');
        }
      })
      document.getElementById('removeFriendBtn' + i).addEventListener('click', function() {
        fetchRemoveFriendship(friendsArray[i][0])
        .then((data) => {
          // console.log('then remove', data);
          document.getElementById('friendList' + i).remove();
          getDashboardInfos();
        })
      })
    }, 300);
  }
  document.getElementById('spinner' + 'friendShipBody-dashboard').remove();
}

function friendExpandInfos_createContent(userObject, index) {

  const cardTitles = ['Victories', 'Defeats', 'Played', 'Friends'];
  const cardValue = [userObject.win, userObject.lose, userObject.win + userObject.lose, userObject.friend.length];
  const cardIcons = ['fas fa-trophy text-success', 'fa-solid fa-face-sad-tear text-danger', 'fas fa-table-tennis text-info', 'fa-solid fa-people-group text-primary'];
  const cardTextColor = [' text-success', ' text-danger', ' text-info', ' text-primary'];
  const infosUser = [userObject.user.first_name, userObject.user.last_name, userObject.user.email];

  // console.log('userObject = ' + userObject.user.username);

  const mainDiv = document.createElement('div');
  mainDiv.classList = 'col-12 mt-3 hidden-element';
  mainDiv.id = 'expand' + index;

  const mainRow = document.createElement('div');
  mainRow.classList = 'row p-3 pt-4 d-flex justify-content-evenly bg-success bg-opacity-25 rounded-3 shadow-sm';

  for (let i = 0; i < 4; i++) {

    const mainCol = document.createElement('div');
    mainCol.classList = 'col-sm-5 px-2 rounded bg-white mb-2 shadow';
    const row = document.createElement('div');
    row.classList = 'row';

    const col1 = document.createElement('div');
    col1.classList = 'col';

    const title = document.createElement('small');
    title.classList = 'fw-bold' + cardTextColor[i];
    title.textContent = cardTitles[i];
    col1.appendChild(title);

    const value = document.createElement('small');
    value.classList = 'mb-0 fw-bold text-secondary ms-sm-2';
    value.textContent = cardValue[i];
    col1.appendChild(value);
    row.appendChild(col1);

    const col2 = document.createElement('div');
    col2.classList = 'col-auto';
    const icon = document.createElement('i');
    icon.classList = cardIcons[i];
    col2.appendChild(icon);
    row.appendChild(col2);

    mainCol.appendChild(row);
    mainRow.appendChild(mainCol);
  }

  const infosDiv = document.createElement('div');
  infosDiv.classList = 'col-lg-5 pt-4 mt-3 py-1';
  for (let i = 0; i < 4; i++) {
    const h5 = document.createElement('h5');
    if (i < 3) {
      h5.classList = 'text-secondary text-center fs-5';
      h5.textContent = infosUser[i];
    } else {
      h5.classList = 'text-secondary text-center fst-italic fs-6';
      if (userObject.mobile_number.length === 0) {
        h5.textContent = 'Mobile not provided';
      } else {
        h5.textContent = userObject.mobile_number;
      }
    }
    infosDiv.appendChild(h5);
  }
  mainRow.appendChild(infosDiv);

  const p1 = document.createElement('p');
  p1.classList = 'lead fst-italic text-secondary text-center fs-6 mb-0';
  const small1 = document.createElement('small');
  small1.textContent = 'joined on : ' + handleDates(userObject.user.date_joined);
  p1.appendChild(small1);
  infosDiv.appendChild(p1);

  const p2 = document.createElement('p');
  p2.classList = 'lead fst-italic text-secondary text-center fs-6';
  const small2 = document.createElement('small');
  small2.textContent = 'last login : ' + handleDates(userObject.user.last_login);
  p2.appendChild(small2);
  infosDiv.appendChild(p2);
  mainRow.appendChild(infosDiv);

  //******* Game History *******************************************************************/
  const historyDiv = document.createElement('div');
  // infosDiv.classList = 'col-12 mt-3';
  historyDiv.classList = 'col-lg-7 mt-3';
  historyDiv.id = 'gameHistoryExpandFriendMenu' + index;
  historyDiv.style.overflowY = 'auto';
  historyDiv.style.overflowX = 'hidden';
  historyDiv.style.maxHeight = '240px';


  for (let i = 0; i < userObject.games_id.length; i++) {

    const game = document.createElement('div');
    if (userObject.user.username === userObject.games_id[i].winner) {
      game.classList = 'row p-1 my-2 bg-success bg-opacity-25 rounded d-flex';
    } else {
      game.classList = 'row p-1 my-2 bg-danger bg-opacity-25 rounded d-flex';
    }
    const names = document.createElement('h5');
    names.classList = 'col-auto mx-auto text-secondary text-uppercase text-center fs-5 mb-0';
    names.textContent = userObject.games_id[i].player_one + "  -VS-  " + userObject.games_id[i].player_two;
    game.appendChild(names);
    const score = document.createElement('h5');
    score.classList = 'col-auto mx-auto text-secondary text-center fs-5 mb-0';
    score.textContent = userObject.games_id[i].final_score;
    game.appendChild(score);
    const date = document.createElement('p');
    date.classList = 'col-auto mx-auto small fst-italic text-center fw-light text-light mb-0';
    date.textContent = handleDates(userObject.games_id[i].updated_at);
    game.appendChild(date);
    historyDiv.appendChild(game);
  }
  mainRow.appendChild(historyDiv);

  const btnDiv = document.createElement('div');
  btnDiv.classList = 'mt-4 d-flex justify-content-center';
  const btn = document.createElement('button');
  btn.classList = 'btn btn-sm btn-outline-danger';
  btn.id = 'removeFriendBtn' + index;
  btn.textContent = 'Remove friendship';
  btnDiv.appendChild(btn);

  mainRow.appendChild(btnDiv);
  mainDiv.appendChild(mainRow);

  return mainDiv;
}

function searchUser_createContent(friendObjet, index) {

  // console.log('index = ' + index);
  // console.log('friendObjet = ', friendObjet);

  const mainDiv = document.createElement('div');
  mainDiv.classList = 'col-auto px-4 py-3 m-2 rounded-3 bg-success bg-opacity-10 shadow';
  mainDiv.id = 'user_searchUser' + index;

  const imgDiv = document.createElement('div');
  imgDiv.classList = 'col-auto d-flex justify-content-center mt-2';

  const img = document.createElement('img');
  img.classList = 'rounded-3 shadow';
  img.alt = 'avatarUser';
  img.style.maxWidth = '80px';
  getAvatar(friendObjet.user.username)
  .then(imageURL => {
    img.src = imageURL;
  })
  .catch(error => {
    console.error("Error : download avatar imgage 'searchFriend_createContent()' !", error);
  });
  imgDiv.appendChild(img);
  mainDiv.appendChild(imgDiv);


  const infosDiv = document.createElement('div');
  infosDiv.classList = 'col-auto';
  const username = document.createElement('h5');
  username.classList = 'text-info text-center text-uppercase text-center fs-3 mb-2 mt-2';
  username.textContent = friendObjet.user.username;
  infosDiv.appendChild(username);
  const firstname = document.createElement('h5');
  firstname.classList = 'text-secondary text-center fs-5';
  firstname.textContent = friendObjet.user.first_name;
  infosDiv.appendChild(firstname);
  const lastname = document.createElement('h5');
  lastname.classList = 'text-secondary text-center fs-5';
  lastname.textContent = friendObjet.user.last_name;
  infosDiv.appendChild(lastname);
  mainDiv.appendChild(infosDiv);

  const div = document.createElement('div');
  div.classList = 'col-auto d-flex justify-content-center align-items-center';


  checkPendingRequest(friendObjet.user.username)
  .then((result) => {
    // console.log('Valeur résolue de la promesse :', result);

    if (result === true) {

      const pendingRequest = document.createElement('h5');
      pendingRequest.classList = 'text-warning text-center';
      pendingRequest.textContent = 'Pending Request';
      div.appendChild(pendingRequest);
    } else if (isFriend(friendObjet.user.username) === true) {
      const icon = document.createElement('i');
      icon.classList = 'fa-solid fa-user-group fa-3x text-info';
      icon.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.3)';
      div.appendChild(icon);
    } else {
      const btn = document.createElement('button');
      btn.classList = 'btn btn-info text-white fw-bold mx-auto shadow';
      btn.textContent = 'Ask as friend';
      btn.id = 'askFriendBtn' + index;
      div.appendChild(btn);

    }
    mainDiv.appendChild(div);
    setTimeout(function() {
      document.getElementById('searchFriend-cardArea').appendChild(mainDiv);

      const askFriendBtn = document.getElementById('askFriendBtn' + index);
      if (askFriendBtn) {
        askFriendBtn.addEventListener('click', function() {
          askFriend(friendObjet.user.username)
          .then((data) => {
            if (data[0] === 'friendship already exist') {
              askFriendBtn.classList.remove('btn-info', 'text-white');
              askFriendBtn.classList.add('disabled', 'btn-warning', 'text-secondary');
              askFriendBtn.textContent = 'Check your friend requests';
            } else {
              document.getElementById('user_searchUser' + index).remove();
              searchUser_createContent(friendObjet, index);
            }
          })
        })
      }
    }, 300)
  });
}

// function searchUser_createContent(friendObjet, index) {

//   console.log('index = ' + index);
//   console.log('friendObjet = ', friendObjet);

//   const mainDiv = document.createElement('div');
//   mainDiv.classList = 'col-sm-10 mx-auto bg-primary bg-opacity-10 rounded shadow p-3 mb-3 fade-in';
//   mainDiv.id = 'user_searchUser' + index;

//   const rowDiv = document.createElement('div');
//   rowDiv.classList = 'row';

//   const imgDiv = document.createElement('div');
//   imgDiv.classList = 'col-auto mx-auto mx-sm-0 my-auto';

//   const img = document.createElement('img');
//   img.classList = 'rounded-3 shadow';
//   img.alt = 'avatarUser';
//   img.style.maxWidth = '80px';
//   getAvatar(friendObjet.user.username)
//   .then(imageURL => {
//     img.src = imageURL;
//   })
//   .catch(error => {
//     console.error("Error : download avatar imgage 'searchFriend_createContent()' !", error);
//   });
//   imgDiv.appendChild(img);
//   rowDiv.appendChild(imgDiv);

//   const infosDiv = document.createElement('div');
//   infosDiv.classList = 'col-sm-5 my-auto';
//   const username = document.createElement('h5');
//   username.classList = 'text-info text-center text-uppercase text-sm-start fs-3 mb-2 mt-md-0';
//   username.textContent = friendObjet.user.username;
//   infosDiv.appendChild(username);
//   const firstname = document.createElement('h5');
//   firstname.classList = 'text-secondary text-center text-sm-start fs-5';
//   firstname.textContent = friendObjet.user.first_name;
//   infosDiv.appendChild(firstname);
//   const lastname = document.createElement('h5');
//   lastname.classList = 'text-secondary text-center text-sm-start fs-5';
//   lastname.textContent = friendObjet.user.last_name;
//   infosDiv.appendChild(lastname);
//   rowDiv.appendChild(infosDiv);

//   const div = document.createElement('div');
//   div.classList = 'col-sm-3 d-flex justify-content-center align-items-center';


//   checkPendingRequest(friendObjet.user.username)
//   .then((result) => {
//     console.log('Valeur résolue de la promesse :', result);

//     if (result === true) {

//       const pendingRequest = document.createElement('h5');
//       pendingRequest.classList = 'text-warning text-center';
//       pendingRequest.textContent = 'Pending Request';
//       div.appendChild(pendingRequest);
//     } else if (isFriend(friendObjet.user.username) === true) {
//       const icon = document.createElement('i');
//       icon.classList = 'fa-solid fa-user-group fa-3x text-info';
//       icon.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.3)';
//       div.appendChild(icon);
//     } else {
//       const btn = document.createElement('button');
//       btn.classList = 'btn btn-info text-white mx-auto shadow';
//       btn.textContent = 'Ask as friend';
//       btn.id = 'askFriendBtn' + index;
//       div.appendChild(btn);

//     }
//     rowDiv.appendChild(div);

//     mainDiv.appendChild(rowDiv);
//     setTimeout(function() {
//       document.getElementById('searchFriend-cardArea').appendChild(mainDiv);

//       const askFriendBtn = document.getElementById('askFriendBtn' + index);
//       if (askFriendBtn) {
//         askFriendBtn.addEventListener('click', function() {
//           askFriend(friendObjet.user.username)
//           .then((data) => {
//             if (data[0] === 'friendship already exist') {
//               askFriendBtn.classList.remove('btn-info', 'text-white');
//               askFriendBtn.classList.add('disabled', 'btn-warning', 'text-secondary');
//               askFriendBtn.textContent = 'Check your friend requests';
//             } else {
//               console.log('then after askAsFriend', data);
//               document.getElementById('user_searchUser' + index).remove();
//               searchUser_createContent(friendObjet, index);
//             }
//           })
//         })
//       }
//     }, 300)
//   });
// }

function gameHistory_createContent(gameInfos, score1, score2) {

  // console.log('data infos = ', gameInfos);
  const timeValues = handleDateTime();
  const mainDiv = document.createElement('div');
  if (gameInfos.winner === sessionUsername) {
    mainDiv.classList = 'col-sm-auto px-4 py-3 m-2 rounded-3 bg-success bg-opacity-50 shadow fade-in';
  } else {
    mainDiv.classList = 'col-sm-auto px-4 py-3 m-2 rounded-3 bg-danger bg-opacity-50 shadow';
  }

  // Avatar images ------------------------------------------------------------------------------------------
  const imgDiv_row = document.createElement('div');
  imgDiv_row.classList = 'row d-felx justify-content-center';

  const imgDiv_left = document.createElement('div');
  imgDiv_left.classList = 'col-auto mt-2';
  const img_left = document.createElement('img');
  img_left.classList = 'rounded-3 shadow';
  img_left.style.maxHeight = '80px';
  img_left.alt = 'user-avatar';
  if (gameInfos.player_one !== null) {
    getAvatar(gameInfos.player_one)
    .then(imageURL => {
      img_left.src = imageURL;
    })
    .catch(error => {
      console.error("Error : download avatar imgage 'gameHistory_createContent(gameInfos)' !", error);
    });
  } else {
    img_left.src = 'img/img_ia.webp';
  }
  imgDiv_left.appendChild(img_left);
  imgDiv_row.appendChild(imgDiv_left);

  const imgDiv_right = document.createElement('div');
  imgDiv_right.classList = 'col-auto mt-2';
  const img_right = document.createElement('img');
  img_right.classList = 'rounded-3 shadow';
  img_right.style.maxHeight = '80px';
  img_right.alt = 'user-avatar';
  if (gameInfos.player_two !== null) {

    getAvatar(gameInfos.player_two)
    .then(imageURL => {
      img_right.src = imageURL;
    })
    .catch(error => {
      console.error("Error : download avatar imgage 'gameHistory_createContent(gameInfos)' !", error);
    });
  } else {
    img_right.src = 'img/img_ia.webp';
  }
  imgDiv_right.appendChild(img_right);
  imgDiv_row.appendChild(imgDiv_right);

  mainDiv.appendChild(imgDiv_row);

  // Usernames & score
  const namesScoreDiv = document.createElement('div');
  namesScoreDiv.classList = 'col-auto my-auto';

  const names = document.createElement('h5');
  names.classList = 'text-secondary text-uppercase text-center fs-4 mb-2 mt-1';

  let playerOne = gameInfos.player_one;
  let playerTwo = gameInfos.player_two;
  if (playerOne === null) {
    playerOne = 'AI';
  }
  if (playerTwo === null) {
    playerTwo = 'AI';
  }
  names.textContent = playerOne + ' / ' + playerTwo;
  namesScoreDiv.appendChild(names);

  const score = document.createElement('h5');
  score.classList = 'text-secondary text-center fs-4';
  score.textContent = score1 + ' / ' + score2;
  namesScoreDiv.appendChild(score);

  mainDiv.appendChild(namesScoreDiv);

  // line HR
  const hr = document.createElement('hr');
  hr.classList = 'mt-1';
  mainDiv.appendChild(hr);

  // infos
  const values = [
    ['fa-solid fa-table-tennis text-secondary', gameInfos.game_type],
    ['fa-solid fa-gauge-high text-secondary', gameInfos.difficulty],
    ['fa-solid fa-calendar-days text-secondary', timeValues.date],
    ['fa-regular fa-clock text-secondary', timeValues.time],
    ['fa-solid fa-stopwatch text-secondary', timeValues.duration]
  ];

  for (let i = 0; i < 5; i++) {

    const levelDiv_row = document.createElement('div');
    levelDiv_row.classList = 'row d-felx justify-content-between';

    const levelDiv_icon = document.createElement('div');
    levelDiv_icon.classList = 'col-auto';
    const icon = document.createElement('i');
    icon.classList = values[i][0];
    levelDiv_icon.appendChild(icon);
    levelDiv_row.appendChild(levelDiv_icon);

    const levelDiv_text = document.createElement('div');
    levelDiv_text.classList = 'col-auto';
    const text = document.createElement('p');
    text.classList = 'fw-bold text-secondary mb-0 bagelFatOne';
    if (i == 0 && gameInfos.game_type === 'pvp') {
        text.textContent = 'duel';
    } else {
      text.textContent = values[i][1];
    }
    levelDiv_text.appendChild(text);
    levelDiv_row.appendChild(levelDiv_text);

    mainDiv.appendChild(levelDiv_row);
  }
  document.getElementById('historyList').appendChild(mainDiv);

  function handleDateTime() {

    const dateTime = gameInfos.created_at.split('T');
    dateTime[1] = dateTime[1].slice(0, 8);

    const endTime = gameInfos.updated_at.split('T');
    endTime[1] = endTime[1].slice(0, 8);

    const startDate = new Date(gameInfos.created_at);
    const endDate = new Date(gameInfos.updated_at);
    // Soustraire la date de départ de la date de fin
    const differenceInMilliseconds = endDate - startDate;
    // Convertir la différence en heures, minutes et secondes
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const hours = Math.floor(differenceInSeconds / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    const seconds = Math.floor(differenceInSeconds % 60);

    const elapsedTime = hours + ':' + minutes + ':' + seconds;

    const time = {
      date: dateTime[0],
      time: dateTime[1],
      duration: elapsedTime
    };
    return time;
  }
}