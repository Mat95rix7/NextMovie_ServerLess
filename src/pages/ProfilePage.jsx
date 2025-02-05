// import { useState, useEffect } from "react";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "../config/firebase";
// import ProfileHeader from "../components/profile/ProfileHeader";
// import UsernameSection from "../components/profile/UsernameSection";
// import PasswordSection from "../components/profile/PasswordSection";
// import { Toaster } from "react-hot-toast";
// import UserStats from "../components/profile/UserStats";
// import { useAuth2 } from "../context/userContext";
// import { Settings, User, Lock, ChevronRight, Loader2 } from "lucide-react";

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

// export function ProfilePage() {
//   const [activeTab, setActiveTab] = useState("films");
//   const [openSection, setOpenSection] = useState("");
//   const [profileData, setProfileData] = useState({ profile: null, displayName: "", stats: null });
//   const [loading, setLoading] = useState(true);
//   const { user, setUser } = useAuth2();

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
//       setProfileData({ profile: userData, displayName: userData?.displayName || "", stats: userData?.stats || null });
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

//   if (!user) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4">
//         <p className="text-gray-600 text-center">Vous devez être connecté pour accéder à votre profil</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
//         <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
//         <p className="text-gray-600">Chargement de votre profil...</p>
//       </div>
//     );
//   }

//   const { displayName, stats } = profileData;

//   return (
//     <div className="min-h-screen pt-20">
//       <div className="max-w-6xl mx-auto px-4 space-y-6 pb-12">
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//           {/* Onglets */}
//           <div className="flex border-b border-gray-100">
//             <button
//               className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === "films" ? "text-amber-700 border-b-2 border-amber-700" : "text-gray-500 hover:text-gray-700"}`}
//               onClick={() => setActiveTab("films")}
//             >
//               Mes Films
//             </button>
//             <button
//               className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === "profil" ? "text-amber-700 border-b-2 border-amber-700" : "text-gray-500 hover:text-gray-700"}`}
//               onClick={() => setActiveTab("profil")}
//             >
//               Mon Profil
//             </button>
//           </div>
//           <ProfileHeader user={user} displayName={displayName} className="border-b border-gray-100" />

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
//   );
// };

// export default ProfilePage;
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import ProfileHeader from "../components/profile/ProfileHeader";
import UsernameSection from "../components/profile/UsernameSection";
import PasswordSection from "../components/profile/PasswordSection";
import { Toaster } from "react-hot-toast";
import UserStats from "../components/profile/UserStats";
import { useAuth2 } from "../context/userContext";
import { Settings, User, Lock, ChevronRight, Loader2 } from "lucide-react";

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


export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("films");
  const [openSection, setOpenSection] = useState("");
  const [profileData, setProfileData] = useState({ profile: null, displayName: "", stats: null });
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth2();

  
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
      setProfileData({ profile: userData, displayName: userData?.displayName || "", stats: userData?.stats || null });
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
        {/* Onglets style marque-page avec grand arrondi */}
        <div className="flex px-6 pt-4 bg-amber-50">
          <div className="flex flex-1 gap-1 min-h-[48px]">
          {["profil", "films"].map((tab) => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                relative flex w-1/2 py-3
                justify-center
                rounded-t-xl
                border border-b-0 
                transition-all duration-200
                before:absolute before:top-0 before:left-0 before:w-full before:h-full 
                before:border-b before:border-gray-50
                ${activeTab === tab 
                  ? "bg-amber-400 text-gray-700 font-bold z-10 " 
                  : "bg-amber-100/50 text-gray-600 hover:bg-amber-100"
                }
              `}
            >
               {tab === "films" ? "Mes Films" : "Mon Profil"}
            </button>
          ))}
            <div className="flex-grow border-b border-gray-200"></div>
          </div>
        </div>

        {/* ProfileHeader et reste du contenu */}
        <div className="bg-white">
          <ProfileHeader user={user} displayName={displayName} />

          {/* Contenu des onglets */}
          {activeTab === "films" && (
            <div className="p-6 space-y-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <UserStats stats={stats} className="p-6 bg-gray-50 border-b border-gray-100" />
              </div>
            </div>
          )}
          {activeTab === "profil" && (
            <div className="p-6 space-y-4">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Settings className="h-6 w-6 text-amber-600" />
                  <h1 className="text-2xl font-semibold text-gray-900">Paramètres du profil</h1>
                </div>
                
                <div className="space-y-4">
                  <SettingsCard
                    icon={User}
                    title="Nom d'utilisateur"
                    description="Modifiez votre nom d'affichage"
                    isOpen={openSection === "username"}
                    onClick={() => setOpenSection(openSection === "username" ? null : "username")}
                  >
                    <UsernameSection user={user} onDisplayNameUpdate={handleProfileUpdate} isOpen={openSection === "username"} />
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