"use client"

import { FileText } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PDFFileCardProps {
  fileName: string
}

export default function PDFFileCard({ fileName }: PDFFileCardProps) {
  return (
    <Card
      className="flex items-center px-1 overflow-hidden max-w-md cursor-pointer hover:border-gray-300 transition-shadow"
    >
      <div className="bg-red-600 p-4 flex items-center justify-center rounded-md h-16 w-16 shrink-0">
        <FileText className="h-8 w-8 text-white" />
      </div>

      <div className="p-4 overflow-hidden">
        <h3 className="font-medium text-sm truncate">{fileName}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs uppercase font-semibold text-gray-500">PDF</span>
        </div>
      </div>
    </Card>
  )
}
