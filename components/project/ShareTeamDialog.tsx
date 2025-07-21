// components/project/ShareTeamDialog.tsx
import React, { useState } from "react";
import { Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "next-i18next";

interface TeamMember {
  name: string;
  role: string;
  email: string;
  access: "viewer" | "editor";
}

interface ShareTeamDialogProps {
  projectName: string;
  projectId: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  isOpen: boolean;
  onClose: () => void;
}

export const ShareTeamDialog = ({
  projectName,
  projectId,
  className,
  variant = "outline",
  size = "sm",
  isOpen,
  onClose,
}: ShareTeamDialogProps) => {
  const { t } = useTranslation("common");
  const [newMember, setNewMember] = useState<TeamMember>({
    name: "",
    role: "",
    email: "",
    access: "viewer",
  });
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleAccessChange = (value: string) => {
    setNewMember({ ...newMember, access: value as "viewer" | "editor" });
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddMember = () => {
    if (!newMember.name.trim()) {
      setError(t("share_team_dialog_name_required"));
      return;
    }
    if (!newMember.email.trim()) {
      setError(t("share_team_dialog_email_required"));
      return;
    }
    if (!validateEmail(newMember.email)) {
      setError(t("share_team_dialog_invalid_email"));
      return;
    }

    setMembers([...members, newMember]);
    setNewMember({
      name: "",
      role: "",
      email: "",
      access: "viewer",
    });
    setError(null);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  const handleSaveAndShare = async () => {
    setIsSending(true);
    // TODO: Implement API call to share project
    console.log(`Sharing project ${projectId} with:`, members);
    alert(`Project "${projectName}" has been shared with ${members.length} team members.`);
    setMembers([]);
    setIsSending(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("Share with your team")}</DialogTitle>
          <DialogDescription>
            {t("Enter the email of the person you want to share this project with.")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-4">
              <Input
                name="name"
                value={newMember.name}
                onChange={handleInputChange}
                placeholder={t("share_team_dialog_enter_name")}
              />
            </div>
            <div className="col-span-3">
              <Input
                name="role"
                value={newMember.role}
                onChange={handleInputChange}
                placeholder={t("share_team_dialog_enter_role")}
              />
            </div>
            <div className="col-span-3">
              <Input
                name="email"
                type="email"
                value={newMember.email}
                onChange={handleInputChange}
                placeholder={t("Enter email")}
              />
            </div>
            <div className="col-span-2">
              <Select
                value={newMember.access}
                onValueChange={handleAccessChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("share_team_dialog_select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">{t("share_team_dialog_viewer")}</SelectItem>
                  <SelectItem value="editor">{t("share_team_dialog_editor")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddMember}
            >
              {t("share_team_dialog_add_member")}
            </Button>
          </div>

          {members.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">{t("share_team_dialog_members_to_invite")}</h4>
              <div className="border rounded-md divide-y">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <span>{member.email}</span>
                        {member.role && (
                          <>
                            <span>•</span>
                            <span>{member.role}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="capitalize">{member.access}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(index)}
                    >
                      {t("share_team_dialog_remove")}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="ghost" type="button" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSaveAndShare}
            disabled={members.length === 0 || isSending}
          >
            {isSending ? t("Sending...") : t("share_team_dialog_share_project")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTeamDialog;
