<?php

namespace App\Controller\Back;

use App\Entity\Materiel;
use App\Entity\Service;
use App\Entity\User;
use App\Repository\MaterielRepository;
use App\Repository\ServiceRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    #[Route('/', name: 'admin_dashboard')]
    public function dashboard(ServiceRepository $serviceRepository, MaterielRepository $materielRepository, UserRepository $userRepository): Response
    {
        $userStats = $userRepository->getAdminStats();
        $serviceStats = $serviceRepository->getAdminStats();
        $toolStats = $materielRepository->getAdminStats();

        $stats = [
            'totalUsers' => $userStats['total'],
            'totalHosts' => $userStats['hosts'],
            'totalGuests' => $userStats['guests'],
            'totalServices' => $serviceStats['total'],
            'totalTools' => $toolStats['total'],
            'totalBookings' => 0,
            'totalToolRentals' => 0,
            'pendingReports' => 0,
            'flaggedAccounts' => 0,
            'monthlyRevenue' => 0,
            'cancellationRate' => 0,
        ];

        return $this->render('admin/dashboard.html.twig', [
            'stats' => $stats,
        ]);
    }

    #[Route('/users', name: 'admin_users')]
    public function users(Request $request, UserRepository $userRepository): Response
    {
        $search = $request->query->get('search');
        $role = $request->query->get('role');
        $status = $request->query->get('status');
        $sort = $request->query->get('sort', 'newest');

        $users = $userRepository->findForAdmin($search, $role, $status, $sort);
        $stats = $userRepository->getAdminStats();

        return $this->render('admin/users.html.twig', [
            'users' => $users,
            'active_users_count' => $stats['active'],
            'inactive_users_count' => $stats['inactive'],
            'total_users_count' => $stats['total'],
            'filters' => [
                'search' => $search,
                'role' => $role,
                'status' => $status,
                'sort' => $sort,
            ],
        ]);
    }

    #[Route('/users/stats', name: 'admin_users_stats')]
    public function usersStats(UserRepository $userRepository): Response
    {
        return $this->render('admin/users_stats.html.twig', [
            'stats' => $userRepository->getAdminStats(),
        ]);
    }

    #[Route('/users/export', name: 'admin_users_export')]
    public function exportUsers(Request $request, UserRepository $userRepository): StreamedResponse
    {
        $search = $request->query->get('search');
        $role = $request->query->get('role');
        $status = $request->query->get('status');
        $sort = $request->query->get('sort', 'newest');
        $users = $userRepository->findForAdmin($search, $role, $status, $sort);

        $response = new StreamedResponse(function () use ($users): void {
            $handle = fopen('php://output', 'wb');
            if (!$handle) {
                return;
            }

            fputcsv($handle, ['ID', 'Email', 'Role', 'Status'], ';');
            foreach ($users as $user) {
                $roleLabel = 'Voyageur';
                if (in_array('ROLE_ADMIN', $user->getRoles(), true)) {
                    $roleLabel = 'Administrateur';
                } elseif (in_array('ROLE_HOST', $user->getRoles(), true)) {
                    $roleLabel = 'Hote';
                }

                fputcsv($handle, [
                    $user->getId(),
                    $user->getEmail(),
                    $roleLabel,
                    $user->isVerified() ? 'Actif' : 'Inactif',
                ], ';');
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="users-export.csv"');

        return $response;
    }

    #[Route('/users/{id}/toggle-status', name: 'admin_user_toggle_status', methods: ['POST'])]
    public function toggleUserStatus(string $id, Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('toggle-status' . $id, (string) $request->request->get('_token'))) {
            $user = $userRepository->find($id);
            if ($user instanceof User) {
                $user->setIsVerified(!$user->isVerified());
                $entityManager->flush();
                $this->addFlash('success', 'Le statut de l\'utilisateur a ete mis a jour.');
            }
        }

        return $this->redirectToRoute('admin_users');
    }

    #[Route('/services', name: 'admin_services')]
    public function services(Request $request, ServiceRepository $serviceRepository): Response
    {
        $search = $request->query->get('search');
        $sort = $request->query->get('sort', 'date_desc');

        return $this->render('admin/services.html.twig', [
            'services' => $serviceRepository->findForAdmin($search, $sort),
            'stats' => $serviceRepository->getAdminStats(),
            'filters' => [
                'search' => $search,
                'sort' => $sort,
            ],
        ]);
    }

    #[Route('/services/stats', name: 'admin_services_stats')]
    public function servicesStats(ServiceRepository $serviceRepository): Response
    {
        return $this->render('admin/services_stats.html.twig', [
            'stats' => $serviceRepository->getAdminStats(),
        ]);
    }

    #[Route('/services/export', name: 'admin_services_export')]
    public function exportServices(Request $request, ServiceRepository $serviceRepository): StreamedResponse
    {
        $search = $request->query->get('search');
        $sort = $request->query->get('sort', 'date_desc');
        $services = $serviceRepository->findForAdmin($search, $sort);

        $response = new StreamedResponse(function () use ($services): void {
            $handle = fopen('php://output', 'wb');
            if (!$handle) {
                return;
            }

            fputcsv($handle, ['ID', 'Titre', 'Description', 'Date service', 'Proprietaire'], ';');
            foreach ($services as $service) {
                fputcsv($handle, [
                    $service->getId(),
                    $service->getTitre(),
                    $service->getDescription() ?? '',
                    $service->getDateService()?->format('Y-m-d H:i:s') ?? '',
                    $service->getUser()?->getEmail() ?? '',
                ], ';');
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="services-export.csv"');

        return $response;
    }

    #[Route('/services/{id}/edit', name: 'admin_service_edit', methods: ['GET', 'POST'])]
    public function editService(Service $service, Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('POST')) {
            if (!$this->isCsrfTokenValid('edit-service' . $service->getId(), (string) $request->request->get('_token'))) {
                $this->addFlash('error', 'Jeton CSRF invalide.');
                return $this->redirectToRoute('admin_service_edit', ['id' => $service->getId()]);
            }

            $titre = trim((string) $request->request->get('titre', ''));
            $description = trim((string) $request->request->get('description', ''));
            $dateValue = (string) $request->request->get('date_service', '');

            if ($titre === '' || $dateValue === '') {
                $this->addFlash('error', 'Titre et date obligatoires.');
                return $this->redirectToRoute('admin_service_edit', ['id' => $service->getId()]);
            }

            try {
                $dateService = new \DateTimeImmutable($dateValue);
            } catch (\Exception) {
                $this->addFlash('error', 'Date invalide.');
                return $this->redirectToRoute('admin_service_edit', ['id' => $service->getId()]);
            }

            $service
                ->setTitre($titre)
                ->setDescription($description !== '' ? $description : null)
                ->setDateService($dateService);

            $entityManager->flush();
            $this->addFlash('success', 'Service modifie avec succes.');
            return $this->redirectToRoute('admin_services');
        }

        return $this->render('admin/service_edit.html.twig', [
            'service' => $service,
        ]);
    }

    #[Route('/services/{id}/delete', name: 'admin_service_delete', methods: ['POST'])]
    public function deleteService(Service $service, Request $request, EntityManagerInterface $entityManager): Response
    {
        if (!$this->isCsrfTokenValid('delete-service' . $service->getId(), (string) $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton CSRF invalide.');
            return $this->redirectToRoute('admin_services');
        }

        $entityManager->remove($service);
        $entityManager->flush();
        $this->addFlash('success', 'Service supprime avec succes.');

        return $this->redirectToRoute('admin_services');
    }

    #[Route('/tools', name: 'admin_tools')]
    public function tools(Request $request, MaterielRepository $materielRepository): Response
    {
        $search = $request->query->get('search');
        $status = $request->query->get('status');
        $sort = $request->query->get('sort', 'newest');

        return $this->render('admin/tools.html.twig', [
            'tools' => $materielRepository->findForAdmin($search, $status, $sort),
            'stats' => $materielRepository->getAdminStats(),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort' => $sort,
            ],
        ]);
    }

    #[Route('/tools/stats', name: 'admin_tools_stats')]
    public function toolsStats(MaterielRepository $materielRepository): Response
    {
        return $this->render('admin/tools_stats.html.twig', [
            'stats' => $materielRepository->getAdminStats(),
        ]);
    }

    #[Route('/tools/export', name: 'admin_tools_export')]
    public function exportTools(Request $request, MaterielRepository $materielRepository): StreamedResponse
    {
        $search = $request->query->get('search');
        $status = $request->query->get('status');
        $sort = $request->query->get('sort', 'newest');
        $tools = $materielRepository->findForAdmin($search, $status, $sort);

        $response = new StreamedResponse(function () use ($tools): void {
            $handle = fopen('php://output', 'wb');
            if (!$handle) {
                return;
            }

            fputcsv($handle, ['ID', 'Nom', 'Etat', 'Disponible'], ';');
            foreach ($tools as $tool) {
                fputcsv($handle, [
                    $tool->getId(),
                    $tool->getNom(),
                    $tool->getEtat() ?? '',
                    $tool->isDisponible() ? 'Oui' : 'Non',
                ], ';');
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="materiel-export.csv"');

        return $response;
    }

    #[Route('/tools/{id}/edit', name: 'admin_tool_edit', methods: ['GET', 'POST'])]
    public function editTool(Materiel $materiel, Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('POST')) {
            if (!$this->isCsrfTokenValid('edit-tool' . $materiel->getId(), (string) $request->request->get('_token'))) {
                $this->addFlash('error', 'Jeton CSRF invalide.');
                return $this->redirectToRoute('admin_tool_edit', ['id' => $materiel->getId()]);
            }

            $nom = trim((string) $request->request->get('nom', ''));
            $etat = trim((string) $request->request->get('etat', ''));
            $disponible = $request->request->getBoolean('disponible', false);

            if ($nom === '') {
                $this->addFlash('error', 'Le nom est obligatoire.');
                return $this->redirectToRoute('admin_tool_edit', ['id' => $materiel->getId()]);
            }

            $materiel
                ->setNom($nom)
                ->setEtat($etat !== '' ? $etat : null)
                ->setDisponible($disponible);

            $entityManager->flush();
            $this->addFlash('success', 'Materiel modifie avec succes.');
            return $this->redirectToRoute('admin_tools');
        }

        return $this->render('admin/tool_edit.html.twig', [
            'tool' => $materiel,
        ]);
    }

    #[Route('/tools/{id}/delete', name: 'admin_tool_delete', methods: ['POST'])]
    public function deleteTool(Materiel $materiel, Request $request, EntityManagerInterface $entityManager): Response
    {
        if (!$this->isCsrfTokenValid('delete-tool' . $materiel->getId(), (string) $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton CSRF invalide.');
            return $this->redirectToRoute('admin_tools');
        }

        $entityManager->remove($materiel);
        $entityManager->flush();
        $this->addFlash('success', 'Materiel supprime avec succes.');

        return $this->redirectToRoute('admin_tools');
    }

    #[Route('/bookings', name: 'admin_bookings')]
    public function bookings(Request $request): Response
    {
        $tab = $request->query->get('tab', 'all');
        $search = $request->query->get('search');
        $type = $request->query->get('type');
        $status = $request->query->get('status');

        return $this->render('admin/bookings.html.twig', [
            'service_bookings_count' => 4,
            'tool_rentals_count' => 2,
            'cancelled_count' => 1,
        ]);
    }

    #[Route('/reports', name: 'admin_reports')]
    public function reports(Request $request): Response
    {
        $tab = $request->query->get('tab', 'reports');
        $search = $request->query->get('search');
        $status = $request->query->get('status');

        return $this->render('admin/reports.html.twig', [
            'pending_reports_count' => 3,
            'critical_alerts_count' => 2,
            'unread_alerts_count' => 3,
        ]);
    }

    #[Route('/reports/{id}/resolve', name: 'admin_report_resolve', methods: ['POST'])]
    public function resolveReport(string $id, Request $request): Response
    {
        if ($this->isCsrfTokenValid('resolve' . $id, (string) $request->request->get('_token'))) {
            $this->addFlash('success', 'Le signalement a ete resolu.');
        }

        return $this->redirectToRoute('admin_reports');
    }

    #[Route('/reports/{id}/dismiss', name: 'admin_report_dismiss', methods: ['POST'])]
    public function dismissReport(string $id, Request $request): Response
    {
        if ($this->isCsrfTokenValid('dismiss' . $id, (string) $request->request->get('_token'))) {
            $this->addFlash('success', 'Le signalement a ete rejete.');
        }

        return $this->redirectToRoute('admin_reports');
    }

    #[Route('/alerts/{id}/mark-read', name: 'admin_alert_mark_read', methods: ['POST'])]
    public function markAlertRead(string $id, Request $request): Response
    {
        if ($this->isCsrfTokenValid('mark-read' . $id, (string) $request->request->get('_token'))) {
            $this->addFlash('success', 'Alerte marquee comme lue.');
        }

        return $this->redirectToRoute('admin_reports');
    }

    #[Route('/analytics', name: 'admin_analytics')]
    public function analytics(Request $request): Response
    {
        $range = $request->query->get('range', '30d');

        return $this->render('admin/analytics.html.twig', [
            'range' => $range,
        ]);
    }

    #[Route('/settings', name: 'admin_settings')]
    public function settings(): Response
    {
        return $this->render('admin/settings.html.twig');
    }

    #[Route('/settings/profile', name: 'admin_settings_profile', methods: ['POST'])]
    public function updateProfile(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-profile', (string) $request->request->get('_token'))) {
            $this->addFlash('success', 'Votre profil a ete mis a jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    #[Route('/settings/notifications', name: 'admin_settings_notifications', methods: ['POST'])]
    public function updateNotifications(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-notifications', (string) $request->request->get('_token'))) {
            $this->addFlash('success', 'Preferences de notification mises a jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    #[Route('/settings/password', name: 'admin_settings_password', methods: ['POST'])]
    public function updatePassword(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-password', (string) $request->request->get('_token'))) {
            $this->addFlash('success', 'Mot de passe mis a jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    #[Route('/settings/security', name: 'admin_settings_security', methods: ['POST'])]
    public function updateSecurity(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-security', (string) $request->request->get('_token'))) {
            $this->addFlash('success', 'Parametres de securite mis a jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    #[Route('/settings/platform', name: 'admin_settings_platform', methods: ['POST'])]
    public function updatePlatform(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-platform', (string) $request->request->get('_token'))) {
            $this->addFlash('success', 'Parametres plateforme mis a jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    #[Route('/users/{id}', name: 'admin_user_show')]
    public function showUser(string $id): Response
    {
        return $this->redirectToRoute('admin_users');
    }
}
