   function formatDate(dateString) {
        const [year, month, day] = dateString.split("-").map(Number);
        // month is 0-based in JS Date, so subtract 1
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    function renderRecentLaunches(list) {
        // Sort by start date (newest first)
        list.sort(function (a, b) {
            return new Date(b.start) - new Date(a.start);
        });

        // Get top 3
        const recent = list.slice(0, 3);

        // Grab container
        const container = document.getElementById("recent-launches");

        // Sidebar wrapper
        const wrapper = document.createElement("div");
        wrapper.className = "bg-dark-800 rounded-xl shadow-2xl p-6 border border-gray-700";

        // Heading
        const header = document.createElement("h3");
        header.className = "text-xl font-semibold text-white mb-6";
        header.textContent = "Recent Launches";
        wrapper.appendChild(header);

        // Launch list
        const listDiv = document.createElement("div");
        listDiv.className = "space-y-6";

        recent.forEach(function (launch, index) {
            const article = document.createElement("article");
            article.className = "border-b border-gray-700 pb-4" + (index === recent.length - 1 ? "" : "");

            // Title
            const h4 = document.createElement("h4");
            h4.className = "font-semibold text-white mb-2";

            const link = document.createElement("a");
            link.href = launch.url;
            link.className = "hover:text-purple-400";
            link.textContent = launch.title;

            h4.appendChild(link);
            article.appendChild(h4);

            // Date + location row
            const meta = document.createElement("div");
            meta.className = "flex flex-col text-sm text-gray-500";

            // Date
            const dateRow = document.createElement("div");
            dateRow.className = "flex items-center";
            const iconDate = document.createElement("i");
            iconDate.className = "fas fa-rocket mr-2";
            const date = document.createElement("span");
            date.textContent = formatDate(launch.start);
            dateRow.appendChild(iconDate);
            dateRow.appendChild(date);

            // Location
            const locationRow = document.createElement("div");
            locationRow.className = "flex items-center mt-1";
            const iconLoc = document.createElement("i");
            iconLoc.className = "fas fa-map-marker-alt mr-2";
            const location = document.createElement("span");
            location.textContent = launch.description;
            locationRow.appendChild(iconLoc);
            locationRow.appendChild(location);

            meta.appendChild(dateRow);
            meta.appendChild(locationRow);

            article.appendChild(meta);
            listDiv.appendChild(article);
        });

        wrapper.appendChild(listDiv);

        // "View All" button
        const viewAll = document.createElement("div");
        viewAll.className = "mt-8";
        viewAll.innerHTML =
        '<a href="/blog/blog.html" class="w-full bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors text-center block">View All Launches</a>';

        wrapper.appendChild(viewAll);

        container.appendChild(wrapper);
    }

    // Run on page load
    renderRecentLaunches(events);