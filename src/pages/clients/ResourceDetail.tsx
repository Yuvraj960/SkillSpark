
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User } from "lucide-react";
import Navbar from "@/components/Navbar";

// Mock detailed resource data
const mockResourceDetails: Record<string, any> = {
  "1": {
    title: "Getting Started with React",
    category: "Programming",
    author: "John Smith",
    date: "2023-05-28",
    readTime: 8,
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    content: `
# Getting Started with React

React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we'll walk through the fundamentals of React and help you build your first application.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components."

## Key Concepts

### Components
Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces.

### JSX
JSX is a syntax extension for JavaScript that looks similar to HTML. It describes what the UI should look like.

### Props
Props are arguments passed into React components. They are passed to components via HTML attributes.

### State
State is a built-in React object that is used to contain data or information about the component.

## Your First Component

Let's create a simple component:

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

## Conclusion

React is an excellent choice for building modern web applications. With its component-based architecture and powerful ecosystem, you can create scalable and maintainable applications.

Start practicing with small projects and gradually work your way up to more complex applications. Happy coding!
    `
  },
  "2": {
    title: "UI Design Principles Everyone Should Know",
    category: "Design",
    author: "Sarah Johnson",
    date: "2023-06-02",
    readTime: 12,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    content: `
# UI Design Principles Everyone Should Know

Great user interface design is both an art and a science. Here are the fundamental principles that every designer should understand.

## 1. Consistency

Consistency is key to a good user experience. Use consistent:
- Colors and typography
- Spacing and layout
- Interactive elements
- Navigation patterns

## 2. Hierarchy

Visual hierarchy guides users through your interface:
- Size: Larger elements draw more attention
- Color: Bright colors stand out
- Contrast: High contrast creates emphasis
- Position: Top-left gets attention first

## 3. Accessibility

Design for everyone:
- Use sufficient color contrast
- Provide alt text for images
- Ensure keyboard navigation
- Use semantic HTML

## 4. Simplicity

Less is often more:
- Remove unnecessary elements
- Use whitespace effectively
- Focus on essential features
- Avoid cognitive overload

## 5. Feedback

Users need to understand what's happening:
- Show loading states
- Confirm actions
- Highlight interactive elements
- Provide error messages

## Conclusion

These principles form the foundation of great UI design. Practice applying them consistently, and your interfaces will become more intuitive and user-friendly.
    `
  }
};

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const resource = id ? mockResourceDetails[id] : null;

  if (!resource) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
              <Button onClick={() => navigate('/clients/resources')}>
                Back to Resources
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/clients/resources')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Button>

          <Card>
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img 
                src={resource.image} 
                alt={resource.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{resource.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {resource.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {resource.readTime} min read
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl">{resource.title}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="prose prose-lg max-w-none">
                {resource.content.split('\n').map((paragraph: string, index: number) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.slice(3)}</h2>;
                  } else if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{paragraph.slice(4)}</h3>;
                  } else if (paragraph.startsWith('```')) {
                    return null; // Handle code blocks separately if needed
                  } else if (paragraph.trim() === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
                  }
                })}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Card className="p-6 bg-primary/5">
              <h3 className="text-xl font-semibold mb-2">Want personalized guidance?</h3>
              <p className="text-muted-foreground mb-4">Book a session with one of our expert Sparkies for tailored learning</p>
              <Button 
                onClick={() => navigate('/clients/book-sparky')}
                className="bg-primary hover:bg-primary/90"
              >
                Find a Sparky
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourceDetail;
