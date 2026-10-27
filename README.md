# Portfolio · Othmane Al Amrani

Site portfolio statique (HTML, CSS, JavaScript), sans dépendance ni étape de build.

## Ouvrir le site

- **Dans PhpStorm** : clic droit sur `index.html` › *Open In* › *Browser*.
- **Ou** double-cliquez sur `index.html` dans le Finder.
- **Serveur local** (facultatif) : `php -S localhost:8000` à la racine du projet, puis http://localhost:8000.

## Fonctionnement

Le site est découpé en six onglets : Accueil, Expérience, Projets, Compétences,
Formation et Contact.

- Une pastille glisse sous l'onglet actif ; le contenu sort d'un côté et entre de
  l'autre selon le sens de navigation, puis apparaît en cascade.
- Chaque onglet a sa propre adresse (`index.html#projets`) : on peut l'envoyer
  directement, et les boutons précédent / suivant du navigateur fonctionnent.
- Clavier : flèches gauche / droite, Début et Fin dans la barre d'onglets.
- Sur téléphone : balayer l'écran vers la gauche ou la droite change d'onglet.
- Si le visiteur a activé « réduire les animations », les onglets changent sans animation.
- Sans JavaScript, toutes les sections s'affichent l'une sous l'autre.

## Structure

```
Portfolio/
├── index.html                      Contenu des six onglets
├── assets/
│   ├── css/style.css               Couleurs, typographie, mise en page (thèmes clair et sombre)
│   ├── js/main.js                  Onglets et animations, thème, copie de l'e-mail
│   ├── img/favicon.svg             Icône d'onglet (étoile à huit branches)
│   └── cv-othmane-al-amrani.pdf    CV téléchargeable
└── README.md
```

## Ajouter ou modifier un onglet

1. Ajoutez un lien dans la barre (`<a class="tab" role="tab" id="tab-xxx" href="#xxx" aria-controls="xxx">`).
2. Ajoutez le panneau correspondant (`<section class="panel" id="xxx" role="tabpanel" aria-labelledby="tab-xxx">`).
3. Ajoutez `"xxx"` à la liste `tabs` du petit script dans le `<head>` de `index.html`.

Les éléments marqués `data-reveal` apparaissent en cascade à l'ouverture de l'onglet.

## Maquettes des projets

Chaque carte de l'onglet Projets affiche une petite maquette animée, dessinée en
HTML/CSS (`<figure class="preview">`) : écran Accueil de DailyFlow, chat d'AgriGPT,
tableau de bord du cabinet médical et fil temps réel de The Wall. Elles se rejouent
à l'ouverture de l'onglet et au survol de la carte.

Pour mettre une vraie capture d'écran à la place, remplacez le contenu du `<figure>`
par une image, par exemple :

```html
<figure class="preview">
  <img src="assets/img/dailyflow.png" alt="Écran Accueil de DailyFlow" style="width:236px;border-radius:28px">
  <figcaption>Écran Accueil</figcaption>
</figure>
```

## À compléter

- **Liens des projets** : si les dépôts GitHub sont publics, ajoutez un lien dans chaque carte de l'onglet Projets.
- **LinkedIn** : ajoutez une ligne dans la liste `contact-links` de l'onglet Contact.

## Modifier les couleurs

Toutes les couleurs sont des variables en haut de `assets/css/style.css`
(`--accent`, `--paper`, `--ink`…), définies une fois pour le thème clair
et une fois pour le thème sombre.

## Mettre en ligne

Le site étant statique, il se publie gratuitement sur **GitHub Pages**
(dépôt `othmanealpro-crypto.github.io`), **Netlify** ou **Vercel** :
il suffit d'envoyer le dossier tel quel.
