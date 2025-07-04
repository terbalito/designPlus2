 
        // Configuration Firebase (à remplacer par vos valeurs)
        const firebaseConfig = {
            apiKey: "AIzaSyDoitIXUoYx7YH6PBXCRmuIhUThXPv-rR4",
            authDomain: "designplus-6cabb.firebaseapp.com",
            databaseURL: "https://designplus-6cabb-default-rtdb.firebaseio.com",
            projectId: "designplus-6cabb",
            storageBucket: "designplus-6cabb.firebasestorage.app",
            messagingSenderId: "543823443062",
            appId: "1:543823443062:web:9c99a16496fa001026db57",
            measurementId: "G-ME81QL196S"
            };

        // Initialiser Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const database = firebase.database();

        // Références aux éléments du DOM
        const loginPage = document.getElementById('login-page');
        const dashboard = document.getElementById('dashboard');
        const loginForm = document.getElementById('login-form');
        const logoutBtn = document.getElementById('logout-btn');
        const articlesContainer = document.getElementById('articles-container');
        const articleForm = document.getElementById('article-form');
        const articleTitleInput = document.getElementById('article-title');
        const articleImageInput = document.getElementById('article-image');
        const articleAltInput = document.getElementById('article-alt');
        const articleContentInput = document.getElementById('article-content');
        const formTitle = document.getElementById('form-title');
        const loginError = document.getElementById('login-error');
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const editorBtns = document.querySelectorAll('.editor-btn');

        // État de l'édition
        let editingArticleId = null;

        // Écouter l'état d'authentification
        auth.onAuthStateChanged(user => {
            if (user) {
                // Utilisateur connecté
                loginPage.classList.add('hidden');
                dashboard.classList.remove('hidden');
                loadArticles();
                showNotification('Connexion réussie!');
            } else {
                // Non connecté
                loginPage.classList.remove('hidden');
                dashboard.classList.add('hidden');
            }
        });

        // Connexion
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
                .catch(error => {
                    loginError.textContent = error.message;
                    loginError.classList.remove('hidden');
                });
        });

        // Déconnexion
        logoutBtn.addEventListener('click', () => {
            auth.signOut();
            showNotification('Déconnexion réussie!');
        });

        // Charger les articles
        function loadArticles() {
            database.ref('articles').on('value', snapshot => {
                articlesContainer.innerHTML = '';
                const articles = snapshot.val();

                if (articles) {
                    Object.entries(articles).forEach(([id, article]) => {
                        const articleEl = document.createElement('div');
                        articleEl.className = 'article-item';
                        articleEl.innerHTML = `
                            <div class="article-info">
                                <h4>${article.title}</h4>
                                <div class="article-date">${new Date(article.date).toLocaleDateString()}</div>
                            </div>
                            <div class="article-actions">
                                <button class="edit-btn" data-id="${id}"><i class="fas fa-edit"></i> Éditer</button>
                                <button class="delete-btn" data-id="${id}"><i class="fas fa-trash-alt"></i> Supprimer</button>
                            </div>
                        `;
                        articlesContainer.appendChild(articleEl);
                    });

                    // Écouteurs pour les boutons d'édition et suppression
                    document.querySelectorAll('.edit-btn').forEach(btn => {
                        btn.addEventListener('click', () => editArticle(btn.dataset.id));
                    });

                    document.querySelectorAll('.delete-btn').forEach(btn => {
                        btn.addEventListener('click', () => deleteArticle(btn.dataset.id));
                    });
                } else {
                    articlesContainer.innerHTML = '<div class="placeholder"><p>Aucun article pour le moment. Ajoutez votre premier article!</p></div>';
                }
            });
        }

        // Éditer un article
        function editArticle(id) {
            database.ref(`articles/${id}`).once('value', snapshot => {
                const article = snapshot.val();
                if (article) {
                    editingArticleId = id;
                    articleTitleInput.value = article.title;
                    articleImageInput.value = article.imageUrl;
                    articleAltInput.value = article.imageAlt;
                    articleContentInput.value = article.content;
                    formTitle.textContent = 'Éditer l\'article';
                    window.scrollTo({ top: document.getElementById('article-form').offsetTop, behavior: 'smooth' });
                    showNotification('Article chargé pour édition');
                }
            });
        }

        // Supprimer un article
        function deleteArticle(id) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
                database.ref(`articles/${id}`).remove()
                    .then(() => showNotification('Article supprimé avec succès!'))
                    .catch(error => showNotification('Erreur lors de la suppression: ' + error.message, true));
            }
        }

        // Soumettre le formulaire (ajout/édition)
        articleForm.addEventListener('submit', e => {
            e.preventDefault();

            const title = articleTitleInput.value;
            const imageUrl = articleImageInput.value;
            const imageAlt = articleAltInput.value;
            const content = articleContentInput.value;
            const date = new Date().toISOString();

            if (editingArticleId) {
                // Mise à jour
                database.ref(`articles/${editingArticleId}`).update({
                    title,
                    imageUrl,
                    imageAlt,
                    content,
                    date
                })
                .then(() => {
                    showNotification('Article mis à jour avec succès!');
                    resetForm();
                })
                .catch(error => showNotification('Erreur lors de la mise à jour: ' + error.message, true));
            } else {
                // Nouvel article
                database.ref('articles').push({
                    title,
                    imageUrl,
                    imageAlt,
                    content,
                    date
                })
                .then(() => {
                    showNotification('Article publié avec succès!');
                    resetForm();
                })
                .catch(error => showNotification('Erreur lors de la publication: ' + error.message, true));
            }
        });

        // Réinitialiser le formulaire
        function resetForm() {
            articleForm.reset();
            editingArticleId = null;
            formTitle.textContent = 'Ajouter un nouvel article';
        }

        // Afficher une notification
        function showNotification(message, isError = false) {
            notificationMessage.textContent = message;
            notification.style.background = isError ? '#e74c3c' : 'var(--accent-color)';
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Gestion de l'éditeur de texte
        editorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const command = btn.dataset.command;
                const value = btn.dataset.value || null;
                
                // Appliquer la commande
                document.execCommand(command, false, value);
                
                // Mettre en surbrillance le bouton actif
                if (['bold', 'italic', 'underline'].includes(command)) {
                    btn.classList.toggle('active', document.queryCommandState(command));
                }
            });
        });

        // Activer/désactiver les boutons d'édition
        articleContentInput.addEventListener('mouseup', () => {
            editorBtns.forEach(btn => {
                const command = btn.dataset.command;
                if (['bold', 'italic', 'underline'].includes(command)) {
                    btn.classList.toggle('active', document.queryCommandState(command));
                }
            });
        });
  