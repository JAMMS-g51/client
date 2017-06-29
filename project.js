$(appReady);

let API_URL = 'https://jello-api.herokuapp.com/api/v1/'

function getUrl() {
	API_URL = 'https://jello-api.herokuapp.com/api/v1/';
	console.log(window.location.origin);
	if(window.location.origin == 'http://127.0.0.1:8080') {
		API_URL = 'http://localhost:3000/api/v1/';
	}
}
function appReady() {
	getUrl();
  	let projectId = getProjectId();
  	console.log(projectId);
  	getProject(projectId);
    logout();
}



function getProject(id) {
  return $.get(`${API_URL}user_project/${id}`)
    .then(userProjects => {
      //console.log(userProjects);
      return $.get({
          url: `${API_URL}user/${userProjects[0].users_id}/project/${userProjects[0].project_id}`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
	}).then(projects => {

		console.log(projects);
    createNameInHeader(projects.name);
      displayGroups(projects.groupings);
      initGroupingEventHandlers()
  }).catch(error => {
    //console.log(error);
    window.location = '404.html';
  });
}).catch(error => {
  window.location = '404.html';
});
}

function getProjectId() {
  let currentIndex = window.location.href;
  let charArray = currentIndex.split('');
  let index = charArray.indexOf('=') + 1;
  let id = currentIndex.substring(index);
  return id
}


function initGroupingEventHandlers() {
	initAddStoryHandler();
	initCloseFieldHandler();
	initStorySubmitHandler();
}
function createNameInHeader(name) {
	$('.project-name').text(name);
}

function displayGroups(groupings) {
  groupings.forEach(grouping => {
    let group = {
      grouping_id: grouping.id,
      grouping_name: grouping.name
    }
    const source = $('#grouping-template').html();
    const template = Handlebars.compile(source);
    const html = template(group);
    $('.grouping-page').append(html);
    grouping.stories.forEach(story => {
      renderStory(story, grouping.id);
    })
  });
}


function renderStory(story, grouping_id) {
  let context = {
    story_name: story.name,
	story_id: `story_${story.id}`,
	id: story.id
  }
  const source = $("#story-template").html();
  const template = Handlebars.compile(source);
  const html = template(context);
  $(`#${grouping_id}`).append(html)
  $(`#story_${story.id}`).click(() => {
	  createStoryModal(story);
  })
}


function createStoryModal(story) {

	$('.story-modal').empty();
	let context = {
		story_name: story.name
	}
	const source = $("#story-expanded-template").html();
	const template = Handlebars.compile(source);
	const html = template(context);
	$('.story-modal').append(html);
	$('.story-modal').css('display', 'flex')
	appendLists(story);
	appendLinks(story);
	appendComments(story);

    initStoryModal();
}


function initStoryModal() {
	$('#modal-close').click(() => {
		$('.story-modal').hide();
	})
}

function appendLists(story) {
	if(!story.lists) { return; }
	story.lists.forEach(list => {
		let icon = `<i class="fa fa-pencil list-edit" aria-hidden="true"></i>`
		let newList = $(`<ul class="story-list-title" data-id="${list.id}">${icon}${list.name}</ul>`)
		list.items.forEach(item => {
			newList.append($(`<li class="story-list" data-id="${item.id}">${item.content}</li>`))
		});
		$('.list-content').append(newList);
	});
}

function appendLinks(story) {
	if(!story.links) { return; }
	story.links.forEach(link => {
		let title;
		if(link.title.length > 0) {
			title = link.title;
		} else {
			title = link.href;
		}
		let newLink = $(`<a href=${link.href} data-id="${link.id}">${title}</a></br>`);
		$('.link-content').append(newLink)
	})
}

function appendComments(story) {
	if(!story.comments) { return; }
	story.comments.forEach(comment => {
		let content = $(`<p class="comment" data-id="${comment.id}">${comment.content}</p>`);
		$('.comment-content').append(content);
	})
}


function initAddStoryHandler() {
	$('.grouping-add-story').click((event) => {
		event.preventDefault();
		$(event.target).parent().parent().find('.add-story-form').show();
	});
}

function initCloseFieldHandler() {
	$('.story-cancel').click((event) => {
		$(event.target).parent().parent().find('.add-story-form').hide();
		$(event.target).parent().find('input').val('');
	})
}

function initStorySubmitHandler() {
	$('.story-submit').click((event) => {
		event.preventDefault();
		let grouping_id = $(event.target).parent().parent().attr('id');
		let $storyName = $(event.target).parent().find('input')
		let story = {
			name: $storyName.val(),
			grouping_id: grouping_id
		}
		$storyName.val('')
		$(event.target).parent().parent().find('.add-story-form').hide();
		$.post(`${API_URL}story`, story).then(response => {
			console.log('response');
			console.log(response);
			renderStory(response, response.grouping_id);
		});
	});
}

function logout(){
	$('.logout-word').on('click', (event) => {
    event.preventDefault();
		localStorage.clear();
    window.location = 'index.html';
	});
}
