import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { restaurants } from '@/data/restaurants';
import { Clock, Bell, ShoppingBag, MapPin, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function LandingPage() {
  const featured = restaurants.slice(0, 3);
  return (
    <PageShell>
      <section className="relative overflow-hidden noise-bg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 -z-10 opacity-40"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-gold/5 blur-3xl"
          />
        </motion.div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-xs text-gold mb-6"
              >
                <Sparkles className="h-3 w-3" />
                Now in Beta
              </motion.span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
                Queue smarter, <span className="text-gold">dine better.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                No more standing in line. Join the queue remotely, get live updates, and we'll
                notify you when your table is ready.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/restaurants"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 transition"
                >
                  <MapPin className="h-4 w-4" />
                  Find restaurants
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:border-gold/40 transition font-medium"
                >
                  For restaurants
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent rounded-3xl blur-xl" />
              <div className="relative grid gap-4">
                {featured.map((restaurant, idx) => (
                  <motion.div
                    key={restaurant.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <RestaurantCard restaurant={restaurant} variant="compact" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Clock,
                title: 'Wait from anywhere',
                desc: 'Join the queue remotely and get real-time updates on your wait.',
              },
              {
                icon: Bell,
                title: 'Get notified',
                desc: "We'll alert you when your table is ready so you never miss a turn.",
              },
              {
                icon: ShieldCheck,
                title: 'No lost spots',
                desc: "Your place in line is guaranteed. Walk in when you're called.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex gap-4 p-6 rounded-2xl bg-card/30 border border-border/30"
              >
                <div className="h-12 w-12 rounded-xl bg-gold/10 grid place-items-center shrink-0">
                  <feature.icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold">Featured restaurants</h2>
            <p className="mt-2 text-muted-foreground">Join the queue at top-rated spots near you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 text-gold hover:underline font-medium"
            >
              View all restaurants <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-semibold">Ready to skip the line?</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Join thousands already using QueueTable to dine smarter.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/restaurants"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 transition"
            >
              <MapPin className="h-4 w-4" />
              Find a restaurant
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:border-gold/40 transition font-medium"
            >
              <ShoppingBag className="h-4 w-4" />
              Sign up free
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
