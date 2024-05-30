import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Paper
} from '@mui/material'
import styled from '@emotion/styled'
import type { SpotifyTracksForLocalFile } from '../../types'

type Props = {
  data: SpotifyTracksForLocalFile
  onSelect: (data: SpotifyTracksForLocalFile, checked: boolean) => void
  selected: boolean
  status: 'success' | 'warning' | 'error'
}

export const ResultDataTable = ({ data, onSelect, selected, status }: Props) => {

  const StyledTableRow = styled(TableRow)`
    & th:not(:last-child), & td:not(:last-child) {
      border-right: 1px solid var(--mui-palette-TableCell-border);
    }

    &.success th:first-of-type,
    &.success td:first-of-type {
      border-left: 8px solid var(--mui-palette-success-light);
    }

    &.warning th:first-of-type,
    &.warning td:first-of-type {
      border-left: 8px solid var(--mui-palette-warning-light);
    }

    &.error th:first-of-type,
    &.error td:first-of-type {
      border-left: 8px solid var(--mui-palette-error-light);
    }
  `

  return (
    <TableContainer component={Paper} data-mui-color-scheme='light'>
      <Table size="small">
        <TableHead>
          <StyledTableRow className={status}>
            <TableCell width={'120px'}>
              <Checkbox
                onChange={(_e, checked) => onSelect(data, checked)}
                checked={selected}
                disabled={status === 'error'}
                size='small'
              />
            </TableCell>
            <TableCell width={'40%'}><b>Title</b></TableCell>
            <TableCell width={'30%'}><b>Artist</b></TableCell>
            <TableCell width={'30%'}><b>Album</b></TableCell>
            <TableCell width={'80px'}><b>Year</b></TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow className={status}>
            <TableCell><b>Local</b></TableCell>
            <TableCell>{data.localFileMetadata.title}</TableCell>
            <TableCell>{data.localFileMetadata.artist}</TableCell>
            <TableCell>{data.localFileMetadata.album}</TableCell>
            <TableCell>{data.localFileMetadata.year}</TableCell>
          </StyledTableRow>
          {
            data.bestMatch ?
              <StyledTableRow className={status}>
                <TableCell sx={{ borderRight: '1px solid var(--mui-palette-TableCell-border)' }}>
                  <Link
                    href={data.spotifyTracks[data.bestMatch.index].external_url}
                    target='_blank'
                    rel='noreferrer'
                    underline='hover'
                  >
                    <b>Spotify</b>
                  </Link>
                </TableCell>
                <TableCell>{data.spotifyTracks[data.bestMatch.index].name}</TableCell>
                <TableCell>{data.spotifyTracks[data.bestMatch.index].artists.join(', ')}</TableCell>
                <TableCell>{data.spotifyTracks[data.bestMatch.index].album.name}</TableCell>
                <TableCell>{data.spotifyTracks[data.bestMatch.index].album.release_date}</TableCell>
              </StyledTableRow>
            :
            <StyledTableRow className={status}>
              <TableCell><b>Spotify</b></TableCell>
              <TableCell colSpan={4} sx={{ color: 'var(--mui-palette-text-disabled)' }}>No match found</TableCell>
            </StyledTableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}
