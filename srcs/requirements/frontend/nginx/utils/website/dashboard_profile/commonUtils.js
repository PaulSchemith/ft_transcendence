function getAvatar(userName) {
    verifyToken();
    // console.log(userName);

    return fetch(domainPath + '/api/account/avatar/' + userName + '/', {
        method: 'GET',

    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'image');
      }
      return response.blob();
    })
    .then(blob => {
      // Crée une URL objet à partir du blob
      const imageURL = URL.createObjectURL(blob);
      return imageURL;
    })
    .catch(error => {
      console.error('Erreur lors du chargement de l\'image :', error);
    });
}