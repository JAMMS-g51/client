
$(appReady);

let API_URL = 'https://jello-api.herokuapp.com/api/v1/'

function getUrl() {
	API_URL = 'https://jello-api.herokuapp.com/api/v1/';
		console.log(window.location.href);
	if(window.location.href == 'http://127.0.0.1:8080/') {
		API_URL = 'http://localhost:3000/api/v1/';
	}
}
function appReady() {
	getUrl();
	//$('.loader').hide();
	checkLoggedIn();
	logout();
	createProject();
}


function checkLoggedIn() {
	if(localStorage.user_id) {
		getUserProjects(localStorage.user_id);
		$('.login-word').hide();
		$('.logout-word').show();
	} else {
		$('.login-word').show();
		$('.logout-word').hide();
		getLoginPage();
	}
}

function getUserProjects(userId) {
	return $.get({
			url: `${API_URL}users/${userId}/project`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`
			}
		}).then(projects => {
		displayProjects(projects);
		displayCreateProject();
	}).catch(() => {
		window.location = '400.html';
	}
);
}

function displayProjects(projects) {
	projects.forEach(project => {
		console.log(project);
		const source = $('#project-template').html();
		const template = Handlebars.compile(source);
		const html = template(project);
		$('.project-page').append(html);
	});
}

function displayCreateProject() {
		const source = $('#project-create-template').html();
		const template = Handlebars.compile(source);
		const html = template();
		$('.project-page').append(html);

		$('.project-page').on('click','.create-project-clicker', () => {
			$('#add-project-modal').modal('open');

		})
}

function createProject(){
	$('.project-page').on('click', '.create-project-submission', (event) => {
		event.preventDefault();
		let projectInfo = getProjectInfo();
		$.post(`${API_URL}project`, projectInfo)
		.then(results => {
			let userProjectInfo = {
				users_id: localStorage.user_id,
				project_id: results[0].id
			}
		$.post(`${API_URL}user_project`, userProjectInfo).then(results => {
			console.log(results);

			//redirect to that project page with the project id
			window.location = `project.html?id=${results[0].id}`
		});
		})
		.catch(error => {
			Materialize.toast(error.responseJSON.message, 3000);
		});
	})
}

function initializeSignUp() {
  $('.create-account').submit(function(event) {
    event.preventDefault();
    const userInfo = getSignUpInfo();
    $.post(`${API_URL}users`, userInfo)
      .then((result) => {
				let loginInfo = {
					email: userInfo.email,
					password: userInfo.password
				};
				$.post(`${API_URL}auth/login`, loginInfo).then(response => {
					localStorage.token = response.token;
					localStorage.user_id = response.id;
					if(localStorage.token){
						loading();
					}
				});
      })
      .catch(function(error) {
        Materialize.toast(error.responseJSON.message, 3000);
      });
  })
}


function initializeLogin() {
  $('.login-account').submit(function(event) {
    event.preventDefault();
    const loginInfo = getLoginInfo();
    $.post(`${API_URL}auth/login`, loginInfo).then(response => {
      localStorage.token = response.token;
      localStorage.user_id = response.id;
			if(localStorage.token){
				loading();
			}
    }).catch(error => {
			// console.log('something');
			// console.log(error);
			Materialize.toast(error.responseJSON.message, 3000);
		});
  });
}


function getLoginPage() {
	initializeSignUp();
	initializeLogin();
	initModals();
	$('.login-page').css('display', 'block');
}

function getProjectInfo() {
	let projectName = $('.project-name').val();
	let projectImgUrl = $('.add-project-image').val();
	if(projectImgUrl == ''){
		projectImgUrl = 'https://source.unsplash.com/random';
	}
	return {
		name: projectName,
		image_url: projectImgUrl
	};
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

function loading() {
	$('.loader').css('display', 'flex');
	setTimeout(() => {
		window.location = 'index.html';
	}, 300);

}

function logout(){
	$('.logout-word').on('click', () => {
		localStorage.clear();
	});
}

// function verification(){
//   if(localStorage.token && localStorage.user_id){
//     return $.get({
//       url: `${postURL}/${localStorage.user_id}/project`,
//       headers: {
//         Authorization: `Bearer ${localStorage.token}`
//      }
//    }).then(response => {
//      console.log(response);
//    });
//   }
// }
