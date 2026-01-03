export function SocialProof() {
  const companies = [
    { name: "ACME Corp", font: "font-serif tracking-widest" },
    { name: "Globex", font: "font-sans font-black tracking-tighter" },
    { name: "Soylent", font: "font-mono tracking-wide" },
    { name: "INITECH", font: "font-sans font-bold tracking-widest" },
    { name: "Massive", font: "font-serif font-bold" },
  ];

  return (
    <section className="py-20 border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
          Trusted by forward-thinking engineering teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {companies.map((company, index) => (
            <div
              key={index}
              className={`text-2xl md:text-3xl text-gray-800 ${company.font} cursor-default hover:text-orange-500 transition-colors duration-300`}
            >
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
