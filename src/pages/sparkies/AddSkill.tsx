import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { userAPI, aiAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import {
  Zap, ArrowLeft, Sparkles, BookOpen, Clock, DollarSign,
  Globe, Users, Loader2, Lightbulb,
} from "lucide-react";

const schema = z.object({
  name: z.string().min(3, "Skill name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  sessionLength: z.coerce.number().min(15, "Minimum 15 minutes").max(240, "Maximum 4 hours"),
  creditsPerSession: z.coerce.number().min(5, "Minimum 5 credits").max(200, "Maximum 200 credits"),
  isRemote: z.boolean().default(true),
  isGroup: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

const categories = [
  { value: "programming", label: "💻 Programming & Tech" },
  { value: "design", label: "🎨 Design & Creative" },
  { value: "marketing", label: "📈 Marketing & Growth" },
  { value: "business", label: "💼 Business & Strategy" },
  { value: "personal", label: "🧠 Personal Development" },
  { value: "music", label: "🎵 Music & Arts" },
  { value: "language", label: "🌍 Languages" },
  { value: "other", label: "⚡ Other" },
];

const AddSkill: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ name: string; reason: string; creditsPerSession: number; difficulty: string }>>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      sessionLength: 60,
      creditsPerSession: 20,
      isRemote: true,
      isGroup: false,
    },
  });

  const handleGetAISuggestions = async () => {
    setIsLoadingAI(true);
    try {
      const currentSkills = user?.skills?.map((s) => s.name) || [];
      const res = await aiAPI.getSkillSuggestions({ currentSkills, goals: "Help clients learn effectively" });
      setAiSuggestions(res.data.suggestions || []);
    } catch {
      toast({ title: "AI Not Available", description: "Please configure your Gemini API key to use AI suggestions.", variant: "destructive" });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const applySuggestion = (suggestion: typeof aiSuggestions[0]) => {
    form.setValue("name", suggestion.name);
    form.setValue("creditsPerSession", suggestion.creditsPerSession);
    toast({ title: "Suggestion Applied!", description: `${suggestion.name} has been filled in.` });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await userAPI.addSkill(data);
      // Update user in context with new skills
      updateUser({ skills: res.data.skills });
      toast({ title: "🎉 Skill Added!", description: `"${data.name}" is now live on your profile.` });
      navigate("/sparkies/profile");
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to add skill.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-2xl px-4 md:px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold">Add New Skill</h1>
              <p className="text-muted-foreground mt-0.5">List a skill to start receiving bookings</p>
            </div>
          </div>

          {/* AI Suggestions */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">AI Skill Suggestions</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetAISuggestions}
                  disabled={isLoadingAI}
                  className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                >
                  {isLoadingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
                  {isLoadingAI ? "Generating..." : "Get AI Suggestions"}
                </Button>
              </div>
              <CardDescription>Let AI suggest skills based on your current profile</CardDescription>
            </CardHeader>
            {aiSuggestions.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {aiSuggestions.map((s, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 p-3 bg-background rounded-xl border border-border/50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{s.name}</p>
                          <Badge variant="outline" className="text-xs">{s.difficulty}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{s.reason}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-bold text-primary">{s.creditsPerSession}cr/session</span>
                        <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => applySuggestion(s)}>
                          Use this →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Skill Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Advanced React Development" className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what clients will learn, your teaching approach, and what makes your sessions valuable..."
                          className="min-h-[120px] rounded-xl resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="sessionLength" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Session Length (min) *
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min={15} max={240} className="h-11 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="creditsPerSession" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" /> Credits per Session *
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min={5} max={200} className="h-11 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex gap-6 pt-2">
                    <FormField control={form.control} name="isRemote" render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="flex items-center gap-1.5 cursor-pointer">
                          <Globe className="w-4 h-4 text-primary" /> Remote sessions
                        </FormLabel>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="isGroup" render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="flex items-center gap-1.5 cursor-pointer">
                          <Users className="w-4 h-4 text-primary" /> Group sessions
                        </FormLabel>
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1 rounded-xl h-11">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl h-11 animated-gradient text-white">
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Add Skill
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddSkill;
