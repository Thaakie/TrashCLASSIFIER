import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Clock, ExternalLink, Search, Trash2, Navigation, Loader2, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface WasteBank {
  name: string
  city: string
  address: string
  phone: string
  hours: string
  types: string[]
  coordinates: string
  latLon: string // Added for unique keys
  isRealtime?: boolean
}

const STATIC_LOCATIONS: WasteBank[] = [
  {
    name: "Bank Sampah Bersinar",
    city: "Bandung",
    address: "Jl. Terusan Bojongsoang No.174, Baleendah, Bandung",
    phone: "+62 812-2222-3333",
    hours: "08:00 - 17:00",
    types: ["Plastik", "Kertas", "Logam", "Minyak Jelantah"],
    coordinates: "https://maps.google.com/?q=Bank+Sampah+Bersinar",
    latLon: "-6.9754,107.6391"
  },
  {
    name: "Bank Sampah Induk Jakarta Barat",
    city: "Jakarta",
    address: "Jl. Bambu Larangan No.3, Kalideres, Jakarta Barat",
    phone: "+62 21-5437-XXXX",
    hours: "09:00 - 16:00",
    types: ["Anorganik", "E-Waste", "Kardus"],
    coordinates: "https://maps.google.com/?q=Bank+Sampah+Induk+Jakarta+Barat",
    latLon: "-6.1512,106.7092"
  },
  {
    name: "Bank Sampah Surabaya",
    city: "Surabaya",
    address: "Jl. Ngagel Timur No.25, Gubeng, Surabaya",
    phone: "+62 31-502-XXXX",
    hours: "08:00 - 15:00",
    types: ["Plastik", "Logam", "Kaca"],
    coordinates: "https://maps.google.com/?q=Bank+Sampah+Surabaya",
    latLon: "-7.2824,112.7505"
  }
]

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [realtimeLocations, setRealtimeLocations] = useState<WasteBank[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNearbyBankSampah = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser Anda.")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      
      const query = `
        [out:json][timeout:25];
        (
          node["name"~"Sampah",i](around:20000, ${latitude}, ${longitude});
          node["name"~"TPS3R",i](around:20000, ${latitude}, ${longitude});
          node["amenity"="waste_transfer_station"](around:20000, ${latitude}, ${longitude});
          node["recycling_type"="centre"](around:20000, ${latitude}, ${longitude});
        );
        out body;
      `
      
      const instances = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.n.osmsurvey.org/api/interpreter"
      ]

      let success = false
      for (const instance of instances) {
        if (success) break
        
        try {
          const response = await fetch(`${instance}?data=${encodeURIComponent(query)}`)
          
          if (!response.ok) continue
          
          const data = await response.json()
          
          const mapped: WasteBank[] = data.elements.map((el: any) => ({
            name: el.tags.name || "Fasilitas Pengelolaan Sampah",
            city: el.tags["addr:city"] || "Sekitar Anda",
            address: el.tags["addr:full"] || el.tags["addr:street"] || "Lokasi terdeteksi via satelit",
            phone: el.tags.phone || el.tags["contact:phone"] || "Hubungi via Maps",
            hours: el.tags.opening_hours || "Cek di lokasi",
            types: ["Anorganik", "Recyclables"],
            latLon: `${el.lat || el.center?.lat},${el.lon || el.center?.lon}`,
            coordinates: `https://www.google.com/maps?q=${el.lat || el.center?.lat},${el.lon || el.center?.lon}`,
            isRealtime: true
          }))

          setRealtimeLocations(mapped)
          success = true
        } catch (err) {
          console.error(`Gagal pada server ${instance}:`, err);
        }
      }

      if (!success) {
        setError("Semua server satelit sedang sibuk. Mohon coba lagi.")
      }
      setLoading(false)
    }, (geoErr) => {
      setError("Izin lokasi ditolak atau GPS tidak aktif.");
      setLoading(false)
    })
  }

  const allLocations = [...realtimeLocations, ...STATIC_LOCATIONS]
  
  const filteredLocations = allLocations.filter(loc => 
    (loc.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (loc.city?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto px-8 py-10"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
        <div className="space-y-6 max-w-2xl text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
          >
            Geo-Discovery Engine
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-balance">
            Nearby <br />
            <span className="text-primary italic">Facilities.</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            Temukan Bank Sampah dan TPS3R terdekat secara instan di seluruh Indonesia.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button 
              onClick={fetchNearbyBankSampah}
              disabled={loading}
              className="flex items-center justify-center gap-4 px-8 py-4 bg-primary text-primary-foreground rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              {loading ? "Mencari..." : "Temukan Sekitar Saya"}
            </button>
          </div>
          
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-[10px] font-bold flex items-center justify-center lg:justify-start gap-2">
              <AlertCircle className="w-3 h-3" /> {error}
            </motion.p>
          )}
        </div>

        <div className="relative w-full lg:w-[350px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Cari kota atau nama..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-card border border-border focus:ring-4 ring-primary/5 outline-none transition-all font-bold text-sm placeholder:text-muted-foreground/40 shadow-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredLocations.map((loc, i) => (
            <motion.div
              key={loc.latLon + i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={`group relative p-8 rounded-[3rem] border shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col overflow-hidden ${
                loc.isRealtime ? 'bg-primary/5 border-primary/10' : 'bg-card border-border'
              }`}
            >
              {loc.isRealtime && (
                <div className="absolute top-6 right-8">
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-primary/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[7px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">LIVE</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 ${
                  loc.isRealtime ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}>
                  <Trash2 className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-1 mb-5">
                <span className="text-[9px] font-black uppercase tracking-wider opacity-60 text-primary">
                  {loc.city}
                </span>
                <h3 className="text-2xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {loc.name}
                </h3>
              </div>

              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-start gap-2.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary opacity-60" />
                  <p className="font-medium text-muted-foreground dark:text-foreground/70 leading-relaxed line-clamp-2">{loc.address}</p>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-primary opacity-60" />
                  <p className="font-bold text-muted-foreground dark:text-foreground/80">{loc.hours}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-8">
                {loc.types.map((type, j) => (
                  <span key={j} className="text-[8px] font-black uppercase tracking-wider px-3 py-1.5 bg-muted/50 border border-border/50 rounded-lg">
                    {type}
                  </span>
                ))}
              </div>

              <a 
                href={loc.coordinates} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2.5 font-black uppercase tracking-widest text-[9px] hover:scale-[1.02] active:scale-95 transition-all mt-auto shadow-lg shadow-primary/10"
              >
                Navigasi <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Locations
