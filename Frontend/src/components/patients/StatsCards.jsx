import { Users } from "lucide-react";

const StatsCards = ({ totalPatients, malePatients, femalePatients }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="stat-card stat-card-teal">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">Total Patients</p>
            <p className="text-4xl font-bold mt-1">{totalPatients}</p>
          </div>
          <Users className="w-8 h-8 opacity-60" />
        </div>
      </div>

      <div className="stat-card stat-card-teal">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">Male Patients</p>
            <p className="text-4xl font-bold mt-1">{malePatients}</p>
          </div>
          <Users className="w-8 h-8 opacity-60" />
        </div>
      </div>

      <div className="stat-card stat-card-pink">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">Female Patients</p>
            <p className="text-4xl font-bold mt-1">{femalePatients}</p>
          </div>
          <Users className="w-8 h-8 opacity-60" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
