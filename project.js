$(appReady);


function appReady() {
  getProject(1);
}

function getProject(id) {
  $.get('http://localhost:3000/api/v1/project/1').then(project => {
    console.log(project);
	createNameInHeader(project.name);
    displayGroups(project.groupings);
	initGroupingEventHandlers();

  })
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
	story_id: `story_${story.id}`
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
		let newList = $(`<ul class="story-list-title">${list.name}</ul>`)
		list.items.forEach(item => {
			newList.append($(`<li class="story-list">${item.content}</li>`))
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
		let newLink = $(`<a href=${link.href}>${title}</a></br>`);
		$('.link-content').append(newLink)
	})
}

function appendComments(story) {
	if(!story.comments) { return; }
	story.comments.forEach(comment => {
		let content = $(`<p class="comment">${comment.content}</p>`);
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
			id: 100
		}
		$storyName.val('')
		$(event.target).parent().parent().find('.add-story-form').hide();
		renderStory(story, grouping_id);
	});
}
