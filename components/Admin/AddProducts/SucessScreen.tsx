"use client"

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/Typography';
import React from 'react'

const SucessScreen = ({ handleReset }: { handleReset: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="text-5xl">✅</div>
      <Typography variant="h3">Product Created Successfully!</Typography>
      <Typography variant="body" className="text-muted-foreground">
        Your product has been saved.
      </Typography>
      <Button
        onClick={handleReset}>
        Create Another Product
      </Button>
    </div>
  )
}

export default SucessScreen