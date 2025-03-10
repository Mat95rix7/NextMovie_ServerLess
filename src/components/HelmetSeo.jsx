import { Helmet } from "react-helmet-async";

const HelmetSeo = () => {
    return (
        <Helmet>
            <title>NextMovie - Découvrez les meilleurs films à voir</title>
            <meta name="description" content="NextMovie - Découvrez les films à l'affiche, les plus populaires et les prochaines sorties. Votre compagnon cinéma au quotidien !" />
            <meta name="keywords" content="NextMovie, cinéma, films, actualité cinéma, sorties cinéma, bandes-annonces, critiques films, acteurs, réalisateurs, films en salle, nouveautés, action, comédie, drame, science-fiction, horreur, thriller, films 2025" />
            <meta name="author" content="Mat95rix7" />
            <meta name="robots" content="index, follow" />
            <meta property="og:title" content="NextMovie - Les meilleurs films à découvrir" />
            <meta property="og:description" content="Découvrez les meilleurs films à voir : sorties cinéma, films populaires et bandes-annonces exclusives sur NextMovie !" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://nextmoviez.vercel.app/" />
            <meta property="og:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="NextMovie - Découvrez les meilleurs films à voir" />
            <meta name="twitter:description" content="Explorez les films à l'affiche, les plus populaires et les prochaines sorties sur NextMovie." />
            <meta name="twitter:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
            <link rel="canonical" href="https://nextmoviez.vercel.app/" />
      </Helmet>
    );
};

export default HelmetSeo;