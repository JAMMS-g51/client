const postURL = 'http://localhost:3000/api/v1/users';
const loginURL = 'http://localhost:3000/api/v1/auth/login';
$(appReady)

function appReady() {
  initializeSignUp();
  initializeLogin();
  initModals();
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
  $('.user-login').submit(function(event) {
    event.preventDefault();
    const loginInfo = getLoginInfo();
    $.post(loginURL, loginInfo).then(response => {
      console.log(response);
    })
  });
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
