<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\PositiveOrZero;

class SearchFilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('location', TextType::class , [
            'required' => false,
            'constraints' => [
                new Length(['max' => 100]),
            ],
        ])
            ->add('category', TextType::class , [
            'required' => false,
            'constraints' => [
                new Length(['max' => 50]),
            ],
        ])
            ->add('minPrice', IntegerType::class , [
            'required' => false,
            'constraints' => [
                new PositiveOrZero(),
            ],
        ])
            ->add('maxPrice', IntegerType::class , [
            'required' => false,
            'constraints' => [
                new PositiveOrZero(),
            ],
        ])
            ->add('guests', IntegerType::class , [
            'required' => false,
            'constraints' => [
                new PositiveOrZero(),
            ],
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'method' => 'GET',
            'csrf_protection' => false, // No CSRF for search forms normally
        ]);
    }

    public function getBlockPrefix(): string
    {
        return ''; // Allow field names like ?location= instead of ?search[location]=
    }
}
