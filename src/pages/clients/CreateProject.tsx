import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { projectAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Briefcase, Plus, X, ArrowLeft, Loader2 } from "lucide-react";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  budget: z.coerce.number().min(10, "Minimum budget is 10 credits"),
  deadline: z.string().min(1, "Please select a deadline"),
  category: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CreateProject: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", budget: 100, deadline: "", category: "general" },
  });

  // Min date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const addRequirement = () => {
    if (reqInput.trim() && !requirements.includes(reqInput.trim())) {
      setRequirements((prev) => [...prev, reqInput.trim()]);
      setReqInput("");
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await projectAPI.createProject({ ...data, requirements });
      const projectId = res.data.project._id || res.data.project.id;
      toast({ title: "🎉 Project Posted!", description: "Sparkies can now find and bid on your project." });
      navigate(`/clients/project/${projectId}`);
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create project.";
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
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold">Post a Project</h1>
              <p className="text-muted-foreground mt-0.5">Describe your project and receive bids from talented Sparkies</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Build a responsive e-commerce website" className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project in detail. What are you building? What's the goal? What will a Sparky be doing?"
                          className="min-h-[140px] rounded-xl resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Requirements */}
                  <div className="space-y-2">
                    <FormLabel>Required Skills / Technologies</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. React, Node.js, MongoDB"
                        value={reqInput}
                        onChange={(e) => setReqInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRequirement(); } }}
                        className="h-10 rounded-xl"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addRequirement} className="h-10 gap-1 rounded-xl">
                        <Plus className="w-3.5 h-3.5" /> Add
                      </Button>
                    </div>
                    {requirements.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {requirements.map((req) => (
                          <Badge key={req} variant="outline" className="gap-1.5 pr-1 border-primary/20 bg-primary/5">
                            {req}
                            <button type="button" onClick={() => setRequirements((prev) => prev.filter((r) => r !== req))}>
                              <X className="w-3 h-3 text-muted-foreground hover:text-destructive transition-colors" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="budget" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (credits) *</FormLabel>
                        <FormControl>
                          <Input type="number" min={10} className="h-11 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="deadline" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline *</FormLabel>
                        <FormControl>
                          <Input type="date" min={minDateStr} className="h-11 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Loader2 className="w-4 h-4 animate-spin" /> Posting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" /> Post Project
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

export default CreateProject;
