"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Container from "@/components/ui/container";
// import { useQuery } from "@tanstack/react-query";
import { useFetchCurrentUserProfile } from "@/hooks/useFetchCurrentUserProfile";
import { logout } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState } from "react";

export default function Profile() {
  const queryClient = useQueryClient();
  const { user } = useFetchCurrentUserProfile();
  const [, logoutAction] = useActionState(logout, undefined);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    queryClient.removeQueries({ queryKey: ["user"] });
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <Container>
      <Card className="max-w-2xl mx-4 md:mx-auto mt-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" alt={user?.firstName} />
            <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{user?.firstName}</h2>
              <p className="text-muted-foreground text-sm italic -mt-2">
                @{user?.firstName}
              </p>
            </div>
            <button
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Contact</h3>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone Number</h3>
              <p className="text-muted-foreground">{user?.phoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
