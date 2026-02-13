import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import { RatingComponent, QuickSatisfaction } from '@/components/feedback/RatingComponent';
import { SessionFeedback, QuickFeedback } from '@/types/feedback';
import { MessageSquare, Star, TrendingUp, Clock, BarChart3 } from 'lucide-react';

const FeedbackDemo: React.FC = () => {
  const [submittedFeedback, setSubmittedFeedback] = React.useState<SessionFeedback | null>(null);
  const [submittedQuickFeedback, setSubmittedQuickFeedback] = React.useState<QuickFeedback | null>(
    null
  );
  const [showDemo, setShowDemo] = React.useState(false);

  const handleFeedbackSubmit = (feedback: SessionFeedback) => {
    console.log('Submitted full feedback:', feedback);
    setSubmittedFeedback(feedback);

    // Here you would typically send the feedback to your backend
    // For demo purposes, we'll store it in localStorage
    const existingFeedbacks = JSON.parse(localStorage.getItem('session_feedbacks') || '[]');
    existingFeedbacks.push(feedback);
    localStorage.setItem('session_feedbacks', JSON.stringify(existingFeedbacks));
  };

  const handleQuickFeedbackSubmit = (feedback: QuickFeedback) => {
    console.log('Submitted quick feedback:', feedback);
    setSubmittedQuickFeedback(feedback);

    // Store quick feedback
    const existingQuickFeedbacks = JSON.parse(localStorage.getItem('quick_feedbacks') || '[]');
    existingQuickFeedbacks.push(feedback);
    localStorage.setItem('quick_feedbacks', JSON.stringify(existingQuickFeedbacks));
  };

  const demoRatingComponents = () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-primary" />
            <span>Rating Variants</span>
          </CardTitle>
          <CardDescription>Different rating component styles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RatingComponent
            question="Star Rating (Default)"
            value={4}
            variant="stars"
            showEmoji
            showLabels
          />

          <RatingComponent question="Emoji Rating" value={5} variant="emoji" showLabels />

          <RatingComponent question="Thumbs Rating" value={3} variant="thumbs" showLabels />

          <RatingComponent question="Heart Rating" value={5} variant="hearts" showLabels />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Quick Satisfaction</span>
          </CardTitle>
          <CardDescription>One-click satisfaction feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <QuickSatisfaction question="How was your experience?" value="satisfied" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Session Feedback System</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time feedback collection system for counseling sessions with star ratings, emoji
            feedback, and comprehensive form handling.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="outline">Feature 5</Badge>
            <Badge variant="secondary">Session Rating</Badge>
            <Badge variant="secondary">Quick Feedback</Badge>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setShowDemo(!showDemo)}
            variant={showDemo ? 'default' : 'outline'}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>{showDemo ? 'Hide Demo' : 'Show Component Demo'}</span>
          </Button>
          <Button
            onClick={() => {
              setSubmittedFeedback(null);
              setSubmittedQuickFeedback(null);
            }}
            variant="outline"
          >
            Reset Demo
          </Button>
        </div>

        {/* Component Demo */}
        {showDemo && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Component Showcase</h2>
            {demoRatingComponents()}
          </div>
        )}

        {/* Main Feedback Form */}
        <div className="max-w-3xl mx-auto">
          <FeedbackForm
            sessionId="demo_session_123"
            studentId="student_456"
            counselorId="counselor_789"
            counselorName="Dr. Sarah Johnson"
            sessionDate="2024-01-15"
            sessionDuration={50}
            onSubmit={handleFeedbackSubmit}
            onQuickSubmit={handleQuickFeedbackSubmit}
          />
        </div>

        {/* Submitted Feedback Display */}
        {(submittedFeedback || submittedQuickFeedback) && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">Submitted Feedback</h2>

            <div className="grid gap-6 lg:grid-cols-2">
              {submittedFeedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-primary" />
                      <span>Complete Feedback</span>
                    </CardTitle>
                    <CardDescription>
                      Submitted at {new Date(submittedFeedback.submittedAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Overall Rating:</span>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: submittedFeedback.overallRating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                          <span className="ml-1">{submittedFeedback.overallRating}/5</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Helpfulness:</span>
                        <div className="flex items-center space-x-1">
                          {Array.from({
                            length: submittedFeedback.categoryRatings.helpfulness,
                          }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                          <span className="ml-1">
                            {submittedFeedback.categoryRatings.helpfulness}/5
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Communication:</span>
                        <div className="flex items-center space-x-1">
                          {Array.from({
                            length: submittedFeedback.categoryRatings.communication,
                          }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                          <span className="ml-1">
                            {submittedFeedback.categoryRatings.communication}/5
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Satisfaction:</span>
                        <div className="flex items-center space-x-1">
                          {Array.from({
                            length: submittedFeedback.categoryRatings.satisfaction,
                          }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                          <span className="ml-1">
                            {submittedFeedback.categoryRatings.satisfaction}/5
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Quick Assessment:</span>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div
                          className={`flex items-center space-x-2 ${submittedFeedback.quickFeedback.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}
                        >
                          <span>{submittedFeedback.quickFeedback.wouldRecommend ? '✓' : '✗'}</span>
                          <span>Would Recommend</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${submittedFeedback.quickFeedback.feelHeard ? 'text-green-600' : 'text-red-600'}`}
                        >
                          <span>{submittedFeedback.quickFeedback.feelHeard ? '✓' : '✗'}</span>
                          <span>Felt Heard</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${submittedFeedback.quickFeedback.goalsMet ? 'text-green-600' : 'text-red-600'}`}
                        >
                          <span>{submittedFeedback.quickFeedback.goalsMet ? '✓' : '✗'}</span>
                          <span>Goals Met</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${submittedFeedback.quickFeedback.safeEnvironment ? 'text-green-600' : 'text-red-600'}`}
                        >
                          <span>{submittedFeedback.quickFeedback.safeEnvironment ? '✓' : '✗'}</span>
                          <span>Safe Environment</span>
                        </div>
                      </div>
                    </div>

                    {submittedFeedback.detailedFeedback?.additionalComments && (
                      <div>
                        <span className="font-medium">Additional Comments:</span>
                        <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">
                          {submittedFeedback.detailedFeedback.additionalComments}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {submittedQuickFeedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Quick Feedback</span>
                    </CardTitle>
                    <CardDescription>Fast feedback submission</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div
                        className={`flex items-center space-x-2 ${submittedQuickFeedback.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}
                      >
                        <span>{submittedQuickFeedback.wouldRecommend ? '✓' : '✗'}</span>
                        <span>Would Recommend</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${submittedQuickFeedback.feelHeard ? 'text-green-600' : 'text-red-600'}`}
                      >
                        <span>{submittedQuickFeedback.feelHeard ? '✓' : '✗'}</span>
                        <span>Felt Heard</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${submittedQuickFeedback.goalsMet ? 'text-green-600' : 'text-red-600'}`}
                      >
                        <span>{submittedQuickFeedback.goalsMet ? '✓' : '✗'}</span>
                        <span>Goals Met</span>
                      </div>
                      <div
                        className={`flex items-center space-x-2 ${submittedQuickFeedback.safeEnvironment ? 'text-green-600' : 'text-red-600'}`}
                      >
                        <span>{submittedQuickFeedback.safeEnvironment ? '✓' : '✗'}</span>
                        <span>Safe Environment</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Feature Status */}
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ✅ Feature 5: Session Feedback System - Complete!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-green-700">
              <div>✓ Star rating system</div>
              <div>✓ Emoji feedback options</div>
              <div>✓ Quick satisfaction forms</div>
              <div>✓ Multi-step form wizard</div>
              <div>✓ TypeScript interfaces</div>
              <div>✓ Real-time validation</div>
              <div>✓ Progress tracking</div>
              <div>✓ Submission handling</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDemo;
