import Hero from "@/features/invitation/components/hero";
import { BrideGroom, Events } from "@/features/events";
import { Location } from "@/features/location";
import { Nasihat } from "@/features/nasihat";
import { Wishes } from "@/features/wishes";
import { Gifts } from "@/features/gifts";
import Closing from "@/features/invitation/components/closing";

// Main Invitation Content
export default function MainContent() {
  return (
    <>
      <Hero />
      <BrideGroom />
      <Events />
      <Location />
      <Nasihat />
      <Gifts />
      <Wishes />
      <Closing />
    </>
  );
}
