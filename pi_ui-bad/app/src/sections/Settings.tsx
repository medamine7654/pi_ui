import { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Mail,
  Lock,
  Smartphone,
  Globe,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reports: true,
    fraud: true,
    bookings: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: '30',
  });

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#484848]">Paramètres</h1>
        <p className="text-gray-500 mt-1">Gérer vos préférences et la configuration</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="platform">Plateforme</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                  <AvatarFallback className="bg-[#FF5A5F] text-white text-xl">AD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Changer la photo
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              <Separator />

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue="RentAdmin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@rentadmin.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" defaultValue="+33 6 12 34 56 78" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#FF5A5F] hover:bg-[#FF5A5F]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Notifications par email</p>
                      <p className="text-sm text-gray-500">Recevoir des emails pour les événements importants</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(v) => setNotifications({...notifications, email: v})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Notifications push</p>
                      <p className="text-sm text-gray-500">Notifications en temps réel sur votre appareil</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push} 
                    onCheckedChange={(v) => setNotifications({...notifications, push: v})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Nouveaux signalements</p>
                      <p className="text-sm text-gray-500">Être alerté des nouveaux signalements</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.reports} 
                    onCheckedChange={(v) => setNotifications({...notifications, reports: v})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Alertes de fraude</p>
                      <p className="text-sm text-gray-500">Notifications pour les activités suspectes</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.fraud} 
                    onCheckedChange={(v) => setNotifications({...notifications, fraud: v})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Nouvelles réservations</p>
                      <p className="text-sm text-gray-500">Être notifié des nouvelles réservations</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.bookings} 
                    onCheckedChange={(v) => setNotifications({...notifications, bookings: v})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#FF5A5F] hover:bg-[#FF5A5F]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>Protégez votre compte administrateur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password */}
              <div className="space-y-4">
                <h4 className="font-medium">Changer le mot de passe</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button variant="outline">Mettre à jour le mot de passe</Button>
              </div>

              <Separator />

              {/* 2FA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Authentification à deux facteurs</p>
                    <p className="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
                  </div>
                </div>
                <Switch 
                  checked={security.twoFactor} 
                  onCheckedChange={(v) => setSecurity({...security, twoFactor: v})}
                />
              </div>

              <Separator />

              {/* Login Alerts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Alertes de connexion</p>
                    <p className="text-sm text-gray-500">Être notifié des nouvelles connexions</p>
                  </div>
                </div>
                <Switch 
                  checked={security.loginAlerts} 
                  onCheckedChange={(v) => setSecurity({...security, loginAlerts: v})}
                />
              </div>

              <Separator />

              {/* Session Timeout */}
              <div className="space-y-2">
                <Label htmlFor="timeout">Délai d'expiration de session (minutes)</Label>
                <Input 
                  id="timeout" 
                  type="number" 
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de la plateforme</CardTitle>
              <CardDescription>Paramètres globaux de l'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fraud Detection Thresholds */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Seuils de détection de fraude
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancellationThreshold">Taux d'annulation (%)</Label>
                    <Input id="cancellationThreshold" type="number" defaultValue="10" />
                    <p className="text-xs text-gray-500">Alerte si dépassé</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewThreshold">Note minimale</Label>
                    <Input id="reviewThreshold" type="number" defaultValue="3.5" step="0.1" />
                    <p className="text-xs text-gray-500">Alerte si en dessous</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listingThreshold">Annonces par jour</Label>
                    <Input id="listingThreshold" type="number" defaultValue="5" />
                    <p className="text-xs text-gray-500">Alerte si dépassé</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportThreshold">Signalements</Label>
                    <Input id="reportThreshold" type="number" defaultValue="3" />
                    <p className="text-xs text-gray-500">Suspension automatique</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Platform Settings */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Paramètres généraux
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mode maintenance</p>
                    <p className="text-sm text-gray-500">Rendre la plateforme inaccessible</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Inscriptions ouvertes</p>
                    <p className="text-sm text-gray-500">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Validation automatique</p>
                    <p className="text-sm text-gray-500">Approuver automatiquement les nouveaux services</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#FF5A5F] hover:bg-[#FF5A5F]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
