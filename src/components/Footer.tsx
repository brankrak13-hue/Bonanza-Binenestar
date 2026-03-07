
"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    const footerLinks = {
        [t('footer.nav')]: [
            { title: t('nav.home'), href: '/' },
            { title: t('nav.about'), href: '/#about' },
            { title: t('nav.contact'), href: '/#contact' },
        ],
        [t('nav.services')]: [
            { title: t('footer.menu'), href: '/servicios' },
            { title: t('nav.advisor'), href: '/agente-virtual' },
        ],
        [t('footer.legal')]: [
            { title: t('legal.terms.title'), href: '/terminos' },
            { title: t('legal.privacy.title'), href: '/privacidad' },
        ]
    };

    return (
        <footer className="bg-secondary border-t">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">{t('footer.newsletter')}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{t('footer.newsDesc')}</p>
                        <form className="flex gap-2">
                            <Input type="email" placeholder="Email" className="bg-background" />
                            <Button type="submit" variant="default">{t('footer.subscribe')}</Button>
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
                        {year && <p>&copy; {year} Bonanza {t('footer.rights')}</p>}
                    </div>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <a href="https://www.instagram.com/bonanzaarteybienestar/" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
