<?php

namespace App\Controller;

use App\Entity\Service;
use App\Entity\Tool;
use App\Repository\ServiceRepository;
use App\Repository\ToolRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    /**
     * Dashboard overview
     */
    #[Route('/', name: 'admin_dashboard')]
    public function dashboard(): Response
    {
        // Fetch statistics from your services
        $stats = [
            'totalUsers' => 2847,
            'totalHosts' => 456,
            'totalGuests' => 2391,
            'totalServices' => 1234,
            'totalTools' => 892,
            'totalBookings' => 5678,
            'totalToolRentals' => 3421,
            'pendingReports' => 23,
            'flaggedAccounts' => 12,
            'monthlyRevenue' => 45680,
            'cancellationRate' => 4.2,
        ];

        return $this->render('admin/dashboard.html.twig', [
            'stats' => $stats,
        ]);
    }

    /**
     * Users management
     */
    #[Route('/users', name: 'admin_users')]
    public function users(Request $request): Response
    {
        $search = $request->query->get('search');
        $role = $request->query->get('role');
        $status = $request->query->get('status');

        // Fetch users from your repository with filters
        // $users = $this->userRepository->findByFilters($search, $role, $status);

        return $this->render('admin/users.html.twig', [
            // 'users' => $users,
            'active_users_count' => 6,
            'suspended_users_count' => 1,
        ]);
    }

    /**
     * Toggle user status (suspend/reactivate)
     */
    #[Route('/users/{id}/toggle-status', name: 'admin_user_toggle_status', methods: ['POST'])]
    public function toggleUserStatus(string $id, Request $request): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        if ($this->isCsrfTokenValid('toggle-status' . $id, $request->request->get('_token'))) {
            // Toggle user status logic here
            // $user = $this->userRepository->find($id);
            // $user->setStatus($user->getStatus() === 'active' ? 'suspended' : 'active');
            // $this->entityManager->flush();
            
            $this->addFlash('success', 'Le statut de l\'utilisateur a été mis à jour.');
        }

        return $this->redirectToRoute('admin_users');
    }

    /**
     * Services moderation
     */
    #[Route('/services', name: 'admin_services')]
    public function services(Request $request, ServiceRepository $serviceRepository): Response
    {
        $tab = $request->query->get('tab', 'all');
        $search = $request->query->get('search');
        $status = $request->query->get('status');

        // Fetch all services from database
        $services = $serviceRepository->findAll();
        
        // Transform services to match template expectations
        $servicesData = array_map(function($service) {
            $category = $service->getCategory();
            return [
                'id' => $service->getId(),
                'title' => $service->getName(),
                'description' => $service->getDescription(),
                'hostName' => $service->getHost() ? $service->getHost()->getName() : 'Unknown',
                'price' => $service->getBasePrice(),
                'location' => $service->getLocation() ?? 'Non spécifié',
                'status' => $service->getIsActive() ? 'approved' : 'pending',
                'rating' => 0, // TODO: Add rating system
                'reportsCount' => 0, // TODO: Add reports count
                'bookingsCount' => 0, // TODO: Add bookings count
                'images' => $service->getImageName() ? ['/uploads/service_images/' . $service->getImageName()] : [],
                'image' => $service->getImageName() ? '/uploads/service_images/' . $service->getImageName() : null,
                'category' => $category ? [
                    'name' => $category->getName(),
                    'icon' => $category->getIcon() ?? 'fas fa-briefcase'
                ] : null,
            ];
        }, $services);

        return $this->render('admin/services.html.twig', [
            'services' => $servicesData,
            'pending_count' => count(array_filter($servicesData, fn($s) => $s['status'] === 'pending')),
            'reported_count' => 0, // TODO: Calculate from reports
        ]);
    }

    /**
     * Approve a service
     */
    #[Route('/services/{id}/approve', name: 'admin_service_approve', methods: ['POST'])]
    public function approveService(Service $service, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('approve' . $service->getId(), $request->request->get('_token'))) {
            $service->setIsActive(true);
            $em->flush();
            
            $this->addFlash('success', 'Le service a été approuvé.');
        }

        return $this->redirectToRoute('admin_services');
    }

    /**
     * Hide a service
     */
    #[Route('/services/{id}/hide', name: 'admin_service_hide', methods: ['POST'])]
    public function hideService(Service $service, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('hide' . $service->getId(), $request->request->get('_token'))) {
            $service->setIsActive(false);
            $em->flush();
            
            $this->addFlash('success', 'Le service a été masqué.');
        }

        return $this->redirectToRoute('admin_services');
    }

    /**
     * Tools moderation
     */
    #[Route('/tools', name: 'admin_tools')]
    public function tools(Request $request, ToolRepository $toolRepository): Response
    {
        $tab = $request->query->get('tab', 'all');
        $search = $request->query->get('search');
        $status = $request->query->get('status');

        // Fetch all tools from database
        $tools = $toolRepository->findAll();
        
        // Transform tools to match template expectations
        $toolsData = array_map(function($tool) {
            $category = $tool->getCategory();
            return [
                'id' => $tool->getId(),
                'name' => $tool->getName(),
                'description' => $tool->getDescription(),
                'hostName' => $tool->getHost() ? $tool->getHost()->getName() : 'Unknown',
                'pricePerDay' => $tool->getPricePerDay(),
                'stock' => $tool->getStockQuantity(),
                'location' => $tool->getLocation() ?? 'Non spécifié',
                'status' => $tool->getIsActive() ? 'available' : 'hidden',
                'reportsCount' => 0, // TODO: Add reports count
                'rentalsCount' => 0, // TODO: Add rentals count
                'images' => $tool->getImageName() ? ['/uploads/tool_images/' . $tool->getImageName()] : [],
                'image' => $tool->getImageName() ? '/uploads/tool_images/' . $tool->getImageName() : null,
                'category' => $category ? [
                    'name' => $category->getName(),
                    'icon' => $category->getIcon() ?? 'fas fa-wrench'
                ] : null,
            ];
        }, $tools);

        return $this->render('admin/tools.html.twig', [
            'tools' => $toolsData,
            'maintenance_count' => 0, // TODO: Calculate from status
            'reported_count' => 0, // TODO: Calculate from reports
        ]);
    }

    /**
     * Activate a tool
     */
    #[Route('/tools/{id}/activate', name: 'admin_tool_activate', methods: ['POST'])]
    public function activateTool(Tool $tool, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('activate' . $tool->getId(), $request->request->get('_token'))) {
            $tool->setIsActive(true);
            $em->flush();
            
            $this->addFlash('success', 'Le matériel a été activé.');
        }

        return $this->redirectToRoute('admin_tools');
    }

    /**
     * Hide a tool
     */
    #[Route('/tools/{id}/hide', name: 'admin_tool_hide', methods: ['POST'])]
    public function hideTool(Tool $tool, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('hide' . $tool->getId(), $request->request->get('_token'))) {
            $tool->setIsActive(false);
            $em->flush();
            
            $this->addFlash('success', 'Le matériel a été masqué.');
        }

        return $this->redirectToRoute('admin_tools');
    }

    /**
     * Bookings oversight
     */
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

    /**
     * Reports and fraud monitoring
     */
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

    /**
     * Resolve a report
     */
    #[Route('/reports/{id}/resolve', name: 'admin_report_resolve', methods: ['POST'])]
    public function resolveReport(string $id, Request $request): Response
    {
        if ($this->isCsrfTokenValid('resolve' . $id, $request->request->get('_token'))) {
            $this->addFlash('success', 'Le signalement a été résolu.');
        }

        return $this->redirectToRoute('admin_reports');
    }

    /**
     * Dismiss a report
     */
    #[Route('/reports/{id}/dismiss', name: 'admin_report_dismiss', methods: ['POST'])]
    public function dismissReport(string $id, Request $request): Response
    {
        if ($this->isCsrfTokenValid('dismiss' . $id, $request->request->get('_token'))) {
            $this->addFlash('success', 'Le signalement a été rejeté.');
        }

        return $this->redirectToRoute('admin_reports');
    }

    /**
     * Mark alert as read
     */
    #[Route('/alerts/{id}/mark-read', name: 'admin_alert_mark_read', methods: ['POST'])]
    public function markAlertRead(string $id, Request $request): Response
    {
        if ($this->isCsrfTokenValid('mark-read' . $id, $request->request->get('_token'))) {
            $this->addFlash('success', 'L\'alerte a été marquée comme lue.');
        }

        return $this->redirectToRoute('admin_reports');
    }

    /**
     * Analytics
     */
    #[Route('/analytics', name: 'admin_analytics')]
    public function analytics(Request $request): Response
    {
        $range = $request->query->get('range', '30d');

        return $this->render('admin/analytics.html.twig', [
            'range' => $range,
        ]);
    }

    /**
     * Settings
     */
    #[Route('/settings', name: 'admin_settings')]
    public function settings(): Response
    {
        return $this->render('admin/settings.html.twig');
    }

    /**
     * Update profile settings
     */
    #[Route('/settings/profile', name: 'admin_settings_profile', methods: ['POST'])]
    public function updateProfile(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-profile', $request->request->get('_token'))) {
            $this->addFlash('success', 'Votre profil a été mis à jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    /**
     * Update notification settings
     */
    #[Route('/settings/notifications', name: 'admin_settings_notifications', methods: ['POST'])]
    public function updateNotifications(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-notifications', $request->request->get('_token'))) {
            $this->addFlash('success', 'Vos préférences de notification ont été mises à jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    /**
     * Update password
     */
    #[Route('/settings/password', name: 'admin_settings_password', methods: ['POST'])]
    public function updatePassword(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-password', $request->request->get('_token'))) {
            $this->addFlash('success', 'Votre mot de passe a été mis à jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    /**
     * Update security settings
     */
    #[Route('/settings/security', name: 'admin_settings_security', methods: ['POST'])]
    public function updateSecurity(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-security', $request->request->get('_token'))) {
            $this->addFlash('success', 'Vos paramètres de sécurité ont été mis à jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    /**
     * Update platform settings
     */
    #[Route('/settings/platform', name: 'admin_settings_platform', methods: ['POST'])]
    public function updatePlatform(Request $request): Response
    {
        if ($this->isCsrfTokenValid('settings-platform', $request->request->get('_token'))) {
            $this->addFlash('success', 'Les paramètres de la plateforme ont été mis à jour.');
        }

        return $this->redirectToRoute('admin_settings');
    }

    /**
     * Show user details
     */
    #[Route('/users/{id}', name: 'admin_user_show')]
    public function showUser(string $id): Response
    {
        // Fetch user from repository
        // $user = $this->userRepository->find($id);
        
        return $this->render('admin/users.html.twig');
    }
}
