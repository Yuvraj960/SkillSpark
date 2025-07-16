
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  aboutMe: z.string().min(10, {
    message: "About me must be at least 10 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  githubUrl: z.string().url({
    message: "Please enter a valid GitHub URL.",
  }),
  portfolioUrl: z.string().url({
    message: "Please enter a valid portfolio URL.",
  }).optional(),
  avatarUrl: z.string().url({
    message: "Please enter a valid image URL.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const SparkyOnboarding: React.FC = () => {
  const { user, completeOnboarding, isOnboarded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aboutMe: "",
      contactEmail: user?.email || "",
      phone: "",
      githubUrl: "",
      portfolioUrl: "",
      avatarUrl: "https://github.com/shadcn.png", // Default avatar
    },
  });

  // If user is already onboarded, redirect to profile
  React.useEffect(() => {
    if (isOnboarded) {
      navigate("/sparkies/profile");
    }
  }, [isOnboarded, navigate]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Complete onboarding with form values
      completeOnboarding({
        ...values,
        skills: [],
        credits: 0,
        sessionsCompleted: 0
      });
      
      toast({
        title: "Profile created!",
        description: "Your profile has been set up successfully.",
      });
      
      navigate("/sparkies/profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem setting up your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Sparky Profile</CardTitle>
          <CardDescription>
            Tell us more about yourself so clients can find and hire you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="aboutMe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Me</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell clients about your experience, skills, and what makes you unique..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="avatarUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Picture URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/your-image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="githubUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub Profile</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Github className="h-4 w-4" />
                              <Input placeholder="https://github.com/yourusername" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="portfolioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourportfolio.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <CardFooter className="flex justify-between px-0">
                {step === 2 ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating Profile..." : "Complete Setup"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="button" variant="outline" onClick={() => navigate("/")}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                    >
                      Next Step
                    </Button>
                  </>
                )}
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SparkyOnboarding;
