'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FaCamera as Camera, 
  FaEnvelope as Mail, 
  FaPhone as Phone, 
  FaShieldAlt as Shield, 
  FaUpload as Upload,
  FaSave as Save,
  FaEdit as Edit,
  FaTrash as Trash2 
} from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/types/auth';
import { ImageUpload } from '@/components/profile/ImageUpload';
import { FormField } from '@/components/profile/FormField';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileCompleteness } from '@/components/profile/ProfileCompleteness';

const Profile = (): React.JSX.Element => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState<Partial<UserType>>(user || {});
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setEditData(user);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">
            Please log in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setValidationErrors({});

    const requiredFields = {
      name: 'Name is required',
      email: 'Email is required',
      phone: 'Phone number is required',
      dateOfBirth: 'Date of birth is required',
    };

    const errors: Record<string, string> = {};

    // Validate required fields
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!editData[field as keyof UserType]) {
        errors[field] = message;
      }
    });

    // Validate email format
    if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate phone format
    if (editData.phone && !/^\+?[\d\s-]{10,}$/.test(editData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Role-specific validation
    if (user.role === 'student') {
      if (!editData.university) errors.university = 'University name is required';
      if (!editData.major) errors.major = 'Major is required';
      if (!editData.studentId) errors.studentId = 'Student ID is required';
    } else if (user.role === 'counselor') {
      if (!editData.license) errors.license = 'License number is required';
      if (!editData.experience) errors.experience = 'Experience is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: 'Validation Error',
        description: 'Please check the highlighted fields and try again.',
        variant: 'destructive',
      });
      return;
    }

    updateUser(editData);
    setIsEditing(false);
    setValidationErrors({});

    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
  };

  const handleImageUpload = (file: File) => {
    setIsUploadingImage(true);
    const imageUrl = URL.createObjectURL(file);

    setTimeout(() => {
      const newEditData = { ...editData, avatar: imageUrl };
      setEditData(newEditData);
      updateUser({ avatar: imageUrl });

      setIsUploadingImage(false);
      toast({
        title: 'Profile Picture Updated',
        description: 'Your profile picture has been updated successfully.',
      });
    }, 1500);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('profile-image-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const removeProfilePicture = () => {
    const newEditData = { ...editData, avatar: undefined };
    setEditData(newEditData);
    updateUser({ avatar: undefined });
    toast({
      title: 'Profile Picture Removed',
      description: 'Your profile picture has been removed.',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-500';
      case 'counselor':
        return 'bg-green-500';
      case 'admin':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <main className="container mx-auto px-8 py-10 max-w-screen-xl space-y-12">
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </section>

      <section className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="w-full lg:w-96 space-y-6">
          <Card className="relative overflow-hidden z-10">
            <CardHeader className="text-center">
              <ImageUpload
                currentImage={editData.avatar || user.avatar}
                onImageUpload={handleImageUpload}
                onImageRemove={removeProfilePicture}
                isLoading={isUploadingImage}
                userName={user.name}
              />
              <CardTitle className="text-xl mt-4">{user.name}</CardTitle>
              <CardDescription className="flex items-center justify-center space-x-2">
                <Badge variant="outline">
                  <span className="text-xs font-medium">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">
                  <Camera size={16} />
                </span>
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <ProfileCompleteness user={user} />
        </div>

        <Card className="w-full flex-1 h-full min-h-[560px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold">Personal Information</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Update your personal details and preferences
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center gap-2"
            >
              {isEditing ? <Save size={16} /> : <Edit size={16} />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="role-specific">
                  {user.role === 'student'
                    ? 'Academic'
                    : user.role === 'counselor'
                      ? 'Professional'
                      : 'Admin'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormField
                      id="name"
                      label="Full Name"
                      value={isEditing ? editData.name || '' : user.name || ''}
                      onChange={(value) => setEditData({ ...editData, name: value })}
                      disabled={!isEditing}
                      error={validationErrors.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      id="email"
                      label="Email"
                      type="email"
                      value={isEditing ? editData.email || '' : user.email || ''}
                      onChange={(value) => setEditData({ ...editData, email: value })}
                      disabled={!isEditing}
                      error={validationErrors.email}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      id="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      value={isEditing ? editData.dateOfBirth || '' : user.dateOfBirth || ''}
                      onChange={(value) => setEditData({ ...editData, dateOfBirth: value })}
                      disabled={!isEditing}
                      error={validationErrors.dateOfBirth}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      id="preferredLanguage"
                      label="Preferred Language"
                      value={
                        isEditing ? editData.preferredLanguage || '' : user.preferredLanguage || ''
                      }
                      onChange={(value) =>
                        setEditData({ ...editData, preferredLanguage: value })
                      }
                      disabled={!isEditing}
                      error={validationErrors.preferredLanguage}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FormField
                    id="emergencyPhone"
                    label="Emergency Phone"
                    value={isEditing ? editData.emergencyPhone || '' : user.emergencyPhone || ''}
                    onChange={(value) => setEditData({ ...editData, emergencyPhone: value })}
                    disabled={!isEditing}
                    error={validationErrors.emergencyPhone}
                  />
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormField
                      id="phone"
                      label="Phone Number"
                      value={isEditing ? editData.phone || '' : user.phone || ''}
                      onChange={(value) => setEditData({ ...editData, phone: value })}
                      disabled={!isEditing}
                      error={validationErrors.phone}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      id="emergencyContact"
                      label="Emergency Contact"
                      value={
                        isEditing ? editData.emergencyContact || '' : user.emergencyContact || ''
                      }
                      onChange={(value) =>
                        setEditData({ ...editData, emergencyContact: value })
                      }
                      disabled={!isEditing}
                      error={validationErrors.emergencyContact}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="role-specific" className="space-y-4 mt-6">
                {user.role === 'student' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormField
                        id="university"
                        label="University"
                        value={isEditing ? editData.university || '' : user.university || ''}
                        onChange={(value) => setEditData({ ...editData, university: value })}
                        disabled={!isEditing}
                        error={validationErrors.university}
                        required={user.role === 'student'}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        id="major"
                        label="Major"
                        value={isEditing ? editData.major || '' : user.major || ''}
                        onChange={(value) => setEditData({ ...editData, major: value })}
                        disabled={!isEditing}
                        error={validationErrors.major}
                        required={user.role === 'student'}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        id="year"
                        label="Academic Year"
                        value={isEditing ? editData.year || '' : user.year || ''}
                        onChange={(value) => setEditData({ ...editData, year: value })}
                        disabled={!isEditing}
                        error={validationErrors.year}
                        required={user.role === 'student'}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        id="studentId"
                        label="Student ID"
                        value={isEditing ? editData.studentId || '' : user.studentId || ''}
                        onChange={(value) => setEditData({ ...editData, studentId: value })}
                        disabled={!isEditing}
                        error={validationErrors.studentId}
                        required={user.role === 'student'}
                      />
                    </div>
                  </div>
                )}

                {user.role === 'counselor' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormField
                          id="license"
                          label="License"
                          value={isEditing ? editData.license || '' : user.license || ''}
                          onChange={(value) => setEditData({ ...editData, license: value })}
                          disabled={!isEditing}
                          error={validationErrors.license}
                          required={user.role === 'counselor'}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormField
                          id="experience"
                          label="Experience"
                          value={isEditing ? editData.experience || '' : user.experience || ''}
                          onChange={(value) => setEditData({ ...editData, experience: value })}
                          disabled={!isEditing}
                          error={validationErrors.experience}
                          required={user.role === 'counselor'}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Specializations</Label>
                      <div className="flex flex-wrap gap-2">
                        {user.specialization?.map((spec: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {user.role === 'admin' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FormField
                        id="department"
                        label="Department"
                        value={isEditing ? editData.department || '' : user.department || ''}
                        onChange={(value) => setEditData({ ...editData, department: value })}
                        disabled={!isEditing}
                        error={validationErrors.department}
                        required={user.role === 'admin'}
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium mb-2">Permissions</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions?.map((permission: string, index: number) => (
                          <span key={index} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            {permission.replace('_', ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Profile;
