// js/catalogo.js

document.addEventListener('DOMContentLoaded', () => {
    const productGridContainer = document.getElementById('product-grid-container');
    const loadingMessage = document.getElementById('loading-message');

    const dataUrl = '../data/productos_catalogo.json'; 

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            if (loadingMessage) {
                loadingMessage.style.display = 'none'; 
            }
            if (products && products.length > 0) {
                displayProducts(products);
                updateSchemaOrgItemList(products); 
            } else {
                productGridContainer.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
            }
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            productGridContainer.innerHTML = '<p>Error al cargar los productos. Por favor, inténtalo más tarde.</p>';
        });

    function displayProducts(products) {
        products.forEach((product, index) => {
            const productCard = document.createElement('article');
            productCard.classList.add('product-card');
            productCard.setAttribute('itemprop', 'itemListElement');
            productCard.setAttribute('itemscope', '');
            productCard.setAttribute('itemtype', 'https://schema.org/ListItem');

            const formattedPrice = new Intl.NumberFormat('es-CO', { 
                style: 'currency', 
                currency: 'COP',
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0
            }).format(product.priceCOP);

            const buttonId = `product-button-${product.id || index}`;

            productCard.innerHTML = `
                <meta itemprop="position" content="${index + 1}">
                <div itemprop="item" itemscope itemtype="https://schema.org/Product">
                    <link itemprop="url" href="${product.storeUrl}">
                    <img itemprop="image" src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400/2a2a2a/cccccc?text=Imagen+No+Disponible';this.alt='Imagen de producto no disponible';">
                    <h3 itemprop="name" class="product-name">${product.name}</h3>
                    <p itemprop="description" class="product-description">${product.description}</p>
                    ${product.author ? `<p class="product-author" itemprop="author" itemscope itemtype="https://schema.org/Person">Por: <span itemprop="name">${product.author}</span></p>` : ''}
                    ${product.isbn ? `<meta itemprop="isbn" content="${product.isbn}">` : ''}
                    <div itemprop="offers" itemscope itemtype="https://schema.org/Offer" class="product-offer">
                        <link itemprop="url" href="${product.storeUrl}">
                        <meta itemprop="availability" content="https://schema.org/InStock">
                        <meta itemprop="priceCurrency" content="${product.currency}">
                        <span itemprop="price" content="${product.priceCOP}" class="product-price">${formattedPrice}</span>
                        <a href="${product.storeUrl}" target="_blank" rel="noopener sponsored" class="product-button" id="${buttonId}" data-product-id="${product.id || 'unknown'}" data-product-name="${product.name}">Ver en Tienda</a>
                    </div>
                    ${product.brand ? `<div itemprop="brand" itemscope itemtype="https://schema.org/Brand" class="product-brand" style="display:none;"><meta itemprop="name" content="${product.brand}"></div>` : ''}
                </div>
            `;
            productGridContainer.appendChild(productCard);
        });
    }

    function updateSchemaOrgItemList(products) {
        const scriptTag = document.querySelector('script[type="application/ld+json"]');
        if (scriptTag) {
            try {
                const schemaData = JSON.parse(scriptTag.textContent);
                let itemListSchema = null;
                if (schemaData['@graph']) {
                    itemListSchema = schemaData['@graph'].find(item => item['@type'] === 'WebPage' && item.mainEntity && item.mainEntity['@type'] === 'ItemList')?.mainEntity;
                } else if (schemaData['@type'] === 'ItemList') {
                    itemListSchema = schemaData;
                } else if (schemaData['@type'] === 'WebPage' && schemaData.mainEntity && schemaData.mainEntity['@type'] === 'ItemList') {
                    itemListSchema = schemaData.mainEntity;
                }

                if (itemListSchema) {
                    itemListSchema.numberOfItems = products.length;
                    itemListSchema.itemListElement = products.map((product, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": product.category === "Libros Técnicos" ? "Book" : "Product", 
                            "name": product.name,
                            "image": product.image.startsWith('http') ? product.image : `https://danielvelez.netlify.app/${product.image.replace(/^\.\.\//, '')}`, 
                            "description": product.description,
                            "url": product.storeUrl,
                            ...(product.sku && { "sku": product.sku }),
                            ...(product.brand && { "brand": { "@type": "Brand", "name": product.brand } }),
                            ...(product.isbn && { "isbn": product.isbn }),
                            ...(product.author && { "author": { "@type": "Person", "name": product.author } }),
                            "offers": {
                                "@type": "Offer",
                                "url": product.storeUrl,
                                "priceCurrency": product.currency,
                                "price": product.priceCOP.toString(),
                                "availability": "https://schema.org/InStock", 
                                "seller": { 
                                    "@type": "Organization",
                                    "name": "Tienda Ejemplo Online" 
                                }
                            }
                        }
                    }));
                    scriptTag.textContent = JSON.stringify(schemaData, null, 2);
                }
            } catch (e) {
                console.error("Error updating Schema.org JSON-LD:", e);
            }
        }
    }
});
