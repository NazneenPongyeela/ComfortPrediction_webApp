import { BarChart3, Heart, Workflow, Activity } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Practical Data Analysis",
    description:
      "Utilizes essential patient and environmental data to assess thermal comfort.",
  },
  {
    icon: Heart,
    title: "Patient-Focused Monitoring",
    description:
      "Offers a clear and accessible interface for convenient patient tracking.",
  },
  {
    icon: Workflow,
    title: "Simple and Efficient",
    description:
      "Streamlines data recording through organized and semi-automated management.",
  },
];

const LoginHero = () => {
  return (
    <div className="flex-1 relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 overflow-hidden flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-primary text-lg">
              Preventive Medicine
            </h1>
            <p className="text-primary/70 text-sm">
              Thermal Comfort Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 pb-8">
        <div className="max-w-lg">
          <h2 className="text-5xl font-bold text-foreground leading-tight mb-4">
            Advanced Patient Care
            <br />
            <span className="text-primary">Monitoring System</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ensuring optimal thermal comfort through AI-powered environmental
            analysis and personalized patient care
          </p>

          {/* Feature Cards */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Why Choose Us
            </h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-8 py-4 bg-primary/5 border-t border-primary/10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-foreground font-medium text-sm">
              Thermal Comfort Prediction System
            </p>
            <p className="text-muted-foreground text-xs">
              AI-powered patient environment optimization
            </p>
          </div>
          <p className="text-muted-foreground text-xs">
            ©2024 MediCare Hospital System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginHero;
