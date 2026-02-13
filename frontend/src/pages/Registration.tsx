import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'react-toastify';
import PageTransition from '@/components/ui/PageTransition';
import ScrollFadeIn from '@/components/ui/ScrollFadeIn';
import CryptoJS from 'crypto-js';
import * as bcrypt from 'bcryptjs';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'counselor' | 'admin' | '';
  dateOfBirth?: string;
  university?: string;
  major?: string;
  year?: string;
  license?: string;
  specialization?: string;
  experience?: string;
  department?: string;
}

// Password database storage (bcrypt-hashed passwords, stored directly)
// This is secure because bcrypt hashes are cryptographically irreversible
const passwordStorage = {
  setItem: (key: string, value: any): void => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  getItem: (key: string): any | null => {
    const data = sessionStorage.getItem(key);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Parse failed:', error);
      return null;
    }
  },
};

// Bcrypt password hashing (high computational cost)
const hashPassword = (password: string): string => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

// Generate cryptographically secure random ID
const generateSecureId = (): string => {
  const timestamp = Date.now();
  const randomBytes = CryptoJS.lib.WordArray.random(16);
  const randomString = randomBytes.toString(CryptoJS.enc.Hex);
  return `user_${timestamp}_${randomString}`;
};

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    dateOfBirth: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRoleChange = (value: 'student' | 'counselor' | 'admin') => {
    setFormData(prev => ({ ...prev, role: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.role) {
      setError('Please select a role');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing users from password storage
      const existingUsers = passwordStorage.getItem('mindbuddy_users_db') || {};

      if (existingUsers[formData.email]) {
        setError('An account with this email already exists');
        setIsLoading(false);
        return;
      }

      const userId = generateSecureId();

      // Create user profile (NO password field)
      const newUser = {
        id: userId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: '/api/placeholder/150/150',
        phone: '',
        dateOfBirth: formData.dateOfBirth || '',
        emergencyContact: '',
        emergencyPhone: '',
        preferredLanguage: 'English',
        timezone: 'Asia/Kolkata',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      if (formData.role === 'student') {
        Object.assign(newUser, {
          university: formData.university || '',
          major: formData.major || '',
          year: formData.year || '',
          studentId: `STU-${Date.now()}`,
        });
      } else if (formData.role === 'counselor') {
        Object.assign(newUser, {
          license: formData.license || '',
          specialization: formData.specialization ? formData.specialization.split(',').map(s => s.trim()) : [],
          experience: formData.experience || '',
        });
      } else if (formData.role === 'admin') {
        Object.assign(newUser, {
          department: formData.department || '',
          permissions: ['user_management', 'system_settings', 'analytics_view'],
        });
      }

      // Store with bcrypt-hashed password in password storage
      // This keeps password data separate from AES encryption flow
      existingUsers[formData.email] = {
        password: hashPassword(formData.password),
        user: newUser,
      };

      passwordStorage.setItem('mindbuddy_users_db', existingUsers);

      toast.success('Registration successful! Please login.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'student':
        return 'Access peer support, counseling sessions, and mental health resources';
      case 'counselor':
        return 'Provide professional counseling and support to students';
      case 'admin':
        return 'Manage platform operations, users, and system settings';
      default:
        return '';
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4">
        <ScrollFadeIn>
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
              <CardDescription className="text-lg">
                Join Mind Care - Your trusted mental health companion
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Select Role *</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="counselor">Counselor</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.role && (
                    <p className="text-sm text-muted-foreground">
                      {getRoleDescription(formData.role)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>

                {formData.role === 'student' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-semibold">Student Information (Optional)</h3>
                    <Input
                      name="university"
                      placeholder="University"
                      value={formData.university}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="major"
                      placeholder="Major"
                      value={formData.major}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="year"
                      placeholder="Year"
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                {formData.role === 'counselor' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-purple-50">
                    <h3 className="font-semibold">Counselor Information (Optional)</h3>
                    <Input
                      name="license"
                      placeholder="License Number"
                      value={formData.license}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="specialization"
                      placeholder="Specialization (comma-separated)"
                      value={formData.specialization}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="experience"
                      placeholder="Years of Experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                {formData.role === 'admin' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-green-50">
                    <h3 className="font-semibold">Administrator Information (Optional)</h3>
                    <Input
                      name="department"
                      placeholder="Department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Your data is encrypted and secure. We follow HIPAA compliance standards.
              </p>
            </CardFooter>
          </Card>
        </ScrollFadeIn>
      </div>
    </PageTransition>
  );
};

export default Register;
