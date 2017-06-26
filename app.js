const postURL = 'http://localhost:3000/api/v1/users';
const loginURL = 'http://localhost:3000/api/v1/auth/login';
$(appReady);

let projects = [
	{
		name: 'Project1',
		image: 'https://www.petfinder.com/wp-content/uploads/2012/11/91615172-find-a-lump-on-cats-skin-632x475.jpg'
	},
	{
		name: 'Project2',
		image: 'https://www.petfinder.com/wp-content/uploads/2012/11/91615172-find-a-lump-on-cats-skin-632x475.jpg'
	},
	{
		name: 'Project3',
		image: 'https://www.petfinder.com/wp-content/uploads/2012/11/91615172-find-a-lump-on-cats-skin-632x475.jpg'
	},
	{
		name: 'Project4',
		image: 'https://www.petfinder.com/wp-content/uploads/2012/11/91615172-find-a-lump-on-cats-skin-632x475.jpg'
	}
];
function appReady() {
	checkLoggedIn();
}


function checkLoggedIn() {
	if(localStorage.user_id) {
		getUserProjects(localStorage.user_id);
	} else {
		getLoginPage();
	}
}

function getUserProjects(userId) {
	$.get(`${postURL}/${userId}/project`).then(projects => {
		displayProjects(projects);
	});
}

function displayProjects(projects) {
	projects.forEach(project => {
		const source = $('#project-template').html();
		const template = Handlebars.compile(source);
		const html = template(project);
		$('.project-page').append(html);
	});
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
function getLoginPage() {
	initializeSignUp();
	initializeLogin();
	initModals();
	$('.login-page').css('display', 'block');
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
