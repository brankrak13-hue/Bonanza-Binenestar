import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const massages = [
    {
        title: "Purificación Sutil",
        subtitle: "Drenaje",
        description: "Movimientos suaves que ayudan a mover líquidos del cuerpo para reducir inflamación y dar una sensación de ligereza.",
        prices: [
            { price: 1100, duration: 90 },
            { price: 900, duration: 60 }
        ]
    },
    {
        title: "Fluidez Esencial",
        subtitle: "Sueco",
        description: "Movimientos suaves y continuos que ayudan a soltar la tensión y llevar al cuerpo a un estado de calma profunda.",
        prices: [
            { price: 800, duration: 60 },
            { price: 1000, duration: 90 }
        ]
    },
    {
        title: "Liberación de Tensión",
        subtitle: "Tejido Profundo",
        description: "Técnica profunda que trabaja zonas rígidas para relajar, revitalizar y volver a sentir un alivio de la tensión muscular.",
        prices: [
            { price: 1100, duration: 90 },
            { price: 900, duration: 60 }
        ]
    },
    {
        title: "Re-inicia tu Mente",
        subtitle: "Cráneo Facial",
        description: "Un tratamiento que llega a lo más profundo del cuerpo, ayudando a disolver tensiones arraigadas y devolviendo una sensación de descanso interno y renovación.",
        prices: [
            { price: 700, duration: 60 }
        ]
    },
    {
        title: "Despertar Vital",
        subtitle: "Quiromasaje",
        description: "Manos intuitivas que liberan emociones cristalizadas en la espalda y hombros, transformando el dolor en relajación por liberar la carga.",
        prices: [
            { price: 800, duration: 60 },
            { price: 1000, duration: 90 }
        ]
    },
    {
        title: "Moldea tu figura",
        subtitle: "Reductivo",
        description: "Masaje intenso que activa tu cuerpo, apoya la eliminación de líquidos y aporta una forma más definida.",
        prices: [
            { price: 900, duration: 60 }
        ]
    }
];


export default function MassageMenu() {
    return (
        <section id="massage-menu" className="py-16 sm:py-24 bg-white">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900">Menú de Masajes</h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Cada masaje es una experiencia única diseñada para restaurar tu equilibrio y bienestar. Elige el que más resuene contigo.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {massages.map((massage, index) => (
                        <Card key={index} className="flex flex-col bg-secondary/50">
                            <CardHeader>
                                <CardTitle className="text-2xl">{massage.title}</CardTitle>
                                <p className="text-sm uppercase tracking-wider text-primary">{massage.subtitle}</p>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-between">
                                <CardDescription className="mb-4 text-foreground/80">{massage.description}</CardDescription>
                                <div className="border-t border-border pt-4">
                                    {massage.prices.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center py-1">
                                            <span className="text-muted-foreground">{p.duration} min</span>
                                            <span className="font-semibold text-foreground">${p.price.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
