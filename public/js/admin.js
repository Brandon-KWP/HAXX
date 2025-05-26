// public/js/admin.js

document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour supprimer un événement
    document.querySelectorAll('.delete-event').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.dataset.id;
            fetch(`/admin/events/${eventId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    location.reload();
                } else {
                    alert('Erreur lors de la suppression de l\'événement.');
                }
            });
        });
    });

    // Fonction pour supprimer un projet
    document.querySelectorAll('.delete-project').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.dataset.id;
            fetch(`/admin/projects/${projectId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    location.reload();
                } else {
                    alert('Erreur lors de la suppression du projet.');
                }
            });
        });
    });

    // Fonction pour supprimer un membre
    document.querySelectorAll('.delete-member').forEach(button => {
        button.addEventListener('click', function() {
            const memberId = this.dataset.id;
            fetch(`/admin/members/${memberId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    location.reload();
                } else {
                    alert('Erreur lors de la suppression du membre.');
                }
            });
        });
    });
});