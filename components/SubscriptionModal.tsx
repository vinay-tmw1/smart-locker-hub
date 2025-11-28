import React, { useState } from 'react';
import { PLANS } from '../constants';
import type { FamilyMember } from '../types';
import { CloseIcon, UsersIcon } from './Icons';

interface SubscriptionModalProps {
  onClose: () => void;
  familyMembers: FamilyMember[];
  onAddMember: (name: string) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, familyMembers, onAddMember }) => {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
        aria-modal="true" 
        role="dialog"
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
            Manage Your Plan
        </h2>
        <p className="text-center text-slate-400 mb-8">Choose a plan that fits your needs. 1 Credit = 1 Parcel.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {PLANS.map(plan => (
            <div key={plan.name} className={`relative p-6 rounded-xl border transition-all duration-300 flex flex-col ${plan.highlight ? 'bg-sky-900/50 border-sky-500' : 'bg-slate-900/50 border-slate-700'}`}>
              {plan.highlight && <div className="absolute top-0 right-4 -mt-3 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="text-3xl font-bold my-4 text-white">₹{plan.price}<span className="text-lg font-medium text-slate-400">/{plan.type.slice(0,2).toLowerCase()}</span></p>
              <ul className="space-y-2 text-slate-300 mb-6">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`mt-auto w-full font-bold py-2 px-4 rounded-lg transition-colors ${plan.highlight ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}>
                Select Plan
              </button>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-white"><UsersIcon className="w-7 h-7 text-cyan-400"/> Family Plan</h3>
          <p className="text-slate-400 mb-4">Add family members to your plan to share credits. Get <span className="font-bold text-amber-400">5 bonus credits</span> for each new member added to a monthly or yearly plan!</p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-200 mb-2">Current Members</h4>
              <ul className="bg-slate-800 p-3 rounded-lg space-y-2">
                {familyMembers.map(member => (
                  <li key={member.id} className="text-slate-300">{member.name}</li>
                ))}
                {familyMembers.length === 0 && <p className="text-slate-500">No members yet.</p>}
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-200 mb-2">Add a New Member</h4>
              <form onSubmit={handleAddMemberSubmit} className="flex items-center gap-2">
                <input 
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Member's Name or Nickname"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add</button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionModal;
