import { Building, Zap, Shield, TreePine, FileText, MapPin, Home, Factory, Users, Briefcase } from "lucide-react"

export const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'infrastructure':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'housing':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'commercial':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'technology':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'safety':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'environment':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'regulation':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'planning':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'manufacturing':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'employment':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    default:
      return 'bg-orange-100 text-orange-800 border-orange-200'
  }
}

export const getCategoryIcon = (category: string, className: string = "h-3 w-3") => {
  switch (category?.toLowerCase()) {
    case 'infrastructure':
      return <Building className={className} />
    case 'housing':
      return <Home className={className} />
    case 'commercial':
      return <Briefcase className={className} />
    case 'technology':
      return <Zap className={className} />
    case 'safety':
      return <Shield className={className} />
    case 'environment':
      return <TreePine className={className} />
    case 'planning':
      return <MapPin className={className} />
    case 'manufacturing':
      return <Factory className={className} />
    case 'employment':
      return <Users className={className} />
    default:
      return <FileText className={className} />
  }
}

export const getCategoryPlaceholder = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'infrastructure':
      return '/placeholder-infrastructure.jpg'
    case 'housing':
      return '/placeholder-housing.jpg'
    case 'technology':
      return '/placeholder-tech.jpg'
    case 'safety':
      return '/placeholder-safety.jpg'
    case 'environment':
      return '/placeholder-environment.jpg'
    case 'planning':
      return '/placeholder-planning.jpg'
    default:
      return '/placeholder.jpg'
  }
}

export const getCategoryIconSVG = (category: string) => {
  const svgClass = "w-8 h-8 text-gray-400"
  const strokeWidth = "2"
  
  switch (category?.toLowerCase()) {
    case 'infrastructure':
      return `<svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`
    case 'housing':
      return `<svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`
    case 'technology':
      return `<svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`
    case 'safety':
      return `<svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`
    case 'environment':
      return `<svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`
    case 'planning':
      return `<svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><circle cx="12" cy="11" r="3"></circle></svg>`
    case 'manufacturing':
      return `<svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="M17.428 4.571A2 2 0 0120 6.571v12.857A2 2 0 0118 21.43H6a2 2 0 01-2-2V6.57a2 2 0 012.428-2L17.428 4.57z"></path></svg>`
    case 'employment':
      return `<svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`
    default:
      return `<svg class="${svgClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`
  }
} 