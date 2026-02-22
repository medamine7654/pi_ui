<?php

namespace App\Controller\Host;

use App\Entity\Logement;
use App\Form\LogementType;
use App\Repository\LogementRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/host/logements')]
#[IsGranted('ROLE_HOST')]
class HostLogementController extends AbstractController
{
    #[Route('/', name: 'host_logements')]
    public function index(LogementRepository $logementRepository): Response
    {
        $logements = $logementRepository->findByHost($this->getUser());

        return $this->render('host/logements/index.html.twig', [
            'logements' => $logements,
        ]);
    }

    #[Route('/new', name: 'host_logement_new')]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $logement = new Logement();
        $form = $this->createForm(LogementType::class, $logement);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $logement->setHost($this->getUser());
            
            // Auto-approve if user is admin, otherwise needs approval
            if ($this->isGranted('ROLE_ADMIN')) {
                $logement->setIsActive(true);
                $this->addFlash('success', 'Logement created and published successfully!');
            } else {
                $logement->setIsActive(false);
                $this->addFlash('success', 'Logement created successfully! Waiting for admin approval.');
            }

            $em->persist($logement);
            $em->flush();

            return $this->redirectToRoute('host_logements');
        }

        return $this->render('host/logements/new.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}/edit', name: 'host_logement_edit')]
    public function edit(Logement $logement, Request $request, EntityManagerInterface $em): Response
    {
        if ($logement->getHost() !== $this->getUser()) {
            throw $this->createAccessDeniedException();
        }

        $form = $this->createForm(LogementType::class, $logement);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();

            $this->addFlash('success', 'Logement updated successfully!');
            return $this->redirectToRoute('host_logements');
        }

        return $this->render('host/logements/edit.html.twig', [
            'logement' => $logement,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}/delete', name: 'host_logement_delete', methods: ['POST'])]
    public function delete(Logement $logement, Request $request, EntityManagerInterface $em): Response
    {
        if ($logement->getHost() !== $this->getUser()) {
            throw $this->createAccessDeniedException();
        }

        if ($this->isCsrfTokenValid('delete'.$logement->getId(), $request->request->get('_token'))) {
            $em->remove($logement);
            $em->flush();

            $this->addFlash('success', 'Logement deleted successfully!');
        }

        return $this->redirectToRoute('host_logements');
    }
}
