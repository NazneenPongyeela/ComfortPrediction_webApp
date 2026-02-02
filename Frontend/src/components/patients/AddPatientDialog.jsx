import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const emptyFormData = {
  hn: "",
  room: "",
  name: "",
  age: "",
  height: "",
  weight: "",
  gender: "",
};

const AddPatientDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = "add",
}) => {
  const [formData, setFormData] = useState(emptyFormData);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        hn: initialData?.hn ?? "",
        room: initialData?.room ?? "",
        name: initialData?.name ?? "",
        age: initialData?.age ?? "",
        height: initialData?.heightCm ?? "",
        weight: initialData?.weightKg ?? "",
        gender: initialData?.genderValue ?? "",
      });
        setErrorMessage("");
    }
  }, [open, initialData]);

  const validateForm = () => {
    const hn = formData.hn.trim();
    const room = formData.room.trim();
    const name = formData.name.trim();
    const age = Number(formData.age);
    const height = Number(formData.height);
    const weight = Number(formData.weight);
    const gender = formData.gender?.trim();

    if (!hn || !room || !name || !gender) {
      return "Please fill in all required fields.";
    }

    if (Number.isNaN(age) || age < 0 || age > 120) {
      return "Please enter a valid age.";
    }

    if (Number.isNaN(height) || height <= 0) {
      return "Please enter a valid height.";
    }

    if (Number.isNaN(weight) || weight <= 0) {
      return "Please enter a valid weight.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSubmit) {
      onOpenChange(false);
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await onSubmit({
        hospital_number: formData.hn.trim(),
        room: formData.room.trim(),
        full_name: formData.name.trim(),
        age: Number(formData.age),
        height_cm: Number(formData.height),
        weight_kg: Number(formData.weight),
        gender: formData.gender.trim().toLowerCase(),
      });
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save patient. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Edit Patient" : "Add New Patient"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter the patient's information below. All fields are required.
          </p>
          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hn">HN (Hospital Number)</Label>
              <Input
                id="hn"
                value={formData.hn}
                onChange={(e) =>
                  setFormData({ ...formData, hn: e.target.value })
                }
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button><Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Add Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
