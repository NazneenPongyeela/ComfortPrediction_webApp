import { Wind, Thermometer, Activity, Heart } from "lucide-react";

const MeasurementCards = ({ windSpeed, skinTemp, tonic, lfhf }) => {
  const measurements = [
    {
      label: "Wind Speed",
      value: windSpeed,
      unit: "m/s",
      icon: <Wind className="w-5 h-5" />,
      color: "text-medical-teal",
    },
    {
      label: "Skin Temp",
      value: skinTemp,
      unit: "°C",
      icon: <Thermometer className="w-5 h-5" />,
      color: "text-medical-orange",
    },
    {
      label: "Tonic",
      value: tonic,
      unit: "μS",
      icon: <Activity className="w-5 h-5" />,
      color: "text-medical-blue",
    },
    {
      label: "LF/HF",
      value: lfhf,
      unit: "μS",
      icon: <Heart className="w-5 h-5" />,
      color: "text-medical-green",
    },
  ];

  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">
          Latest Measurements
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {measurements.map((measurement, index) => (
          <div
            key={index}
            className="bg-background rounded-lg p-4 border border-border/50"
          >
            <div className="flex justify-between items-start mb-2">
              <span className={measurement.color}>
                {measurement.icon}
              </span>
              <span className="text-xs text-muted-foreground">
                {measurement.unit}
              </span>
            </div>

            <p className="text-muted-foreground text-xs mb-1">
              {measurement.label}
            </p>

            <p className={`text-2xl font-bold ${measurement.color}`}>
              {measurement.value ?? "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementCards;
