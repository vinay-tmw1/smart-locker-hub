import React, { useState } from 'react';
import LockerCard from './components/TechCard';
import SubscriptionModal from './components/SubscriptionModal';
import AdminDashboard from './components/AdminDashboard';
import UserParcelManagement from './components/UserParcelManagement';
import UserFamilyPlan from './components/UserFamilyPlan';
import { LOCKERS as initialLockers, USER_PARCELS } from './constants';
import type { Locker, FamilyMember, Parcel } from './types';
import { LockerStatus, ParcelStatus } from './types';
import { SignalIcon, CreditIcon, DashboardIcon, LayoutGridIcon, BoxIcon, UsersIcon } from './components/Icons';

type UserViewTab = 'lockers' | 'parcels' | 'family';

const App: React.FC = () => {
  const [lockers, setLockers] = useState<Locker[]>(initialLockers);
  const [isNearby, setIsNearby] = useState(false);
  const [credits, setCredits] = useState(12);
  const [userParcels, setUserParcels] = useState<Parcel[]>(USER_PARCELS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: 1, name: 'Spouse' },
    { id: 2, name: 'Child' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [activeUserTab, setActiveUserTab] = useState<UserViewTab>('lockers');

  const handleOpenLocker = (id: number) => {
    setLockers(prevLockers =>
      prevLockers.map(locker =>
        locker.id === id ? { ...locker, status: LockerStatus.AVAILABLE, parcelInfo: undefined } : locker
      )
    );
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSimulateDelivery = () => {
    const availableLocker = lockers.find(l => l.status === LockerStatus.AVAILABLE);
    if (availableLocker) {
      setLockers(prevLockers =>
        prevLockers.map(l =>
          l.id === availableLocker.id
            ? { ...l, status: LockerStatus.OCCUPIED_USER, parcelInfo: 'New Amazon Parcel' }
            : l
        )
      );
      showNotification(`WhatsApp SIM: Your parcel has arrived in Locker ${availableLocker.id}.`);
    } else {
      showNotification("No available lockers for a new delivery.");
    }
  };

  const addFamilyMember = (name: string) => {
    const newMember: FamilyMember = { id: Date.now(), name };
    setFamilyMembers(prev => [...prev, newMember]);
    setCredits(prev => prev + 5); // Bonus for adding a member
    showNotification(`Added ${name} to your plan! You received 5 bonus credits.`);
  };

  const editFamilyMember = (id: number, newName: string) => {
    setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, name: newName } : m));
    showNotification(`Updated member details.`);
  };

  const deleteFamilyMember = (id: number) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
    showNotification(`Removed member from your plan.`);
  };

  const handleUpdateUserParcelStatus = (parcelId: string, newStatus: ParcelStatus) => {
    setUserParcels(prevParcels =>
      prevParcels.map(p =>
        p.id === parcelId
          ? { ...p, status: newStatus, lastUpdate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) }
          : p
      )
    );
     if (newStatus === ParcelStatus.IN_LOCKER) {
        showNotification(`Parcel ${parcelId} approved and is being moved to a locker.`);
    } else if (newStatus === ParcelStatus.RETURNED) {
        showNotification(`Parcel ${parcelId} was rejected.`);
    }
  };

  const renderUserContent = () => {
    switch (activeUserTab) {
      case 'lockers':
        return (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg gap-4">
              <div className="flex items-center gap-3">
                <SignalIcon className={`w-6 h-6 transition-colors ${isNearby ? 'text-blue-400' : 'text-slate-500'}`} />
                <div>
                  <h2 className="font-semibold text-lg text-slate-200">Locker Proximity Access</h2>
                  <p className="text-sm text-slate-400">Simulates being 4-6 ft away to enable locker access.</p>
                </div>
              </div>
              <label htmlFor="proximity-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    id="proximity-toggle"
                    type="checkbox"
                    className="sr-only"
                    checked={isNearby}
                    onChange={() => setIsNearby(!isNearby)}
                  />
                  <div className="block bg-slate-700 w-14 h-8 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
                </div>
              </label>
              <style>{`
                #proximity-toggle:checked + .relative .dot {
                  transform: translateX(24px);
                }
                #proximity-toggle:checked + .relative div:first-of-type {
                    background-color: #38bdf8;
                }
              `}</style>
              <button
                onClick={handleSimulateDelivery}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Simulate New Parcel Delivery
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {lockers.map((locker) => (
                <LockerCard
                  key={locker.id}
                  locker={locker}
                  isNearby={isNearby}
                  onOpen={handleOpenLocker}
                />
              ))}
            </div>
          </>
        );
      case 'parcels':
        return <UserParcelManagement parcels={userParcels} onUpdateParcel={handleUpdateUserParcelStatus} />;
      case 'family':
        return <UserFamilyPlan
          familyMembers={familyMembers}
          onAddMember={addFamilyMember}
          onEditMember={editFamilyMember}
          onDeleteMember={deleteFamilyMember}
          onManagePlanClick={() => setIsModalOpen(true)}
        />;
      default:
        return null;
    }
  }

  const UserTabButton: React.FC<{ tab: UserViewTab, label: string, icon: React.ReactNode }> = ({ tab, label, icon }) => (
      <button 
        onClick={() => setActiveUserTab(tab)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeUserTab === tab ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
      >
        {icon}
        {label}
      </button>
  );

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-gray-100 p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div
          className="absolute top-0 left-0 w-full h-full bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]">
        </div>

        {notification && (
          <div className="fixed top-5 z-50 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
            {notification}
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto relative z-10">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
              Smart Locker Hub
            </h1>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
                <button onClick={() => setView('user')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${view === 'user' ? 'bg-sky-500 text-white' : 'hover:bg-slate-700'}`}>
                  User View
                </button>
                <button onClick={() => setView('admin')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${view === 'admin' ? 'bg-sky-500 text-white' : 'hover:bg-slate-700'}`}>
                  <DashboardIcon className="w-4 h-4" />
                  Admin
                </button>
              </div>
              {view === 'user' && (
                  <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg">
                    <CreditIcon className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-white">{credits}</span>
                    <span className="text-sm text-slate-400">Credits</span>
                </div>
              )}
            </div>
          </header>

          {view === 'user' ? (
            <main className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-2xl">
              <div className="mb-6 border-b border-slate-700 pb-4 flex flex-wrap gap-2">
                  <UserTabButton tab="lockers" label="Lockers" icon={<LayoutGridIcon className="w-4 h-4"/>} />
                  <UserTabButton tab="parcels" label="Parcels" icon={<BoxIcon className="w-4 h-4"/>} />
                  <UserTabButton tab="family" label="Family Plan" icon={<UsersIcon className="w-4 h-4"/>} />
              </div>
              {renderUserContent()}
            </main>
          ) : (
            <AdminDashboard />
          )}

          <footer className="text-center mt-8 text-slate-500">
            <p>This is a demo interface for a smart locker solution.</p>
          </footer>
        </div>
      </div>
      {isModalOpen && <SubscriptionModal
        onClose={() => setIsModalOpen(false)}
        familyMembers={familyMembers}
        onAddMember={addFamilyMember}
      />}
    </>
  );
};

export default App;
