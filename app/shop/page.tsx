'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Diamond, Crown, Gift, Sparkles, Timer, Check, X,
  CreditCard, Smartphone, Building2, ChevronRight, Star,
  TrendingUp, Zap, Shield, ArrowLeft
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParticlesBackground, FloatingOrbs } from '@/components/particles'
import { Button } from '@/components/ui/button'
import { useUserStore, diamondPacks } from '@/lib/store'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const paymentMethods = [
  { id: 'payme', name: 'Payme', icon: '💳', color: 'from-blue-500 to-cyan-500' },
  { id: 'click', name: 'Click', icon: '📱', color: 'from-green-500 to-emerald-500' },
  { id: 'paynet', name: 'Paynet', icon: '🏦', color: 'from-purple-500 to-pink-500' },
  { id: 'uzum', name: 'Uzum Bank', icon: '🏛️', color: 'from-orange-500 to-red-500' },
]

export default function ShopPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [purchasedPack, setPurchasedPack] = useState<typeof diamondPacks[0] | null>(null)
  
  const { user, addDiamonds, isAuthenticated } = useUserStore()

  const handlePurchase = async () => {
    if (!selectedPack || !selectedPayment) return
    
    const pack = diamondPacks.find(p => p.id === selectedPack)
    if (!pack) return
    
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const totalDiamonds = pack.diamonds + pack.bonusDiamonds
    
    // Add diamonds to local store
    addDiamonds(totalDiamonds)

    // Sync diamonds to DB
    if (user) {
      fetch(`/api/users/${user.id}/diamonds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalDiamonds, type: 'purchase', description: pack.name }),
      }).catch(() => {})
    }

    setPurchasedPack(pack)
    setShowSuccess(true)
    setIsProcessing(false)
    setSelectedPack(null)
    setSelectedPayment(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' UZS'
  }

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />
      <FloatingOrbs />
      <Navbar />

      <main className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Diamond className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Diamond Shop</span>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Power Up Your Experience
            </motion.h1>
            <motion.p
              className="text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Purchase diamonds to unlock premium chapters, support translators, and customize your profile
            </motion.p>

            {/* Current Balance */}
            {isAuthenticated && user && (
              <motion.div
                className="inline-flex items-center gap-3 mt-6 px-6 py-3 rounded-2xl glass"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Diamond className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Current Balance</p>
                  <p className="text-xl font-bold text-yellow-400">{user.diamonds.toLocaleString()}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Exchange Rate Info */}
          <motion.div
            className="max-w-md mx-auto mb-12 p-4 rounded-xl bg-secondary/30 border border-border/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-muted-foreground">
              <span className="text-yellow-400 font-medium">100 Diamonds</span> = <span className="text-foreground font-medium">10,000 UZS</span>
            </p>
          </motion.div>

          {/* Diamond Packs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
            {diamondPacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                className={cn(
                  'relative rounded-2xl p-6 cursor-pointer transition-all',
                  'glass border-2',
                  selectedPack === pack.id 
                    ? 'border-primary glow-primary' 
                    : 'border-border/50 hover:border-primary/50',
                  pack.isLimited && 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPack(pack.id)}
              >
                {/* Badges */}
                <div className="absolute -top-3 left-4 flex gap-2">
                  {pack.isPopular && (
                    <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      Popular
                    </span>
                  )}
                  {pack.isLimited && (
                    <span className="px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium animate-pulse">
                      Limited
                    </span>
                  )}
                </div>

                {/* Discount Badge */}
                {pack.discount && (
                  <div className="absolute -top-2 -right-2">
                    <div className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-bold">
                      -{pack.discount}%
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="text-center pt-2">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center"
                    animate={selectedPack === pack.id ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Diamond className={cn(
                      'w-8 h-8 text-yellow-400',
                      pack.isLimited && 'animate-pulse'
                    )} />
                  </motion.div>

                  <h3 className="font-bold text-lg mb-1">{pack.name}</h3>
                  
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl font-bold text-yellow-400">
                      {pack.diamonds.toLocaleString()}
                    </span>
                  </div>
                  
                  {pack.bonusDiamonds > 0 && (
                    <div className="flex items-center justify-center gap-1 text-sm text-success mb-2">
                      <Gift className="w-4 h-4" />
                      +{pack.bonusDiamonds} bonus
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-border/50">
                    {pack.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(pack.originalPrice)}
                      </p>
                    )}
                    <p className="text-lg font-bold">{formatPrice(pack.price)}</p>
                  </div>

                  {pack.expiresAt && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-xs text-orange-400">
                      <Timer className="w-3 h-3" />
                      Expires soon
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedPack === pack.id && (
                  <motion.div
                    className="absolute top-3 right-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </motion.div>
                )}

                {/* Shimmer Effect */}
                {pack.isLimited && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: [-500, 500] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Payment Methods */}
          <AnimatePresence>
            {selectedPack && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4">Select Payment Method</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all',
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 hover:border-primary/50'
                        )}
                        onClick={() => setSelectedPayment(method.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-3xl mb-2">{method.icon}</div>
                        <p className="text-sm font-medium">{method.name}</p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Order Summary */}
                  {selectedPayment && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-xl bg-secondary/30 mb-6"
                    >
                      <h4 className="font-medium mb-3">Order Summary</h4>
                      {(() => {
                        const pack = diamondPacks.find(p => p.id === selectedPack)
                        if (!pack) return null
                        return (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{pack.name}</span>
                              <span>{pack.diamonds} diamonds</span>
                            </div>
                            {pack.bonusDiamonds > 0 && (
                              <div className="flex justify-between text-success">
                                <span>Bonus</span>
                                <span>+{pack.bonusDiamonds} diamonds</span>
                              </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-border/50 font-bold">
                              <span>Total</span>
                              <span>{formatPrice(pack.price)}</span>
                            </div>
                          </div>
                        )
                      })()}
                    </motion.div>
                  )}

                  <Button
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold py-6"
                    disabled={!selectedPayment || isProcessing}
                    onClick={handlePurchase}
                  >
                    {isProcessing ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Complete Purchase
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Secure payment processed by our trusted partners
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Benefits Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">What Can You Do With Diamonds?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                className="glass rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Crown className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Unlock Premium Chapters</h3>
                <p className="text-sm text-muted-foreground">
                  Access early releases and premium content from your favorite manga
                </p>
              </motion.div>

              <motion.div
                className="glass rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-success/20 flex items-center justify-center">
                  <Gift className="w-7 h-7 text-success" />
                </div>
                <h3 className="font-bold mb-2">Support Translators</h3>
                <p className="text-sm text-muted-foreground">
                  Directly support the translators who bring your favorite stories to life
                </p>
              </motion.div>

              <motion.div
                className="glass rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold mb-2">Customize Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Get exclusive avatar frames, badges, and profile themes
                </p>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && purchasedPack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative glass-strong rounded-2xl p-8 max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Animated Diamond Rain */}
              <div className="relative">
                <motion.div
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-500/30 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <Diamond className="w-12 h-12 text-yellow-400" />
                  </motion.div>
                </motion.div>

                {/* Floating diamonds */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-400"
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 0,
                      left: '50%',
                      top: '50%'
                    }}
                    animate={{ 
                      x: Math.cos(i * 60 * Math.PI / 180) * 80,
                      y: Math.sin(i * 60 * Math.PI / 180) * 80 - 40,
                      opacity: [0, 1, 0],
                    }}
                    transition={{ 
                      duration: 1.5, 
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <Diamond className="w-4 h-4" />
                  </motion.div>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-2">Purchase Complete!</h2>
              <p className="text-muted-foreground mb-6">
                You&apos;ve successfully purchased {purchasedPack.name}
              </p>

              <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 mb-6">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-400">
                  <Diamond className="w-6 h-6" />
                  +{(purchasedPack.diamonds + purchasedPack.bonusDiamonds).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {purchasedPack.bonusDiamonds > 0 && `(Includes ${purchasedPack.bonusDiamonds} bonus diamonds!)`}
                </p>
              </div>

              <Button
                className="w-full"
                onClick={() => setShowSuccess(false)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
