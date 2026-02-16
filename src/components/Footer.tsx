import Link from "next/link";
import { Star } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
    'Bonanza': [
        { title: 'La Maison', href: '#' },
        { title: 'Carreras', href: '#' },
        { title: 'Sostenibilidad', href: '#' },
    ],
    'Servicios': [
        { title: 'Contacto', href: '#' },
        { title: 'Preguntas Frecuentes', href: '#' },
        { title: 'Seguimiento de Pedido', href: '#' },
        { title: 'Nuestras Boutiques', href: '#' },
    ],
    'Legal': [
        { title: 'Términos y Condiciones', href: '#' },
        { title: 'Política de Privacidad', href: '#' },
        { title: 'Aviso Legal', href: '#' },
    ]
};

const socialLinks = [
    { name: 'Instagram', href: '#', icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c-4.068 0-4.542.018-6.136.09-1.595.072-2.686.348-3.638 1.298C1.595 4.336 1.32 5.43 1.248 7.02c-.072 1.596-.09 2.068-.09 6.136s.018 4.54.09 6.136c.072 1.595.348 2.686 1.298 3.638.95.95 2.043 1.226 3.638 1.298 1.596.072 2.068.09 6.136.09s4.54-.018 6.136-.09c1.595-.072 2.686-.348 3.638-1.298.95-.95 1.226-2.043 1.298-3.638.072-1.596.09-2.068.09-6.136s-.018-4.54-.09-6.136c-.072-1.595-.348-2.686-1.298-3.638C21.065 2.42 19.97 2.144 18.378 2.072 16.855 2.002 16.382 2 12.315 2zm0 1.62c4.002 0 4.444.016 6.018.086 1.48.068 2.292.33 2.88.92.586.588.85 1.4.918 2.88.07 1.574.086 2.016.086 6.018s-.016 4.444-.086 6.018c-.068 1.48-.33 2.292-.918 2.88-.588.586-1.4.85-2.88.918-1.574.07-2.016.086-6.018.086s-4.444-.016-6.018-.086c-1.48-.068-2.292-.33-2.88-.918-.586-.588-.85-1.4-.918-2.88-.07-1.574-.086-2.016-.086-6.018s.016-4.444.086-6.018c.068-1.48.33-2.292.918-2.88.588-.586 1.4-.85 2.88-.92 1.574-.07 2.016-.086 6.018-.086zM12 7.25a5.065 5.065 0 100 10.13 5.065 5.065 0 000-10.13zm0 8.51a3.445 3.445 0 110-6.89 3.445 3.445 0 010 6.89zm6.315-9.39a1.185 1.185 0 100 2.37 1.185 1.185 0 000-2.37z" clipRule="evenodd" /></svg> },
    { name: 'Facebook', href: '#', icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg> },
    { name: 'Twitter', href: '#', icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.5 20.33 8.79c0-.21 0-.42-.01-.62.84-.6 1.56-1.36 2.14-2.23z" /></svg> },
]

export default function Footer() {
    return (
        <footer id="maison" className="bg-white border-t">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-800 mb-4">Newsletter</h3>
                        <p className="text-sm text-gray-600 mb-4">Sé el primero en descubrir nuestras novedades y ofertas exclusivas.</p>
                        <form className="flex gap-2">
                            <Input type="email" placeholder="Tu dirección de e-mail" className="bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-primary" />
                            <Button type="submit" variant="default" className="bg-black hover:bg-gray-800 text-white">Suscribir</Button>
                        </form>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title}>
                                <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-800">{title}</h3>
                                <ul className="mt-4 space-y-3">
                                    {links.map(link => (
                                        <li key={link.title}>
                                            <Link href={link.href} className="text-sm text-gray-600 hover:text-primary transition-colors">
                                                {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="flex items-center">
                            <span className="font-headline text-xl font-semibold text-gray-900">BONANZA</span>
                            <Star className="w-4 h-4 ml-1.5 text-primary" fill="currentColor" />
                        </Link>
                        <p>&copy; {new Date().getFullYear()}. Todos los derechos reservados.</p>
                    </div>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        {socialLinks.map(link => (
                            <a key={link.name} href={link.href} className="text-gray-500 hover:text-primary transition-colors">
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
