"use client";

import { useState } from "react";
import {
  Users,
  Mail,
  Shield,
  MoreHorizontal,
  UserPlus,
  Crown,
  X,
  Check,
  Copy,
  Clock,
  Trash2,
} from "lucide-react";

type Role = "owner" | "admin" | "member" | "viewer";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  status: "active" | "pending";
  joinedAt: string;
}

export default function TeamSettingsPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("member");
  const [copied, setCopied] = useState(false);

  // Real team data - would come from API/Supabase
  const teamMembers: TeamMember[] = []; // No team members yet (empty state)

  const inviteLink = ""; // No invite link generated yet

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case "owner":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 border-yellow-500/30";
      case "admin":
        return "bg-neural/20 text-neural-bright border-neural/30";
      case "member":
        return "bg-white/10 text-white border-white/20";
      case "viewer":
        return "bg-white/5 text-phantom-gray border-white/10";
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "owner":
        return Crown;
      case "admin":
        return Shield;
      default:
        return Users;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    // Would call API to send invite
    console.log("Inviting:", inviteEmail, "as", inviteRole);
    setShowInviteModal(false);
    setInviteEmail("");
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Section Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">Team</h1>
        <p className="text-phantom-gray">
          Manage your team members and permissions
        </p>
      </div>

      {/* Team Stats */}
      <section className="mb-8 grid grid-cols-3 gap-4 animate-fade-in-up stagger-1">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-phantom-gray mb-1">Team Members</p>
          <p className="text-2xl font-bold text-white">
            {teamMembers.filter((m) => m.status === "active").length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-phantom-gray mb-1">Pending Invites</p>
          <p className="text-2xl font-bold text-yellow-500">
            {teamMembers.filter((m) => m.status === "pending").length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-phantom-gray mb-1">Seats Available</p>
          <p className="text-2xl font-bold text-quantum-green">7</p>
        </div>
      </section>

      {/* Invite Link */}
      {inviteLink ? (
        <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-neural/10 to-electric-cyan/10 border border-neural/20 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Invite Link
              </h3>
              <p className="text-sm text-phantom-gray">
                Share this link to invite team members
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-medium hover:shadow-glow transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member
            </button>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-phantom-gray text-sm"
            />
            <button
              onClick={handleCopyLink}
              className={`h-12 px-4 rounded-xl border transition-all flex items-center gap-2 ${
                copied
                  ? "bg-quantum-green/20 border-quantum-green/30 text-quantum-green"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </section>
      ) : (
        <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-neural/10 to-electric-cyan/10 border border-neural/20 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Team Collaboration
              </h3>
              <p className="text-sm text-phantom-gray">
                Upgrade to Pro to invite team members
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-medium hover:shadow-glow transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member
            </button>
          </div>
        </section>
      )}

      {/* Team Members List */}
      <section className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-3">
        <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
        {teamMembers.length > 0 ? (
          <div className="space-y-3">
            {teamMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neural/50 to-electric-cyan/50 flex items-center justify-center text-white font-medium">
                      {member.name
                        ? member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">
                          {member.name || member.email}
                        </p>
                        {member.status === "pending" && (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-phantom-gray">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${getRoleBadgeColor(member.role)}`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      <span className="capitalize">{member.role}</span>
                    </span>
                    {member.role !== "owner" && (
                      <button className="p-2 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="w-4 h-4 text-phantom-gray" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Users className="w-8 h-8 text-phantom-gray" />
            </div>
            <p className="text-phantom-gray mb-4">No team members yet</p>
            <p className="text-sm text-phantom-gray mb-6">
              Invite team members to collaborate on projects
            </p>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 rounded-xl bg-neural/20 text-neural-bright font-medium hover:bg-neural/30 transition-all"
            >
              Invite Team Member
            </button>
          </div>
        )}
      </section>

      {/* Roles & Permissions */}
      <section className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-fade-in-up stagger-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Roles & Permissions
        </h3>
        <div className="space-y-4">
          {[
            {
              role: "Owner",
              description: "Full access. Can manage billing and delete workspace.",
              permissions: ["All permissions", "Billing access", "Delete workspace"],
            },
            {
              role: "Admin",
              description: "Can manage team members and all projects.",
              permissions: ["Manage team", "All projects", "API keys"],
            },
            {
              role: "Member",
              description: "Can create and manage their own projects.",
              permissions: ["Create projects", "Run tests", "View reports"],
            },
            {
              role: "Viewer",
              description: "Read-only access to assigned projects.",
              permissions: ["View projects", "View reports"],
            },
          ].map((item) => (
            <div
              key={item.role}
              className="p-4 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white font-medium mb-1">{item.role}</h4>
                  <p className="text-sm text-phantom-gray">{item.description}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {item.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-1 rounded-lg bg-white/5 text-xs text-phantom-gray"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div className="relative w-full max-w-md p-6 bg-void-elevated rounded-2xl border border-white/10 pointer-events-auto">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5 text-phantom-gray" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Invite Team Member
              </h3>
              <p className="text-phantom-gray text-sm">
                Send an invitation to join your workspace
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-phantom-gray mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-phantom-gray" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neural transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-phantom-gray mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neural transition-all appearance-none cursor-pointer"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neural to-electric-cyan text-white font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Invite
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
