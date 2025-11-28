import React, { useState } from 'react';
import type { FamilyMember } from '../types';
import { EditIcon, TrashIcon, UserIcon } from './Icons';

interface UserFamilyPlanProps {
  familyMembers: FamilyMember[];
  onAddMember: (name: string) => void;
  onEditMember: (id: number, newName: string) => void;
  onDeleteMember: (id: number) => void;
  onManagePlanClick: () => void;
}

const UserFamilyPlan: React.FC<UserFamilyPlanProps> = ({ familyMembers, onAddMember, onEditMember, onDeleteMember, onManagePlanClick }) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember && editingMember.name.trim()) {
        onEditMember(editingMember.id, editingMember.name.trim());
        setEditingMember(null);
    }
  };

  const cancelEdit = () => {
    setEditingMember(null);
  }

  const formInputClasses = "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500";


  return (
    <div className="flex flex-col gap-8">
      {/* Current Plan Section */}
      <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h3 className="text-xl font-semibold text-white">Your Current Plan: <span className="text-cyan-400">Monthly</span></h3>
                <p className="text-slate-400">You have a recurring monthly subscription with rollover credits.</p>
            </div>
            <button 
                onClick={onManagePlanClick}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg transition-colors whitespace-nowrap">
                Change Plan
            </button>
        </div>
      </section>

      {/* Member Management Section */}
      <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">Family Members</h3>
        <div className="flex flex-col gap-3 mb-6">
            {familyMembers.map(member => (
                <div key={member.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                    {editingMember?.id === member.id ? (
                        <form onSubmit={handleEditSubmit} className="flex-grow flex items-center gap-2">
                            <input
                                type="text"
                                value={editingMember.name}
                                onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                                className={formInputClasses}
                                autoFocus
                            />
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md">Save</button>
                            <button type="button" onClick={cancelEdit} className="bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-md">Cancel</button>
                        </form>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-5 h-5 text-slate-400" />
                                <span className="text-slate-200">{member.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingMember(member)} className="text-slate-400 hover:text-sky-400 p-1 rounded-md" aria-label={`Edit ${member.name}`}>
                                    <EditIcon className="w-5 h-5"/>
                                </button>
                                <button onClick={() => onDeleteMember(member.id)} className="text-slate-400 hover:text-red-400 p-1 rounded-md" aria-label={`Delete ${member.name}`}>
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
             {familyMembers.length === 0 && <p className="text-slate-500">No members yet. Add one below!</p>}
        </div>

        <div>
            <h4 className="font-semibold text-slate-200 mb-2">Add a New Member</h4>
             <p className="text-sm text-slate-400 mb-3">Get <span className="font-bold text-amber-400">5 bonus credits</span> for each member added to a monthly/yearly plan.</p>
            <form onSubmit={handleAddSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Member's Name or Nickname"
                className={formInputClasses}
                required
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add</button>
            </form>
        </div>
      </section>
    </div>
  );
};

export default UserFamilyPlan;
