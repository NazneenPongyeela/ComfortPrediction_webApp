import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, ClipboardList } from "lucide-react";
import { useState } from "react";

const PredictionPage = () => {
  const [formData, setFormData] = useState({
    hn: "",
    bmi: "",
    skinTemp: "",
    eda: "",
    hrv: "",
    windSpeed: "",
    temperature: "",
    humidity: "",
    allergic: "no",
  });

  const [prediction, setPrediction] = useState(null);

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
      bgClass: "bg-pink-500",
      textClass: "text-pink-600",
    };
  };

  const handlePredict = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const token =
        localStorage.getItem("idToken") ||
        sessionStorage.getItem("idToken");

      const payload = {
        hospital_number: formData.hn,
        skintemp: parseFloat(formData.skinTemp) || 0,
        bmi: parseFloat(formData.bmi) || 0,
        eda_raw: parseFloat(formData.eda) || 0,
        hrv_raw: parseFloat(formData.hrv) || 0,
        windSpeed: parseFloat(formData.windSpeed) || 0,
        temperature: parseFloat(formData.temperature) || 0,
        humidity: parseFloat(formData.humidity) || 0,
        is_allergy: formData.allergic === "yes" ? 1 : 0,
      };

      const response = await fetch(`${baseUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setPrediction(result.prediction);
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
              <Label htmlFor="hrv" className="text-sm text-muted-foreground mb-1.5 block">
                HRV (ms)
              </Label>
              <Input
                id="hrv"
                placeholder="e.g., 45.5"
                value={formData.hrv}
                onChange={(e) => handleInputChange("hrv", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="eda" className="text-sm text-muted-foreground mb-1.5 block">
                EDA (μS)
              </Label>
              <Input
                id="eda"
                placeholder="e.g., 0.70"
                value={formData.eda}
                onChange={(e) => handleInputChange("eda", e.target.value)}
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

          <Button onClick={handlePredict} className="w-full mt-6" size="lg">
            Predict Comfort Level
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
