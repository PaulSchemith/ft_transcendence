function getProfileInfos() {

  // console.log('function getProfileInfos()');

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
      console.error('Erreur lors de la récupération du profil :', response.status);
      throw new Error('Échec de la récupération du profil');
    }
  })
  .then(data => {

    two_fa = data.two_fa;
    if (two_fa === true) {
      init2faProfile(data);
    } else {
      document.getElementById('mobileDiv').classList.add('hidden-element');
    }
    initProfile(data);
  })
  .catch(error => {
    console.error('Erreur lors de la récupération du profil :', error);
  });
}

function init2faProfile(data) {
  document.getElementById('authTitle').classList.add('text-success');
  document.getElementById('mobileDiv').classList.remove('hidden-element');
  if(data.mobile_number !== "" && data.mobile_number_verified === false) {
    document.getElementById('mobileNotVerified').classList.remove('hidden-element');
    document.getElementById('mobileVerified').classList.add('hidden-element');
  } else {
    document.getElementById('mobileNotVerified').classList.add('hidden-element')
    document.getElementById('mobileVerified').classList.remove('hidden-element');
    document.getElementById('mobileVerified').textContent = data.mobile_number;
  }
}


function initProfile(data) {
  sessionUsername = data.user.username;
  waitForWebSocketConnection(data.user.username);

  document.getElementById('firstNameProfile').textContent = data.user.first_name;
  document.getElementById('lastNameProfile').textContent = data.user.last_name;
  document.getElementById('userNameProfile').textContent = data.user.username;
  document.getElementById('emailProfile').textContent = data.user.email;
  document.getElementById('bioProfile').textContent = data.bio;
  document.getElementById('username-profileDropdown').textContent = data.user.username;
  document.getElementById('bio-profileDropdown').textContent = data.bio;

  getAvatar(data.user.username)
  .then(imageURL => {
    document.getElementById('avatar-img').src = imageURL;
    document.getElementById('avatar-img_profilDropdown').src = imageURL;
  })
  .catch(error => {
    console.error("Error : download avatar imgage 'initProfile()' !", error);
  });

}
