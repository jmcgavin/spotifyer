import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import type { LocalFileMetadata } from '../../types'

type Props = {
  data: LocalFileMetadata[]
}

export const TracksDataTable = ({ data }: Props) => {
  return (
    <TableContainer component={Paper} data-mui-color-scheme='light'>
      <Table size="small">
        <TableHead sx={{ backgroundColor: 'var(--mui-palette-primary-main)' }}>
          <TableRow>
            <TableCell></TableCell>
            <TableCell sx={{ color: 'var(--mui-palette-primary-contrastText)' }}><b>Title</b></TableCell>
            <TableCell sx={{ color: 'var(--mui-palette-primary-contrastText)' }}><b>Artist</b></TableCell>
            <TableCell sx={{ color: 'var(--mui-palette-primary-contrastText)' }}><b>Album</b></TableCell>
            <TableCell sx={{ color: 'var(--mui-palette-primary-contrastText)' }}><b>Year</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, id) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{id + 1}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.artist}</TableCell>
                <TableCell>{row.album}</TableCell>
                <TableCell>{row.year}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell colSpan={5} sx={{ textAlign: 'center', border: 0, padding: '12px' }}>
                No tracks selected
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
