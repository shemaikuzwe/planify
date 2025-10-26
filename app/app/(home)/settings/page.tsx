import UserProfile from "@/components/profile/user-profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};
export default function page() {
  return (
    <div className="w-full">
      <UserProfile />
    </div>
  );
}
