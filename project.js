$(appReady);


function appReady() {
  getProject(1);
}

function getProject(id) {
  console.log('working');
  $.get('https://jello-api.herokuapp.com/api/v1/project/1').then(project => {
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
    story_name: story.name
  }
  const source = $("#story-template").html();
  const template = Handlebars.compile(source);
  const html = template(context);
  $(`#${grouping_id}`).append(html);
}
