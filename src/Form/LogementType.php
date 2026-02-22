<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Logement;
use App\Repository\CategoryRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Positive;
use Vich\UploaderBundle\Form\Type\VichImageType;

class LogementType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Property Name',
                'constraints' => [
                    new NotBlank(),
                ],
                'attr' => ['class' => 'form-control']
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'required' => false,
                'attr' => ['class' => 'form-control', 'rows' => 4]
            ])
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'placeholder' => 'Select a category',
                'required' => true,
                'query_builder' => function (CategoryRepository $repository) {
                    return $repository->createQueryBuilder('c')
                        ->where('c.type = :type')
                        ->setParameter('type', 'logement')
                        ->orderBy('c.name', 'ASC');
                },
                'attr' => ['class' => 'form-control'],
                'constraints' => [
                    new NotBlank(message: 'Please select a category'),
                ],
            ])
            ->add('pricePerNight', NumberType::class, [
                'label' => 'Price per Night (€)',
                'constraints' => [
                    new NotBlank(),
                    new Positive(),
                ],
                'attr' => ['class' => 'form-control', 'step' => '0.01']
            ])
            ->add('address', TextType::class, [
                'label' => 'Address',
                'required' => false,
                'attr' => ['class' => 'form-control']
            ])
            ->add('city', TextType::class, [
                'label' => 'City',
                'required' => false,
                'attr' => ['class' => 'form-control']
            ])
            ->add('country', TextType::class, [
                'label' => 'Country',
                'required' => false,
                'attr' => ['class' => 'form-control']
            ])
            ->add('numberOfRooms', IntegerType::class, [
                'label' => 'Number of Rooms',
                'required' => false,
                'attr' => ['class' => 'form-control', 'min' => 0]
            ])
            ->add('numberOfBeds', IntegerType::class, [
                'label' => 'Number of Beds',
                'required' => false,
                'attr' => ['class' => 'form-control', 'min' => 0]
            ])
            ->add('numberOfBathrooms', IntegerType::class, [
                'label' => 'Number of Bathrooms',
                'required' => false,
                'attr' => ['class' => 'form-control', 'min' => 0]
            ])
            ->add('maxGuests', IntegerType::class, [
                'label' => 'Maximum Guests',
                'required' => false,
                'attr' => ['class' => 'form-control', 'min' => 1]
            ])
            ->add('squareMeters', IntegerType::class, [
                'label' => 'Square Meters',
                'required' => false,
                'attr' => ['class' => 'form-control', 'min' => 0]
            ])
            ->add('imageFile', VichImageType::class, [
                'required' => false,
                'allow_delete' => true,
                'delete_label' => 'Remove image',
                'download_uri' => false,
                'image_uri' => false,
                'label' => 'Property Image',
                'help' => 'Max 5MB. Formats: JPG, PNG, GIF',
                'attr' => ['class' => 'form-control']
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Logement::class,
        ]);
    }
}
