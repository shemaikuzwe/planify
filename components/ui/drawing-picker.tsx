import React, { use } from 'react'
import { Card } from './card'
import { Drawing } from '@prisma/client'
import { Sheet, SheetContent, SheetTrigger } from './sheet'
import { Button } from './button'
import { PanelLeftClose } from 'lucide-react'

interface Props {
  drawingsPromise: Promise<Drawing[]>
}

export default function DrawingPicker({ drawingsPromise }: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const drawings = use(drawingsPromise)
  const favoriteDrawings = drawings.slice(0, 3)
  const recentDrawings = drawings
  return (
    <>
      {!isOpen ? (
        <Button className='w-fit' variant={"ghost"} onClick={() => setIsOpen(!isOpen)}>
        <PanelLeftClose  className='h-10 w-10'/>
      </Button>
      ):(
       <div className='ml-2'>
         <Card className="p-2">
        <div className="space-y-6">
          {/* Favorite Projects Section */}
          <div>
            <h2 className="text-sm font-medium mb-3 tracking-wide">Favorite Projects</h2>
            <div className="space-y-3">
              {favoriteDrawings.map((drawing) => (
                <div
                  key={drawing.id}
                  className="group cursor-pointer rounded-lg p-2"
                >
                  <h3 className="font-medium text-sm mb-1">
                    {drawing.name}
                  </h3>
                  <p className="text-xs leading-relaxed mb-2">{drawing.description}</p>
                  {/* {drawing.tags && (
                  <div className="flex gap-1 flex-wrap">
                    {drawing.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 hover:bg-gray-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )} */}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Section */}
          <div>
            <h2 className="text-sm font-medium mb-3 tracking-wide">Recent</h2>
            <div className="space-y-3">
              {recentDrawings.map((drawing) => (
                <div
                  key={drawing.id}
                  className="group cursor-pointer rounded-lg p-2"
                >
                  <h3 className="font-medium text-sm mb-1">
                    {drawing.name}
                  </h3>
                  <p className="text-xs leading-relaxed mb-2">{drawing.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
       </div>
      )}
    </>
  )
}