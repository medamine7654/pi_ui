<?php

namespace App\Entity;

use App\Repository\LogementRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: LogementRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Logement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Title is required")]
    #[Assert\Length(
        min: 5,
        max: 255,
        minMessage: "Title must be at least {{ limit }} characters long",
        maxMessage: "Title cannot be longer than {{ limit }} characters"
    )]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank(message: "Description is required")]
    #[Assert\Length(
        min: 20,
        minMessage: "Description must be at least {{ limit }} characters long"
    )]
    private ?string $description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Assert\NotBlank(message: "Price is required")]
    #[Assert\Positive(message: "Price must be positive")]
    private ?string $price = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Address is required")]
    private ?string $address = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: "City is required")]
    private ?string $city = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: "Country is required")]
    private ?string $country = null;

    #[ORM\Column]
    private ?int $capacity = 1;

    #[ORM\Column]
    private ?int $bedrooms = 1;

    #[ORM\Column]
    private ?int $bathrooms = 1;

    /**
     * Store image URLs instead of BLOB (as per requirements)
     */
    #[ORM\Column(type: Types::JSON)]
    private array $imageUrls = [];

    #[ORM\Column]
    private ?bool $isAvailable = true;

    #[ORM\Column]
    private ?bool $isApproved = true;

    #[ORM\Column]
    private ?bool $isReported = false;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $reportReason = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'logements')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

    #[ORM\ManyToOne(inversedBy: 'logements')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $host = null;

    #[ORM\OneToMany(targetEntity: Reservation::class, mappedBy: 'logement')]
    private Collection $reservations;

    #[ORM\OneToMany(targetEntity: Review::class, mappedBy: 'logement')]
    private Collection $reviews;

    #[ORM\Column(type: Types::DECIMAL, precision: 9, scale: 6, nullable: true)]
    private ?string $latitude = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 9, scale: 6, nullable: true)]
    private ?string $longitude = null;

    public function __construct()
    {
        $this->reservations = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters and Setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;
        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;
        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): static
    {
        $this->country = $country;
        return $this;
    }

    public function getCapacity(): ?int
    {
        return $this->capacity;
    }

    public function setCapacity(int $capacity): static
    {
        $this->capacity = $capacity;
        return $this;
    }

    public function getBedrooms(): ?int
    {
        return $this->bedrooms;
    }

    public function setBedrooms(int $bedrooms): static
    {
        $this->bedrooms = $bedrooms;
        return $this;
    }

    public function getBathrooms(): ?int
    {
        return $this->bathrooms;
    }

    public function setBathrooms(int $bathrooms): static
    {
        $this->bathrooms = $bathrooms;
        return $this;
    }

    public function getImageUrls(): array
    {
        return $this->imageUrls;
    }

    public function setImageUrls(array $imageUrls): static
    {
        $this->imageUrls = $imageUrls;
        return $this;
    }

    public function addImageUrl(string $imageUrl): static
    {
        if (!in_array($imageUrl, $this->imageUrls, true)) {
            $this->imageUrls[] = $imageUrl;
        }
        return $this;
    }

    public function removeImageUrl(string $imageUrl): static
    {
        if (($key = array_search($imageUrl, $this->imageUrls, true)) !== false) {
            unset($this->imageUrls[$key]);
            $this->imageUrls = array_values($this->imageUrls);
        }
        return $this;
    }

    public function isAvailable(): ?bool
    {
        return $this->isAvailable;
    }

    public function setAvailable(bool $isAvailable): static
    {
        $this->isAvailable = $isAvailable;
        return $this;
    }

    public function isApproved(): ?bool
    {
        return $this->isApproved;
    }

    public function setApproved(bool $isApproved): static
    {
        $this->isApproved = $isApproved;
        return $this;
    }

    public function isReported(): ?bool
    {
        return $this->isReported;
    }

    public function setReported(bool $isReported): static
    {
        $this->isReported = $isReported;
        return $this;
    }

    public function getReportReason(): ?string
    {
        return $this->reportReason;
    }

    public function setReportReason(?string $reportReason): static
    {
        $this->reportReason = $reportReason;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;
        return $this;
    }

    public function getHost(): ?User
    {
        return $this->host;
    }

    public function setHost(?User $host): static
    {
        $this->host = $host;
        return $this;
    }

    /**
     * @return Collection<int, Reservation>
     */
    public function getReservations(): Collection
    {
        return $this->reservations;
    }

    public function addReservation(Reservation $reservation): static
    {
        if (!$this->reservations->contains($reservation)) {
            $this->reservations->add($reservation);
            $reservation->setLogement($this);
        }
        return $this;
    }

    public function removeReservation(Reservation $reservation): static
    {
        if ($this->reservations->removeElement($reservation)) {
            // set the owning side to null (unless already changed)
            if ($reservation->getLogement() === $this) {
                $reservation->setLogement(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): static
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setLogement($this);
        }
        return $this;
    }

    public function removeReview(Review $review): static
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getLogement() === $this) {
                $review->setLogement(null);
            }
        }
        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(?string $latitude): static
    {
        $this->latitude = $latitude;
        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(?string $longitude): static
    {
        $this->longitude = $longitude;
        return $this;
    }

    // Helper methods
    public function getFullLocation(): string
    {
        return $this->city . ', ' . $this->country;
    }

    public function getFirstImageUrl(): ?string
    {
        return $this->imageUrls[0] ?? null;
    }

    public function getAverageRating(): float
    {
        if ($this->reviews->count() === 0) {
            return 0.0;
        }

        $total = 0;
        foreach ($this->reviews as $review) {
            $total += $review->getRating();
        }

        return round($total / $this->reviews->count(), 1);
    }
}