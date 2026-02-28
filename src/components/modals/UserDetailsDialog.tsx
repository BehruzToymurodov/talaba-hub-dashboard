import type { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types";
import { formatDate } from "@/lib/utils/formatters";

type UserDetailsDialogProps = {
  user: User | null;
  open: boolean;
  onClose: () => void;
};

export const UserDetailsDialog: FC<UserDetailsDialogProps> = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : undefined)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={user.enabled ? "success" : "destructive"}>{user.enabled ? "Enabled" : "Disabled"}</Badge>
            <Badge variant={user.studentStatusVerified ? "success" : "warning"}>
              {user.studentStatusVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">{formatDate(user.createdDate)}</p>
          </div>
        <div>
          <p className="text-muted-foreground">Verified Date</p>
          <p className="font-medium">{formatDate(user.verifiedDate)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Related Applications</p>
          <p className="text-sm text-muted-foreground">Show linked applications here when API provides them.</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
};
