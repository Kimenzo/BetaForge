"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Bug,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Zap,
} from "lucide-react";

export default function ProjectAnalyticsPage() {
  const params = useParams();
  const projectId = params.id as string;

  // Mock analytics data
  const stats = [
    {
      label: "Total Tests Run",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: Activity,
      color: "text-neural-bright",
      bgColor: "bg-neural/10",
    },
    {
      label: "Bugs Found",
      value: "47",
      change: "+8%",
      trend: "up",
      icon: Bug,
      color: "text-ember-orange",
      bgColor: "bg-ember-orange/10",
    },
    {
      label: "Avg. Test Duration",
      value: "4.2m",
      change: "-15%",
      trend: "down",
      icon: Clock,
      color: "text-electric-cyan",
      bgColor: "bg-electric-cyan/10",
    },
    {
      label: "Pass Rate",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-quantum-green",
      bgColor: "bg-quantum-green/10",
    },
  ];

  const severityBreakdown = [
    { label: "Critical", count: 3, color: "bg-crimson-red", percentage: 6 },
    { label: "High", count: 12, color: "bg-ember-orange", percentage: 26 },
    { label: "Medium", count: 18, color: "bg-amber-500", percentage: 38 },
    { label: "Low", count: 14, color: "bg-mist-gray", percentage: 30 },
  ];

  const agentPerformance = [
    { name: "Sarah", bugsFound: 12, testsRun: 24, efficiency: 92 },
    { name: "Marcus", bugsFound: 8, testsRun: 24, efficiency: 88 },
    { name: "Ahmed", bugsFound: 15, testsRun: 24, efficiency: 95 },
    { name: "Lin", bugsFound: 6, testsRun: 24, efficiency: 85 },
    { name: "Diego", bugsFound: 4, testsRun: 24, efficiency: 78 },
    { name: "Emma", bugsFound: 2, testsRun: 24, efficiency: 90 },
  ];

  const recentActivity = [
    { date: "Today", tests: 3, bugs: 5 },
    { date: "Yesterday", tests: 4, bugs: 8 },
    { date: "2 days ago", tests: 2, bugs: 3 },
    { date: "3 days ago", tests: 5, bugs: 12 },
    { date: "4 days ago", tests: 3, bugs: 6 },
    { date: "5 days ago", tests: 4, bugs: 7 },
    { date: "6 days ago", tests: 3, bugs: 6 },
  ];

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href={`/dashboard/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-phantom-gray hover:text-ghost-white transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Project
      </Link>

      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-neural/20 to-purple-500/20 border border-white/10">
            <BarChart3 className="w-6 h-6 text-neural-bright" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ghost-white">Analytics</h1>
            <p className="text-phantom-gray">
              Detailed insights and trends from your tests
            </p>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 rounded-lg bg-neural/20 text-ghost-white text-sm font-medium">
          Last 7 days
        </button>
        <button className="px-4 py-2 rounded-lg bg-void-elevated border border-white/5 text-phantom-gray text-sm hover:text-ghost-white transition-colors">
          Last 30 days
        </button>
        <button className="px-4 py-2 rounded-lg bg-void-elevated border border-white/5 text-phantom-gray text-sm hover:text-ghost-white transition-colors">
          Last 90 days
        </button>
        <button className="px-4 py-2 rounded-lg bg-void-elevated border border-white/5 text-phantom-gray text-sm hover:text-ghost-white transition-colors flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Custom
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-quantum-green" : "text-electric-cyan"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-ghost-white">{stat.value}</p>
            <p className="text-sm text-phantom-gray">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Severity Breakdown */}
        <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-2">
          <h3 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-plasma-pink" />
            Bug Severity Breakdown
          </h3>
          <div className="space-y-4">
            {severityBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-phantom-gray">{item.label}</span>
                  <span className="text-sm text-ghost-white font-medium">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-void-elevated rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-3">
          <h3 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-electric-cyan" />
            Recent Activity
          </h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {recentActivity.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="w-full bg-ember-orange/60 rounded-t"
                    style={{ height: `${day.bugs * 4}px` }}
                    title={`${day.bugs} bugs`}
                  />
                  <div
                    className="w-full bg-neural-bright/60 rounded-b"
                    style={{ height: `${day.tests * 8}px` }}
                    title={`${day.tests} tests`}
                  />
                </div>
                <span className="text-xs text-mist-gray truncate w-full text-center">
                  {day.date.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-neural-bright/60" />
              <span className="text-xs text-phantom-gray">Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-ember-orange/60" />
              <span className="text-xs text-phantom-gray">Bugs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="glass rounded-2xl p-6 border border-white/5 animate-fade-in-up stagger-4">
        <h3 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-quantum-green" />
          Agent Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-sm font-medium text-phantom-gray">
                  Agent
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-phantom-gray">
                  Tests Run
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-phantom-gray">
                  Bugs Found
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-phantom-gray">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody>
              {agentPerformance.map((agent) => (
                <tr key={agent.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <span className="font-medium text-ghost-white">{agent.name}</span>
                  </td>
                  <td className="py-3 px-4 text-phantom-gray">{agent.testsRun}</td>
                  <td className="py-3 px-4 text-phantom-gray">{agent.bugsFound}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-void-elevated rounded-full overflow-hidden max-w-[100px]">
                        <div
                          className="h-full bg-quantum-green rounded-full"
                          style={{ width: `${agent.efficiency}%` }}
                        />
                      </div>
                      <span className="text-sm text-quantum-green">{agent.efficiency}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex items-center justify-end gap-3">
        <button className="px-4 py-2 rounded-lg bg-void-elevated border border-white/5 text-phantom-gray text-sm hover:text-ghost-white hover:border-white/10 transition-colors">
          Export CSV
        </button>
        <button className="px-4 py-2 rounded-lg bg-void-elevated border border-white/5 text-phantom-gray text-sm hover:text-ghost-white hover:border-white/10 transition-colors">
          Export PDF
        </button>
      </div>
    </div>
  );
}
