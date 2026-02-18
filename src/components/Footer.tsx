"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { Instagram } from "lucide-react";

const footerLinks = {
    'Navegación': [
        { title: 'Inicio', href: '#home' },
        { title: 'Servicios', href: '/servicios' },
        { title: 'Sobre Nosotros', href: '#about' },
        { title: 'Contacto', href: '#contact' },
    ],
    'Servicios': [
        { title: 'Masaje Facial', href: '/servicios' },
        { title: 'Sound Healing', href: '#' },
        { title: 'Paquetes', href: '#' },
        { title: 'Tarjetas de Regalo', href: '#' },
    ],
    'Legal': [
        { title: 'Términos y Condiciones', href: '/terminos' },
        { title: 'Política de Privacidad', href: '/privacidad' },
    ]
};

const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/bonanzaarteybienestar/', icon: <Instagram className="h-5 w-5" /> },
]

export default function Footer() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-secondary border-t">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">Newsletter</h3>
                        <p className="text-sm text-muted-foreground mb-4">Recibe noticias y promociones especiales en tu correo.</p>
                        <form className="flex gap-2">
                            <Input type="email" placeholder="Tu dirección de e-mail" className="bg-background border-input focus:bg-white focus:border-primary focus:ring-primary" />
                            <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">Suscribir</Button>
                        </form>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title}>
                                <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">{title}</h3>
                                <ul className="mt-4 space-y-3">
                                    {links.map(link => (
                                        <li key={link.title}>
                                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                                {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="flex items-center gap-2 text-foreground">
                            <LotusIcon className="w-5 h-5 text-primary" />
                            <span className="font-headline text-xl font-semibold">BONANZA</span>
                        </Link>
                        {year && <p>&copy; {year} Bonanza Arte & Bienestar. Todos los derechos reservados.</p>}
                    </div>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        {socialLinks.map(link => (
                            <a key={link.name} href={link.href} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                                <span className="sr-only">{link.name}</span>
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
