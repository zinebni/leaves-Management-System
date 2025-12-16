\documentclass[12pt,a4paper]{report}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[french]{babel}
\usepackage{geometry}
\geometry{margin=2.5cm}
\usepackage{graphicx}
\usepackage{hyperref}
\usepackage{caption}
\usepackage{amsmath,amssymb}
\usepackage{array}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{setspace}
\usepackage{tocloft}
\usepackage{tikz}
\usepackage{pgf-umlsd}
\usepackage{fancyhdr}
\usepackage{titlesec}
\usepackage{tcolorbox}
\tcbuselibrary{skins,breakable}
\usepackage{enumitem}
\usepackage{fontawesome5}

\onehalfspacing

% Définition des couleurs de l'application RHPlus (inspirées du thème urbain)
\definecolor{rhplus-primary}{RGB}{44,62,80}      % Bleu urbain profond
\definecolor{rhplus-secondary}{RGB}{52,152,219}   % Bleu ciel
\definecolor{rhplus-accent}{RGB}{46,204,113}      % Vert succès
\definecolor{rhplus-warning}{RGB}{230,126,34}     % Orange
\definecolor{rhplus-danger}{RGB}{231,76,60}       % Rouge
\definecolor{rhplus-light}{RGB}{236,240,241}      % Gris clair
\definecolor{rhplus-dark}{RGB}{52,73,94}          % Gris foncé
\definecolor{code-bg}{RGB}{250,250,250}           % Fond code
\definecolor{code-keyword}{RGB}{0,102,204}        % Mots-clés
\definecolor{code-string}{RGB}{163,21,21}         % Chaînes
\definecolor{code-comment}{RGB}{0,128,0}          % Commentaires

\hypersetup{
  colorlinks=true,
  linkcolor=rhplus-primary,
  urlcolor=rhplus-secondary,
  citecolor=rhplus-primary,
  bookmarksnumbered=true,
  pdfstartview=FitH
}

% Style des listings de code amélioré
\lstdefinestyle{code}{
  basicstyle=\ttfamily\small\color{rhplus-dark},
  keywordstyle=\color{code-keyword}\bfseries,
  stringstyle=\color{code-string},
  commentstyle=\color{code-comment}\itshape,
  columns=fullflexible,
  breaklines=true,
  frame=single,
  rulecolor=\color{rhplus-secondary},
  backgroundcolor=\color{code-bg},
  showstringspaces=false,
  numbers=left,
  numberstyle=\tiny\color{gray},
  numbersep=8pt,
  tabsize=2,
  captionpos=b
}

\lstset{style=code}

% Style des titres de chapitres
\titleformat{\chapter}[display]
  {\normalfont\huge\bfseries\color{rhplus-primary}}
  {\filleft\Huge\color{rhplus-secondary}\chaptertitlename\ \thechapter}
  {4ex}
  {\titlerule\vspace{2ex}\filleft}
  [\vspace{2ex}\titlerule]

% Style des sections
\titleformat{\section}
  {\normalfont\Large\bfseries\color{rhplus-primary}}
  {\thesection}{1em}{}

\titleformat{\subsection}
  {\normalfont\large\bfseries\color{rhplus-secondary}}
  {\thesubsection}{1em}{}

% En-têtes et pieds de page
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\textcolor{rhplus-primary}{RHPlus - Application Web de Gestion des Congés}}
\fancyhead[R]{\small\textcolor{rhplus-secondary}{\thepage}}
\fancyfoot[C]{\small\textcolor{gray}{UEMF - EIDIA | Année 2025-2026}}
\renewcommand{\headrulewidth}{0.5pt}
\renewcommand{\footrulewidth}{0.5pt}
\renewcommand{\headrule}{\hbox to\headwidth{\color{rhplus-secondary}\leaders\hrule height \headrulewidth\hfill}}
\renewcommand{\footrule}{\hbox to\headwidth{\color{rhplus-light}\leaders\hrule height \footrulewidth\hfill}}

% Style de la table des matières
\renewcommand{\cftchapfont}{\bfseries\color{rhplus-primary}}
\renewcommand{\cftchappagefont}{\bfseries\color{rhplus-secondary}}
\renewcommand{\cftsecfont}{\color{rhplus-dark}}
\renewcommand{\cftsecpagefont}{\color{rhplus-secondary}}

% Boîtes colorées pour les remarques
\newtcolorbox{infobox}[1]{
  colback=rhplus-light,
  colframe=rhplus-secondary,
  fonttitle=\bfseries,
  title=#1,
  breakable
}

\newtcolorbox{warningbox}[1]{
  colback=rhplus-warning!10,
  colframe=rhplus-warning,
  fonttitle=\bfseries,
  title=#1,
  breakable
}

\newtcolorbox{successbox}[1]{
  colback=rhplus-accent!10,
  colframe=rhplus-accent,
  fonttitle=\bfseries,
  title=#1,
  breakable
}

\usetikzlibrary{shapes.geometric, arrows, positioning, shadows, calc}

\begin{document}

%========================================================
% Page de garde
%========================================================
\begin{titlepage}
  \centering
  \begin{tikzpicture}[remember picture,overlay]
    \fill[rhplus-primary] (current page.north west) rectangle ($(current page.north east)+(0,-3cm)$);
    \fill[rhplus-secondary] (current page.south west) rectangle ($(current page.south east)+(0,3cm)$);
  \end{tikzpicture}
  
  \vspace*{2cm}
  {\Large \textcolor{white}{\textbf{Université Euromed de Fès}}\\[0.3cm]
   \textcolor{white}{École d'Ingénierie Digitale et d'Intelligence Artificielle (EIDIA)}\par}
  
  \vspace{3cm}
  
  \begin{tcolorbox}[
    colback=white,
    colframe=rhplus-accent,
    boxrule=2pt,
    arc=8pt,
    width=0.9\textwidth
  ]
    \centering
    {\Large \textbf{Rapport de Projet de Fin de Module}\par}
    \vspace{0.5cm}
    {\huge \textcolor{rhplus-primary}{\textbf{RHPlus}}\par}
    \vspace{0.3cm}
    {\LARGE \textcolor{rhplus-secondary}{\textbf{Application Web de Gestion des Congés}}\par}
  \end{tcolorbox}
  
  \vspace{1.5cm}
  
  \begin{tcolorbox}[
    colback=rhplus-light,
    colframe=rhplus-primary,
    boxrule=1pt,
    arc=5pt,
    width=0.8\textwidth
  ]
  {\large \textbf{Filière :} Ingénierie Full Stack et Multimédia\par}
  \end{tcolorbox}
  
  \vspace{1.5cm}
  
  \begin{minipage}[t]{0.45\textwidth}
    \begin{tcolorbox}[colback=white, colframe=rhplus-secondary, boxrule=1pt, arc=5pt]
      \textbf{\textcolor{rhplus-primary}{Réalisé par :}}\\[0.3cm]
      \textcolor{rhplus-dark}{
      \faUser\ Mlle. Zineb BENNANI GABSI\\
      \faUser\ Mlle. Aya ET-TOUIL\\
      \faUser\ Mlle. Nada BOUAHYAOUI
      }
    \end{tcolorbox}
  \end{minipage}
  \hfill
  \begin{minipage}[t]{0.45\textwidth}
    \begin{tcolorbox}[colback=white, colframe=rhplus-accent, boxrule=1pt, arc=5pt]
      \textbf{\textcolor{rhplus-primary}{Encadré par :}}\\[0.3cm]
      \textcolor{rhplus-dark}{
      \faChalkboardTeacher\ M. Abdellatif EL ABDERRAHMANI
      }
    \end{tcolorbox}
  \end{minipage}
  
  \vfill
  
  \begin{tikzpicture}[remember picture,overlay]
    \node[anchor=south] at ($(current page.south)+(0,1cm)$) {
      \begin{tcolorbox}[
        colback=rhplus-secondary,
        colframe=rhplus-secondary,
        width=12cm,
        arc=5pt
      ]
        \centering
        \textcolor{white}{\large \faCalendar\ Année universitaire 2025--2026}
      \end{tcolorbox}
    };
  \end{tikzpicture}
\end{titlepage}

\pagenumbering{roman}

%========================================================
% Résumé
%========================================================
\chapter*{Résumé}
\addcontentsline{toc}{chapter}{Résumé}
Ce rapport présente le travail réalisé dans le cadre d’un projet de fin de module en ingénierie Full Stack et Multimédia. 
L’objectif du projet est de concevoir et développer une application web de gestion des congés destinée à une organisation, afin de digitaliser le processus de demande, de validation et de suivi des congés des employés, tout en respectant les dispositions du Code du Travail marocain. 
L’application propose trois espaces distincts : un espace administrateur pour la gestion des départements et des comptes RH, un espace employé pour la soumission et le suivi des demandes, et un espace RH pour le traitement des demandes, la gestion des employés et des événements. 
Le développement repose sur la stack MERN (MongoDB, Express.js, React.js, Node.js), et intègre des fonctionnalités avancées telles que l’authentification sécurisée via JSON Web Tokens (JWT), la communication en temps réel avec Socket.io, l’automatisation de tâches planifiées à l’aide de node-cron, ainsi que la dockerisation de l’application afin de faciliter son déploiement, sa portabilité et la gestion des environnements.

\textbf{Mots-clés :} Gestion des congés, MERN, JavaScript, Node.js, MongoDB, React, Express, Socket.io, node-cron, Docker.



%========================================================
% Table des matières / figures
%========================================================
\tableofcontents
\listoffigures
\clearpage

\pagenumbering{arabic}

%========================================================
% Chapitre 1 : Introduction générale
%========================================================
\chapter{Introduction générale}

Avec l’utilisation croissante des technologies numériques, les départements des ressources humaines cherchent à automatiser leurs processus afin de gagner en efficacité, en traçabilité et en transparence vis-à-vis des employés. 
La gestion des congés constitue un processus critique, à l’interface entre contraintes légales, organisationnelles et humaines, et reste encore souvent gérée de manière manuelle via des formulaires papier ou des fichiers tableurs. 
Ce mode de fonctionnement engendre des risques d’erreurs, un manque d’historique fiable et une charge administrative importante.

Au Maroc, le Code du Travail encadre strictement les droits aux congés payés et certains congés exceptionnels, ce qui complexifie la gestion lorsqu’elle est assurée sans support logiciel adapté. 
Les solutions existantes sur le marché demeurent parfois peu flexibles, insuffisamment personnalisables ou mal adaptées au contexte réglementaire marocain et aux besoins des petites et moyennes structures. 
Dans ce contexte, la mise en place d’une application web de gestion des congés, moderne et évolutive, représente un levier important de digitalisation des processus RH.

Ce projet de fin de module a pour objectif de concevoir et réaliser \textbf{RHPlus}, une application web de gestion des congés basée sur la stack MERN, offrant une interface moderne, responsive et une architecture modulaire évolutive. 

\begin{infobox}{Pourquoi RHPlus ?}
\textbf{RHPlus} se distingue des solutions existantes par :
\begin{itemize}[leftmargin=2em]
  \item[\textcolor{rhplus-secondary}{\faMapMarkerAlt}] \textbf{Adaptation locale} : Conçu spécifiquement pour le contexte marocain
  \item[\textcolor{rhplus-secondary}{\faUserCheck}] \textbf{UX simplifiée} : Interface intuitive ne nécessitant aucune formation
  \item[\textcolor{rhplus-secondary}{\faDollarSign}] \textbf{Accessibilité} : Tarification adaptée au marché marocain
  \item[\textcolor{rhplus-secondary}{\faExpand}] \textbf{Évolutivité} : Plateforme extensible vers d'autres fonctionnalités RH
\end{itemize}
\end{infobox}

\vspace{0.5cm}

Le présent rapport décrit successivement le contexte et la problématique, la méthodologie de conduite du projet, l’analyse et la conception de la solution, la mise en œuvre technique, puis la dockerisation de l’application pour faciliter son déploiement et son exploitation.

%========================================================
% Chapitre 2 : Contexte général du projet
%========================================================
\chapter{Contexte général du projet}

\section{Gestion des congés : état des lieux}

Dans de nombreuses organisations, la gestion des congés repose sur des procédures manuelles : demandes sur papier, échanges de courriels, validations informelles ou suivis sur des tableurs. 
Ce mode de fonctionnement rend difficile la centralisation des informations, la mise à jour des droits individuels, ainsi que la production de tableaux de bord pour le pilotage RH. 
Les erreurs humaines (saisie, calcul, oubli de mise à jour) peuvent générer des conflits ou des incompréhensions entre les employés et la direction.

\section{Cadre légal et typologie des congés}

Le cadre légal fixe un ensemble de droits aux congés payés, ainsi que des congés exceptionnels liés à des événements familiaux ou personnels. 
Pour gérer ces droits de manière fiable, une application doit intégrer des règles paramétrables, prenant en compte l’ancienneté, la durée du travail, la situation familiale et les spécificités propres à chaque organisation.

\subsection*{Exemple de typologie de congés}

\begin{table}[h]
\centering
\begin{tabular}{|p{4cm}|p{3cm}|p{7cm}|}
\hline
\textbf{Type de congé} & \textbf{Durée indicative} & \textbf{Commentaires} \\
\hline
Congé annuel payé & 1,5 jour / mois & Acquis après une période minimale de travail, durée plafonnée annuellement. \\
\hline
Mariage du salarié & 4 jours & Congé exceptionnel rémunéré, sur justificatif. \\
\hline
Décès (conjoint, parent proche) & 3 jours & Congé exceptionnel, sur justificatif. \\
\hline
Congé de maternité & 14 semaines & Régi par le Code du Travail, peut être étendu selon la convention. \\
\hline
Congé de paternité & 3 jours & Immédiatement après la naissance. \\
\hline
Congés sans solde & Variable & Soumis à l’accord de l’employeur. \\
\hline
\end{tabular}
\caption{Exemple de typologie de congés gérés par l’application}
\end{table}

\section{Problématique}

Les principales difficultés rencontrées dans la gestion manuelle des congés peuvent être résumées comme suit :
\begin{itemize}
  \item Manque de centralisation et de visibilité globale sur les absences.
  \item Risques d’erreurs dans le calcul des droits acquis et consommés.
  \item Difficulté à assurer la traçabilité et l’historique des décisions.
  \item Faible ergonomie pour les employés comme pour les responsables RH.
\end{itemize}

La problématique centrale du projet est donc : \emph{comment concevoir une application web permettant d’automatiser la gestion des congés, en respectant le cadre légal et en offrant une expérience utilisateur fluide et transparente ?}

\section{Objectifs du projet}

Les objectifs poursuivis par ce projet de fin de module sont les suivants :
\begin{itemize}
  \item Digitaliser l’ensemble du cycle de vie d’une demande de congé (création, validation, suivi, historique).
  \item Centraliser les informations relatives aux droits, soldes et historiques de congés.
  \item Simplifier le travail des services RH grâce à une interface de gestion dédiée.
  \item Mettre en place une architecture technique moderne, sécurisée et évolutive.
  \item Faciliter le déploiement de la solution grâce à la dockerisation.
\end{itemize}

%========================================================
% Chapitre 3 : Méthodologie du projet
%========================================================
\chapter{Méthodologie du projet}

\section{Démarche adoptée}

Le projet a été mené selon une méthodologie agile adaptée au contexte académique, permettant un développement itératif et incrémental.

\begin{figure}[h!]
  \centering
  \begin{tikzpicture}[node distance=1.5cm]
    \tikzstyle{phase}=[rectangle, draw=rhplus-primary, fill=rhplus-light, 
                       text width=3cm, text centered, rounded corners, minimum height=1cm, line width=1pt]
    \tikzstyle{arrow}=[->, >=stealth, line width=1.5pt, draw=rhplus-secondary]
    
    \node[phase, fill=rhplus-accent!20] (p1) {\textbf{1. Analyse}\\Besoins \& Cahier des charges};
    \node[phase, right=of p1, fill=rhplus-secondary!20] (p2) {\textbf{2. Conception}\\UML \& Architecture};
    \node[phase, right=of p2, fill=rhplus-warning!20] (p3) {\textbf{3. Développement}\\Sprints itératifs};
    \node[phase, below=of p3, fill=rhplus-accent!30] (p4) {\textbf{4. Tests}\\Validation};
    \node[phase, left=of p4, fill=rhplus-primary!20] (p5) {\textbf{5. Déploiement}\\Docker};
    
    \draw[arrow] (p1) -- (p2);
    \draw[arrow] (p2) -- (p3);
    \draw[arrow] (p3) -- (p4);
    \draw[arrow] (p4) -- (p5);
    \draw[arrow, dashed] (p5) to [bend right=45] (p1);
  \end{tikzpicture}
  \caption{Cycle de développement du projet RHPlus}
\end{figure}

\section{Outils et environnement de développement}

\subsection*{Gestion de projet}

\begin{itemize}[leftmargin=2em]
  \item[\textcolor{rhplus-primary}{\faProjectDiagram}] \textbf{Jira} : Gestion des tâches et suivi du projet
  \item[\textcolor{rhplus-primary}{\faCodeBranch}] \textbf{Git \& GitHub} : Versioning et collaboration
  \item[\textcolor{rhplus-primary}{\faFileAlt}] \textbf{StarUML} : Modélisation UML
\end{itemize}

\subsection*{Développement}

\begin{itemize}[leftmargin=2em]
  \item[\textcolor{rhplus-secondary}{\faCode}] \textbf{VS Code} : Éditeur de code principal
  \item[\textcolor{rhplus-secondary}{\faDatabase}] \textbf{MongoDB Compass} : Gestion de la base de données
  \item[\textcolor{rhplus-secondary}{\faNetworkWired}] \textbf{Postman} : Tests API
  \item[\textcolor{rhplus-secondary}{\faDocker}] \textbf{Docker Desktop} : Conteneurisation
\end{itemize}

\subsection*{Design}

\begin{itemize}[leftmargin=2em]
  \item[\textcolor{rhplus-accent}{\faPalette}] \textbf{Tailwind CSS} : Framework CSS utility-first
  \item[\textcolor{rhplus-accent}{\faPaintBrush}] \textbf{Vanta.js} : Effets visuels interactifs
  \item[\textcolor{rhplus-accent}{\faLanguage}] \textbf{i18next} : Internationalisation
\end{itemize}

\section{Organisation du travail}

Le projet a été réalisé en équipe de trois étudiantes avec une répartition des tâches selon les compétences :

\begin{table}[h!]
\centering
\begin{tabular}{|p{4cm}|p{10cm}|}
\hline
\rowcolor{rhplus-primary!20}
\textbf{Membre} & \textbf{Responsabilités principales} \\
\hline
Zineb BENNANI GABSI & Architecture backend, API REST, Authentification JWT/2FA, Node-cron \\
\hline
Aya ET-TOUIL & Interface React, Composants UI, Intégration Socket.io, Tailwind CSS \\
\hline
Nada BOUAHYAOUI & Base de données MongoDB, Modélisation, Tests, Dockerisation \\
\hline
\end{tabular}
\caption{Répartition des responsabilités dans l'équipe}
\end{table}

%========================================================
% Chapitre 4 : Analyse et conception
%========================================================
\chapter{Analyse et conception}

\section{Besoins fonctionnels}

Les besoins fonctionnels de l’application peuvent être structurés autour de trois profils principaux : administrateur, responsable RH, employé.

\subsection*{Espace administrateur}

L’administrateur peut :
\begin{itemize}
  \item Créer et gérer les départements de l’organisation.
  \item Créer et gérer les comptes des responsables RH.
  \item Consulter une vue d’ensemble de l’activité (statistiques de congés, répartition par département, etc.).
\end{itemize}

\subsection*{Espace responsable RH}

Le responsable RH peut :
\begin{itemize}
  \item Créer et gérer les comptes des employés.
  \item Consulter, approuver ou rejeter les demandes de congés.
  \item Gérer les événements internes (jours fériés spécifiques, fermetures exceptionnelles).
  \item Consulter l’historique des demandes traitées.
\end{itemize}

\subsection*{Espace employé}

L’employé peut :
\begin{itemize}
  \item Créer une demande de congé en sélectionnant un type, une période et un motif.
  \item Consulter l’historique de ses demandes et leur statut.
  \item Consulter ses informations personnelles et éventuellement certaines données relatives à ses droits restants.
\end{itemize}

\section{Besoins non fonctionnels}

Parmi les besoins non fonctionnels identifiés :
\begin{itemize}
  \item \textbf{Sécurité} : authentification sécurisée, gestion des rôles et des autorisations, protection des données.
  \item \textbf{Performance} : temps de réponse raisonnable malgré un volume croissant de données.
  \item \textbf{Scalabilité} : possibilité de supporter un nombre important d’utilisateurs.
  \item \textbf{Ergonomie} : interface claire, responsive et accessible sur différents terminaux.
\end{itemize}

\section{Modélisation UML}

La modélisation UML comprend notamment :
\begin{itemize}
  \item Un diagramme de cas d’utilisation présentant les interactions entre acteurs (administrateur, RH, employé) et fonctionnalités principales.
  \item Des diagrammes de séquence décrivant les scénarios clés (création d’un compte employé, demande de congé, traitement d’une demande).
  \item Un diagramme de classes représentant la structure des principales entités (Utilisateur, Employé, Département, Demande de congé, Événement).
\end{itemize}

\subsection{Diagramme de cas d'utilisation}

Le diagramme de cas d'utilisation suivant illustre les principales interactions entre les différents acteurs du système (Administrateur, Responsable RH, et Employé) et les fonctionnalités offertes par l'application RHPlus.

\begin{figure}[h!]
  \centering
  \begin{tikzpicture}[
    scale=0.75,
    every node/.style={transform shape},
    actor/.style={
      stick figure,
      minimum width=1cm,
      minimum height=2cm,
      fill=rhplus-secondary!20,
      draw=rhplus-primary,
      line width=1.5pt
    },
    usecase/.style={
      ellipse,
      draw=rhplus-secondary,
      fill=rhplus-light,
      line width=1pt,
      align=center,
      minimum width=3cm,
      minimum height=1cm,
      font=\small
    },
    system/.style={
      rectangle,
      draw=rhplus-primary,
      line width=2pt,
      minimum width=14cm,
      minimum height=18cm,
      fill=white
    },
    include/.style={
      ->,
      dashed,
      draw=rhplus-accent,
      line width=0.8pt
    },
    extend/.style={
      ->,
      dashed,
      draw=rhplus-warning,
      line width=0.8pt
    },
    association/.style={
      -,
      draw=rhplus-primary,
      line width=1pt
    }
  ]
  
  % Système
  \node[system] (system) at (8,-1) {};
  \node[above=0.5cm,font=\Large\bfseries,color=rhplus-primary] at (system.north) {RHPlus - Système de Gestion des Congés};
  
  % Acteurs à gauche
  \node[font=\small\bfseries,color=rhplus-primary] (admin) at (0,7) {\faUserShield};
  \node[below=0.2cm of admin,font=\small,color=rhplus-dark] {Administrateur};
  
  \node[font=\small\bfseries,color=rhplus-primary] (rh) at (0,-1) {\faUserTie};
  \node[below=0.2cm of rh,font=\small,color=rhplus-dark] {Responsable RH};
  
  \node[font=\small\bfseries,color=rhplus-primary] (emp) at (0,-9) {\faUser};
  \node[below=0.2cm of emp,font=\small,color=rhplus-dark] {Employé};
  
  % Cas d'utilisation - Administrateur
  \node[usecase] (uc1) at (6,8) {Gérer\\Départements};
  \node[usecase] (uc2) at (10,8) {Gérer comptes\\RH};
  \node[usecase] (uc3) at (8,6) {Consulter\\statistiques};
  
  % Cas d'utilisation - RH
  \node[usecase] (uc4) at (6,3) {Gérer\\Employés};
  \node[usecase] (uc5) at (10,3) {Créer compte\\Employé};
  \node[usecase] (uc6) at (6,1) {Traiter demandes\\de congé};
  \node[usecase] (uc7) at (10,1) {Approuver\\demande};
  \node[usecase] (uc8) at (10,-0.5) {Rejeter\\demande};
  \node[usecase] (uc9) at (6,-1) {Gérer\\Événements};
  \node[usecase] (uc10) at (10,-2.5) {Consulter\\historique};
  
  % Cas d'utilisation - Employé
  \node[usecase] (uc11) at (6,-5) {Créer demande\\de congé};
  \node[usecase] (uc12) at (10,-5) {Consulter\\solde congés};
  \node[usecase] (uc13) at (6,-7) {Consulter\\historique demandes};
  \node[usecase] (uc14) at (10,-7) {Modifier\\profil};
  
  % Cas d'utilisation - Communs
  \node[usecase,fill=rhplus-accent!20] (uc15) at (8,-9.5) {S'authentifier\\(2FA)};
  \node[usecase,fill=rhplus-accent!20] (uc16) at (13,-9.5) {Recevoir\\notifications};
  
  % Associations Administrateur
  \draw[association] (admin) -- (uc1);
  \draw[association] (admin) -- (uc2);
  \draw[association] (admin) -- (uc3);
  
  % Associations RH
  \draw[association] (rh) -- (uc4);
  \draw[association] (rh) -- (uc6);
  \draw[association] (rh) -- (uc9);
  \draw[association] (rh) -- (uc10);
  \draw[association] (rh) -- (uc3);
  
  % Associations Employé
  \draw[association] (emp) -- (uc11);
  \draw[association] (emp) -- (uc12);
  \draw[association] (emp) -- (uc13);
  \draw[association] (emp) -- (uc14);
  
  % Associations communes
  \draw[association] (admin) -- (uc15);
  \draw[association] (rh) -- (uc15);
  \draw[association] (emp) -- (uc15);
  
  \draw[association] (admin) -- (uc16);
  \draw[association] (rh) -- (uc16);
  \draw[association] (emp) -- (uc16);
  
  % Relations include
  \draw[include] (uc4) -- (uc5) node[midway,above,sloped,font=\tiny,color=rhplus-accent] {<<include>>};
  \draw[include] (uc6) -- (uc7) node[midway,above,sloped,font=\tiny,color=rhplus-accent] {<<include>>};
  \draw[include] (uc6) -- (uc8) node[midway,above,sloped,font=\tiny,color=rhplus-accent] {<<include>>};
  
  \end{tikzpicture}
  \caption{Diagramme de cas d'utilisation de l'application RHPlus}
  \label{fig:use_case}
\end{figure}

\vspace{0.5cm}

\begin{infobox}{Description des cas d'utilisation principaux}
\textbf{Espace Administrateur :}
\begin{itemize}[leftmargin=2em]
  \item[\textcolor{rhplus-secondary}{\faCheckCircle}] \textbf{Gérer Départements} : Créer, modifier, supprimer et consulter les départements
  \item[\textcolor{rhplus-secondary}{\faCheckCircle}] \textbf{Gérer comptes RH} : Administrer les comptes des responsables RH
  \item[\textcolor{rhplus-secondary}{\faCheckCircle}] \textbf{Consulter statistiques} : Accéder aux tableaux de bord et KPIs
\end{itemize}

\textbf{Espace Responsable RH :}
\begin{itemize}[leftmargin=2em]
  \item[\textcolor{rhplus-accent}{\faCheckCircle}] \textbf{Gérer Employés} : CRUD complet sur les employés
  \item[\textcolor{rhplus-accent}{\faCheckCircle}] \textbf{Traiter demandes} : Approuver ou rejeter les demandes de congé
  \item[\textcolor{rhplus-accent}{\faCheckCircle}] \textbf{Gérer Événements} : Définir jours fériés et fermetures
  \item[\textcolor{rhplus-accent}{\faCheckCircle}] \textbf{Consulter historique} : Accéder à l'historique complet des demandes
\end{itemize}

\textbf{Espace Employé :}
\begin{itemize}[leftmargin=2em]
  \item[\textcolor{rhplus-warning}{\faCheckCircle}] \textbf{Créer demande de congé} : Soumettre une nouvelle demande
  \item[\textcolor{rhplus-warning}{\faCheckCircle}] \textbf{Consulter solde} : Visualiser les jours disponibles
  \item[\textcolor{rhplus-warning}{\faCheckCircle}] \textbf{Consulter historique} : Suivre l'état de ses demandes
\end{itemize}

\textbf{Fonctionnalités communes :}
\begin{itemize}[leftmargin=2em]
  \item[\textcolor{rhplus-primary}{\faShieldAlt}] \textbf{Authentification 2FA} : Connexion sécurisée avec double facteur
  \item[\textcolor{rhplus-primary}{\faBell}] \textbf{Notifications} : Alertes temps réel et emails
\end{itemize}
\end{infobox}

%========================================================
% Chapitre 5 : Mise en œuvre de l'application
%========================================================
\chapter{Mise en œuvre de l’application}

\section{Architecture technique}

L’architecture de l’application s’appuie sur la stack MERN :
\begin{itemize}
  \item \textbf{MongoDB} pour la persistance des données.
  \item \textbf{Express.js} comme framework backend.
  \item \textbf{React.js} pour le frontend.
  \item \textbf{Node.js} comme environnement d’exécution côté serveur.
\end{itemize}

La communication entre le frontend et le backend se fait via une API REST sécurisée, et l’authentification est assurée par des JSON Web Tokens (JWT). 
Les notifications en temps réel sont gérées à l’aide de Socket.io, et certaines tâches récurrentes (par exemple la mise à jour de certains états ou l’envoi d’alertes) sont planifiées avec node-cron.

\section{Technologies utilisées}

\subsection*{Backend}

\begin{itemize}
  \item Node.js, Express.js
  \item MongoDB, Mongoose
  \item JSON Web Token (JWT) pour l’authentification
  \item Nodemailer / Handlebars pour l’envoi d’e-mails
  \item Socket.io pour les communications en temps réel
  \item node-cron pour la planification de tâches
\end{itemize}

\subsection*{Frontend}

\begin{itemize}
  \item React.js
  \item React Router pour la navigation
  \item Axios pour les appels HTTP
  \item Tailwind CSS pour le design
  \item i18next pour la gestion du multilingue
  \item date-fns pour la manipulation de dates
\end{itemize}

\section{Exemples de code backend}

\subsection{Schéma Mongoose pour un employé}

Le schéma suivant définit la structure d'un employé avec validation des données, soft delete et tous les champs nécessaires à la gestion RH :

\begin{lstlisting}[language=JavaScript, caption={Schéma Mongoose Employee avec validations}]
import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete';

const employeeSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.org$/.test(value);
        },
        message: "Format d'adresse e-mail invalide.",
      }
    },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpiredAt: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["RH", "employe"]
    },
    verificationEmail: { type: String, required: true },
    numeroDeContact: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return /^(\+212|0)([5-7])[0-9]{8}$/.test(value);
        },
        message: "Numéro invalide. Ex: +212612345678",
      }
    },
    dateDeRecrutement: { type: Date, default: Date.now },
    anneeDerniereMiseAJour: { type: Number, default: null },
    dateDeDepart: { type: Date, default: null },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
    },
    sexe: {
      type: String,
      enum: ['Homme', 'Femme'],
      required: true
    },
    situationFamiliale: {
      type: String,
      enum: ['célibataire', 'marié(e)', 'divorcé(e)'],
      default: 'célibataire'
    },
    nombreEnfants: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Plugin pour soft delete
employeeSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
\end{lstlisting}

\subsection{Schéma Mongoose pour une demande de congé}

Ce schéma gère les demandes de congé avec justificatifs, suivi du statut et traçabilité des approbations :

\begin{lstlisting}[language=JavaScript, caption={Schéma Mongoose Conge avec justificatifs}]
import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete';

const congeSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    nombreDeJours: { type: Number, required: true },
    motif: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DroitConge",
    },
    justificatif: [{ type: String, required: false }],
    status: {
      type: String,
      enum: ["en attente", "approuve", "refuse"],
      default: "en attente",
    },
    commentaire: { type: String, required: false },
    approuvePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },
    refusePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },
  },
  { timestamps: true }
);

// Plugin pour soft delete
congeSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all'
});

const Conge = mongoose.model("Conge", congeSchema);
export default Conge;
\end{lstlisting}

\subsection{Contrôleur pour créer une demande de congé}

Ce contrôleur gère la logique métier complète : vérifications, calculs, notifications email :

\begin{lstlisting}[language=JavaScript, caption={Contrôleur createLeaveRequest avec validations}]
import dayjs from "dayjs";
import transporter from '../../config/nodemailer.js';
import Conge from "../../models/congeModel.js";
import DroitConge from "../../models/droitCongeModel.js";
import Employee from '../../models/employeeModel.js';

export const createLeaveRequest = async (req, res) => {
  const employeeId = req.user.id;
  
  // Vérifier qu'il n'y a pas de demande en attente
  const existingPending = await Conge.findOne({
    employee: employeeId,
    status: "en attente",
  });

  if (existingPending) {
    return res.status(400).json({
      success: false,
      message: "Vous avez déjà une demande en attente.",
    });
  }

  const { date_debut, date_fin, motif, commentaire } = req.body;
  const justificatifs = req.files ? 
    req.files.map(f => f.filename) : [];

  if (!date_debut || !date_fin || !motif) {
    return res.status(400).json({
      success: false,
      message: 'Informations incomplètes.'
    });
  }

  if (date_debut > date_fin) {
    return res.status(400).json({
      success: false,
      message: 'Date de début doit être antérieure.'
    });
  }

  // Calcul du nombre de jours
  const nombreDeJoursDemande = 
    dayjs(date_fin).diff(dayjs(date_debut), 'day') + 1;
  
  // Vérifier les droits
  const droitConge = await DroitConge.findOne({
    _id: motif,
    employee: employeeId
  });

  if (!droitConge) {
    return res.status(400).json({
      message: "Droit de congé introuvable."
    });
  }
  
  if (droitConge.joursAutorisee - nombreDeJoursDemande < 0) {
    return res.status(400).json({
      message: "Pas assez de jours autorisés."
    });
  }

  try {
    const conge = new Conge({
      employee: employeeId,
      date_debut,
      date_fin,
      nombreDeJours: nombreDeJoursDemande,
      motif,
      commentaire,
      justificatif: justificatifs
    });

    await conge.save();
    await conge.populate({ path: 'motif', select: 'type' });

    // Envoyer email avec Handlebars
    const employee = await Employee.findById(conge.employee);
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: employee.verificationEmail,
      subject: 'Demande de congé enregistrée',
      template: 'leave_requested',
      context: {
        nom: employee.nom,
        prenom: employee.prenom,
        type: conge.motif.type,
        nombreDeJours: conge.nombreDeJours,
        date_debut: dayjs(conge.date_debut)
          .format('DD/MM/YYYY'),
        date_fin: dayjs(conge.date_fin)
          .format('DD/MM/YYYY'),
      },
    };
    transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Congé enregistré avec succès.',
      conge
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
\end{lstlisting}

\subsection{Middleware d'authentification JWT}

Le middleware suivant sécurise les routes en vérifiant le token JWT stocké dans les cookies :

\begin{lstlisting}[language=JavaScript, caption={Middleware d'authentification avec JWT}]
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Non autorise."
      });
    }

    const tokenDecoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    
    if (!tokenDecoded.id || !tokenDecoded.role) {
      return res.status(401).json({
        success: false,
        message: "Non autorise."
      });
    }

    req.user = {
      id: tokenDecoded.id,
      role: tokenDecoded.role,
      organisation: tokenDecoded.organisation,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Non autorise."
    });
  }
};
\end{lstlisting}

\subsection{Automatisation avec node-cron}

\begin{lstlisting}[language=JavaScript, caption={Mise a jour automatique des droits}]
import nodeCron from 'node-cron';
import DroitConge from '../models/droitCongeModel.js';

nodeCron.schedule('0 0 * * * *', async () => {
  const employees = await Employee.find();

  await Promise.all(employees.map(async (emp) => {
    const now = new Date();
    const recrutement = new Date(emp.dateDeRecrutement);
    const mois = (now.getFullYear() - recrutement.getFullYear()) * 12 
                 + (now.getMonth() - recrutement.getMonth());

    if (isEligibleForLeave(emp.dateDeRecrutement)) {
      let joursAnnuel = 18;
      const nb5ans = Math.floor(mois / 60);
      joursAnnuel += nb5ans * 1.5;
      joursAnnuel = Math.min(joursAnnuel, 30);

      await DroitConge.findOneAndUpdate(
        { employee: emp._id, type: 'annuel' },
        { joursAutorisee: joursAnnuel },
        { upsert: true }
      );
    }
  }));
});
\end{lstlisting}

\begin{successbox}{Points forts du backend}
\begin{itemize}[leftmargin=2em]
  \item[\textcolor{rhplus-accent}{\faCheckCircle}] Validation robuste des donnees
  \item[\textcolor{rhplus-accent}{\faCheckCircle}] Securite JWT et cookies HTTP-only
  \item[\textcolor{rhplus-accent}{\faCheckCircle}] Calcul automatique selon Code du Travail
  \item[\textcolor{rhplus-accent}{\faCheckCircle}] Emails avec templates Handlebars
\end{itemize}
\end{successbox}

%========================================================
% Chapitre 6 : Dockerisation de l'application
%========================================================
\chapter{Dockerisation de l’application}

\section{Objectifs de la dockerisation}

La dockerisation permet de packager les différentes composantes de l’application (frontend, backend, base de données) dans des conteneurs indépendants, facilement déployables et reproductibles. 
Elle facilite ainsi la mise en place d’environnements de développement, de test et de production cohérents, tout en réduisant les problèmes liés aux différences de configuration entre machines.

\section{Dockerfile du backend}

\begin{lstlisting}[language=Dockerfile, caption={Dockerfile pour le backend Node.js}]
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]
\end{lstlisting}

\section{Dockerfile du frontend}

\begin{lstlisting}[language=Dockerfile, caption={Dockerfile pour le frontend React}]
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
\end{lstlisting}

\section{Fichier \texttt{docker-compose.yml}}

\begin{lstlisting}[language=Yaml, caption={Fichier docker-compose pour orchestrer l'application}]
version: "3.9"

services:
  mongo:
    image: mongo:7
    container_name: rhplus-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    container_name: rhplus-backend
    restart: always
    environment:
      - MONGO_URI=mongodb://mongo:27017/rhplus
      - JWT_SECRET=changeme
      - NODE_ENV=production
      - PORT=5000
    ports:
      - "5000:5000"
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    container_name: rhplus-frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongo-data:
\end{lstlisting}

\section{Procédure de lancement}

Pour lancer l’application dockerisée, il suffit de :
\begin{enumerate}
  \item Placer le code du backend dans le dossier \texttt{backend} et le code du frontend dans le dossier \texttt{frontend}.
  \item Placer le fichier \texttt{docker-compose.yml} à la racine du projet.
  \item Exécuter la commande suivante :
  \begin{lstlisting}[language=bash]
docker-compose up --build
  \end{lstlisting}
  \item Accéder ensuite à l’interface web via \texttt{http://localhost:3000}.
\end{enumerate}

%========================================================
% Conclusion générale
%========================================================
\chapter{Conclusion générale}

Ce projet de fin de module a permis de concevoir et de réaliser une application web de gestion des congés basée sur la stack MERN, intégrant des mécanismes d’authentification sécurisée, de gestion des rôles, de suivi des demandes et de communications en temps réel. 
L’analyse et la conception ont mis en évidence l’importance d’une modélisation claire des entités métier et des règles de gestion, notamment en lien avec le cadre légal et les besoins des utilisateurs. 
La mise en œuvre technique, complétée par la dockerisation de l’application, offre une solution moderne, extensible et facilement déployable.

Plusieurs perspectives d’évolution sont envisageables : enrichissement des fonctionnalités RH (gestion des présences, des formations, des évaluations), intégration avec d’autres systèmes d’information de l’entreprise, ajout de fonctionnalités de reporting avancé ou encore amélioration continue de l’ergonomie et de l’accessibilité de l’interface. 
Ces pistes ouvrent la voie à la transformation de cette application de gestion des congés en une véritable plateforme de gestion des ressources humaines.

\end{document}
