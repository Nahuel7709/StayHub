import {
  Wifi,
  WavesLadder,
  PawPrint,
  SquareParking,
  Tv,
  Snowflake,
  CookingPot,
  Dumbbell,
  Trees,
  MapPin,
  UtensilsCrossed,
  ShieldCheck,
  BedDouble,
  Bath,
  Sparkles,
} from "lucide-react";

const ICONS = {
  wifi: Wifi,
  "waves-ladder": WavesLadder,
  "paw-print": PawPrint,
  "square-parking": SquareParking,
  tv: Tv,
  snowflake: Snowflake,
  "cooking-pot": CookingPot,
  dumbbell: Dumbbell,
  trees: Trees,
  "map-pin": MapPin,
  utensils: UtensilsCrossed,
  "shield-check": ShieldCheck,
  "bed-double": BedDouble,
  bath: Bath,
};

export default function FeatureIcon({
  name,
  className = "h-5 w-5",
  strokeWidth = 2,
}) {
  const Icon = ICONS[name] || Sparkles;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
