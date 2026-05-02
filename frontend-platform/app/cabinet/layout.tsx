import './cabinet.css'
import CabinetSidebar from '@/components/cabinet/CabinetSidebar'
import CabinetTopbar from '@/components/cabinet/CabinetTopbar'

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cab-app">
      <CabinetSidebar />
      <main className="cab-main">
        <CabinetTopbar />
        {children}
      </main>
    </div>
  )
}
