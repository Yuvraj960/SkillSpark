
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Project title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  requirements: z.string().min(10, {
    message: "Requirements must be at least 10 characters.",
  }),
  budget: z.number().min(10, {
    message: "Budget must be at least 10 credits.",
  }),
  deadline: z.string().refine(dateString => {
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Remove time part for comparison
    return date >= now;
  }, {
    message: "Deadline must be in the future.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateProject: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      budget: 100,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new project object
      const newProject = {
        id: `project-${Date.now()}`,
        clientId: user.id,
        clientName: user.name,
        title: values.title,
        description: values.description,
        requirements: values.requirements.split(',').map(req => req.trim()),
        budget: values.budget,
        deadline: values.deadline,
        status: 'open',
        createdAt: new Date().toISOString(),
        bids: []
      };
      
      // In a real app, we would store this in a database
      console.log("Created project:", newProject);
      
      toast({
        title: "Project created!",
        description: "Your project has been posted successfully.",
      });
      
      navigate("/clients/open-projects");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating your project.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Button
        variant="outline"
        onClick={() => navigate("/clients/open-projects")}
        className="mb-6"
      >
        ← Back to Projects
      </Button>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Project</CardTitle>
          <CardDescription>
            Describe your project to find the perfect Sparky for the job
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Website Redesign for Small Business" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed description of what you need..." 
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills & Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List required skills, separated by commas (e.g., React, Node.js, UI Design)" 
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (Credits)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute top-3 left-3 h-4 w-4 text-skillspark-purple" />
                          <Input 
                            type="date"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <CardFooter className="flex justify-between px-0 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate("/clients/open-projects")}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-skillspark-purple hover:bg-skillspark-darkpurple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Project"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProject;
