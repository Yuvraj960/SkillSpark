import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resourceAPI } from "@/lib/api";
import type { Resource } from "@/types";
import Navbar from "@/components/Navbar";
import {
  Search, BookOpen, Play, Zap, Clock, Eye,
  Filter, Loader2, Bookmark, Star,
} from "lucide-react";

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "article", label: "📄 Articles" },
  { value: "video", label: "🎬 Videos" },
  { value: "interactive", label: "⚡ Interactive" },
];

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (typeFilter !== "all") params.type = typeFilter;
      const res = await resourceAPI.getResources(params);
      setResources(res.data.resources || []);
    } catch {
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, [typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources();
  };

  const getTypeIcon = (type: string) => {
    if (type === "video") return <Play className="w-3.5 h-3.5" />;
    if (type === "interactive") return <Zap className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  const getTypeBadgeClass = (type: string) => {
    if (type === "video") return "bg-red-500/10 text-red-600 border-red-500/20";
    if (type === "interactive") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  };

  const featured = resources.filter((r) => r.isFeatured);
  const rest = resources.filter((r) => !r.isFeatured);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-primary" /> Learning Resources
            </h1>
            <p className="text-muted-foreground mt-1">Articles, videos, and interactive lessons to accelerate your growth</p>
          </div>

          {/* Filters */}
          <Card className="mb-6 border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-10 rounded-xl"
                    />
                  </div>
                  <Button type="submit" variant="outline" className="h-10 rounded-xl gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Search
                  </Button>
                </form>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 w-44 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading resources...</p>
              </div>
            </div>
          ) : resources.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-semibold">No resources found</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different search or filter</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Featured section */}
              {featured.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" /> Featured
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    {featured.map((resource) => {
                      const id = resource._id || resource.id;
                      return (
                        <Link key={id} to={`/clients/resources/${id}`}>
                          <Card className="group hover-lift border-border/50 hover:border-primary/30 transition-all overflow-hidden">
                            {resource.imageUrl && (
                              <div className="h-44 overflow-hidden bg-muted">
                                <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                            )}
                            <CardContent className="p-5">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={`text-xs gap-1 ${getTypeBadgeClass(resource.type)}`}>
                                  {getTypeIcon(resource.type)} {resource.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                              </div>
                              <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">{resource.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span>By {resource.author}</span>
                                {resource.readTime && (
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {resource.readTime} min</span>
                                )}
                                {resource.views && (
                                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {resource.views}</span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All resources */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> All Resources
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((resource) => {
                    const id = resource._id || resource.id;
                    return (
                      <Link key={id} to={`/clients/resources/${id}`}>
                        <Card className="group hover-lift border-border/50 hover:border-primary/30 transition-all h-full">
                          <CardContent className="p-5 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={`text-xs gap-1 ${getTypeBadgeClass(resource.type)}`}>
                                {getTypeIcon(resource.type)} {resource.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                            </div>
                            <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">{resource.title}</h3>
                            {resource.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{resource.description}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-3 border-t">
                              <span>By {resource.author}</span>
                              <div className="flex items-center gap-2">
                                {resource.readTime && (
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {resource.readTime}m</span>
                                )}
                                <Bookmark className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Resources;
