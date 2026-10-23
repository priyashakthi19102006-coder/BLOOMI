import React from 'react'
import type { WorldId } from '../../types/curriculum.types'
import { AmusementParkScene } from './AmusementParkScene'
import { FoodWorldScene } from './FoodWorldScene'
import { AnimalWorldScene } from './AnimalWorldScene'
import { SpaceWorldScene } from './SpaceWorldScene'

interface WorldSceneProps {
  worldId: WorldId | string
  className?: string
  animated?: boolean
}

export const WorldScene: React.FC<WorldSceneProps> = ({ worldId, className = 'w-full h-full', animated = true }) => {
  switch (worldId) {
    case 'writing':
    case 'amusement':
      return <AmusementParkScene className={className} animated={animated} />
    case 'speaking':
    case 'food':
      return <FoodWorldScene className={className} animated={animated} />
    case 'social':
    case 'animal':
      return <AnimalWorldScene className={className} animated={animated} />
    case 'visual':
    case 'space':
      return <SpaceWorldScene className={className} animated={animated} />
    default:
      return <AmusementParkScene className={className} animated={animated} />
  }
}
