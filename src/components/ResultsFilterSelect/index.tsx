import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Select, MenuItem } from '@mui/material'
import type { SpotifyTracksForLocalFile, MatchType } from '../../types'

type Props = {
  allResults: SpotifyTracksForLocalFile[]
  allSelections: SpotifyTracksForLocalFile[]
  selected: MatchType | 'all'
  onSelect: (resultsFilter: MatchType) => void
}

type GroupsType = {
  confident: SpotifyTracksForLocalFile[]
  likely: SpotifyTracksForLocalFile[]
  none: SpotifyTracksForLocalFile[]
}

const INITIAL_GROUPS = {
  confident: [],
  likely: [],
  none: []
}

const ColorBadge = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;

  &.confident {
    background-color: var(--mui-palette-success-main);
  }
  &.likely {
    background-color: var(--mui-palette-warning-main);
  }
  &.none {
    background-color: var(--mui-palette-error-main);
  }
`

export const ResultsFilterSelect = ({
  allResults,
  allSelections,
  selected,
  onSelect
}: Props) => {
  const [groupedResults, setGroupedResults] = useState<GroupsType>(INITIAL_GROUPS)
  const [groupedSelections, setGroupedSelections] = useState<GroupsType>(INITIAL_GROUPS)

  useMemo(() => {
    const results = allResults.reduce<GroupsType>((acc, curr) => {
      acc[curr.matchType].push(curr)
      return acc
    }, {
      confident: [],
      likely: [],
      none: []
    })

    setGroupedResults(results)
  }, [allResults])

  useMemo(() => {
    const results = allSelections.reduce<GroupsType>((acc, curr) => {
      acc[curr.matchType].push(curr)
      return acc
    }, {
      confident: [],
      likely: [],
      none: []
    })

    setGroupedSelections(results)
  }, [allSelections])

  return (
    <Select
      sx={{ minWidth: '230px' }}
      size='small'
      value={selected}
      onChange={(e) => onSelect(e.target.value as MatchType)}
    >
      <MenuItem value='all'>
        All results ({allSelections.length}/{allResults.length})
      </MenuItem>
      <MenuItem value='confident' disabled={!groupedResults.confident.length}>
        <ColorBadge className='confident'/>
        Confident match ({groupedSelections.confident.length}/{groupedResults.confident.length})</MenuItem>
      <MenuItem value='likely' disabled={!groupedResults.likely.length}>
        <ColorBadge className='likely'/>
        Likely match ({groupedSelections.likely.length}/{groupedResults.likely.length})
      </MenuItem>
      <MenuItem value='none' disabled={!groupedResults.none.length}>
        <ColorBadge className='none'/>
        No match ({groupedResults.none.length})
      </MenuItem>
    </Select>
  )
}
