import { useState } from "react";
import { Search, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import AddPatientDialog from "./AddPatientDialog";

const getStatusClass = (status) => {
  if (status === "Uncomfortable") return "status-uncomfortable";
  if (status === "Comfortable") return "status-comfortable";
  return "status-neutral";
};

const PatientTable = ({
  patients,
  onAddPatient,
  onEditPatient,
  onDeletePatient,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter((patient) => {
    const hn = patient.hn ?? "";
    const name = patient.name ?? "";
    return (
      hn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  return (
    <div className="medical-card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-lg">
            Patients Database
          </h3>
          <p className="text-muted-foreground text-sm">
            {patients.length} records
          </p>
        </div>

        <Button
          onClick={() => {
            setDialogMode("add");
            setSelectedPatient(null);
            setIsDialogOpen(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by HN or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background"
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>HN</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Height</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPatients.map((patient, index) => (
              <TableRow
                key={patient.id}
                className="hover:bg-muted/30"
              >
                <TableCell className="font-medium">
                  {index + 1}
                </TableCell>
                <TableCell>{patient.hn}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>
                  <span
                    className={
                      patient.gender === "Male"
                        ? "gender-male"
                        : "gender-female"
                    }
                  >
                    {patient.gender}
                  </span>
                </TableCell>
                <TableCell>
                  {patient.heightCm ? `${patient.heightCm} cm` : "-"}
                </TableCell>
                <TableCell>
                  {patient.weightKg ? `${patient.weightKg} kg` : "-"}
                </TableCell>
                <TableCell>{patient.room}</TableCell>
                <TableCell>
                  <span
                    className={`status-badge ${getStatusClass(
                      patient.status
                    )}`}
                  >
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        navigate(`/patients/${patient.id}`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setDialogMode("edit");
                        setSelectedPatient(patient);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeletePatient?.(patient.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddPatientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        initialData={selectedPatient}
        onSubmit={async (payload) => {
          if (dialogMode === "edit" && selectedPatient) {
            await onEditPatient?.(selectedPatient.id, payload);
          } else {
            await onAddPatient?.(payload);
          }
        }}
      />
    </div>
  );
};

export default PatientTable;
