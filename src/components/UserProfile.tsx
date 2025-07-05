import React, { useState, useEffect } from 'react';
import { User, Lock, Save, X, AlertCircle, CheckCircle, Eye, EyeOff, Edit, Mail, Shield, Calendar, Check, Star, Award, Zap } from 'lucide-react';
import { authService } from '../services/authService';
import { User as UserType } from '../types/user';

interface UserProfileProps {
  user: UserType;
  onClose: () => void;
  onUserUpdate?: (user: UserType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
    color: string;
    requirements: { met: boolean; text: string }[];
  }>({ 
    score: 0, 
    feedback: '', 
    color: 'bg-gray-200',
    requirements: []
  });

  // Clear messages when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeTab]);

  // Enhanced password strength checker
  useEffect(() => {
    if (passwordData.newPassword) {
      const password = passwordData.newPassword;
      let score = 0;
      let feedback = '';
      let color = '';

      const requirements = [
        { met: password.length >= 8, text: 'Au moins 8 caractères' },
        { met: password.length >= 12, text: 'Au moins 12 caractères' },
        { met: /[A-Z]/.test(password), text: 'Une lettre majuscule' },
        { met: /[a-z]/.test(password), text: 'Une lettre minuscule' },
        { met: /[0-9]/.test(password), text: 'Un chiffre' },
        { met: /[^A-Za-z0-9]/.test(password), text: 'Un caractère spécial' }
      ];

      score = requirements.filter(req => req.met).length;

      if (score < 2) {
        feedback = 'Très faible';
        color = 'bg-red-500';
      } else if (score < 4) {
        feedback = 'Faible';
        color = 'bg-orange-500';
      } else if (score < 5) {
        feedback = 'Moyen';
        color = 'bg-yellow-500';
      } else if (score < 6) {
        feedback = 'Fort';
        color = 'bg-blue-500';
      } else {
        feedback = 'Très fort';
        color = 'bg-green-500';
      }

      setPasswordStrength({ score, feedback, color, requirements });
    } else {
      setPasswordStrength({ 
        score: 0, 
        feedback: '', 
        color: 'bg-gray-200',
        requirements: []
      });
    }
  }, [passwordData.newPassword]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!passwordData.currentPassword) {
      setError('Le mot de passe actuel est requis');
      return;
    }

    if (!passwordData.newPassword) {
      setError('Le nouveau mot de passe est requis');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Mot de passe changé avec succès');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Error changing password:', error);
      let errorMessage = 'Échec du changement de mot de passe';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data.message || 'Mot de passe actuel incorrect';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleDisplay = (role: string) => {
    return role === 'admin' ? 'Administrateur' : 'Utilisateur';
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <Award className="w-4 h-4" /> : <Star className="w-4 h-4" />;
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden transform transition-all duration-300 ease-out scale-100"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 6s ease infinite'
        }}
      >
        {/* Header with animated gradient background */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 opacity-90"></div>
          <div className="absolute inset-0 bg-black opacity-10"></div>
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 -translate-y-16 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full transform translate-x-12 -translate-y-12 animate-pulse delay-1000"></div>
            <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white rounded-full transform -translate-x-20 translate-y-20 animate-pulse delay-2000"></div>
          </div>

          <div className="relative px-8 py-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {getInitials(user.username)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Profil Utilisateur</h2>
                  <p className="text-white text-opacity-80 text-sm">Gérez vos informations personnelles et sécurité</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-xl transition-all duration-200 backdrop-blur-sm group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white border-b border-gray-100">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-6 px-8 text-sm font-semibold text-center transition-all duration-300 relative group ${
                activeTab === 'profile'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <User className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'profile' ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span>Informations Personnelles</span>
              </div>
              {activeTab === 'profile' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-6 px-8 text-sm font-semibold text-center transition-all duration-300 relative group ${
                activeTab === 'password'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <Lock className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'password' ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span>Sécurité & Mot de Passe</span>
              </div>
              {activeTab === 'password' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full"></div>
              )}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Enhanced Alert Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-1">Erreur</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-1">Succès</h3>
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Enhanced User Card */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                  <div className="text-center mb-8">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4 transform transition-transform duration-300 hover:scale-110">
                        {getInitials(user.username)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.username}</h3>
                    <p className="text-gray-600 text-lg">{user.email}</p>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getRoleBadgeColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-2">{getRoleDisplay(user.role)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Nom d'utilisateur</h4>
                      <p className="text-xl font-bold text-gray-900 mt-1">{user.username}</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Adresse Email</h4>
                      <p className="text-xl font-bold text-gray-900 mt-1">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-green-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Niveau d'accès</h4>
                      <p className="text-xl font-bold text-gray-900 mt-1">{getRoleDisplay(user.role)}</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-orange-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Membre depuis</h4>
                      <p className="text-lg font-bold text-gray-900 mt-1">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Status Card */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-green-800">Compte Actif et Vérifié</h4>
                    <p className="text-green-700">Votre compte est en bon état et tous les services sont disponibles</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Password Tab */}
          {activeTab === 'password' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Conseils de Sécurité</h3>
                    <p className="text-yellow-700 mb-3">
                      Utilisez un mot de passe fort pour protéger votre compte. Un bon mot de passe doit contenir :
                    </p>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Au moins 8 caractères (12 recommandés)</li>
                      <li>• Lettres majuscules et minuscules</li>
                      <li>• Chiffres et caractères spéciaux</li>
                      <li>• Aucune information personnelle</li>
                    </ul>
                  </div>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-8">
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mot de passe actuel *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => {
                        setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }));
                        setError('');
                      }}
                      className="w-full px-6 py-4 pr-14 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder="Entrez votre mot de passe actuel"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showCurrentPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nouveau mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                        setError('');
                      }}
                      className="w-full px-6 py-4 pr-14 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder="Entrez votre nouveau mot de passe"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showNewPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                  
                  {/* Enhanced Password Strength Indicator */}
                  {passwordData.newPassword && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Force du mot de passe</span>
                        <span className={`text-sm font-bold ${
                          passwordStrength.score >= 5 ? 'text-green-600' :
                          passwordStrength.score >= 4 ? 'text-blue-600' :
                          passwordStrength.score >= 3 ? 'text-yellow-600' :
                          passwordStrength.score >= 2 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {passwordStrength.feedback}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {passwordStrength.requirements.map((req, index) => (
                          <div key={index} className={`flex items-center text-xs ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${req.met ? 'bg-green-100' : 'bg-gray-100'}`}>
                              {req.met && <Check className="w-2 h-2" />}
                            </div>
                            {req.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Confirmer le nouveau mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => {
                        setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }));
                        setError('');
                      }}
                      className={`w-full px-6 py-4 pr-14 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-lg ${
                        passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Confirmez votre nouveau mot de passe"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Les mots de passe ne correspondent pas
                    </p>
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex justify-end space-x-4 pt-8">
                  <button
                    type="button"
                    onClick={resetPasswordForm}
                    className="px-8 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Modification en cours...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-3" />
                        Changer le mot de passe
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;