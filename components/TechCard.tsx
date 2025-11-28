import React from 'react';
import type { Locker, Feature } from '../types';
import { LockerStatus } from '../types';
import { PackageIcon, LockOpenIcon, SnowflakeIcon, FlameIcon, UvIcon } from './Icons';

interface LockerCardProps {
  locker: Locker;
  isNearby: boolean;
  onOpen: (id: number) => void;
}

const FeatureIcon: React.FC<{ feature: Feature }> = ({ feature }) => {
  switch (feature) {
    case 'cold':
      return <SnowflakeIcon className="w-4 h-4 text-blue-400" />;
    case 'hot':
      return <FlameIcon className="w-4 h-4 text-red-400" />;
    case 'uv':
      return <UvIcon className="w-4 h-4 text-purple-400" />;
    default:
      return null;
  }
};

const LockerCard: React.FC<LockerCardProps> = ({ locker, isNearby, onOpen }) => {
  const { id, status, parcelInfo, features } = locker;

  const isUserParcel = status === LockerStatus.OCCUPIED_USER;
  const canOpen = isUserParcel && isNearby;

  const baseClasses = "relative bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 ease-in-out p-4 flex flex-col justify-between aspect-square";
  
  const statusClasses: { [key in LockerStatus]: { border: string; text: string; shadow?: string } } = {
    [LockerStatus.AVAILABLE]: { border: 'border-slate-600', text: 'text-slate-400' },
    [LockerStatus.OCCUPIED_USER]: { border: 'border-cyan-400', text: 'text-cyan-300', shadow: 'hover:shadow-cyan-400/30' },
    [LockerStatus.OCCUPIED_OTHER]: { border: 'border-slate-700', text: 'text-slate-500' },
    [LockerStatus.SANITIZING]: { border: 'border-purple-500', text: 'text-purple-400', shadow: 'hover:shadow-purple-500/30 animate-pulse' },
  };
  
  const currentStatusStyle = statusClasses[status];
  
  return (
    <div className={`${baseClasses} border ${currentStatusStyle.border} ${currentStatusStyle.shadow || ''}`}>
      <div className="flex justify-between items-start">
        <div className={`font-bold text-lg ${currentStatusStyle.text}`}>
          {id.toString().padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          {features.map(f => <FeatureIcon key={f} feature={f} />)}
        </div>
      </div>

      <div className="text-center my-2 flex-grow flex flex-col items-center justify-center">
        {isUserParcel && <PackageIcon className="w-10 h-10 text-cyan-400 mb-2" />}
        <p className={`font-semibold text-lg ${currentStatusStyle.text}`}>{status}</p>
        {isUserParcel && <p className="text-slate-400 text-sm">{parcelInfo}</p>}
        {status === LockerStatus.SANITIZING && <div className="w-full bg-purple-900 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-purple-500 h-1 w-full animate-pulse"></div></div>}
      </div>

      <div className="h-12">
        {canOpen && (
          <button
            onClick={() => onOpen(id)}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
            aria-label={`Open locker ${id}`}
          >
            <LockOpenIcon className="w-5 h-5" />
            <span>Open</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LockerCard;