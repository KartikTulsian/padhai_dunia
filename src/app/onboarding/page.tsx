import prisma from "@/lib/prisma";
import UserForm from "@/components/forms/UserForm"; 
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await currentUser();
  
  // Security: If user is not signed in, go to sign-in
  if (!user) redirect("/sign-in");

  // Check if user already has a role metadata. If yes, redirect to dashboard.
  // This prevents accessing onboarding twice.
  if (user.publicMetadata?.role) {
    const role = user.publicMetadata.role;
    if (role === 'admin') redirect('/admin');
    if (role === 'institute') redirect('/institute');
    if (role === 'student') redirect('/student');
    if (role === 'teacher') redirect('/teacher');
  }

  // Fetch Institutes for the dropdown
  const institutes = await prisma.institute.findMany({
    select: { id: true, name: true, code: true },
    where: { status: "ACTIVE" } // Only show active institutes
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
       <UserForm institutes={institutes} />
    </div>
  );
}