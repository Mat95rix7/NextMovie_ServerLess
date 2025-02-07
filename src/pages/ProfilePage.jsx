// import { useState, useEffect } from "react";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "../config/firebase";
// import ProfileHeader from "../components/profile/ProfileHeader";
// import UsernameSection from "../components/profile/UsernameSection";
// import PasswordSection from "../components/profile/PasswordSection";
// import ProfilePhotoSection from "../components/profile/ProfilePhotoSection";
// import UserStats from "../components/profile/UserStats";
// import { useAuth2 } from "../context/userContext";
// import { Settings, User, Lock, Camera, ChevronRight, Loader2 } from "lucide-react";
// import PropTypes from "prop-types";

// const SettingsCard = ({ icon: Icon, title, description, children, isOpen, onClick }) => (
//   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
//     <div className="flex items-center justify-between p-6 cursor-pointer" onClick={onClick}>
//       <div className="flex items-center space-x-4">
//         <div className="p-2 bg-amber-50 rounded-lg">
//           <Icon className="h-6 w-6 text-amber-500" />
//         </div>
//         <div>
//           <h3 className="text-lg font-medium text-gray-900">{title}</h3>
//           <p className="text-sm text-gray-600">{description}</p>
//         </div>
//       </div>
//       <ChevronRight 
//         className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} 
//       />
//     </div>
//     <div className={`border-t border-gray-100 transition-all duration-200 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
//       <div className="p-6 bg-amber-50">{children}</div>
//     </div>
//   </div>
// );

// SettingsCard.propTypes = {
//   icon: PropTypes.elementType.isRequired,
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   children: PropTypes.node.isRequired,
//   isOpen: PropTypes.bool.isRequired,
//   onClick: PropTypes.func.isRequired,
// };

// export function ProfilePage() {
//   const [activeTab, setActiveTab] = useState("films");
//   const [openSection, setOpenSection] = useState("");
//   const [profileData, setProfileData] = useState({ 
//     profile: null, 
//     displayName: "", 
//     stats: null,
//     profilePhotoUrl: null
//    });
//   const [loading, setLoading] = useState(true);
//   const { user, setUser } = useAuth2();

//   useEffect(() => {
//     setOpenSection("");
//   }, [activeTab]);
  
//   useEffect(() => {
//     if (!user?.uid) {
//       setLoading(false);
//       return;
//     }

//     const userRef = doc(db, "users", user.uid);
    
//     const unsubscribe = onSnapshot(userRef, (snapshot) => {
//       if (!snapshot.exists()) {
//         setLoading(false);
//         return;
//       }

//       const userData = snapshot.data();
//       setProfileData({ 
//         profile: userData, 
//         displayName: userData?.displayName || "", 
//         stats: userData?.stats || null,
//         profilePhotoUrl: userData?.profilePhotoUrl || null });
//       setLoading(false);
//     }, (error) => {
//       console.error("Erreur lors du chargement du profil:", error);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [user?.uid]);

//   const handleProfileUpdate = (newDisplayName) => {
//     setProfileData((prev) => ({ ...prev, displayName: newDisplayName }));
//     setUser((prev) => ({ ...prev, displayName: newDisplayName }));
//   };

//   if (!user) return (
//     <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4">
//       <p className="text-gray-600 text-center">Vous devez être connecté pour accéder à votre profil</p>
//     </div>
//   );

//   if (loading) return (
//     <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
//       <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
//       <p className="text-gray-600">Chargement de votre profil...</p>
//     </div>
//   );

//   const { displayName, stats } = profileData;

//   return (
//     <div className="min-h-screen pt-20">
//     <div className="max-w-6xl mx-auto px-4 space-y-6 pb-12">
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//         {/* Onglets style marque-page avec grand arrondi */}
//         <div className="flex px-3 pt-4 bg-amber-50">
//           <div className="flex flex-1 gap-1 min-h-[48px]">
//           {["profil", "films"].map((tab) => (
//             <button key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`
//                 relative flex w-1/2 py-3
//                 justify-center
//                 text-xl
//                 rounded-t-xl
//                 border-black border-b-0 
//                 transition-all duration-200
//                 before:absolute before:top-0 before:left-0 before:w-full before:h-full 
//                 before:border-b before:border-gray-50
//                 ${activeTab === tab 
//                   ? "bg-amber-400 text-gray-700 font-bold z-10 " 
//                   : "bg-amber-100/50 text-gray-600 hover:bg-amber-100"
//                 }
//               `}
//             >
//                {tab === "films" ? "Mes Films" : "Mon Profil"}
//             </button>
//           ))}
//             <div className="flex-grow border-b border-gray-200"></div>
//           </div>
//         </div>
        
//         <div className="bg-white">
//           <ProfileHeader user={user} displayName={displayName} />

//           {/* Contenu des onglets */}
//           {activeTab === "films" && (
//             <div className="p-6 space-y-4">
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//                 <UserStats stats={stats} className="p-6 bg-gray-50 border-b border-gray-100" />
//               </div>
//             </div>
//           )}
//           {activeTab === "profil" && (
//             <div className="p-6 space-y-4">
//               <div className="space-y-6">
//                 <div className="flex items-center space-x-3">
//                   <Settings className="h-6 w-6 text-amber-600" />
//                   <h1 className="text-2xl font-semibold text-gray-900">Paramètres du profil</h1>
//                 </div>
                
//                 <div className="space-y-4">
                    
//                   <SettingsCard
//                     icon={Camera}
//                     title="Photo de profil"
//                     description="Modifiez votre photo de profil"
//                     isOpen={openSection === "photo"}
//                     onClick={() => setOpenSection(openSection === "photo" ? null : "photo")}
//                   >
//                     <ProfilePhotoSection 
//                       isOpen={openSection === "photo"} 
//                       profilePhotoUrl={profileData.profilePhotoUrl} 
//                     />
//                   </SettingsCard>

//                   <SettingsCard
//                     icon={User}
//                     title="Nom d'utilisateur"
//                     description="Modifiez votre nom d'affichage"
//                     isOpen={openSection === "username"}
//                     onClick={() => setOpenSection(openSection === "username" ? null : "username")}
//                   >
//                     <UsernameSection user={user} onDisplayNameUpdate={handleProfileUpdate} isOpen={openSection === "username"} />
//                   </SettingsCard>

//                   <SettingsCard
//                     icon={Lock}
//                     title="Mot de passe"
//                     description="Mettez à jour votre mot de passe"
//                     isOpen={openSection === "password"}
//                     onClick={() => setOpenSection(openSection === "password" ? null : "password")}
//                   >
//                     <PasswordSection isOpen={openSection === "password"} />
//                   </SettingsCard>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// );
// }

// export default ProfilePage;


import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import ProfileHeader from "../components/profile/ProfileHeader";
import UsernameSection from "../components/profile/UsernameSection";
import PasswordSection from "../components/profile/PasswordSection";
import ProfilePhotoSection from "../components/profile/ProfilePhotoSection";
import UserStats from "../components/profile/UserStats";
import { useAuth2 } from "../context/userContext";
import { Settings, User, Lock, Camera, ChevronRight, Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const TabButton = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`
      relative flex-1 py-3
      text-xl font-medium rounded-t-xl
      transition-all duration-300 ease-in-out
      ${active 
        ? "text-gray-900 bg-amber-400 font-bold" 
        : "text-gray-600 hover:text-gray-900 bg-amber-100 hover:bg-amber-50"
      }
    `}
  >
    {label}
    {active && (
      <div 
        className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 
        transform transition-all duration-300 ease-in-out"
      />
    )}
  </button>
);

TabButton.propTypes = {
  active: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const SettingsCard = ({ icon: Icon, title, description, children, isOpen, onClick }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
    <div className="flex items-center justify-between p-6 cursor-pointer" onClick={onClick}>
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-amber-50 rounded-lg">
          <Icon className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <ChevronRight 
        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} 
      />
    </div>
    <div className={`border-t border-gray-100 transition-all duration-200 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
      <div className="p-6 bg-amber-50">{children}</div>
    </div>
  </div>
);

SettingsCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("films");
  const [openSection, setOpenSection] = useState("");
  const [profileData, setProfileData] = useState({ 
    profile: null, 
    displayName: "", 
    stats: null,
    profilePhotoUrl: null
   });
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth2();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOpenSection("");
  };

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) {
        setLoading(false);
        return;
      }

      const userData = snapshot.data();
      setProfileData({ 
        profile: userData, 
        displayName: userData?.displayName || "", 
        stats: userData?.stats || null,
        profilePhotoUrl: userData?.profilePhotoUrl || null 
      });
      setLoading(false);
    }, (error) => {
      console.error("Erreur lors du chargement du profil:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleProfileUpdate = (newDisplayName) => {
    setProfileData((prev) => ({ ...prev, displayName: newDisplayName }));
    setUser((prev) => ({ ...prev, displayName: newDisplayName }));
  };

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4">
      <p className="text-gray-600 text-center">Vous devez être connecté pour accéder à votre profil</p>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      <p className="text-gray-600">Chargement de votre profil...</p>
    </div>
  );

  const { displayName, stats } = profileData;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 space-y-6 pb-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    
          {/* Navigation avec animation */}
          <div className="w-full">
            <div className="flex mx-3">
              <TabButton
                active={activeTab === "profil"}
                label="Mon Profil"
                onClick={() => handleTabChange("profil")}
              />
              <TabButton
                active={activeTab === "films"}
                label="Mes Films"
                onClick={() => handleTabChange("films")}
              />
            </div>
          </div>

          <ProfileHeader user={user} displayName={displayName} />

          {/* Contenu des onglets avec transition */}
          <div className="bg-white transition-all duration-300 ease-in-out">
            {activeTab === "films" && (
              <div className="p-6 space-y-4 animate-fadeIn">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <UserStats stats={stats} className="p-6 bg-gray-50 border-b border-gray-100" />
                </div>
              </div>
            )}
            
            {activeTab === "profil" && (
              <div className="p-6 space-y-4 animate-fadeIn">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-6 w-6 text-amber-600" />
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Paramètres du profil
                    </h1>
                  </div>
                  
                  <div className="space-y-4">
                    <SettingsCard
                      icon={Camera}
                      title="Photo de profil"
                      description="Modifiez votre photo de profil"
                      isOpen={openSection === "photo"}
                      onClick={() => setOpenSection(openSection === "photo" ? null : "photo")}
                    >
                      <ProfilePhotoSection 
                        isOpen={openSection === "photo"} 
                        profilePhotoUrl={profileData.profilePhotoUrl} 
                      />
                    </SettingsCard>

                    <SettingsCard
                      icon={User}
                      title="Nom d'utilisateur"
                      description="Modifiez votre nom d'affichage"
                      isOpen={openSection === "username"}
                      onClick={() => setOpenSection(openSection === "username" ? null : "username")}
                    >
                      <UsernameSection 
                        user={user} 
                        onDisplayNameUpdate={handleProfileUpdate} 
                        isOpen={openSection === "username"} 
                      />
                    </SettingsCard>

                    <SettingsCard
                      icon={Lock}
                      title="Mot de passe"
                      description="Mettez à jour votre mot de passe"
                      isOpen={openSection === "password"}
                      onClick={() => setOpenSection(openSection === "password" ? null : "password")}
                    >
                      <PasswordSection isOpen={openSection === "password"} />
                    </SettingsCard>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;