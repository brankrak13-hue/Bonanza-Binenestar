import Image from "next/image";
import { getPlaceholderImage } from "@/lib/images";

const categories = [
    { name: "Perfume", image: getPlaceholderImage("category-perfume") },
    { name: "Maquillaje", image: getPlaceholderImage("category-makeup") },
    { name: "Tratamiento", image: getPlaceholderImage("category-skincare") },
    { name: "Spas", image: getPlaceholderImage("category-spas") },
]

export default function Categories() {
    return (
        <section id="perfume" className="py-16 sm:py-24 bg-white">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-semibold text-gray-900">Explora Nuestras Colecciones</h2>
                    <p className="mt-4 text-gray-600">Sumérgete en el universo Bonanza.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {categories.map((category, index) => (
                        <a href="#" key={category.name} className="group relative block aspect-[3/4] overflow-hidden rounded-lg shadow-lg category-card animate-fadeIn" style={{ animationDelay: `${index * 150}ms`}}>
                            <Image
                                src={category.image.imageUrl}
                                alt={category.image.description}
                                fill
                                className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                                data-ai-hint={category.image.imageHint}
                            />
                            <div className="category-overlay" />
                            <div className="absolute inset-0 flex items-end p-6">
                                <h3 className="text-2xl font-semibold text-white tracking-wider">{category.name}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
