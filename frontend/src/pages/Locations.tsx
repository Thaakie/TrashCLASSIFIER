import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Clock, ExternalLink, Search, Trash2, Navigation, Loader2 } from 'lucide-react'
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
    console.log(">>> [LOG] Memulai pencarian lokasi sekitarmu...");
    
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser Anda.")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      console.log(`>>> [LOG] Koordinat ditemukan: ${latitude}, ${longitude}. Menghubungi satelit...`);
      
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
          console.log(`>>> [LOG] Mencoba server: ${new URL(instance).hostname}...`);
          const response = await fetch(`${instance}?data=${encodeURIComponent(query)}`)
          
          if (!response.ok) {
            console.warn(`>>> [WARN] Server ${new URL(instance).hostname} sibuk.`);
            continue
          }
          
          const data = await response.json()
          console.log(`>>> [LOG] Berhasil mendapatkan ${data.elements.length} lokasi dari ${new URL(instance).hostname}.`);
          
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
          console.error(`>>> [ERROR] Gagal pada server ${instance}:`, err);
        }
      }

      if (!success) {
        setError("Semua server satelit sedang sibuk. Mohon coba lagi dalam beberapa menit.")
      }
      setLoading(false)
      console.log(">>> [LOG] Proses selesai.");
    }, (geoErr) => {
      console.error(">>> [ERROR] Geolocation error:", geoErr);
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
      className="max-w-7xl mx-auto px-8 py-12"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full tracking-widest uppercase">
              Real-time Tracker
            </span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
            Waste Bank <br />
            <span className="text-primary italic">Nearby</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg">
            Gunakan satelit untuk menemukan Bank Sampah terdekat secara instan di seluruh Indonesia.
          </p>
          
          <button 
            onClick={fetchNearbyBankSampah}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
            {loading ? "Mencari Lokasi..." : "Cari di Sekitar Saya"}
          </button>
          
          {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Cari kota atau nama bank sampah..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:ring-2 ring-primary/20 outline-none transition-all font-bold"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredLocations.map((loc, i) => (
            <motion.div
              key={loc.latLon + i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className={`group relative p-8 rounded-[3rem] border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col overflow-hidden ${
                loc.isRealtime ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
              }`}
            >
              {loc.isRealtime && (
                <div className="absolute top-6 right-8">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">LIVE</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  loc.isRealtime ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  <Trash2 className="w-7 h-7" />
                </div>
                <span className="px-4 py-1.5 bg-muted text-[10px] font-black uppercase tracking-widest rounded-full">
                  {loc.city}
                </span>
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                {loc.name}
              </h3>

              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-1 shrink-0 text-primary" />
                  <p className="font-medium leading-relaxed line-clamp-2">{loc.address}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 shrink-0 text-primary" />
                  <p className="font-bold">{loc.phone}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0 text-primary" />
                  <p className="font-bold">{loc.hours}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {loc.types.map((type, j) => (
                  <span key={j} className="text-[9px] font-black uppercase tracking-wider px-3 py-1 bg-muted/50 border border-border rounded-lg">
                    {type}
                  </span>
                ))}
              </div>

              <a 
                href={loc.coordinates} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-auto shadow-lg shadow-primary/20"
              >
                Navigasi Ke Lokasi <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredLocations.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-20">
              <Search className="w-10 h-10" />
            </div>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-sm">Lokasi tidak ditemukan</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Locations
