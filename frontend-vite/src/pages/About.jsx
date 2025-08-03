import React, { useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  Lightbulb, 
  Globe, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  GraduationCap,
  Microscope,
  Heart,
  Share2,
  MessageSquare,
  User,
  LogIn
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with actual auth state
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);

  const features = [
    {
      icon: MessageCircle,
      title: "Share Your Research Journey",
      description: "Share your failed research stories and get valuable feedback from peers worldwide.",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Global Collaboration",
      description: "Connect and collaborate with researchers from different institutions and countries.",
      color: "text-green-600"
    },
    {
      icon: Lightbulb,
      title: "Learn from Mistakes",
      description: "Learn and grow from your mistakes in a supportive, non-judgmental environment.",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your research progress and celebrate both failures and successes.",
      color: "text-orange-600"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Safe Environment",
      description: "Share failures without fear of judgment in our supportive community."
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Connect with researchers from top institutions worldwide."
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Get recognized for your contributions to the research community."
    },
    {
      icon: BookOpen,
      title: "Knowledge Sharing",
      description: "Access valuable insights from real research experiences."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Researchers" },
    { number: "50,000+", label: "Research Stories" },
    { number: "150+", label: "Countries" },
    { number: "95%", label: "Success Rate" }
  ];

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // Navigate to profile page
      window.location.href = '/profile';
    } else {
      // Navigate to login page
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to <span className="text-blue-300">Errify</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Errify is a platform for researchers to share their research failures and successes,
              collaborate with peers, and learn from shared experiences in a supportive environment.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe that every research failure is a stepping stone to success.
              Our mission is to create a global community where researchers can openly
              share their experiences, learn from each other, and accelerate scientific progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">For Researchers</h3>
              </div>
              <p className="text-gray-600">
                Share your research journey, connect with peers, and get valuable feedback
                on your work. Whether it's a breakthrough or a setback, every experience
                contributes to the collective knowledge of the scientific community.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <Microscope className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">For Science</h3>
              </div>
              <p className="text-gray-600">
                Accelerate scientific progress by learning from shared experiences.
                Reduce redundant research efforts and build upon the knowledge of
                researchers worldwide through transparent collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to share, collaborate, and grow in your research journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Errify?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of researchers who trust Errify for their research collaboration needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Growing Community</h2>
            <p className="text-blue-100 text-lg">
              Join thousands of researchers already sharing their experiences on Errify.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-300 mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started with Errify in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Profile</h3>
              <p className="text-gray-600 text-sm">
                Sign up and create your researcher profile with your expertise and interests.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Stories</h3>
              <p className="text-gray-600 text-sm">
                Share your research experiences, both successes and failures, with the community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect & Collaborate</h3>
              <p className="text-gray-600 text-sm">
                Connect with other researchers, get feedback, and collaborate on projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Join the Research Revolution?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start sharing your research journey and connect with researchers worldwide.
            Every experience matters in advancing science.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Errify</h3>
              <p className="text-gray-600 text-sm">
                Connecting researchers through shared experiences of failure and success.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Support</a></li>
                <li><a href="#" className="hover:text-gray-900">Feedback</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © 2024 Errify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About; 