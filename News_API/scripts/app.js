let newsContainer = document.getElementById("container"); 

let allNews = news.articles.map((article) => createItem(article));
let allNewsHTML = allNews.join(' ');
newsContainer.innerHTML = allNewsHTML;

function createItem(article) {
    let newsItem = `<div class="newsItem">`;
    if (article.urlToImage != null) {
        newsItem += `  <img class="newsImage" src=${article.urlToImage} />`;
    }
    if (article.title != null) {
        newsItem += `  <div class="newsTitle" >${article.title}</div>`;
    }
    if (article.author != null) {
        newsItem += `  <div class="newsAuthor" >${article.author}</div>`;
    }
    if (article.description != null) {
        newsItem += `  <div class="newsDesc" >${article.description}</div>`;
    }
    if (article.url != null) {
        newsItem += `  <div class="newsURL" >${article.url}</div>`;
    }
    if (article.publishedAt != null) {
        pubDate = new Date(article.publishedAt);
        newsItem += `  <div class="newsDate" >${pubDate.toString()}</div>`;
    }
    newsItem += `</div>`;
    return newsItem;
}
