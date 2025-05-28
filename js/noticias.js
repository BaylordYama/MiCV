// js/noticias.js

document.addEventListener('DOMContentLoaded', () => {
    const newsGridContainer = document.getElementById('news-grid-container');
    const loadingMessage = document.getElementById('loading-news-message');
    
    // Cambiado para cargar desde un JSON local
    const dataUrl = '../data/noticias_tecnologia.json'; 

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) {
                // Si hay un error al cargar el JSON local (ej. no encontrado), se mostrará aquí.
                throw new Error(`Error al cargar el archivo de noticias: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(newsItems => {
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            if (newsItems && newsItems.length > 0) {
                displayNews(newsItems);
                // Opcional: Actualizar el JSON-LD de la página si es necesario
                // updateNewsPageSchema(newsItems); 
            } else {
                newsGridContainer.innerHTML = '<p>No hay noticias disponibles en este momento.</p>';
            }
        })
        .catch(error => {
            console.error('Error al cargar las noticias:', error);
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            newsGridContainer.innerHTML = `<p>Error al cargar las noticias: ${error.message}. Por favor, inténtalo más tarde.</p>`;
        });

    function displayNews(newsItems) {
        newsItems.forEach(item => {
            const newsCard = document.createElement('article');
            newsCard.classList.add('news-card'); 
            
            newsCard.setAttribute('itemscope', '');
            newsCard.setAttribute('itemtype', 'https://schema.org/NewsArticle');

            let formattedDate = 'Fecha no disponible';
            try {
                // Asegurarse que la fecha tenga un formato que el constructor Date entienda bien, como YYYY-MM-DD
                // Si item.datePublished ya es YYYY-MM-DD, no necesita T00:00:00
                const dateObj = new Date(item.datePublished.includes('T') ? item.datePublished : item.datePublished + 'T00:00:00Z'); // Añadir Z para UTC si no hay timezone
                if (!isNaN(dateObj)) {
                    formattedDate = dateObj.toLocaleDateString('es-CO', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        timeZone: 'America/Bogota' // Opcional: asegurar zona horaria
                    });
                }
            } catch(e) {
                console.warn("Fecha inválida para la noticia:", item.headline, item.datePublished);
            }
            
            // ID único para el botón de la noticia para GTM
            const buttonId = `news-button-${item.id || item.headline.toLowerCase().replace(/[^\w-]+/g, '-')}`; 

            newsCard.innerHTML = `
                <link itemprop="mainEntityOfPage" href="${item.originalUrl}">
                <meta itemprop="author" content="${item.sourceName}"> 
                <meta itemprop="publisher" content="${item.sourceName}">

                <div class="news-image-container">
                    <img itemprop="image" src="${item.image}" alt="Imagen de la noticia: ${item.headline}" class="news-image" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/800x450/1a1a1a/cccccc?text=Imagen+No+Disponible';this.alt='Imagen no disponible';">
                </div>
                <div class="news-content">
                    <h3 itemprop="headline" class="news-title">${item.headline}</h3>
                    <p class="news-meta">
                        Fuente: <span itemprop="sourceOrganization" itemscope itemtype="https://schema.org/Organization"><span itemprop="name">${item.sourceName}</span></span> | 
                        Publicado: <time itemprop="datePublished" datetime="${item.datePublished}">${formattedDate}</time>
                    </p>
                    <p itemprop="description" class="news-summary">${item.summary}</p>
                    <a itemprop="url" href="${item.originalUrl}" target="_blank" rel="noopener noreferrer nofollow" class="news-readmore-button" id="${buttonId}" data-news-id="${item.id || 'unknown'}" data-news-headline="${item.headline}">Leer Noticia Completa</a>
                </div>
            `;
            newsGridContainer.appendChild(newsCard);
        });
    }

    // Función opcional para actualizar el JSON-LD de la página de noticias con los artículos cargados
    /*
    function updateNewsPageSchema(newsItems) {
        const scriptTag = document.querySelector('script[type="application/ld+json"]');
        if (scriptTag) {
            try {
                const schemaData = JSON.parse(scriptTag.textContent);
                if (schemaData['@type'] === 'CollectionPage') {
                    schemaData.mainEntity = {
                        "@type": "ItemList",
                        "itemListElement": newsItems.map((item, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": item.originalUrl // O la URL de una página de detalle en tu sitio si la tuvieras
                        }))
                    };
                    schemaData.numberOfItems = newsItems.length; // Si ItemList es mainEntity
                    scriptTag.textContent = JSON.stringify(schemaData, null, 2);
                }
            } catch (e) {
                console.error("Error updating News CollectionPage Schema.org JSON-LD:", e);
            }
        }
    }
    */
});
