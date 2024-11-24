import { DragEvent, useRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import styled from '@emotion/styled'
import type { LocalFileMetadata } from '../../types'
import { msToHMS } from '../../helpers'

type Props = {
  data: LocalFileMetadata[]
  onReceiveFiles: (files: File[]) => void
}

const DropZone = styled(TableCell)`
  text-align: center;
  border: 0;
  padding: 96px 0;
  color: var(--mui-palette-text-disabled);

  &.active {
    background-color: var(--mui-palette-FilledInput-hoverBg);
  }
`

export const TracksDataTable = ({ data, onReceiveFiles }: Props) => {
  const dragText = 'Drag audio files here'
  const dropText = 'Release'
  const dropZoneRef = useRef<HTMLDivElement | null>(null)

  const dragEnter = (e: DragEvent) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('active')
      dropZoneRef.current.textContent = dropText
    }
  }

  const dragOver = (e: DragEvent) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('active')
      dropZoneRef.current.textContent = dropText
    }
  }

  const dragLeave = (e: DragEvent) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current?.classList.remove('active')
      dropZoneRef.current.textContent = dragText
    }
  }

  const drop = (e: DragEvent) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current?.classList.remove('active')

      const files = e.dataTransfer.files
      const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'))

      onReceiveFiles(audioFiles)
    }
  }

  return (
    <TableContainer component={Paper} data-mui-color-scheme='light' sx={{ flexGrow: 1 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: 'var(--mui-palette-primary-main)' }}>
          <TableRow>
            <TableCell></TableCell>
            <TableCell sx={{ color: 'var(--mui-palette-primary-contrastText)' }}><b>Title</b></TableCell>
            <TableCell sx={{ color: 'var(--mui-palette-primary-contrastText)' }}><b>Time</b></TableCell>
            <TableCell sx={{ color: 'var(--mui-palette-primary-contrastText)' }}><b>Artist</b></TableCell>
            <TableCell sx={{ color: 'var(--mui-palette-primary-contrastText)' }}><b>Album</b></TableCell>
            <TableCell sx={{ color: 'var(--mui-palette-primary-contrastText)' }}><b>Year</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, index) => (
              <TableRow key={row.id} sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.duration && msToHMS(row.duration)}</TableCell>
                <TableCell>{row.artist}</TableCell>
                <TableCell>{row.album}</TableCell>
                <TableCell>{row.year}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <DropZone
                ref={dropZoneRef}
                colSpan={6}
                onDragEnter={e => dragEnter(e)}
                onDragOver={e => dragOver(e)}
                onDragLeave={e => dragLeave(e)}
                onDrop={e => drop(e)}
              >
                {dragText}
              </DropZone>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
