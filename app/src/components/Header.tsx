import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function Header({ onSearch, searchPlaceholder = 'Rechercher...' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl ml-12 lg:ml-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-[#484848]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5A5F] rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-sm font-medium">Nouveau signalement</span>
                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                  </div>
                  <span className="text-xs text-gray-500">Service "Visite guidée du Louvre" signalé</span>
                  <span className="text-xs text-gray-400">Il y a 10 minutes</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <span className="text-sm font-medium">Compte suspendu</span>
                  <span className="text-xs text-gray-500">Sophie Bernard a été suspendue</span>
                  <span className="text-xs text-gray-400">Il y a 2 heures</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <span className="text-sm font-medium">Nouvelle réservation</span>
                  <span className="text-xs text-gray-500">Réservation de matériel confirmée</span>
                  <span className="text-xs text-gray-400">Il y a 3 heures</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-[#00A699]">
                Voir toutes les notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                  <AvatarFallback className="bg-[#FF5A5F] text-white">AD</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-[#484848]">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#FF5A5F]">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
