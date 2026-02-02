import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCards from "@/components/patients/StatsCards";
import ComfortChart from "@/components/patients/ComfortChart";
import PatientTable from "@/components/patients/PatientTable";

const mockPatients = [
  {
    id: "1",
    hn: "HN001",
    name: "มูโน่ สหจันทนะ",
    age: 20,
    gender: "Male",
    height: "158 cm",
    weight: "51.25 kg",
    room: "A101",
    status: "Very Uncomfortable",
  },
  {
    id: "2",
    hn: "HN002",
    name: "กลค ปิยฐานหล",
    age: 20,
    gender: "Female",
    height: "157 cm",
    weight: "58.95 kg",
    room: "A102",
    status: "Very Uncomfortable",
  },
  {
    id: "3",
    hn: "HN003",
    name: "ปราชญ์ วงศ์ศิลี่",
    age: 19,
    gender: "Female",
    height: "148 cm",
    weight: "42.15 kg",
    room: "A103",
    status: "Uncomfortable",
  },
  {
    id: "4",
    hn: "HN004",
    name: "แบม น่าเสรม",
    age: 21,
    gender: "Female",
    height: "154 cm",
    weight: "43.95 kg",
    room: "A104",
    status: "Neutral",
  },
  {
    id: "5",
    hn: "HN005",
    name: "ลา เคล้า",
    age: 20,
    gender: "Female",
    height: "162 cm",
    weight: "70 kg",
    room: "A105",
    status: "Very comfortable",
  },
  {
    id: "6",
    hn: "HN006",
    name: "ลาจุบ บุทองลบ",
    age: 20,
    gender: "Male",
    height: "172 cm",
    weight: "100.5 kg",
    room: "A106",
    status: "Very comfortable",
  },
];

const PatientManagementPage = () => {
  const maleCount = mockPatients.filter((p) => p.gender === "Male").length;
  const femaleCount = mockPatients.filter((p) => p.gender === "Female").length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Patient Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor patient records
          </p>
        </div>

        <StatsCards
          totalPatients={mockPatients.length}
          malePatients={maleCount}
          femalePatients={femaleCount}
        />

        <ComfortChart />

        <PatientTable patients={mockPatients} />
      </div>
    </DashboardLayout>
  );
};

export default PatientManagementPage;
