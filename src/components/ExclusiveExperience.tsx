import Image from "next/image";
import { getPlaceholderImage } from "@/lib/images";

export default function ExclusiveExperience() {
  const image = getPlaceholderImage("exclusive-experience");
  return (
    <section id="spas" className="relative py-32 sm:py-48 bg-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          className="object-cover w-full h-full opacity-30"
          data-ai-hint={image.imageHint}
        />
      </div>
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm tracking-widest uppercase text-primary animate-fadeIn">
            Más allá de los productos
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold my-6 animate-fadeIn" style={{animationDelay: '200ms'}}>
            Experiencias Exclusivas
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed animate-fadeIn" style={{animationDelay: '400ms'}}>
            Descubre nuestros spas, servicios de consulta personalizados y eventos únicos que te transportarán al corazón del lujo y el bienestar de Bonanza.
          </p>
          <button className="btn-outline mt-10 animate-fadeIn" style={{animationDelay: '600ms'}}>
            Reservar una experiencia
          </button>
        </div>
      </div>
    </section>
  );
}
