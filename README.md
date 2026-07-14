# ConsignArt

> ConsignArt API

- [Description du projet](#1-description-du-projet)
- [Quick start](#quick-start)
- [Fonctionnalités implémentées](#fonctionnalités-implémentées)
- [Contraintes techniques](#contraintes-techniques)
- [Architecture](#architecture)

## Description du projet:

============= Contenu ici ====================

## Quick start:

============= Contenu ici ====================


## Fonctionnalités implémentées

### Gestion des utilisateurs et authentification:
- [x] Inscription (Collecteur, Artist, Admin & Gallery)
- [x] Un utilisateur `Artist` est attaché à qu'une seul `Galerie` à la fois 
- [x] Les mots de passe sont hachés avec bcrypt
- [x] un compte `Galerie` doit être validé par un administrateur avant son activation
- [x] Login & Authentication avec JWT (Access + Refresh Token)
- [x] Access au resource d'un compte via `/auth/me`
- [x] Refresh Token pour obtenir un nouveau Access Token`
- [x] Refresh Token rotation & revocation

### Gestion des artistes:
- [x] Ajout d'un artiste par un compte Galerie
- [x] Demande de transféré d'une galerie par un artiste
- [x] Validation de transferred par un compte admin 




## Contraintes techniques:

============= Contenu ici ====================


### Modules:

- [x] Découpage fonctionnel en modules (11 Modules), admin, analytics, artists, auth, expositions, sell-contracts
  ..etc [tout les modules ici](./src/modules)
- [x] Chaque module encapsule son domaine

### Contrôleurs et routes:

- [x] Routes REST respectant les conventions
- [x] Paramètres de route, query string, body correctement typés
- [x] Versionnement de l'API via préfixe

### Pipes

- [x] Validation automatique des DTOs avec class validator & class-transformer via un pipe global
- [ ] Pipe personnalisée de transformation métier
- [ ] Pipe personnalisée de validation métier

### Guards:

- [x] Guard d'authentification globale (JwtAuthGuard) pour les accessTokens
- [x] Guard d'authentification globale (JwtRefreshAuthGuard) pour les refreshTokens
- [x] Guard de rôle (Admin, Artist, Gallery, Collector)
- [ ] Guard d'appartenance personnalisée OwnershipGuard (vérifie qu'une
  œuvre appartient bien à la galerie de l'utilisateur connecté)

### Interceptors:

- [x] Interceptor de transformation : formate toutes les réponses API dans un enveloppe standard ( { data, meta,
  timestamp } )
- [x] Interceptor de logging : enregistre chaque requête (méthode, route, durée, utilisateur) dans un fichier ou en
  base
- [ ] Interceptor de cache (optionnel) : met en cache les réponses des endpoints de consultation publique

### Exception Filters:

- [x] Filtre global qui attrape toutes les exceptions non gérées et retourne une réponse
  formatée
- [ ] Filtre personnalisé pour les erreurs métier spécifiques

### TypeORM et base de données:

- [x] Utilisation de TypeORM avec une base de données SQL (SQLite en dev, PostgreSQL en prod via Docker).
- [x] Relations : ManyToOne, OneToMany, ManyToMany
- [x] Transactions : une opération critique (ex. : vente d'une œuvre avec mise à jour du solde artiste) doit se faire
  dans une transaction
- [x] Migrations : le projet doit inclure des migrations pour créer le schéma de base.
- [ ] Index : au moins un index sur une colonne fréquemment interrogée

### Tests:

- [ ] Tests unitaires sur les services critiques
- [ ] Tests unitaires sur les guards et pipes personnalisés
- [ ] Tests d'intégration sur au moins un endpoint complet
- [ ] Utilisation de Vitest (ou Jest).

### Configuration et environnement:

- [x] Variables d'environnement chargées via @nestjs/config.
- [x] Fichier .env.example fourni sans secrets
- [x] Configuration typée avec ConfigService et validation des variables requises (class-validator)

## Architecture:

============= Contenu ici ====================