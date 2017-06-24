const postURL = 'http://localhost:3000/api/v1/users';
const loginURL = 'http://localhost:3000/api/v1/auth/login';
$(appReady)

function appReady() {
  getUserInput();
  initializeLogin();
  initTestButton();
}
function getUserInput() {
  $('.create-account').submit(function(event) {
    event.preventDefault();
    const userInfo = getUserValues();
    $.post(postURL, userInfo)
      .then(function(result) {
      console.log(result);
    })
    .catch(function(result){
      console.log(result);
    });
  })
}

function initializeLogin() {
	$('.user-login').submit(function(event) {
		console.log('button working');
	  event.preventDefault();
	  const loginInfo = getLoginInfo();
	  $.post(loginURL, loginInfo).then(response => {
		  console.log(response);
	  })
  });
}



function getUserValues() {
  let userName = $('.user-name').val();
  let userEmail = $('.user-email').val();
  let userPassword = $('.user-password').val();
  const userInfo = {
    "name": userName,
    "email": userEmail,
    "password": userPassword
  }
  return userInfo;
}


function getLoginInfo() {
  let loginEmail = $('.login-email').val();
  let loginPassword = $('.login-password').val()
  const loginInfo = {
    email: loginEmail,
    password: loginPassword
  }
  return loginInfo;
}


function testGet() {
	$.get(postURL).then(res => {
		console.log(res);
	});
}

function initTestButton() {
	$('.testbutton').click(() => {
		testGet();
	});
}
