// components/project/ShareTeamDialog.tsx
import React, { useState } from "react";
import { Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
}

export const ShareTeamDialog = ({
  projectName,
  projectId,
  className,
  variant = "outline",
  size = "sm",
}: ShareTeamDialogProps) => {
  const [newMember, setNewMember] = useState<TeamMember>({
    name: "",
    role: "",
    email: "",
    access: "viewer",
  });
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      setError("Name is required");
      return;
    }
    if (!newMember.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(newMember.email)) {
      setError("Please enter a valid email address");
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
    // TODO: Implement API call to share project
    console.log(`Sharing project ${projectId} with:`, members);
    alert(`Project "${projectName}" has been shared with ${members.length} team members.`);
    setMembers([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4 mr-1" />
          Share with Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Project with Team</DialogTitle>
          <DialogDescription>
            Invite team members to collaborate on &ldquo;{projectName}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-4">
              <Input
                name="name"
                value={newMember.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
            </div>
            <div className="col-span-3">
              <Input
                name="role"
                value={newMember.role}
                onChange={handleInputChange}
                placeholder="Role"
              />
            </div>
            <div className="col-span-3">
              <Input
                name="email"
                type="email"
                value={newMember.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
            <div className="col-span-2">
              <Select
                value={newMember.access}
                onValueChange={handleAccessChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
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
              Add Member
            </Button>
          </div>

          {members.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Team members to invite:</h4>
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
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="ghost" type="button">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveAndShare}
            disabled={members.length === 0}
          >
            Share Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTeamDialog;
