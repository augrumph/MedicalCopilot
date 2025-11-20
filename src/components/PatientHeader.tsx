import React from 'react';
import { User } from 'lucide-react';

interface PatientHeaderProps {
  name: string;
  age?: number;
  gender?: string;
  diagnosis?: string;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({
  name,
  age,
  gender,
  diagnosis
}) => {
  // Generate a random background color for the initial
  const getInitialColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center space-x-6 mb-8">
      <div className={`${getInitialColor(name)} w-20 h-20 rounded-full flex items-center justify-center`}>
        <span className="text-3xl font-bold">{initial}</span>
      </div>
      <div>
        <h1 className="text-4xl font-bold">{name}</h1>
        <div className="flex space-x-4 mt-2">
          {age && <span className="text-xl text-gray-300">{age} anos</span>}
          {gender && <span className="text-xl text-gray-300">{gender}</span>}
        </div>
        {diagnosis && (
          /* Sea green for success/positive info */
          <p className="text-lg text-[#2e8b57] mt-2">Diagnóstico: {diagnosis}</p>
        )}
      </div>
    </div>
  );
};

export default PatientHeader;