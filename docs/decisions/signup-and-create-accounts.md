# Accounts Creation: Signup

## Décision

La création des comptes se base sur une `composition pattern`. **UserEntity** sert d'entité de base contenant les
données partagées par tous les utilisateurs (email, mot de passe hashé, rôle) et chaque type d'utilisateur spécialisé
compose un **UserEntity** via une relation **OneToOne** et gere ses propres données métier.

La création d'un compte se fait en deux étapes

1. **POST /auth/signup**: reçoit les informations de base (email, mot de passe, rôle). Crée le `UserEntity`, crée
   l'entité spécialisée associée, et établit la relation `OneToOne` entre les deux.


2. **PATCH /[module_utilisateur]/set account**: complète le compte avec les données spécifiques au type d'utilisateur

## Pourquoi: 
- simplifie la gestion de l'authentification : un seul point d'entrée d'authentification pour toute l'application
- Les classes utilisateur spécialisées restent concentrées sur leur logique métier propre


