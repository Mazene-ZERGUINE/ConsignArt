# Quelle base de données choisir ?

Deux bases de données sont utilisées dans ce projet (SQLite et PostgreSQL), pour des différents objectifs et raisons

### 1 - En développement : SQLite
SQLite en environnement local pour les raisons suivantes :

- **Mise en place rappide** : aucun service à orchestrer en docker compose seulement un fichier `.sqlite` sur disque.
- **Intégration avec TypeORM** : le mode `synchronize: true` permet de répercuter automatiquement les changements d'entités sur le schéma, sans risque puisque les données sont locales et jetables.
- **Empreinte minimale** : pas de port exposé, pas de processus en arrière-plan.
- **Tests rapides** : possibilité d'utiliser une base SQLite en mémoire (`:memory:`) pour les tests d'intégration.

### 2 - En production : PostgreSQL
PostgreSQL est retenu en production pour:

- **Scalabilité** : capable de gérer des larges volumes de données ainsi qu'une forte concurrence en lecture/écriture
- ** transactions** : support complet permettant des accès concurrents performants sans blocage.
- **Sécurité renforcée** : gestion fine des rôles et des permissions, authentification ...etc.
- **Workflow de migrations** : utilisation des migrations TypeORM (`synchronize: false` en production) pour versionner les évolutions de schéma de manière contrôlée.

