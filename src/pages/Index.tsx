
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { HandHeart, GraduationCap, Users } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-gradient-to-br from-skillspark-darkpurple to-black">
        <div className="container text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
            Connect, Learn, and <span className="bg-clip-text text-transparent bg-gradient-to-r from-skillspark-purple to-blue-400">Collaborate</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            A platform connecting those with skills to those who need them. Teach what you know, learn what you don't.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-skillspark-purple hover:bg-skillspark-darkpurple text-white">
              <Link to="/register?type=sparky">Join as a Sparky</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-skillspark-purple text-skillspark-purple hover:bg-skillspark-purple hover:text-white">
              <Link to="/register?type=client">Join as a Client</Link>
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-6 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md transition-all hover:shadow-lg hover:transform hover:scale-105">
              <div className="bg-skillspark-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-skillspark-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">Share your skills or needs with our community by setting up your detailed profile.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md transition-all hover:shadow-lg hover:transform hover:scale-105">
              <div className="bg-skillspark-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <GraduationCap className="text-skillspark-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Collaborate</h3>
              <p className="text-muted-foreground">Browse projects, connect with skilled sparkies, or post your own project needs.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md transition-all hover:shadow-lg hover:transform hover:scale-105">
              <div className="bg-skillspark-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <HandHeart className="text-skillspark-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Grow Your Skills</h3>
              <p className="text-muted-foreground">Learn from experts, earn credentials, and expand your skillset or business.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-skillspark-purple/10 py-16 px-6">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg max-w-2xl mx-auto">Join our community today and start sharing or learning skills.</p>
          
          <div className="pt-4">
            <Button asChild size="lg" className="bg-skillspark-purple hover:bg-skillspark-darkpurple">
              <Link to="/register">Create Your Account</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-8 px-6 bg-background">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2025 SkillSpark. All rights reserved.</p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-muted-foreground hover:text-skillspark-purple">Terms</Link>
            <Link to="#" className="text-muted-foreground hover:text-skillspark-purple">Privacy</Link>
            <Link to="#" className="text-muted-foreground hover:text-skillspark-purple">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
