<?php

require __DIR__.'/vendor/autoload.php';

use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;

(new Dotenv())->bootEnv(__DIR__.'/.env');

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();
$container = $kernel->getContainer();

$entityManager = $container->get('doctrine')->getManager();

// Nettoyer la base de données
$connection = $entityManager->getConnection();
$connection->executeStatement('DELETE FROM avis');
$connection->executeStatement('DELETE FROM reservation');
$connection->executeStatement('DELETE FROM logement');
$connection->executeStatement('DELETE FROM user');

// Hash simple pour les mots de passe (password123)
$hashedPassword = password_hash('password123', PASSWORD_BCRYPT);

// Créer les utilisateurs
$proprietaire = new App\Entity\User();
$proprietaire->setEmail('proprietaire@rentall.com');
$proprietaire->setNom('Dupont');
$proprietaire->setPrenom('Jean');
$proprietaire->setRoles(['ROLE_USER', 'ROLE_HOST']);
$proprietaire->setPassword($hashedPassword);
$entityManager->persist($proprietaire);

$locataire = new App\Entity\User();
$locataire->setEmail('locataire@rentall.com');
$locataire->setNom('Martin');
$locataire->setPrenom('Sophie');
$locataire->setRoles(['ROLE_USER']);
$locataire->setPassword($hashedPassword);
$entityManager->persist($locataire);

$locataire2 = new App\Entity\User();
$locataire2->setEmail('marie.dubois@rentall.com');
$locataire2->setNom('Dubois');
$locataire2->setPrenom('Marie');
$locataire2->setRoles(['ROLE_USER']);
$locataire2->setPassword($hashedPassword);
$entityManager->persist($locataire2);

$entityManager->flush();

// Créer les logements
$logement1 = new App\Entity\Logement();
$logement1->setTitre('Appartement moderne au centre-ville');
$logement1->setDescription('Magnifique appartement entièrement rénové situé en plein cœur de la ville. Idéal pour un séjour professionnel ou touristique. Proche de toutes commodités.');
$logement1->setAdresse('15 Rue de la République, Paris 75001');
$logement1->setPrixParNuit('120');
$logement1->setNombreChambres(2);
$logement1->setType('Appartement');
$logement1->setCapacite(4);
$logement1->setDisponible(true);
$logement1->setImage('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop');
$logement1->setProprietaire($proprietaire);
$entityManager->persist($logement1);

$logement2 = new App\Entity\Logement();
$logement2->setTitre('Villa avec piscine et jardin');
$logement2->setDescription('Superbe villa avec piscine privée et grand jardin arboré. Parfait pour des vacances en famille dans un cadre calme et verdoyant.');
$logement2->setAdresse('28 Avenue des Palmiers, Nice 06000');
$logement2->setPrixParNuit('250');
$logement2->setNombreChambres(4);
$logement2->setType('Villa');
$logement2->setCapacite(8);
$logement2->setDisponible(true);
$logement2->setImage('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop');
$logement2->setProprietaire($proprietaire);
$entityManager->persist($logement2);

$logement3 = new App\Entity\Logement();
$logement3->setTitre('Studio cosy près de la gare');
$logement3->setDescription('Charmant studio parfaitement équipé, idéal pour une personne. Situé à 5 minutes à pied de la gare, très pratique pour les déplacements.');
$logement3->setAdresse('42 Rue du Commerce, Lyon 69002');
$logement3->setPrixParNuit('65');
$logement3->setNombreChambres(1);
$logement3->setType('Studio');
$logement3->setCapacite(2);
$logement3->setDisponible(true);
$logement3->setImage('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop');
$logement3->setProprietaire($proprietaire);
$entityManager->persist($logement3);

$logement4 = new App\Entity\Logement();
$logement4->setTitre('Loft industriel avec terrasse');
$logement4->setDescription('Magnifique loft au style industriel avec une grande terrasse offrant une vue imprenable sur la ville. Espace lumineux et design.');
$logement4->setAdresse('8 Quai de la Loire, Bordeaux 33000');
$logement4->setPrixParNuit('180');
$logement4->setNombreChambres(3);
$logement4->setType('Loft');
$logement4->setCapacite(6);
$logement4->setDisponible(true);
$logement4->setImage('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop');
$logement4->setProprietaire($proprietaire);
$entityManager->persist($logement4);

$entityManager->flush();

// Créer des réservations
$reservation1 = new App\Entity\Reservation();
$reservation1->setLogement($logement1);
$reservation1->setLocataire($locataire);
$reservation1->setDateDebut(new \DateTime('2026-03-15'));
$reservation1->setDateFin(new \DateTime('2026-03-20'));
$reservation1->setMontantTotal('600');
$reservation1->setStatut('confirmee');
$reservation1->setDateCreation(new \DateTime('2026-02-01'));
$entityManager->persist($reservation1);

$reservation2 = new App\Entity\Reservation();
$reservation2->setLogement($logement2);
$reservation2->setLocataire($locataire2);
$reservation2->setDateDebut(new \DateTime('2026-04-10'));
$reservation2->setDateFin(new \DateTime('2026-04-17'));
$reservation2->setMontantTotal('1750');
$reservation2->setStatut('confirmee');
$reservation2->setDateCreation(new \DateTime('2026-02-05'));
$entityManager->persist($reservation2);

$reservation3 = new App\Entity\Reservation();
$reservation3->setLogement($logement3);
$reservation3->setLocataire($locataire);
$reservation3->setDateDebut(new \DateTime('2026-02-01'));
$reservation3->setDateFin(new \DateTime('2026-02-05'));
$reservation3->setMontantTotal('260');
$reservation3->setStatut('terminee');
$reservation3->setDateCreation(new \DateTime('2026-01-15'));
$entityManager->persist($reservation3);

$entityManager->flush();

// Créer des avis
$avis1 = new App\Entity\Avis();
$avis1->setReservation($reservation3);
$avis1->setNote(5);
$avis1->setCommentaire('Excellent séjour ! Le studio était impeccable et très bien situé. Je recommande vivement ce logement pour un court séjour à Lyon.');
$avis1->setDateCreation(new \DateTime('2026-02-06'));
$entityManager->persist($avis1);

$avis2 = new App\Entity\Avis();
$avis2->setReservation($reservation1);
$avis2->setNote(4);
$avis2->setCommentaire('Très bon appartement, bien équipé et propre. Seul petit bémol : un peu de bruit le soir, mais rien de rédhibitoire. Bon rapport qualité-prix.');
$avis2->setDateCreation(new \DateTime('2026-03-21'));
$entityManager->persist($avis2);

$entityManager->flush();

echo "✅ Fixtures chargées avec succès !\n";
echo "📊 Données créées :\n";
echo "   - 3 utilisateurs\n";
echo "   - 4 logements\n";
echo "   - 3 réservations\n";
echo "   - 2 avis\n";
