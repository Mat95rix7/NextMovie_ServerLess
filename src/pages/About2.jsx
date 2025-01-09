import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Star, Ticket, Smartphone, Mail, Github, Linkedin, PlayCircle, Heart, Users } from 'lucide-react';

const AboutPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Cinéphile passionnée",
      content: "MovieApp a complètement changé ma façon de découvrir les films. L'interface est intuitive et les recommandations sont toujours pertinentes.",
      avatar: "/api/placeholder/64/64"
    },
    {
      name: "Lucas Martin",
      role: "Critique amateur",
      content: "Une application indispensable pour tous les amoureux du cinéma. La communauté est active et les discussions sont enrichissantes.",
      avatar: "/api/placeholder/64/64"
    },
    {
      name: "Sophie Bernard",
      role: "Blogueuse cinéma",
      content: "Je recommande MovieApp à tous mes lecteurs. C'est l'outil parfait pour organiser ses sorties cinéma et partager ses découvertes.",
      avatar: "/api/placeholder/64/64"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Motif de fond décoratif */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, gray 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}/>
      </div>

      <div className="relative z-10">
        {/* Hero Section améliorée */}
        <div className="relative overflow-hidden py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MovieApp
              </h1>
              <p className="text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
                Votre passerelle vers l'univers magique du cinéma
              </p>
              <div className="flex justify-center gap-4">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Découvrir
                </button>
                <button className="px-8 py-3 bg-white text-blue-600 rounded-full border-2 border-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Stats avec animation au scroll */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Camera className="w-6 h-6" />, number: "1000+", label: "Films", color: "blue" },
              { icon: <Users className="w-6 h-6" />, number: "50K+", label: "Utilisateurs", color: "purple" },
              { icon: <Ticket className="w-6 h-6" />, number: "100+", label: "Cinémas", color: "green" },
              { icon: <Heart className="w-6 h-6" />, number: "4.8★", label: "Note App", color: "pink" }
            ].map((stat, index) => (
              <div key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                <div className={`text-${stat.color}-500 mb-4`}>{stat.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Fonctionnalités améliorée */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <CardContent className="p-10">
              <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Une Expérience Cinéma Unique
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: <Camera className="w-8 h-8 text-blue-500" />,
                    title: "Catalogue Intelligent",
                    description: "Découvrez des films personnalisés selon vos goûts grâce à notre algorithme de recommandation avancé."
                  },
                  {
                    icon: <Star className="w-8 h-8 text-yellow-500" />,
                    title: "Communauté Active",
                    description: "Partagez vos critiques, créez des listes et échangez avec d'autres passionnés du cinéma."
                  },
                  {
                    icon: <Ticket className="w-8 h-8 text-green-500" />,
                    title: "Réservation Premium",
                    description: "Réservez vos séances en quelques clics et profitez d'offres exclusives avec nos partenaires."
                  },
                  {
                    icon: <Smartphone className="w-8 h-8 text-purple-500" />,
                    title: "Multi-Plateformes",
                    description: "Accédez à votre compte depuis n'importe quel appareil avec une expérience fluide et optimisée."
                  }
                ].map((feature, index) => (
                  <div key={index} 
                    className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 bg-white rounded-xl shadow-md">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800">
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
        </div>

        {/* Section Témoignages */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-10">
              <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ils adorent MovieApp
              </h2>
              <div className="relative">
                <div className="flex overflow-hidden">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} 
                      className={`w-full flex-shrink-0 transition-transform duration-500 transform ${
                        index === activeTestimonial ? 'translate-x-0' : 'translate-x-full'
                      }`}>
                      <div className="max-w-2xl mx-auto text-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full mx-auto mb-4"
                        />
                        <p className="text-xl text-gray-600 mb-6 italic">
                          "{testimonial.content}"
                        </p>
                        <h4 className="font-semibold text-gray-800">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Équipe améliorée */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-10">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative group w-64 h-64 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full transform group-hover:scale-105 transition-transform duration-500" />
                  <img 
                    src="/api/placeholder/256/256"
                    alt="Photo du créateur"
                    className="relative w-full h-full rounded-full object-cover p-2"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Thomas Martin
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed mb-8">
                    Passionné de cinéma depuis mon plus jeune âge, j'ai créé MovieApp avec la vision 
                    de révolutionner la façon dont nous découvrons et partageons notre amour du 7ème art. 
                    Développeur fullstack avec plus de 8 ans d'expérience, je mets mes compétences au 
                    service d'une expérience utilisateur exceptionnelle.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { icon: <Mail className="w-5 h-5" />, label: "Contact", href: "#" },
                      { icon: <Github className="w-5 h-5" />, label: "Projets", href: "#" },
                      { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", href: "#" }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                      >
                        {social.icon}
                        <span>{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">MovieApp</h3>
                <p className="text-gray-400">
                  Votre compagnon cinéma au quotidien
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Accueil</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Films</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                <p className="text-gray-400 mb-4">
                  Restez informé des dernières actualités
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Votre email"
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white flex-1"
                  />
                  <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              © 2024 MovieApp. Tous droits réservés.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;