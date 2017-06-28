const postURL = 'http://localhost:3000/api/v1/users';
const loginURL = 'http://localhost:3000/api/v1/auth/login';
$(appReady);

function appReady() {
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
			url: `${postURL}/${userId}/project`,
			headers: {
				Authorization: `Bearer ${localStorage.token}`
			}
		}).then(projects => {
		displayProjects(projects);
		displayCreateProject();
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
		$.post('http://localhost:3000/api/v1/project', projectInfo)
		.then(results => {
			let userProjectInfo = {
				users_id: localStorage.user_id,
				project_id: results[0].id
			}
		$.post('http://localhost:3000/api/v1/user_project', userProjectInfo).then(results => {
			//console.log(results);
			//redirect to that project page with the project id
			//window.location = 'project.html'
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
    $.post(postURL, userInfo)
      .then(function(result) {
				let loginInfo = {
					email: userInfo.email,
					password: userInfo.password
				};
				$.post(loginURL, loginInfo).then(response => {
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
    $.post(loginURL, loginInfo).then(response => {
      localStorage.token = response.token;
      localStorage.user_id = response.id;
			if(localStorage.token){
				loading();
			}
    }).catch(error => {
			Materialize.toast(error.responseJSON.message, 3000);
		})
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
	}, 1000);

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
