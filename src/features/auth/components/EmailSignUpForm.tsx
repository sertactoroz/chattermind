// 'use client';
// 
// import React, { useState } from 'react';
// import { useTranslations } from 'next-intl';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useAuthContext } from '@/features/auth/context/AuthProvider';
// import { Mail, Lock } from 'lucide-react'; // Icons for fields
// 
// // 💡 Defining the required props interface
// interface EmailSignUpFormProps {
//     onSuccess: () => void;
//     onSubmissionStart: () => void;
//     onSubmissionEnd: () => void;
// }
// 
// /**
//  * Form component for signing up with email and password.
//  */
// export default function EmailSignUpForm({
//     onSuccess,
//     onSubmissionStart, // 💡 FIX: Destructure new prop
//     onSubmissionEnd    // 💡 FIX: Destructure new prop
// }: EmailSignUpFormProps) { // 💡 FIX: Use the full interface as the component argument type
// 
//     const t = useTranslations('Auth');
//     // We use the general 'loading' state for the submit button visibility
//     const { signUpWithEmail, loading } = useAuthContext();
// 
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
// 
//     // NOTE: isSubmitting is often redundant if you rely on the AuthContext's 'loading' state,
//     // but kept here to maintain component logic integrity. We will prioritize the context's 'loading'.
//     const [isSubmitting, setIsSubmitting] = useState(false);
// 
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
// 
//         if (!email || !password) {
//             // Add client-side validation toast if needed
//             return;
//         }
// 
//         setIsSubmitting(true);
//         onSubmissionStart(); // 💡 FIX: Notify parent that submission has started
// 
//         try {
//             // Call the context function with user input
//             await signUpWithEmail(email, password);
// 
//             // If sign up succeeds (even if email confirmation is needed), close the modal
//             onSuccess();
//         } catch (error) {
//             // Error handled by AuthProvider toast, just reset loading state
//         } finally {
//             setIsSubmitting(false);
//             onSubmissionEnd(); // 💡 FIX: Notify parent that submission has ended
//         }
//     };
// 
//     return (
//         <form onSubmit={handleSubmit} className="space-y-6 pt-2">
// 
//             {/* Email Input */}
//             <div className="space-y-2">
//                 <Label htmlFor="email">{t('email_label') || 'Email'}</Label>
//                 <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                         id="email"
//                         type="email"
//                         placeholder="you@example.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         className="pl-10" // Add padding for icon
//                     />
//                 </div>
//             </div>
// 
//             {/* Password Input */}
//             <div className="space-y-2">
//                 <Label htmlFor="password">{t('password_label') || 'Password'}</Label>
//                 <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                         id="password"
//                         type="password"
//                         placeholder={t('password_placeholder') || 'Enter secure password'}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         minLength={6}
//                         className="pl-10"
//                     />
//                 </div>
//             </div>
// 
//             {/* Submit Button */}
//             <Button
//                 type="submit"
//                 className="w-full h-10"
//                 // Use AuthContext loading to disable the button, synchronized by the callbacks
//                 disabled={isSubmitting || loading}
//             >
//                 {isSubmitting || loading ? t('submitting') || 'Signing up...' : t('signup_action') || 'Create Account'}
//             </Button>
//         </form>
//     );
// }