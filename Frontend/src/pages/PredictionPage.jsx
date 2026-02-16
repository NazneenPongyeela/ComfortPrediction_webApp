import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, ClipboardList } from "lucide-react";
import { useState } from "react";
import { predictComfort } from "@/lib/api";

const PredictionPage = () => {
  const [formData, setFormData] = useState({
    hn: "",
    bmi: "",
    skinTemp: "",
    windSpeed: "",
    temperature: "",
    humidity: "",
    edaTonic: "",
    edaPhasic: "",
    hfNEcg: "",
    lfNEcg: "",
    lfhfRatio: "",
    allergic: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizePrediction = (value) => {
    if (typeof value === "number") {
      return value === 1 ? "Comfortable" : "Uncomfortable";
    }
    if (typeof value === "string" && value.trim()) {
      const normalized = value.trim().toLowerCase();
      if (normalized === "comfortable" || normalized === "comfort") {
        return "Comfortable";
      }
      if (normalized === "uncomfortable" || normalized === "discomfort") {
        return "Uncomfortable";
      }
      return value;
    }
    return null;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPredictionStyle = (result) => {
    if (result === "Comfortable") {
      return {
        emoji: "🙂",
        bgClass: "bg-green-500",
        textClass: "text-green-600",
      };
    }
    return {
      emoji: "😟",
      bgClass: "bg-orange-500",
      textClass: "text-orange-600",
    };
  };

  const handlePredict = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const skinTemp = parseFloat(formData.skinTemp) || 0;
      const bmi = parseFloat(formData.bmi) || 0;
      const windSpeed = parseFloat(formData.windSpeed) || 0;
      const temperature = parseFloat(formData.temperature) || 0;
      const humidity = parseFloat(formData.humidity) || 0;
      const edaTonic = parseFloat(formData.edaTonic) || 0;
      const edaPhasic = parseFloat(formData.edaPhasic) || 0;
      const hfNEcg = parseFloat(formData.hfNEcg) || 0;
      const lfNEcg = parseFloat(formData.lfNEcg) || 0;
      const lfhfRatio = parseFloat(formData.lfhfRatio) || 0;

      const payload = {
        hospital_number: formData.hn,
        skintemp: skinTemp,
        bmi,
        eda_tonic_b: edaTonic,
        eda_phasic_b: edaPhasic,
        hf_n_ecg_b: hfNEcg,
        lf_n_ecg_b: lfNEcg,
        lfhf_ratio_ecg_b: lfhfRatio,
        windSpeed,
        temperature,
        humidity,
        is_allergy: formData.allergic === "yes" ? 1 : 0,
      };

      const result = await predictComfort(payload);
      setPrediction(normalizePrediction(result.label ?? result.prediction));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to fetch prediction."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Thermal Comfort Prediction
        </h1>
        <p className="text-muted-foreground mb-6">
          Enter patient measurements to predict comfort level
        </p>

        {/* Patient Measurements Card */}
        <div className="medical-card mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              Patient Measurements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hn" className="text-sm text-muted-foreground mb-1.5 block">
                Hospital Number (HN)
              </Label>
              <Input
                id="hn"
                placeholder="Enter HN"
                value={formData.hn}
                onChange={(e) => handleInputChange("hn", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bmi" className="text-sm text-muted-foreground mb-1.5 block">
                Body Mass Index (BMI)
              </Label>
              <Input
                id="bmi"
                placeholder="e.g., 22.5"
                value={formData.bmi}
                onChange={(e) => handleInputChange("bmi", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="skinTemp" className="text-sm text-muted-foreground mb-1.5 block">
                Skin Temperature (°C)
              </Label>
              <Input
                id="skinTemp"
                placeholder="e.g., 35.73"
                value={formData.skinTemp}
                onChange={(e) =>
                  handleInputChange("skinTemp", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="windSpeed" className="text-sm text-muted-foreground mb-1.5 block">
                Wind Speed (m/s)
              </Label>
              <Input
                id="windSpeed"
                placeholder="e.g., 1.5"
                value={formData.windSpeed}
                onChange={(e) =>
                  handleInputChange("windSpeed", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="temperature" className="text-sm text-muted-foreground mb-1.5 block">
                Temperature (°C)
              </Label>
              <Input
                id="temperature"
                placeholder="e.g., 25.0"
                value={formData.temperature}
                onChange={(e) =>
                  handleInputChange("temperature", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="humidity" className="text-sm text-muted-foreground mb-1.5 block">
                Humidity (%)
              </Label>
              <Input
                id="humidity"
                placeholder="e.g., 60"
                value={formData.humidity}
                onChange={(e) =>
                  handleInputChange("humidity", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="edaTonic" className="text-sm text-muted-foreground mb-1.5 block">
                EDA Tonic (EDA_Tonic_B)
              </Label>
              <Input
                id="edaTonic"
                placeholder="e.g., 0.15"
                value={formData.edaTonic}
                onChange={(e) =>
                  handleInputChange("edaTonic", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="edaPhasic" className="text-sm text-muted-foreground mb-1.5 block">
                EDA Phasic (EDA_Phasic_B)
              </Label>
              <Input
                id="edaPhasic"
                placeholder="e.g., 0.03"
                value={formData.edaPhasic}
                onChange={(e) =>
                  handleInputChange("edaPhasic", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="hfNEcg" className="text-sm text-muted-foreground mb-1.5 block">
                HF_n_ECG_B
              </Label>
              <Input
                id="hfNEcg"
                placeholder="e.g., 0.22"
                value={formData.hfNEcg}
                onChange={(e) =>
                  handleInputChange("hfNEcg", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="lfNEcg" className="text-sm text-muted-foreground mb-1.5 block">
                LF_n_ECG_B
              </Label>
              <Input
                id="lfNEcg"
                placeholder="e.g., 0.18"
                value={formData.lfNEcg}
                onChange={(e) =>
                  handleInputChange("lfNEcg", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="lfhfRatio" className="text-sm text-muted-foreground mb-1.5 block">
                LFHF_ratio_ECG_B
              </Label>
              <Input
                id="lfhfRatio"
                placeholder="e.g., 1.2"
                value={formData.lfhfRatio}
                onChange={(e) =>
                  handleInputChange("lfhfRatio", e.target.value)
                }
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-sm text-muted-foreground mb-2 block">
                Allergic
              </Label>
              <RadioGroup
                value={formData.allergic}
                onValueChange={(value) =>
                  handleInputChange("allergic", value)
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="allergic-yes" />
                  <Label htmlFor="allergic-yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="allergic-no" />
                  <Label htmlFor="allergic-no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {errorMessage ? (
            <p className="text-sm text-destructive mt-4">
              {errorMessage}
            </p>
          ) : null}
          <Button
            onClick={handlePredict}
            className="w-full mt-6"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Predicting..." : "Predict Comfort Level"}
          </Button>
        </div>

        {/* Prediction Result Card */}
        <div className="medical-card border-2 border-dashed border-primary/30">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              Prediction Result
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 text-center md:text-left">
              {prediction ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">
                      {getPredictionStyle(prediction).emoji}
                    </span>
                    <span
                      className={`text-2xl font-bold ${getPredictionStyle(prediction).textClass}`}
                    >
                      {prediction}
                    </span>
                  </div>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium text-white ${getPredictionStyle(prediction).bgClass}`}
                  >
                    {prediction}
                  </span>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Enter measurements to see prediction
                </p>
              )}
            </div>

            <div className="flex-1 bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-foreground">
                  Recommendation
                </h3>
              </div>

              {prediction === "Comfortable" ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your comfort level is good, continue your current environment.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Monitor patient every 30 minutes</li>
                    <li>• Maintain current room temperature</li>
                    <li>• Ensure adequate ventilation</li>
                  </ul>
                </>
              ) : prediction === "Uncomfortable" ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    The patient may feel uncomfortable. Consider adjusting the environment.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Adjust room temperature</li>
                    <li>• Increase ventilation or air flow</li>
                    <li>• Check patient's clothing</li>
                    <li>• Monitor patient more frequently</li>
                  </ul>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter measurements to see recommendations
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PredictionPage;
