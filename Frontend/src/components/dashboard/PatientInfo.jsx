import { User, Building, Calendar, Ruler, Scale } from "lucide-react";

const getDefaultAvatar = (gender) => {
  if (gender === "Male") return "👨";
  if (gender === "Female") return "👩";
  return "👤";
};

const PatientInfo = ({
  hn,
  room,
  name,
  gender,
  age,
  height,
  weight,
  avatarUrl,
}) => {
  return (
    <div className="medical-card flex-1">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">
          Patient Information
        </h3>
      </div>

      <div className="flex gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center overflow-hidden border-4 border-card shadow-md">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl">
                {getDefaultAvatar(gender)}
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <Building className="w-3 h-3" />
              Hospital Number
            </div>
            <p className="font-semibold text-foreground">{hn}</p>
          </div>

          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <Building className="w-3 h-3" />
              Room
            </div>
            <p className="font-semibold text-foreground">{room}</p>
          </div>

          <div className="col-span-2">
            <div className="text-muted-foreground text-xs mb-1">
              Patient Name
            </div>
            <p className="font-semibold text-foreground text-lg">
              {name}
            </p>
          </div>

          <div>
            <div className="text-muted-foreground text-xs mb-1">
              Gender
            </div>
            <p className="font-medium text-foreground flex items-center gap-2">
              <span
                className={
                  gender === "Male" ? "gender-male" : "gender-female"
                }
              >
                {gender}
              </span>
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <Calendar className="w-3 h-3" />
              Age
            </div>
            <p className="font-semibold text-foreground">
              {age} years
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <Ruler className="w-3 h-3" />
              Height
            </div>
            <p className="font-semibold text-foreground">
              {height}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
              <Scale className="w-3 h-3" />
              Weight
            </div>
            <p className="font-semibold text-foreground">
              {weight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
