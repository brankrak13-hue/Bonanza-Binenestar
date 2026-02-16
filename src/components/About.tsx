import Image from "next/image";
import { getPlaceholderImage } from "@/lib/images";

export default function About() {
  const image = getPlaceholderImage("about-us");
  return (
    <section id="about" className="bg-white py-16 sm:py-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="animate-fadeIn">
            <div className="hover-zoom aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={image.description}
                width={600}
                height={800}
                className="object-cover w-full h-full"
                data-ai-hint={image.imageHint}
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm tracking-widest uppercase text-primary animate-slideIn" style={{ animationDelay: '100ms' }}>
              Nuestra Fundadora
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold my-4 text-gray-900 animate-slideIn" style={{ animationDelay: '200ms' }}>
              Conoce a Bonanza
            </h2>
            <p className="text-gray-600 max-w-md mx-auto md:mx-0 leading-relaxed animate-slideIn mb-6" style={{ animationDelay: '300ms' }}>
              Con una pasión por el bienestar integral y años de estudio en técnicas de sanación ancestrales, Bonanza fundó este espacio como un refugio para el alma. Su misión es guiarte en un viaje de autodescubrimiento y sanación, combinando el arte del tacto con el poder de la vibración.
            </p>
             <p className="text-gray-600 max-w-md mx-auto md:mx-0 leading-relaxed animate-slideIn" style={{ animationDelay: '400ms' }}>
              "Creemos que la verdadera belleza emana de un estado de equilibrio interior. Nuestro propósito es ayudarte a encontrarlo."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
