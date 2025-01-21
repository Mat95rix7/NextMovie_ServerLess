import { Card, CardContent } from '@/components/ui/card';
import { Camera, Star, Ticket, Smartphone, Mail, Github, Linkedin } from 'lucide-react';
import Mat95rix7 from '../assets/profile.jpg'

const AboutPage = () => {
  return (
    <div className="min-h-screen  py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section avec animation */}
        <div className="text-center mb-16 transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-400 mb-6">
            MovieApp
          </h1>
          <p className="text-2xl text-amber-600 max-w-2xl mx-auto leading-relaxed">
          Votre passerelle vers l&apos;univers magique du cinéma
          </p>
        </div>

        {/* Section Stats */}
        <div className="grid grid-cols-2  md:grid-cols-4 gap-4 mb-16">
          {[
            { number: "1000+", label: "Films" },
            { number: "50K+", label: "Utilisateurs" },
            { number: "100+", label: "Cinémas" },
            { number: "4.8★", label: "Note App" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-2xl font-bold text-amber-600">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section Fonctionnalités */}
        <Card className="mb-16 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-amber-600">
              Fonctionnalités Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Camera className="w-8 h-8 text-blue-500" />,
                  title: "Films à l'affiche",
                  description: "Accédez aux dernières sorties et aux classiques du cinéma"
                },
                {
                  icon: <Star className="w-8 h-8 text-yellow-500" />,
                  title: "Notes & Critiques",
                  description: "Partagez votre avis et découvrez les recommandations de la communauté"
                },
                {
                  icon: <Ticket className="w-8 h-8 text-green-500" />,
                  title: "Réservation Simple",
                  description: "Réservez vos places en quelques clics"
                },
                {
                  icon: <Smartphone className="w-8 h-8 text-purple-500" />,
                  title: "100% Responsive",
                  description: "Une expérience optimale et fluide  sur tous vos appareils"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section Créateur */}
        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-44 h-48 rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                  <img 
                    src={Mat95rix7}
                    alt="Photo du créateur"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl text-center font-bold text-amber-600 mb-4">
                  NAADJI Djamel ( Mat95rix7 )
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Développeur fullstack passionné par le cinéma et l&apos;expérience utilisateur. 
                  Dans le cadre de ma formation en tant que concepteur developpeur d&apos;applications, j&apos;ai décidé de créer <span className='font-bold text-amber-600'>MovieApp</span> pour révolutionner la façon dont nous découvrons et apprécions le cinéma.
                </p>
                <div className="flex gap-4 justify-center">
                  {[
                    { icon: <Mail className="w-5 h-5" />, label: "Email", href: "mailto:ndjam71@gmail.com" },
                    { icon: <Github className="w-5 h-5" />, label: "GitHub", href: "https://github.com/Mat95rix7" },
                    { icon: <Linkedin className="w-5 h-5 " />, label: "LinkedIn", href: "https://www.linkedin.com/in/naadji-djamel"}
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300"
                    >
                      {social.icon}
                      <span className='text-amber-700'>{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;