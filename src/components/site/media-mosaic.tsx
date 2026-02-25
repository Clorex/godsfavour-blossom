import VisualCard from "@/components/site/visual-card";
import { publicAsset } from "@/lib/public-asset";

export default function MediaMosaic() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[32px] bg-soft-grid opacity-60" />
      <div className="relative grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-7">
          <VisualCard
            src={publicAsset("money2")}
            aspect="16/11"
            label="PLACEHOLDER: Member/Client support image"
            note="Use: real client/member photo, support moment, or cooperative activity."
          />
        </div>

        <div className="col-span-12 sm:col-span-5 grid gap-3">
          <VisualCard
            src={publicAsset("money3")}
            aspect="16/10"
            label="PLACEHOLDER: Savings/Contribution"
            note="Use: counting money, contribution, savings moment."
          />
          <VisualCard
            src={publicAsset("money4")}
            aspect="16/10"
            label="PLACEHOLDER: Office/Team/Meeting"
            note="Use: office photo, staff picture, cooperative meeting."
          />
        </div>
      </div>
    </div>
  );
}


