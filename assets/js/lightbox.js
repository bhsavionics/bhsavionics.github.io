        // Lightbox functionality
        const photos = document.querySelectorAll('.photo img');
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.classList.add('lightbox');
        document.body.appendChild(lightbox);
    
        const lightboxImg = document.createElement('img');
        lightbox.appendChild(lightboxImg);
    
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('close');
        closeBtn.innerHTML = '&times;';
        lightbox.appendChild(closeBtn);
    
        photos.forEach(photo => {
          photo.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = photo.src;
          });
        });
    
        closeBtn.addEventListener('click', () => {
          lightbox.style.display = 'none';
        });
    
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) {
            lightbox.style.display = 'none';
          }
        });
      
