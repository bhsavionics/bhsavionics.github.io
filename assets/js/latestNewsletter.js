// Blog post data
const posts = [
    { title: "Mountain View STEM Night", date: "2024-03-13", link: "Posts/StemNight.html", preview: "A look into our STEM Night event..." },
    { title: "2024 Interest Meeting", date: "2024-09-12", link: "Posts/InterestMeeting.html", preview: "Kickstarting the year with an interest meeting..." },
    { title: "Model Rocket Building Meeting", date: "2024-09-26", link: "Posts/ModelBuilding.html", preview: "Our journey in building rockets..." },
    { title: "TARC Rocket Design Presentations", date: "2024-12-6", link: "Posts/DesignPresentations.html", preview: "The first steps of our journey..." },
    { title: "TARC Rocket Model Building", date: "2024-12-18", link: "Posts/RocketBuilding.html", preview: "Our first model..." }
    // Add additional posts here
];

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Get the latest post
const latestPost = posts.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
});

// Function to dynamically load content
function loadPost(postUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', postUrl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Insert the content into the post container
            const parser = new DOMParser();
            const doc = parser.parseFromString(xhr.responseText, 'text/html');

            // Place the modified content into the target element
            document.getElementById('postContent').innerHTML = doc.body.innerHTML;

            // Optionally hide footer buttons
            const buttons = document.querySelectorAll('footer p a.button');
            buttons.forEach(button => {
                button.style.display = 'none';
            });
        }
    };

    xhr.send();
}

// Get the 3 most recent posts
const recentPosts = posts.slice(0, 3);

// Format date to MM/DD/YY
function formatDate(isoDate) {
    const date = new Date(isoDate);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
}

// Render to the page
const container = document.getElementById("recentPosts");
recentPosts.forEach(post => {
    const postHTML = `
        <article class="box post-summary">
            <h3><a href="${post.link}">${post.title}</a></h3>
            <ul class="meta">
                <li class="icon fa-clock">${formatDate(post.date)}</li>
            </ul>
        </article>
    `;
    container.innerHTML += postHTML;
});

// Load the latest post on page load
window.onload = function () {
    if (latestPost) {
        loadPost(latestPost.link);
    } else {
        document.getElementById("postContent").innerHTML = "<p>No posts available.</p>";
    }
};
