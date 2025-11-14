'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PagePreloader from '../../components/PagePreloader';

export default function TestPage() {
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  const pageContentRef = useRef<HTMLDivElement>(null)

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  const products = [
    {
      id: 1,
      name: 'Obsidian Watch',
      price: '$2,850',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
      category: 'Timepieces'
    },
    {
      id: 2,
      name: 'Carbon Fiber Cufflinks',
      price: '$485',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop&crop=center',
      category: 'Accessories'
    },
    {
      id: 3,
      name: 'Milano Leather Wallet',
      price: '$320',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop&crop=center',
      category: 'Leather Goods'
    },
    {
      id: 4,
      name: 'Titanium Fountain Pen',
      price: '$1,250',
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&h=600&fit=crop&crop=center',
      category: 'Writing Instruments'
    },
    {
      id: 5,
      name: 'Sapphire Ring',
      price: '$4,200',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center',
      category: 'Jewelry'
    },
    {
      id: 6,
      name: 'Cashmere Scarf',
      price: '$680',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop&crop=center',
      category: 'Textiles'
    }
  ];

  return (
    <>
      {!preloaderComplete && (
        <PagePreloader 
          pageName="Test" 
          onComplete={handlePreloaderComplete}
          pageContentRef={pageContentRef}
        />
      )}
      
      <div 
        ref={pageContentRef}
        style={{ 
          opacity: preloaderComplete ? 1 : 0,
          willChange: 'filter, transform, opacity'
        }}
      >
        <main className="bg-black min-h-screen text-white">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-8 py-4"
        >
          <div className="flex items-center space-x-12">
            <div className="font-light text-xl tracking-[0.15em]">LUXE</div>
            <div className="flex space-x-8 text-sm tracking-[0.2em] font-light">
              <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">COLLECTIONS</span>
              <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">HERITAGE</span>
              <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">ATELIER</span>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-8xl md:text-9xl font-extralight tracking-[0.1em] mb-8 leading-none">
              CRAFTED
              <br />
              <span className="font-light">EXCELLENCE</span>
            </h1>
            <p className="text-xl font-light tracking-[0.05em] text-white/80 max-w-2xl mx-auto leading-[1.6]">
              A curated collection of extraordinary objects, each piece meticulously selected for the discerning connoisseur.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Product Hero */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative h-[80vh] rounded-3xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&h=1000&fit=crop&crop=center"
              alt="Featured Watch"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-16 left-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <p className="text-sm font-light tracking-[0.2em] text-white/80 mb-4">FEATURED COLLECTION</p>
                <h2 className="text-5xl font-extralight tracking-[0.08em] mb-6 leading-[1.2]">Obsidian Series</h2>
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-10 py-4 text-sm font-light tracking-widest hover:bg-white/20 transition-all duration-300">
                  DISCOVER MORE
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-extralight tracking-[0.08em] mb-8 leading-[1.1]">
              CURATED COLLECTION
            </h2>
            <p className="text-lg font-light text-white/70 tracking-[0.03em] max-w-3xl mx-auto leading-[1.6]">
              Each piece represents the pinnacle of craftsmanship, selected for those who appreciate the extraordinary.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl mb-8 aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-light tracking-[0.15em] text-white/60 uppercase">
                    {product.category}
                  </p>
                  <h3 className="text-2xl font-light tracking-[0.03em] group-hover:text-white/80 transition-colors duration-300 leading-[1.3]">
                    {product.name}
                  </h3>
                  <p className="text-xl font-light tracking-[0.02em] text-white/90">
                    {product.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-extralight tracking-[0.08em] mb-8 leading-[1.2]">
              STAY INFORMED
            </h2>
            <p className="text-lg font-light text-white/70 tracking-[0.03em] mb-12 max-w-2xl mx-auto leading-[1.6]">
              Be the first to discover new arrivals and exclusive pieces from our curated collections.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border border-white/20 rounded-full px-8 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors duration-300"
              />
              <button className="bg-white text-black rounded-full px-10 py-4 text-sm font-light tracking-widest hover:bg-white/90 transition-colors duration-300">
                SUBSCRIBE
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-light tracking-wide mb-8">LUXE</h3>
              <p className="text-sm font-light text-white/70 leading-relaxed">
                Crafting extraordinary experiences through exceptional objects since 1952.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-light tracking-widest text-white/80 mb-6">COLLECTIONS</h4>
              <ul className="space-y-3 text-sm font-light text-white/60">
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Timepieces</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Jewelry</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Accessories</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Limited Edition</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light tracking-widest text-white/80 mb-6">SERVICES</h4>
              <ul className="space-y-3 text-sm font-light text-white/60">
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Concierge</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Authentication</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Customization</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Maintenance</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light tracking-widest text-white/80 mb-6">CONNECT</h4>
              <ul className="space-y-3 text-sm font-light text-white/60">
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Instagram</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Twitter</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">LinkedIn</li>
                <li className="hover:text-white/80 transition-colors duration-300 cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm font-light text-white/50">
              <p>&copy; 2024 LUXE. All rights reserved.</p>
              <div className="flex space-x-8 mt-4 md:mt-0">
                <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white/70 transition-colors duration-300 cursor-pointer">Terms of Service</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
    </div>
    </>
  );
}