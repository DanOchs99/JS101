// get the top level node
let parent = document.getElementById("container");

// create header element
let header = document.createElement("div");
header.id = "header";
header.className = "hoc-header";
let logo = document.createElement("div");
logo.id = "logo";
logo.innerHTML = "HighOnCoding";
let menuItem1 = document.createElement("div");
menuItem1.id = "menuItem1";
menuItem1.innerHTML = "Home";
let menuItem2 = document.createElement("div");
menuItem2.id = "menuItem2";
menuItem2.innerHTML = "Categories";
header.appendChild(logo);
header.appendChild(menuItem1);
header.appendChild(menuItem2);

// create hero element
let hero = document.createElement("div");
hero.id = "hero";
hero.className = "hoc-hero";
let headline = document.createElement("div");
headline.id = "heroHeadline";
headline.innerHTML = "Curse of the Current Reviews";
let text = document.createElement("div");
text.id = "heroText";
text.innerHTML = "When you want to buy any application from the Apple iTunes store you have more choices than you can handle. Most of the users scroll past the application description completely avoiding it like ads displayed on the right column of your webpage. Their choice is dependent on three important factors price, screenshot, and reviews."
hero.appendChild(headline);
hero.appendChild(text);

// create first article
let article1 = document.createElement("div");
article1.id = "article1";
article1.className = "hoc-article";
headline = document.createElement("div");
headline.id = "article1Headline";
headline.className = "headline";
headline.innerHTML = "Hello WatchKit";
text = document.createElement("div");
text.id = "article1Text";
text.className = "text";
text.innerHTML = "Last month Apple released the anticipated WatchKit Framework for developers in the form of iOS 8.2 beta SDK release. The WatchKit framework enables the developers to create Apple Watch applications. In this article we are going to focus on the basics of getting started with the WatchKit framework and developing apps for the Apple Watch.";
let footer = document.createElement("div");
footer.id = "article1Footer";
footer.className = "footer";
footer.innerHTML = "12 comments   124 likes";
article1.appendChild(headline);
article1.appendChild(text);
article1.appendChild(footer);

// create second article
let article2 = document.createElement("div");
article2.id = "article2";
article2.className = "hoc-article";
headline = document.createElement("div");
headline.id = "article1Headline";
headline.className = "headline";
headline.innerHTML = "Introduction to Swift";
text = document.createElement("div");
text.id = "article1Text";
text.className = "text";
text.innerHTML = "Swift is a modern programming language developed by Apple to create the next generation of iOS and OSX applications. Swift is a fairly new language and still in development but it clearly reflects the intentions and future direction. This article will revolve around the basic concepts in the Swift language and how you can get started.";
footer = document.createElement("div");
footer.id = "article1Footer";
footer.className = "footer";
footer.innerHTML = "15 comments   45 likes";
article2.appendChild(headline);
article2.appendChild(text);
article2.appendChild(footer);

// add elements to page
parent.appendChild(header);
parent.appendChild(hero);
parent.appendChild(article1);
parent.appendChild(article2);
