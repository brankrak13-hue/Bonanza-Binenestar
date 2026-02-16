import { Truck, Gift, Package, Mail } from 'lucide-react';

const benefits = [
    {
        icon: Truck,
        title: 'Envío Gratuito',
        description: 'En pedidos superiores a 50€.'
    },
    {
        icon: Gift,
        title: 'Muestras de Lujo',
        description: 'Elige dos muestras con cada pedido.'
    },
    {
        icon: Package,
        title: 'Embalaje de Regalo',
        description: 'Presentación excepcional para tus regalos.'
    },
    {
        icon: Mail,
        title: 'Consulta Personalizada',
        description: 'Contacta a nuestros expertos en belleza.'
    }
]

export default function Benefits() {
    return (
        <section id="services" className="bg-gray-50 border-y">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <benefit.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold tracking-wider uppercase">{benefit.title}</h3>
                                <p className="mt-1 text-sm text-gray-600">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
