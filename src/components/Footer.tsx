import Link from "next/link";
import { Flower2 as Lotus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
    'Navegación': [
        { title: 'Inicio', href: '#home' },
        { title: 'Servicios', href: '#services' },
        { title: 'Sobre Nosotros', href: '#about' },
        { title: 'Contacto', href: '#contact' },
    ],
    'Servicios': [
        { title: 'Masaje Facial', href: '#' },
        { title: 'Sound Healing', href: '#' },
        { title: 'Paquetes', href: '#' },
        { title: 'Tarjetas de Regalo', href: '#' },
    ],
    'Legal': [
        { title: 'Términos y Condiciones', href: '#' },
        { title: 'Política de Privacidad', href: '#' },
    ]
};

const socialLinks = [
    { name: 'Instagram', href: '#', icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c-4.068 0-4.542.018-6.136.09-1.595.072-2.686.348-3.638 1.298C1.595 4.336 1.32 5.43 1.248 7.02c-.072 1.596-.09 2.068-.09 6.136s.018 4.54.09 6.136c.072 1.595.348 2.686 1.298 3.638.95.95 2.043 1.226 3.638 1.298 1.596.072 2.068.09 6.136.09s4.54-.018 6.136-.09c1.595-.072 2.686-.348 3.638-1.298.95-.95 1.226-2.043 1.298-3.638.072-1.596.09-2.068.09-6.136s-.018-4.54-.09-6.136c-.072-1.595-.348-2.686-1.298-3.638C21.065 2.42 19.97 2.144 18.378 2.072 16.855 2.002 16.382 2 12.315 2zm0 1.62c4.002 0 4.444.016 6.018.086 1.48.068 2.292.33 2.88.92.586.588.85 1.4.918 2.88.07 1.574.086 2.016.086 6.018s-.016 4.444-.086 6.018c-.068 1.48-.33 2.292-.918 2.88-.588.586-1.4.85-2.88.918-1.574.07-2.016.086-6.018.086s-4.444-.016-6.018-.086c-1.48-.068-2.292-.33-2.88-.918-.586-.588-.85-1.4-.918-2.88-.07-1.574-.086-2.016-.086-6.018s.016-4.444.086-6.018c.068-1.48.33-2.292.918-2.88.588-.586 1.4-.85 2.88-.92 1.574-.07 2.016-.086 6.018-.086zM12 7.25a5.065 5.065 0 100 10.13 5.065 5.065 0 000-10.13zm0 8.51a3.445 3.445 0 110-6.89 3.445 3.445 0 010 6.89zm6.315-9.39a1.185 1.185 0 100 2.37 1.185 1.185 0 000-2.37z" clipRule="evenodd" /></svg> },
    { name: 'Facebook', href: '#', icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg> },
]

export default function Footer() {
    return (
        <footer id="contact" className="bg-secondary border-t">
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
                            <Lotus className="w-5 h-5 text-primary" />
                            <span className="font-headline text-xl font-semibold">BONANZA</span>
                        </Link>
                        <p>&copy; {new Date().getFullYear()} Bonanza Arte & Bienestar. Todos los derechos reservados.</p>
                    </div>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        {socialLinks.map(link => (
                            <a key={link.name} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
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
