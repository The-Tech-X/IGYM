import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { MOCK_TRAINER_DETAILS, MOCK_TRAINERS } from '@/lib/mock-data';
import TrainerTransformations from '@/components/trainers/TrainerTransformations';
import GoldDivider from '@/components/ui/GoldDivider';

const TRAINER_FALLBACK =
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getTrainer(slug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('trainers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  return data;
}

// Generate metadata for each trainer
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trainer = (await getTrainer(slug)) ?? MOCK_TRAINER_DETAILS[slug];

  if (!trainer) {
    return {
      title: 'Trainer Not Found | IGYM',
    };
  }

  const bio = (trainer.bio ?? []) as string[];
  const specialties = (trainer.specialties ?? []) as string[];
  const description = bio.length > 0
    ? bio[0].slice(0, 160)
    : `${trainer.name} is a specialist in ${specialties.join(', ')} at IGYM.`;

  return {
    title: `${trainer.name} | Elite Coach | IGYM`,
    description,
    openGraph: {
      title: `${trainer.name} | Elite Coach | IGYM`,
      description,
      images: [trainer.image_url || TRAINER_FALLBACK],
    },
  };
}

// Generate static params for ISR/SSG
export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('trainers')
    .select('slug')
    .eq('is_active', true);

  if (data && data.length > 0) return data.map((t) => ({ slug: t.slug }));
  return MOCK_TRAINERS.map((t) => ({ slug: t.slug }));
}

export default async function TrainerPage({ params }: Props) {
  const { slug } = await params;
  const trainer = (await getTrainer(slug)) ?? MOCK_TRAINER_DETAILS[slug];

  if (!trainer) {
    notFound();
  }

  // Fetch transformations for this trainer and map DB -> component shape
  const supabase = createPublicClient();
  const { data: transformationsData } = await supabase
    .from('transformations')
    .select('*')
    .eq('trainer_id', trainer.id)
    .order('display_order', { ascending: true });

  const mappedTransformations = (transformationsData ?? []).map((t) => ({
    client: t.client_name,
    duration: t.duration,
    goal: t.goal,
    beforeImg: t.before_image_url ?? '',
    afterImg: t.after_image_url ?? '',
  }));

  const bio = (trainer.bio ?? []) as string[];
  const certifications = (trainer.certifications ?? []) as string[];
  const specialties = (trainer.specialties ?? []) as string[];
  const availability = (trainer.availability ?? []) as Array<{ day: string; hours: string }>;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919454694546';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20IGYM,%20I'd%20like%20to%20arrange%20a%20coaching%20consultation%20with%20${encodeURIComponent(
    trainer.name
  )}.`;

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: trainer.name,
    jobTitle: trainer.role,
    image: trainer.image_url || undefined,
    worksFor: { '@type': 'Organization', name: 'iGym' },
  };

  return (
    <div className="bg-white min-h-screen text-charcoal pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row relative">

        {/* LEFT PORTRAIT PANEL - Sticky on desktop (40% width) */}
        <div className="w-full lg:w-[40%] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 z-10 overflow-hidden bg-charcoal-mid">
          <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-full">
            <Image
              src={trainer.image_url ?? TRAINER_FALLBACK}
              alt={trainer.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* RIGHT INFO PANEL - Scrolls on desktop (60% width) */}
        <div className="w-full lg:w-[60%] px-6 md:px-12 lg:px-20 py-12 md:py-16 flex flex-col space-y-10">

          {/* Header */}
          <div>
            <span className="text-[11px] font-body uppercase tracking-[0.2em] text-gold font-medium block mb-2">
              {trainer.specialty_eyebrow}
            </span>
            <h1 className="text-[40px] md:text-[64px] font-display font-light text-charcoal leading-none mb-3">
              {trainer.name}
            </h1>
            <p className="text-[14px] md:text-[16px] font-body uppercase tracking-[0.1em] text-gray-muted font-normal">
              {trainer.role}
            </p>
          </div>

          <GoldDivider className="my-2" />

          {/* Biography */}
          <div className="space-y-6 text-[16px] font-body font-light text-charcoal-mid leading-relaxed">
            {bio.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Certifications Section */}
          <div className="space-y-4">
            <span className="text-[11px] font-body uppercase tracking-[0.2em] text-gold font-medium block">
              CERTIFICATIONS
            </span>
            <ul className="space-y-3">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex items-start text-[14px] font-body font-light text-charcoal-mid">
                  <span className="text-gold mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties Section */}
          <div className="space-y-4">
            <span className="text-[11px] font-body uppercase tracking-[0.2em] text-gold font-medium block">
              SPECIALTIES
            </span>
            <div className="flex flex-wrap gap-2.5">
              {specialties.map((spec, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-beige-light border border-beige-dark text-charcoal text-[11px] font-body uppercase tracking-wider font-light"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Availability Section */}
          <div className="space-y-4">
            <span className="text-[11px] font-body uppercase tracking-[0.2em] text-gold font-medium block">
              AVAILABILITY
            </span>
            <div className="border border-beige-dark overflow-hidden">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {availability.map((avail, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-beige-light/40' : 'bg-white'}>
                      <td className="py-3 px-4 font-body text-[13px] font-semibold text-charcoal w-1/3">
                        {avail.day}
                      </td>
                      <td className="py-3 px-4 font-body text-[13px] font-light text-charcoal-mid">
                        {avail.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-5 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors duration-300 text-[12px] font-body uppercase tracking-[0.2em] font-medium rounded-none cursor-pointer"
            >
              Arrange a Session
            </a>
          </div>

          {/* Transformations Section */}
          {mappedTransformations.length > 0 && (
            <TrainerTransformations transformations={mappedTransformations} />
          )}

        </div>

      </div>
    </div>
  );
}
