import styled from '@emotion/styled'
import { Select, MenuItem } from '@mui/material'
import type { ResultsCount, ResultsFilter } from '../../types'

type Props = {
  resultsCount: ResultsCount
  selected: string
  onSelect: (resultsFilter: ResultsFilter) => void
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
  resultsCount,
  selected,
  onSelect
}: Props) => {
  return (
    <Select
      sx={{ minWidth: '230px' }}
      size='small'
      value={selected}
      onChange={(e) => onSelect(e.target.value as ResultsFilter)}
    >
      <MenuItem value='all'>All results ({resultsCount.all})</MenuItem>
      <MenuItem value='confident' disabled={!resultsCount.confident}>
        <ColorBadge className='confident'/>
        Confident matches ({resultsCount.confident})</MenuItem>
      <MenuItem value='likely' disabled={!resultsCount.likely}>
        <ColorBadge className='likely'/>
        Likely matches ({resultsCount.likely})
      </MenuItem>
      <MenuItem value='none' disabled={!resultsCount.none}>
        <ColorBadge className='none'/>
        No matches ({resultsCount.none})
      </MenuItem>
    </Select>
  )
}
