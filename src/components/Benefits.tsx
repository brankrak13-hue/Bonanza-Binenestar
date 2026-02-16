import { Hand, Heart, Leaf, Waves } from 'lucide-react';

const benefits = [
    {
        icon: Leaf,
        title: 'Ingredientes Naturales',
        description: 'Usamos solo productos orgánicos y de alta calidad.'
    },
    {
        icon: Hand,
        title: 'Terapeutas Expertos',
        description: 'Profesionales certificados con años de experiencia.'
    },
    {
        icon: Heart,
        title: 'Enfoque Holístico',
        description: 'Tratamos cuerpo, mente y espíritu como un todo.'
    },
    {
        icon: Waves,
        title: 'Ambiente Relajante',
        description: 'Un espacio diseñado para tu paz y tranquilidad.'
    }
]

export default function Benefits() {
    return (
        <section id="why-us" className="bg-secondary border-y">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-4 text-center md:text-left flex-col md:flex-row items-center md:items-start">
                            <div className="flex-shrink-0 mb-4 md:mb-0">
                                <benefit.icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold tracking-wider uppercase">{benefit.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
