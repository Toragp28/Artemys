document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = e.target.id.split('-')[2];
            const paypalButtonContainer = document.getElementById(`paypal-button-container-${productId}`);
            
            if (productId === '4') {
                // Gestion spéciale pour l'article gratuit
                handleFreeProductPurchase(productId);
            } else {
                // Gestion pour les autres produits
                if (paypalButtonContainer.classList.contains('show')) {
                    paypalButtonContainer.classList.remove('show');
                    paypalButtonContainer.innerHTML = '';
                } else {
                    paypalButtonContainer.classList.add('show');
                    renderPayPalButton(productId);
                }
            }
        });
    });

    function renderPayPalButton(productId) {
        const products = {
            '1': { price: '9.99', description: 'Pack Armistys 1000', armestys: 1000 },
            '2': { price: '39.99', description: 'Pack Armestys 5000', armestys: 5000 },
            '3': { price: '74.99', description: 'Pack Armistys 10000', armestys: 10000 }
        };

        const product = products[productId];

        if (window.paypal) {
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            description: product.description,
                            amount: {
                                currency_code: 'EUR',
                                value: product.price
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        alert('Merci pour votre achat, ' + details.payer.name.given_name + '!');
                        
                        // Récupérer l'utilisateur Discord depuis les cookies ou une autre méthode
                        const userId = getUserIdFromCookies(); // Implémentez cette fonction selon votre logique

                        if (userId) {
                            // Envoyer une requête à l'API pour ajouter des armestys
                            fetch('/api/addarmestys', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    userId: userId,
                                    amount: product.armestys
                                })
                            }).then(response => response.json())
                              .then(data => {
                                  console.log(data);
                                  alert(`Vous avez reçu ${product.armestys} armestys!`);
                              }).catch(error => {
                                  console.error('Erreur:', error);
                                  alert('Erreur lors de l\'ajout des armestys.');
                              });
                        } else {
                            alert('Erreur : Utilisateur Discord non trouvé.');
                        }
                    });
                }
            }).render(`#paypal-button-container-${productId}`);
        } else {
            alert('Erreur: Le SDK PayPal ne s\'est pas chargé correctement.');
        }
    }

    function handleFreeProductPurchase(productId) {
        const userId = getUserIdFromCookies();
        const freeProductArmestys = 100; // Quantité d'armestys pour le produit gratuit

        if (userId) {
            // Envoyer une requête à l'API pour ajouter des armestys pour l'article gratuit
            fetch('/api/addarmestys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    amount: freeProductArmestys
                })
            }).then(response => response.json())
              .then(data => {
                  console.log(data);
                  alert(`Vous avez reçu ${freeProductArmestys} armestys pour l'article gratuit!`);
              }).catch(error => {
                  console.error('Erreur:', error);
                  alert('Erreur lors de l\'ajout des armestys.');
              });
        } else {
            alert('Erreur : Utilisateur Discord non trouvé.');
        }
    }

    function getUserIdFromCookies() {
        // Implémentez la logique pour récupérer l'ID utilisateur depuis les cookies ou une autre source
        // Exemple de récupération des cookies en JavaScript :
        const cookieName = 'discordUserId';
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

        return cookies[cookieName] || null;
    }
});
