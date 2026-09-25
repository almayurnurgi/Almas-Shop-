import React, { useState, useEffect } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { testFirebaseConnection } from '../../lib/firebase';
import firebaseConfig from '../../../firebase-applet-config.json';

export const FirebaseStatusBar: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(false);

  const checkStatus = async () => {
    setChecking(true);
    const ok = await testFirebaseConnection();
    setIsConnected(ok);
    setChecking(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202020] border border-gray-700/60 text-[11px] text-gray-200">
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-[#5DD62C] opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-[#5DD62C]' : 'bg-amber-500'}`}></span>
      </span>
      <Database className="w-3 h-3 text-[#5DD62C]" />
      <span className="font-semibold text-white">Firestore</span>
      <span className="text-gray-400 hidden sm:inline truncate max-w-[130px]">
        {firebaseConfig.projectId}
      </span>
      <button
        onClick={checkStatus}
        disabled={checking}
        title="Verificar sincronização com Firebase"
        className="text-gray-400 hover:text-white transition p-0.5 ml-0.5"
      >
        <RefreshCw className={`w-2.5 h-2.5 ${checking ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};
