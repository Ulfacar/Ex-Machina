import './partner.css'
import PartnerSidebar from '@/components/partner/PartnerSidebar'
import PartnerTopbar from '@/components/partner/PartnerTopbar'

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-app">
      <PartnerSidebar />
      <div className="p-main">
        <PartnerTopbar />
        {children}
      </div>
    </div>
  )
}
