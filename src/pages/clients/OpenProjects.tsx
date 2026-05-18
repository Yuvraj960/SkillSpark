import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { projectAPI } from "@/lib/api";
import type { Project } from "@/types";
import {
  Search, Plus, Briefcase, DollarSign, Calendar, Clock,
  Users, Filter, Loader2, ChevronRight, ArrowUpDown,
} from "lucide-react";

const OpenProjects: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("open");

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (sort !== "newest") params.sort = sort;

      const res = await projectAPI.getProjects(params);
      setProjects(res.data.projects || []);
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      open: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "in-progress": "bg-amber-500/10 text-amber-600 border-amber-500/20",
      completed: "bg-gray-500/10 text-gray-600 border-gray-500/20",
      cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
    };
    return map[status] || "bg-muted text-muted-foreground";
  };

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d left` : "Expired";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-2">
                <Briefcase className="w-7 h-7 text-primary" /> Open Projects
              </h1>
              <p className="text-muted-foreground mt-1">
                {user?.type === "sparky"
                  ? "Browse projects and submit proposals to win work"
                  : "Post a project and receive bids from talented Sparkies"}
              </p>
            </div>
            {user?.type === "client" && (
              <Link to="/clients/create-project">
                <Button className="gap-2 animated-gradient text-white shadow-md">
                  <Plus className="w-4 h-4" /> Post Project
                </Button>
              </Link>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6 border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects by title or skills..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-10 rounded-xl"
                    />
                  </div>
                  <Button type="submit" variant="outline" className="h-10 rounded-xl gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Search
                  </Button>
                </form>

                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 w-36 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="h-10 w-40 rounded-xl">
                      <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="budget-high">Budget: High → Low</SelectItem>
                      <SelectItem value="budget-low">Budget: Low → High</SelectItem>
                      <SelectItem value="bids">Most Bids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-semibold text-lg mb-2">No projects found</p>
                <p className="text-muted-foreground mb-4">
                  {search ? `No results for "${search}"` : "There are no open projects right now."}
                </p>
                {user?.type === "client" && (
                  <Link to="/clients/create-project">
                    <Button className="gap-2 animated-gradient text-white">
                      <Plus className="w-4 h-4" /> Post the First Project
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">{projects.length} project{projects.length !== 1 ? "s" : ""} found</p>
              <div className="grid gap-4">
                {projects.map((project) => {
                  const id = project._id || project.id;
                  return (
                    <Card key={id} className="group hover-lift border-border/50 hover:border-primary/30 transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <Link to={`/clients/project/${id}`}>
                                <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                                  {project.title}
                                </h3>
                              </Link>
                              <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">by {project.clientName}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-2xl font-extrabold text-primary">{project.budget}</p>
                            <p className="text-xs text-muted-foreground">credits budget</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                        {/* Requirements */}
                        {project.requirements.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.requirements.slice(0, 5).map((req) => (
                              <Badge key={req} variant="outline" className="text-xs border-primary/20 bg-primary/5">
                                {req}
                              </Badge>
                            ))}
                            {project.requirements.length > 5 && (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{project.requirements.length - 5}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {project.bids.length} bid{project.bids.length !== 1 ? "s" : ""}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {getDaysLeft(project.deadline)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(project.createdAt || "").toLocaleDateString()}
                            </span>
                          </div>
                          <Link to={`/clients/project/${id}`}>
                            <Button size="sm" className="gap-1.5 h-8 text-xs rounded-lg" variant={user?.type === "sparky" ? "default" : "outline"}>
                              {user?.type === "sparky" ? (
                                <><DollarSign className="w-3 h-3" /> Place Bid</>
                              ) : (
                                <>View Details <ChevronRight className="w-3 h-3" /></>
                              )}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default OpenProjects;
