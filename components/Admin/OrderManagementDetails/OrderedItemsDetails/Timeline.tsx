import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderTimelinesTypes } from '@/types/Admin/orders.types'
import { Clock } from 'lucide-react'
import React from 'react'

const Timeline = ({data}:{data:OrderTimelinesTypes[]}) => {
  return (
    <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />Timeline</CardTitle></CardHeader>
        <CardContent>
          {data.length === 0 ? <p className="text-sm text-muted-foreground">No history yet</p> : (
            <div className="space-y-3">
              {data.map(t => (
                <div key={t.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium capitalize">{t.status.replace(/_/g, " ")}</p>
                    {t.note && <p className="text-xs text-muted-foreground">{t.note}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
  )
}

export default Timeline