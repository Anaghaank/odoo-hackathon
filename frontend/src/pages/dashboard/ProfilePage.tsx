import React from 'react';
import { User, Shield, Terminal, Fingerprint, LogOut, Key, Activity } from 'lucide-react';

const ProfilePage: React.FC = () => {
    let user = { name: 'Commander Admin', login: 'admin-alpha' };
    try {
        const userString = localStorage.getItem('core_user');
        if (userString) {
            user = JSON.parse(userString);
        }
    } catch (e) {
        console.error("Error parsing user from localStorage", e);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 border-4 border-white/10 flex items-center justify-center p-2 relative z-10 overflow-hidden group">
                        <User className="w-24 h-24 text-white" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Terminal className="w-8 h-8 text-white animate-pulse" />
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-green-500 w-12 h-12 rounded-2xl border-4 border-[#020617] flex items-center justify-center shadow-xl z-20">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black font-display text-blue-500 uppercase tracking-[0.4em] mb-2">Authenticated Operator</div>
                        <h1 className="text-6xl font-black text-white tracking-tighter leading-none">{user.name}</h1>
                        <p className="text-slate-500 font-bold text-xl tracking-tight">Access Level: <span className="text-white">Supreme Override</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                <div className="glass-card p-10 rounded-[3rem] border-white/10 space-y-8 relative overflow-hidden group">
                    <div className="absolute items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Fingerprint className="w-6 h-6 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Biometric Credentials</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Universal Identity</div>
                            <div className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300 font-bold">{user.login}</div>
                        </div>
                        <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
                            <Key className="w-4 h-4" /> Reset Flux Key
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-10 rounded-[3rem] border-white/10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Neural Activity</h2>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-[3rem] border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                                <LogOut className="w-6 h-6 text-red-500 group-hover:text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">Sever Link</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
