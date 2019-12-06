// Hacker News stories
//
// use the Hacker News API - endpoints:
//   https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty (to get all stories)
//   https://hacker-news.firebaseio.com/v0/item/<story ID>.json?print=pretty  (to get a story)
//
// display for each story: title, url, by, time (date format)
//

class Story {
    constructor(id, title, url, by, time) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.by = by;
        this.time = time;
    }
}

const storyIdUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
const storyUrlStart = 'https://hacker-news.firebaseio.com/v0/item/';
const storyUrlEnd = '.json?print=pretty';

const container = document.getElementById('container');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const statusDiv = document.getElementById('statusDiv');

let stories = [];
let storyIds = {};
let index = 0;
let pageSize = 10;

async function getStoryIds(complete) {
    let response = await fetch(storyIdUrl);
    storyIds = await response.json();
    complete();    
}

async function getStory(id, slot) {
    let response = await fetch(`${storyUrlStart}${id}${storyUrlEnd}`);
    let story = await response.json();
    stories[slot] = new Story(story.id, story.title, story.url, story.by, story.time);
    if (countStories() == pageSize) {
        updateUI();
    }
}

function countStories() {
    let count = 0;
    for (let i = 0; i < stories.length; i++) {
        if (typeof(stories[i].id) != 'undefined') {
            count += 1;
        }
    } 
    return count;
}

function fetch_stories() {
    stories = [];
    for (let i=0; i < pageSize; i++) {
        stories.push({});
    }
    for (let i=index; i < (index+pageSize); i++) {
        getStory(storyIds[i], i-index);
    }
}

function updateUI() {
    let storiesHTML = stories.map((story) => {
        statusDiv.innerHTML = `${index + 1} - ${index + pageSize}`
        return `<p><div class='title'>${story.title}</div>
                <a class='url' href='${story.url}'>${story.url}</a><br>
                <div class='by'>${story.by}</div>
                <div class='time'>${story.time}</div></p>`;
    });
    container.innerHTML = storiesHTML.join(' '); 
}

prevButton.addEventListener('click',() => {
    if (index > 9) {
        index += -10;
    }
    fetch_stories();
});

nextButton.addEventListener('click',() => {
    if (index < 490) {
        index += 10;
    }
    fetch_stories();
});

// kick off the app
getStoryIds(fetch_stories);
