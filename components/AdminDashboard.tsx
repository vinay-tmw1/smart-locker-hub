import React, { useState, useMemo } from 'react';
import { TEAMS, PARCELS as initialParcels } from '../constants';
import type { Parcel } from '../types';
import { ParcelStatus } from '../types';
import { ElevatorIcon, BroomIcon, WrenchScrewdriverIcon, InventoryIcon, ClipboardListIcon } from './Icons';

const InsightCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}> = ({ icon, title, value, change, changeType }) => {
  const changeColor = {
    increase: 'text-red-400',
    decrease: 'text-green-400',
    neutral: 'text-slate-400',
  }[changeType];

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex-1">
      <div className="flex items-center gap-4">
        <div className="bg-slate-700 p-3 rounded-lg">{icon}</div>
        <div>
          <h3 className="text-slate-400 font-medium">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className={`text-sm font-medium ${changeColor}`}>{change}</p>
        </div>
      </div>
    </div>
  );
};

const lockerBlueprints = [
    { name: '7-Locker Tower', specs: '3S, 2M, 2L Lockers', sheetMetal: 2, components: { 'Smart Locks': 7, 'Microcontrollers': 1, 'RGB Strips': 7, 'Weight Sensors': 7 } },
    { name: 'Kiosk Tower', specs: '22" Touchscreen, 1S, 1M, 1L', sheetMetal: 1.5, components: { 'Smart Locks': 3, 'Microcontrollers': 1, '22" Touchscreen': 1, 'PC': 1, 'QR Scanner': 1 } },
    { name: 'XL Tower', specs: '2 Extra-Large Lockers', sheetMetal: 2.5, components: { 'Smart Locks': 2, 'Microcontrollers': 1 } },
    { name: 'XXL Tower', specs: '1 Super-Large Locker', sheetMetal: 2.5, components: { 'Smart Locks': 1, 'Microcontrollers': 1 } },
    { name: 'Hot/Cold Unit', specs: '6 Temp-controlled', sheetMetal: 3, components: { 'Smart Locks': 6, 'Temp Modules': 6, 'Microcontrollers': 2 } },
];

const inventory = {
    'Sheet Metal': 500,
    'Smart Locks': 2500,
    'Microcontrollers': 800,
    'RGB Strips': 3000,
    'Weight Sensors': 3000,
    '22" Touchscreen': 150,
    'PC': 150,
    'QR Scanner': 150,
    'Temp Modules': 200
};

const AdminDashboard: React.FC = () => {
    const [buildOrder, setBuildOrder] = useState<{ [key: string]: number }>({});
    const [parcels, setParcels] = useState<Parcel[]>(initialParcels);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('New client request submitted for review!');
        (e.target as HTMLFormElement).reset();
    };

    const handleOrderChange = (name: string, value: number) => {
        setBuildOrder(prev => ({...prev, [name]: Math.max(0, value) }));
    };

    const handleUpdateParcelStatus = (parcelId: string, newStatus: ParcelStatus) => {
        setParcels(prevParcels =>
            prevParcels.map(p =>
                p.id === parcelId
                    ? { ...p, status: newStatus, lastUpdate: new Date().toLocaleString('en-US', {dateStyle: 'short', timeStyle: 'short'}) }
                    : p
            )
        );
    };

    const requiredBOM = useMemo(() => {
        const bom: { [key: string]: number } = {};
        for (const [name, quantity] of Object.entries(buildOrder)) {
            if (quantity > 0) {
                const blueprint = lockerBlueprints.find(b => b.name === name);
                if (blueprint) {
                    bom['Sheet Metal'] = (bom['Sheet Metal'] || 0) + blueprint.sheetMetal * quantity;
                    for (const [comp, count] of Object.entries(blueprint.components)) {
                        bom[comp] = (bom[comp] || 0) + count * quantity;
                    }
                }
            }
        }
        return bom;
    }, [buildOrder]);

    // FIX: Added missing ParcelStatus values to satisfy the type.
    const statusColors: { [key in ParcelStatus]: string } = {
        [ParcelStatus.RECEIVED]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        [ParcelStatus.SANITIZING]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        [ParcelStatus.IN_LOCKER]: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        [ParcelStatus.DELIVERED]: 'bg-green-500/20 text-green-300 border-green-500/30',
        [ParcelStatus.RETURNED]: 'bg-red-500/20 text-red-300 border-red-500/30',
        [ParcelStatus.AWAITING_APPROVAL]: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        [ParcelStatus.UPCOMING]: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    };
    
    const formInputClasses = "w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors";


  return (
    <main className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-2xl flex flex-col gap-8">
      {/* Section 1: Live Building Insights */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Live Building Insights</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <InsightCard
            icon={<ElevatorIcon className="w-6 h-6 text-sky-400" />}
            title="Elevator Usage (Today)"
            value="157 Trips"
            change="▲ 22% from yesterday"
            changeType="increase"
          />
          <InsightCard
            icon={<BroomIcon className="w-6 h-6 text-amber-400" />}
            title="Housekeeping Status"
            value="Alert"
            change="Lobby requires cleaning due to rain"
            changeType="neutral"
          />
        </div>
      </section>
      
      {/* Section: Parcel Management */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><ClipboardListIcon className="w-6 h-6" /> Parcel Management</h2>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Parcel ID</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Locker ID</th>
                            <th scope="col" className="px-6 py-3">Recipient</th>
                            <th scope="col" className="px-6 py-3">Last Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map((parcel) => (
                            <tr key={parcel.id} className="border-b border-slate-700 hover:bg-slate-800/40">
                                <td className="px-6 py-4 font-mono text-cyan-400">{parcel.id}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={parcel.status}
                                        onChange={(e) => handleUpdateParcelStatus(parcel.id, e.target.value as ParcelStatus)}
                                        className={`w-full p-2 rounded-md border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 ${statusColors[parcel.status]}`}
                                    >
                                        {Object.values(ParcelStatus).filter(s => ![ParcelStatus.AWAITING_APPROVAL, ParcelStatus.UPCOMING].includes(s)).map(status => (
                                            <option key={status} value={status} className="bg-slate-800 text-white">{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4">{parcel.lockerId || 'N/A'}</td>
                                <td className="px-6 py-4">{parcel.recipient}</td>
                                <td className="px-6 py-4">{parcel.lastUpdate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </section>

      {/* Section: Manufacturing & Inventory */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><WrenchScrewdriverIcon className="w-6 h-6" /> Manufacturing & Inventory</h2>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Locker Tower Blueprints</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {lockerBlueprints.map(bp => (
                    <div key={bp.name} className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 transition-colors hover:border-cyan-400/50">
                       <h4 className="font-bold text-cyan-400">{bp.name}</h4>
                       <p className="text-sm text-slate-300">{bp.specs}</p>
                       <p className="text-xs text-slate-400 mt-2">Requires: {bp.sheetMetal} sheets</p>
                    </div>
                ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><InventoryIcon className="w-5 h-5" /> Live Inventory</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(inventory).map(([name, count]) => (
                          <div key={name} className="bg-slate-700/50 p-3 rounded-md">
                              <p className="text-sm text-slate-300">{name}</p>
                              <p className="font-bold text-lg text-white">{count.toLocaleString()}</p>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col">
                  <h3 className="text-xl font-semibold text-white mb-4">New Build Order (BOM Calculator)</h3>
                  <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-4">
                     {lockerBlueprints.map(bp => (
                         <div key={bp.name}>
                             <label htmlFor={bp.name} className="block text-sm font-medium text-slate-300 mb-1">{bp.name}</label>
                             <input type="number" id={bp.name} name={bp.name} min="0" 
                             className={formInputClasses} placeholder="0" 
                             value={buildOrder[bp.name] || ''}
                             onChange={(e) => handleOrderChange(bp.name, parseInt(e.target.value) || 0)}
                             />
                         </div>
                     ))}
                  </div>
                   {Object.keys(requiredBOM).length > 0 && (
                      <div className="bg-slate-800 mt-4 p-4 rounded-lg border border-slate-600">
                          <h4 className="font-semibold text-white mb-2">Required Components (Bill of Materials)</h4>
                          <ul className="text-sm text-slate-300 grid grid-cols-2 gap-x-4 gap-y-1">
                              {Object.entries(requiredBOM).map(([name, count]) => (
                                  <li key={name} className="truncate">- {name}: <span className="font-bold text-amber-400">{count.toLocaleString()}</span></li>
                              ))}
                          </ul>
                      </div>
                  )}
              </div>
          </div>
        </div>
      </section>

      {/* Section 2: Company Directory */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Company Directory</h2>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <div className="flex flex-wrap gap-3">
                {TEAMS.map(team => (
                    <span key={team} className="bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1.5 rounded-full">
                        {team}
                    </span>
                ))}
            </div>
        </div>
      </section>

      {/* Section 3: New Client Onboarding */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">New Client Onboarding</h2>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="wings" className="block text-sm font-medium text-slate-300 mb-2">Number of Wings/Towers</label>
                    <input type="number" id="wings" name="wings" className={formInputClasses} placeholder="e.g., 3" required />
                </div>
                 <div>
                    <label htmlFor="floors" className="block text-sm font-medium text-slate-300 mb-2">Floors per Wing</label>
                    <input type="number" id="floors" name="floors" className={formInputClasses} placeholder="e.g., 25" required />
                </div>
                 <div>
                    <label htmlFor="apartments" className="block text-sm font-medium text-slate-300 mb-2">Apartments per Floor</label>
                    <input type="number" id="apartments" name="apartments" className={formInputClasses} placeholder="e.g., 4" required />
                </div>
                 <div>
                    <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">Building Location</label>
                    <input type="text" id="location" name="location" className={formInputClasses} placeholder="e.g., Andheri West, Mumbai" required />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="demographics" className="block text-sm font-medium text-slate-300 mb-2">Resident Demographics / Gentry</label>
                    <textarea id="demographics" name="demographics" rows={3} className={formInputClasses} placeholder="Describe the target audience (e.g., working professionals, families, high-income)..."></textarea>
                </div>
                <div className="md:col-span-2 text-right mt-2">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;