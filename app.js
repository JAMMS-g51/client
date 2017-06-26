const postURL = 'http://localhost:3000/api/v1/users';
const loginURL = 'http://localhost:3000/api/v1/auth/login';
$(appReady)

function appReady() {
  initializeSignUp();
  initializeLogin();
  initModals();
  getProjects();
}


function initializeSignUp() {
  $('.create-account').submit(function(event) {
    event.preventDefault();
    const userInfo = getSignUpInfo();
    $.post(postURL, userInfo)
      .then(function(result) {
        console.log(result);
      })
      .catch(function(result) {
        console.log(result);
      });
  })
}


function initializeLogin() {
  $('.login-account').submit(function(event) {
    event.preventDefault();
    const loginInfo = getLoginInfo();
    console.log(loginInfo);
    $.post(loginURL, loginInfo).then(response => {
      console.log(response);
      localStorage.token = response.token;
      localStorage.user_id = response.id;
      setIdRedirect(localStorage.user_id);
    })
  });
}

function setIdRedirect(id){
  localStorage.user_id = id;
  window.location = `/index.html?id=${localStorage.user_id}`;
}


function getSignUpInfo() {
  let userName = $('.user-name').val();
  let userEmail = $('.user-email').val();
  let userPassword = $('.user-password').val();
  return {
    name: userName,
    email: userEmail,
    password: userPassword
  }
}


function getLoginInfo() {
  let loginEmail = $('.login-email').val();
  let loginPassword = $('.login-password').val()
  return {
    email: loginEmail,
    password: loginPassword
  }
}


function initModals() {
  $('.modal').modal();
}

function getProjects(id){
  if(localStorage.token && localStorage.user_id){
    return $.get({
      url: `${postURL}/${localStorage.user_id}/project`,
      headers: {
        Authorization: `Bearer ${localStorage.token}`
     }
   }).then(response => {
     console.log(response);
   });
  }
}
