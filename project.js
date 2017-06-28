$(appReady);


function appReady() {
  getProject(1);
}

function getProject(id) {
  console.log('working');
  $.get('http://localhost:3000/api/v1/project/1').then(project => {
    console.log(project);
    displayGroups(project.groupings);
  })
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
	  console.log(`#story_${story.id}`);
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
	story.lists.forEach(list => {
		let newList = $(`<ul class="story-list-title">${list.name}</ul>`)
		list.items.forEach(item => {
			newList.append($(`<li class="story-list">${item.content}</li>`))
		});
		$('.list-content').append(newList);
	});
}

function appendLinks(story) {
	story.links.forEach(link => {
		console.log(link);
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
	story.comments.forEach(comment => {
		let content = $(`<p class="comment">${comment.content}</p>`);
		$('.comment-content').append(content);
	})
}
