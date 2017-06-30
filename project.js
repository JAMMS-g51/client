$(appReady);

let API_URL = 'https://jello-api.herokuapp.com/api/v1/'

function getUrl() {
	API_URL = 'https://jello-api.herokuapp.com/api/v1/';
	if(window.location.origin == 'http://127.0.0.1:8080') {
		API_URL = 'http://localhost:3000/api/v1/';
	}
}
function appReady() {
	initModals()
	getUrl();

//   	let userProjectId = getUserProjectId();
//   	getProject(userProjectId);
  	let projectId = getProjectId();
  	getProject(projectId);
    logout();
}



function getProject(id) {
  return $.get(`${API_URL}user_project/${id}`)
    .then(userProjects => {
      return $.get({
          url: `${API_URL}user/${userProjects[0].users_id}/project/${userProjects[0].project_id}`,
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
	}).then(projects => {

    createNameInHeader(projects.name);
	initAddGroupingButton(projects.id);
      displayGroups(projects.groupings);

    initGroupingEventHandlers();
	findGroupsOnPage();
	initRemoveColumnButton();

  }).catch(error => {
    //console.log(error);
    // window.location = '404.html';
  });
}).catch(error => {
  // window.location = '404.html';
});
}

function getProjectId() {
  let currentIndex = window.location.href;
  let charArray = currentIndex.split('');
  let index = charArray.indexOf('=') + 1;
  let id = currentIndex.substring(index);
  return id
}


function initGroupingEventHandlers(newGroup) {
	initAddStoryHandler(newGroup);
	initCloseFieldHandler(newGroup);
	initStorySubmitHandler(newGroup);
}
function createNameInHeader(name) {
	$('.project-name').text(name);
}

function displayGroups(groupings) {
  groupings.forEach(grouping => {
	renderGroup(grouping);
    grouping.stories.forEach(story => {
      renderStory(story, grouping.id);
  	});
  });
}
function renderGroup(grouping) {
	let group = {
      grouping_id: grouping.id,
      grouping_name: grouping.name
    }
	const source = $('#grouping-template').html();
    const template = Handlebars.compile(source);
    const html = template(group);
	let newGroup = $(html);
    $('.grouping-page').append(newGroup);
	initGroupingEventHandlers(newGroup);
  var el = document.getElementById(grouping.id);
  //var sortable = Sortable.create(el);
   var sortable = new Sortable(el, {
   group: 'story',
      animation: 150,
      ghostClass: "sortable-ghost"
    })

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
  $(`#${grouping_id}`).append(html);
  $(`#story_${story.id}`).click(() => {
	  createStoryModal(story);
  })
}


function createStoryModal(oldStory) {
	let id = getProjectId();
	let updatedStory = oldStory;
	$.get(`${API_URL}user_project/${id}`)
      .then(userProjects => {
        $.get({
            url: `${API_URL}user/${userProjects[0].users_id}/project/${userProjects[0].project_id}`,
            headers: {
              Authorization: `Bearer ${localStorage.token}`
            }
  	}).then(response => {
		console.log(response);
		response.groupings.forEach(grouping => {
			grouping.stories.forEach(story => {
				if(story.id === oldStory.id) {
					updatedStory = story;
				}
			})
		})
		let story = updatedStory;
		console.log(story);
		$('.story-modal').empty();
		let context = {
			story_name: story.name,
			story_id: story.id
		}
		const source = $("#story-expanded-template").html();
		const template = Handlebars.compile(source);
		const html = template(context);
		$('.story-modal').append(html);
		$('.story-modal').css('display', 'flex');
		appendLists(story);
		appendLinks(story);
		appendComments(story);
		initLinkAddButton();
		initStoryDeleteButton(story);
		initClearComment();
		initSubmitComment();
		initAddLinkButton();
		initListCreateButton();
		initListNameCancel();
		initCreateListTitleButton();
		initEditListButton();
		initListItemSubmit();
		initCancelListItemSubmit();
		initCloseLinkField();
	    initStoryModal();
	});
});
}

function initStoryDeleteButton(story) {
	$('#delete-story-button').click((event) => {

		$('.story-modal').hide();
		$(`*[story-id="${story.id}"]`).remove();
		$.ajax({
    		url: `${API_URL}story/${story.id}`,
    		type: 'DELETE',
    		success: function(result) {
    		}
		});
	});
}

function initStoryModal() {
	$('#modal-close').click(() => {
		$('.story-modal').hide();
	})
}

// function appendLists(story) {
// 	if(!story.lists) { return; }
// 	story.lists.forEach(list => {
// 		let icon = `<i class="fa fa-pencil list-edit" aria-hidden="true"></i>`
// 		let newList = $(`<ul class="story-list-title" list-id="${list.id}">${icon}${list.name}</ul>`)
// 		list.items.forEach(item => {
// 			newList.append($(`<li class="story-list" list-item-id="${item.id}">${item.content}</li>`))
// 		});
// 		$('.list-content').append(newList);
// 	});
// }

function appendLists(story) {
	if(!story.lists) { return; }
	story.lists.forEach(list => {
		renderList(list);
	});
}

function renderList(list) {
	console.log(list);
	let context = {
		list_id: list.id,
		list_name: list.name
	}
	let source = $("#list-template").html();
	let template = Handlebars.compile(source);
	let html = template(context);
	let newList = $(html);
	$('.list-content').append(newList);
	// console.log($(newList[0]));
	if(list.items) {
		renderListItems(newList, list);
	}

}

function renderListItems(newList, list) {
	// $(newList[0]).remove();
	list.items.forEach(item => {
		// console.log(item.content);
		$(newList).find('ul').append($(`<li>${item.content}</li>`));
			// $(newList).find('ul')[0].append("$(`<li>hello</li>`)");
	})
}



function appendLinks(story) {
	if(!story.links) { return; }
	story.links.forEach(link => {
		appendLinkToStoryModal(link);
	});
}

function appendLinkToStoryModal(link) {
	let title;
	if(link.title.length > 0) {
		title = link.title;
	} else {
		title = link.href;
	}
	let newLinkContainer = $(`<div class="link-container" link-id="${link.id}">`);
	let newLinkDeleteIcon = $(`<i class="fa fa-trash-o link-delete" aria-hidden="true">`);
	let newLink = $(`</i><a href=${link.href} target="_blank" link-id="${link.id}">${title}</a></br>`);
	newLinkDeleteIcon.click(() => {
		removeLinkFromStory(link)
		newLinkContainer.remove();
	})
	newLinkContainer.append(newLinkDeleteIcon);
	newLinkContainer.append(newLink);
	$('.link-content').append(newLinkContainer);
}


function removeLinkFromStory(link) {
	$.ajax({
		url: `${API_URL}link/${link.id}`,
		type: 'DELETE',
		success: function(result) {
		}
	});
}

function appendComments(story) {
	if(!story.comments) { return; }
	story.comments.forEach(comment => {
		// let content = $(`<p class="comment" comment-id="${comment.id}">${comment.content}</p>`);
		// $('.comment-content').append(content);
		renderComment(comment);
	})
}


function initAddStoryHandler(newGroup) {
	$(newGroup).find('.grouping-add-story').click((event) => {
		event.preventDefault();
		$(event.target).parent().parent().find('.add-story-form').show();
	});
}

function initCloseFieldHandler(newGroup) {
	$(newGroup).find('.story-cancel').click((event) => {
		$(event.target).parent().parent().find('.add-story-form').hide();
		$(event.target).parent().find('input').val('');
	})
}

function initStorySubmitHandler(newGroup) {
	$(newGroup).find('.story-submit').click((event) => {
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
			renderStory(response[0], response[0].grouping_id);
		});
	});
}

function initModals() {
  $('.modal').modal();
}


function initAddGroupingButton(id) {
	$("#create-grouping-button").click(() => {
		let newGroup = {
			name: $('.add-column-name').val(),
			project_id: id
		}
		$('.add-column-name').val('')
		$.post(`${API_URL}grouping`, newGroup).then(response => {
			renderGroup(response[0]);
			addGroupingToSelectMenu(response[0]);
			$('#modal-add-column').modal('close');
		})
	})
}


function findGroupsOnPage() {
	let elementList = document.querySelectorAll('.grouping-template');
	elementList.forEach(grouping => {
		let groupData = {
			id: $(grouping).attr('grouping-id'),
			name: $(grouping).find('.grouping-card-title').text()
		}
		addGroupingToSelectMenu(groupData);
	})

}


function addGroupingToSelectMenu(groupData) {
	let newSelect = $(`<option value="${groupData.id}">${groupData.name}</option>`);
	$("#remove-column-select").append(newSelect);
}

function initRemoveColumnButton() {
	$('#remove-column-button').click(() => {
		let grouping_id = $('#remove-column-select').val();
		$.ajax({
    		url: `${API_URL}grouping/${grouping_id}`,
    		type: 'DELETE',
    		success: function(result) {
    		}
		});
		$('#remove-column-select option:selected').remove();
		$(`*[grouping-id="${grouping_id}"]`).remove();
		$('#modal-remove-column').modal('close');
	})
}

function initLinkAddButton() {
	$('.story-link-menu').click(() => {
		$('.add-link-form-container').show();
		$('.fa-trash-o').show();
	});
}

function initAddLinkButton() {
	$('.link-submit').click(() => {
		let newLink = {
			title: $('#link-name').val(),
			href: $('#link-url').val(),
			story_id: $('.story-details').attr('story-id')
		};
		$.post(`${API_URL}link`, newLink).then(response => {
			$('#link-name').val('');
			$('#link-url').val('');
			appendLinkToStoryModal(response[0]);
			$('.add-link-form-container').hide();
			$('.link-delete').hide();
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
function initCloseLinkField() {
	$('.link-cancel').click(() => {
		$('.add-link-form-container').hide();
		$('.link-delete').hide();

	});
}



function renderComment(comment, userName) {
	$.get(`${API_URL}users/${comment.users_id}`).then(user => {
		if(!comment.created_at) {
			comment.created_at = new Date();
		}
		let context = {
			user_name: user[0].name,
			comment_content: comment.content,
			comment_id: comment.id,
			date: comment.created_at
		}
		let source = $("#comment-template").html();
		let template = Handlebars.compile(source);
		let html = template(context);
		$('.comment-content').append(html);
	});
}



function initSubmitComment() {
	$('.submit-comment').click(() => {
		let comment = {
			users_id: localStorage.user_id,
			story_id: $('.story-details').attr('story-id'),
			content: $('#comment-text-field').val()
		}
		$('#comment-text-field').val('');
		$.get(`${API_URL}users/${comment.users_id}`).then(user => {
			userName = user[0].name;
			$.post(`${API_URL}comment`, comment).then(response => {
				renderComment(response[0], userName);
			});
		})

	});
}

function initClearComment() {
	$('.clear-comment').click(() => {
		$('#comment-text-field').val('');
	})
}


function initListCreateButton() {
	$('.story-list-menu').click(() => {
		$('.add-list-form-container').show();
	})
}

function initListNameCancel() {
	$('.list-title-cancel').click(() => {
		$('.add-list-form-container').hide();
		$('#list-name').val('');
	});
}


function initCreateListTitleButton() {
	$('.list-title-submit').click(() => {
		let newListTitle = {
			story_id: $('.story-details').attr('story-id'),
			name: $('#list-name').val()
		}
		$.post(`${API_URL}list`, newListTitle).then(listTitle => {
			// console.log(listTitle);
			newListTitle.list_id = listTitle[0].id;
			newListTitle.list_name = newListTitle.name;
			renderList(newListTitle)
		})
		$('#list-name').val('')
	})
}


function initEditListButton() {
	$('.list-edit').click((event) => {
		// $('.add-list-item-form').show();
		$(event.target).parent().parent().find('form').show();
	});
}


function initCancelListItemSubmit() {
	$('.list-item-cancel').click((event) => {
		$(event.target).siblings('input').val('');
		$(event.target).parent().hide();
	});
}

function initListItemSubmit() {
	$('.list-item-submit').click((event) => {
		let newListItem = {
			content: $(event.target).siblings('input').val(),
			list_id: $(event.target).siblings('input').attr('list-id')
		}
		$.post(`${API_URL}list_item`, newListItem).then(response => {
			newListItem.id = response[0].id;
			console.log(newListItem);
			$(event.target).parent().siblings('ul').append($(`<li>${newListItem.content}</li>`))
		})
		$(event.target).parent().hide();
		$(event.target).siblings('input').val('')
	});
}

// function initEditListButton() {
// 	$('.list-edit').click((event) => {
// 		if($(event.target).find('.add-list-item-container')) { console.log(true); }
// 		let newFormContainer = $(`<div class="add-list-item-container">`)
// 		let newForm = $(`<form></form>`)
// 		let newField = $(`<input type="text" size="35" placeholder="Add item"/>`);
// 		let submitNewListItemButton = $(`<i class="fa fa-check"aria-hidden="true"></i>`)
// 		let cancelNewListItemButton = $(`<i class="fa fa-ban"aria-hidden="true"></i>`)
// 		newForm.append(newField);
// 		newFormContainer.append(newForm).append(submitNewListItemButton).append(cancelNewListItemButton);
// 		$(event.target).parent().append(newForm);
// 	})
// }
