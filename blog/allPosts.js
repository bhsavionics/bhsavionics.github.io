function renderAllPosts(list) {
    // Sort by start date (newest first)
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Grab container
    const postContainer = document.getElementById('post-container');

    list.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'group bg-dark-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden hover:border-purple-400 transition-all duration-300 hover:shadow-purple-500/20';
            
        postCard.innerHTML = `
            <a href="${post.url}" class="block">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-400/30">
                            ${post.category}
                        </span>
                        <span class="text-xs text-gray-400">${post.readTime}</span>
                    </div>
                        
                    <h3 class="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                        ${post.title}
                    </h3>
                        
                    <p class="text-gray-300 text-sm leading-relaxed mb-4">
                        ${post.preview}
                    </p>
                        
                    <div class="flex items-center justify-between">
                        <div class="flex items-center text-sm text-gray-400">
                            <i class="fas fa-calendar mr-2"></i>
                            <span>${new Date(post.start).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                        <div class="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                            <span class="text-sm font-semibold">Read More</span>
                            <i class="fas fa-arrow-right ml-2 text-xs"></i>
                        </div>
                    </div>
                </div>
            </a>
        `;
        postContainer.appendChild(postCard);
    });
}

renderAllPosts(events);
