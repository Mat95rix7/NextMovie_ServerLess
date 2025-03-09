import { Helmet } from "react-helmet-async";

const HelmetSeo = () => {
    return (
        <Helmet>
            <title>NextMovie - Découvrez les meilleurs films à voir</title>
            <meta name="description" content="Explorez les films à l'affiche, les plus populaires et les prochaines sorties sur NextMovie" />
            <meta name="keywords" content="nextmovie, cinéma, films, actualité cinéma, films récents, films à venir, critiques de films, bandes-annonces, TMDb, films populaires, acteurs, réalisateurs, films en salle, nouveautés cinéma, film d'action, comédies, drames, films de science-fiction, films d'horreur, critiques cinéma, cinéma 2025" />
            <meta name="author" content="Mat95rix7" />
            <meta property="og:title" content="NextMovie - Les meilleurs films à découvrir" />
            <meta property="og:description" content="Découvrez notre collection de films populaires, bien notés et à venir" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://nextmoviez.vercel.app/" />
            <meta property="og:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
            <meta name="twitter:card" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
            <meta name="twitter:title" content="NextMovie - Découvrez les meilleurs films à voir" />
            <meta name="twitter:description" content="Explorez les films à l'affiche, les plus populaires et les prochaines sorties sur NextMovie." />
            <meta name="twitter:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
            <link rel="canonical" href="https://nextmoviez.vercel.app/" />
      </Helmet>
    );
};

export default HelmetSeo;