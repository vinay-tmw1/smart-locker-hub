import React, { useState, useMemo } from 'react';
import type { Parcel } from '../types';
import { ParcelStatus } from '../types';
import { BoxIcon, ChevronDownIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';

interface UserParcelManagementProps {
  parcels: Parcel[];
  onUpdateParcel: (parcelId: string, newStatus: ParcelStatus) => void;
}

type SortKey = 'sender' | 'lastUpdate';
type SortDirection = 'asc' | 'desc';

const ParcelCard: React.FC<{ 
    parcel: Parcel; 
    onUpdateParcel: (parcelId: string, newStatus: ParcelStatus) => void;
    isExpanded: boolean;
    onToggleExpand: (parcelId: string) => void;
}> = ({ parcel, onUpdateParcel, isExpanded, onToggleExpand }) => {
  const canExpand = [ParcelStatus.IN_LOCKER, ParcelStatus.DELIVERED, ParcelStatus.RETURNED].includes(parcel.status);

  return (
    <div className="bg-slate-800/70 rounded-lg border border-slate-700 transition-all duration-300">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-700 p-3 rounded-lg hidden sm:block">
            <BoxIcon className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="font-bold text-white">{parcel.sender}</p>
            <p className="text-sm text-slate-400 font-mono">{parcel.id}</p>
            <p className="text-xs text-slate-500">Last Update: {parcel.lastUpdate}</p>
          </div>
        </div>
        
        {parcel.status === ParcelStatus.AWAITING_APPROVAL ? (
          <div className="flex gap-2 self-end sm:self-center">
            <button 
              onClick={() => onUpdateParcel(parcel.id, ParcelStatus.IN_LOCKER)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 text-sm rounded-md transition-colors">
              Approve
            </button>
            <button 
              onClick={() => onUpdateParcel(parcel.id, ParcelStatus.RETURNED)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 text-sm rounded-md transition-colors">
              Reject
            </button>
          </div>
        ) : canExpand ? (
             <button 
                onClick={() => onToggleExpand(parcel.id)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700 transition-colors self-end sm:self-center"
                aria-label="Toggle details"
             >
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
             </button>
        ) : null}
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded && canExpand ? 'max-h-48' : 'max-h-0'}`}>
        <div className="border-t border-slate-700 p-4 pt-3">
          <h4 className="font-semibold text-slate-200 mb-2">Parcel Details</h4>
          <ul className="text-sm space-y-1 text-slate-400">
              <li><strong>Sender:</strong> <span className="text-slate-200">{parcel.sender}</span></li>
              <li><strong>Recipient:</strong> <span className="text-slate-200">{parcel.recipient}</span></li>
              <li><strong>Locker ID:</strong> <span className="font-mono text-cyan-400">{parcel.lockerId || 'N/A'}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};


const UserParcelManagement: React.FC<UserParcelManagementProps> = ({ parcels, onUpdateParcel }) => {
  const [expandedParcels, setExpandedParcels] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('lastUpdate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleToggleExpand = (parcelId: string) => {
    setExpandedParcels(prev => {
        const newSet = new Set(prev);
        if (newSet.has(parcelId)) {
            newSet.delete(parcelId);
        } else {
            newSet.add(parcelId);
        }
        return newSet;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedParcels = useMemo(() => {
    return [...parcels].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'lastUpdate') {
        comparison = new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
      } else { // sender
        comparison = a.sender.localeCompare(b.sender);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [parcels, sortKey, sortDirection]);


  const awaitingApproval = sortedParcels.filter(p => p.status === ParcelStatus.AWAITING_APPROVAL);
  const upcoming = sortedParcels.filter(p => p.status === ParcelStatus.UPCOMING);
  const inLocker = sortedParcels.filter(p => p.status === ParcelStatus.IN_LOCKER);
  const history = sortedParcels.filter(p => [ParcelStatus.DELIVERED, ParcelStatus.RETURNED].includes(p.status));

  const renderParcelList = (parcelList: Parcel[], emptyMessage: string) => (
    <div className="flex flex-col gap-3">
      {parcelList.length > 0 ? (
        parcelList.map(p => 
            <ParcelCard 
                key={p.id} 
                parcel={p} 
                onUpdateParcel={onUpdateParcel}
                isExpanded={expandedParcels.has(p.id)}
                onToggleExpand={handleToggleExpand}
            />
        )
      ) : (
        <p className="text-slate-500">{emptyMessage}</p>
      )}
    </div>
  );

  const SortButton: React.FC<{ label: string; sortKeyName: SortKey }> = ({ label, sortKeyName }) => {
    const isActive = sortKey === sortKeyName;
    return (
        <button 
            onClick={() => handleSort(sortKeyName)} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${isActive ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700/50'}`}
        >
            {label}
            {isActive && (
                sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
            )}
        </button>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end items-center gap-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
          <span className="text-sm font-medium text-slate-400">Sort by:</span>
          <SortButton label="Sender" sortKeyName="sender" />
          <SortButton label="Date" sortKeyName="lastUpdate" />
      </div>

      <div className="flex flex-col gap-8">
        <section>
          <h3 className="text-xl font-semibold text-amber-400 mb-3">Awaiting Approval</h3>
          {renderParcelList(awaitingApproval, "No parcels are awaiting your approval.")}
        </section>

        <section>
          <h3 className="text-xl font-semibold text-sky-400 mb-3">Upcoming</h3>
          {renderParcelList(upcoming, "You have no upcoming deliveries.")}
        </section>

        <section>
          <h3 className="text-xl font-semibold text-green-400 mb-3">Stored / In Locker</h3>
          {renderParcelList(inLocker, "You have no parcels currently in a locker.")}
        </section>

        <section>
          <h3 className="text-xl font-semibold text-slate-400 mb-3">History</h3>
          {renderParcelList(history, "You have no delivered or returned parcels.")}
        </section>
      </div>
    </div>
  );
};

export default UserParcelManagement;