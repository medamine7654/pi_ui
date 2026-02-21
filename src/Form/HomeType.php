<?php

namespace App\Form;

use App\Entity\Home;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Positive;
use Symfony\Component\Validator\Constraints\PositiveOrZero;

class HomeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Home Title',
                'constraints' => [
                    new NotBlank(),
                ],
                'attr' => ['class' => 'form-control', 'placeholder' => 'e.g., Cozy Apartment in City Center']
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'required' => false,
                'attr' => ['class' => 'form-control', 'rows' => 6, 'placeholder' => 'Describe your home, its unique features, and what guests can expect...']
            ])
            ->add('pricePerNight', NumberType::class, [
                'label' => 'Price per Night (€)',
                'constraints' => [
                    new NotBlank(),
                    new Positive(),
                ],
                'attr' => ['class' => 'form-control', 'step' => '0.01']
            ])
            ->add('maxGuests', IntegerType::class, [
                'label' => 'Maximum Guests',
                'constraints' => [
                    new NotBlank(),
                    new Positive(),
                ],
                'attr' => ['class' => 'form-control', 'min' => 1]
            ])
            ->add('bedrooms', IntegerType::class, [
                'label' => 'Bedrooms',
                'constraints' => [
                    new NotBlank(),
                    new PositiveOrZero(),
                ],
                'attr' => ['class' => 'form-control', 'min' => 0]
            ])
            ->add('beds', IntegerType::class, [
                'label' => 'Beds',
                'constraints' => [
                    new NotBlank(),
                    new Positive(),
                ],
                'attr' => ['class' => 'form-control', 'min' => 1]
            ])
            ->add('bathrooms', IntegerType::class, [
                'label' => 'Bathrooms',
                'constraints' => [
                    new NotBlank(),
                    new PositiveOrZero(),
                ],
                'attr' => ['class' => 'form-control', 'min' => 0]
            ])
            ->add('address', TextType::class, [
                'label' => 'Street Address',
                'constraints' => [
                    new NotBlank(),
                ],
                'attr' => ['class' => 'form-control']
            ])
            ->add('city', TextType::class, [
                'label' => 'City',
                'constraints' => [
                    new NotBlank(),
                ],
                'attr' => ['class' => 'form-control']
            ])
            ->add('postalCode', TextType::class, [
                'label' => 'Postal Code',
                'required' => false,
                'attr' => ['class' => 'form-control']
            ])
            ->add('country', TextType::class, [
                'label' => 'Country',
                'constraints' => [
                    new NotBlank(),
                ],
                'attr' => ['class' => 'form-control']
            ])
            ->add('amenities', ChoiceType::class, [
                'label' => 'Amenities',
                'choices' => [
                    'WiFi' => 'wifi',
                    'Kitchen' => 'kitchen',
                    'Washer' => 'washer',
                    'Dryer' => 'dryer',
                    'Air Conditioning' => 'ac',
                    'Heating' => 'heating',
                    'TV' => 'tv',
                    'Parking' => 'parking',
                    'Elevator' => 'elevator',
                    'Pool' => 'pool',
                    'Hot Tub' => 'hot_tub',
                    'Gym' => 'gym',
                    'BBQ Grill' => 'bbq',
                    'Fireplace' => 'fireplace',
                    'Smoke Detector' => 'smoke_detector',
                    'Carbon Monoxide Detector' => 'co_detector',
                    'First Aid Kit' => 'first_aid',
                    'Fire Extinguisher' => 'fire_extinguisher',
                ],
                'multiple' => true,
                'expanded' => true,
                'attr' => ['class' => 'grid grid-cols-2 md:grid-cols-3 gap-2']
            ])
            ->add('mainImage', FileType::class, [
                'label' => 'Main Image',
                'required' => false,
                'attr' => ['class' => 'form-control', 'accept' => 'image/*']
            ])
            ->add('additionalImages', FileType::class, [
                'label' => 'Additional Images',
                'required' => false,
                'multiple' => true,
                'attr' => ['class' => 'form-control', 'accept' => 'image/*']
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Home::class,
        ]);
    }
}