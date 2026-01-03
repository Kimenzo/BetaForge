"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bug,
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Severity = "all" | "critical" | "high" | "medium" | "low";

const severityConfig = {
  critical: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-crimson-red",
    bg: "bg-crimson-red/10",
    border: "border-crimson-red/20",
  },
  high: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-ember-orange",
    bg: "bg-ember-orange/10",
    border: "border-ember-orange/20",
  },
  medium: {
    icon: <Info className="w-4 h-4" />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  low: {
    icon: <Bug className="w-4 h-4" />,
    color: "text-mist-gray",
    bg: "bg-mist-gray/10",
    border: "border-mist-gray/20",
  },
};

// Sample reports data
const sampleReports = [
  {
    id: "1",
    title: "Form validation error not displayed",
    severity: "high" as const,
    project: "E-commerce App",
    agent: "Sarah",
    createdAt: "2 hours ago",
    status: "open",
  },
  {
    id: "2",
    title: "Keyboard navigation broken in modal",
    severity: "critical" as const,
    project: "Dashboard Pro",
    agent: "Ahmed",
    createdAt: "4 hours ago",
    status: "open",
  },
  {
    id: "3",
    title: "Mobile menu doesn't close properly",
    severity: "medium" as const,
    project: "Marketing Site",
    agent: "Lin",
    createdAt: "1 day ago",
    status: "fixed",
  },
];

export default function ReportsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const severities: Severity[] = ["all", "critical", "high", "medium", "low"];

  const filteredReports = sampleReports.filter((report) => {
    const matchesSeverity =
      selectedSeverity === "all" || report.severity === selectedSeverity;
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-ghost-white mb-2">Bug Reports</h1>
        <p className="text-phantom-gray">
          All bugs discovered by AI agents across your projects
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
        <div className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Bug className="w-4 h-4 text-neural-bright" />
            <span className="text-sm text-phantom-gray">Total Bugs</span>
          </div>
          <p className="text-2xl font-bold text-ghost-white">47</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-crimson-red" />
            <span className="text-sm text-phantom-gray">Critical</span>
          </div>
          <p className="text-2xl font-bold text-ghost-white">3</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-ember-orange" />
            <span className="text-sm text-phantom-gray">Open</span>
          </div>
          <p className="text-2xl font-bold text-ghost-white">28</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-quantum-green" />
            <span className="text-sm text-phantom-gray">Fixed</span>
          </div>
          <p className="text-2xl font-bold text-ghost-white">19</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up stagger-2">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-gray" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {severities.map((severity) => (
            <button
              key={severity}
              onClick={() => setSelectedSeverity(severity)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSeverity === severity
                  ? "bg-neural/20 text-neural-bright border border-neural/30"
                  : "bg-void-elevated border border-white/5 text-phantom-gray hover:text-ghost-white hover:border-white/10"
              }`}
            >
              {severity !== "all" && (
                <span className={severityConfig[severity].color}>
                  {severityConfig[severity].icon}
                </span>
              )}
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>

        {/* Additional Filters */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Calendar className="w-4 h-4" />
            Date
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4" />
            More
          </Button>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-3 animate-fade-in-up stagger-3">
          {filteredReports.map((report, index) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="block glass rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="p-5 flex items-center gap-4">
                {/* Severity Icon */}
                <div
                  className={`p-3 rounded-xl ${severityConfig[report.severity].bg} ${severityConfig[report.severity].color}`}
                >
                  {severityConfig[report.severity].icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-ghost-white group-hover:text-neural-bright transition-colors truncate">
                      {report.title}
                    </h3>
                    <Badge
                      variant={report.status === "open" ? "destructive" : "success"}
                      size="sm"
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-phantom-gray">
                    <span>{report.project}</span>
                    <span className="w-1 h-1 rounded-full bg-mist-gray" />
                    <span>by {report.agent}</span>
                    <span className="w-1 h-1 rounded-full bg-mist-gray" />
                    <span>{report.createdAt}</span>
                  </div>
                </div>

                {/* Arrow */}
                <ExternalLink className="w-4 h-4 text-mist-gray opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-void-surface/50 p-12 text-center animate-fade-in-up">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ember-orange/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-ember-orange/20 to-crimson-red/20 flex items-center justify-center border border-white/10">
              <Sparkles className="w-10 h-10 text-ember-orange" />
            </div>
            <h3 className="text-xl font-semibold text-ghost-white mb-2">
              No bug reports found
            </h3>
            <p className="text-phantom-gray mb-6 max-w-md mx-auto">
              {searchQuery || selectedSeverity !== "all"
                ? "Try adjusting your filters"
                : "Run tests on your projects to discover bugs. Our AI agents will analyze your application and report issues here."}
            </p>
            <Link href="/dashboard/projects">
              <Button>View Projects</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
