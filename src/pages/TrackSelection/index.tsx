import { Dispatch, SetStateAction, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Tooltip } from '@mui/material'
import { LibraryMusic } from '@mui/icons-material'
import { ManageSearch } from '@mui/icons-material'

import { ROUTES } from '../../constants'
import { LocalFileMetadata } from '../../types'
import { parseFile } from '../../helpers'
import { PageHeader, TracksDataTable } from '../../components'

type Props = {
  data: LocalFileMetadata[]
  onSetData: Dispatch<SetStateAction<LocalFileMetadata[]>>
}

export const TrackSelection = ({ data, onSetData }: Props) => {
  const navigate = useNavigate()
  const inputFile = useRef<HTMLInputElement | null>(null)

  const handleInputFiles = async (files: FileList | File[] = []) => {
    const parsedData = []

    for (const file of files) {
      const metadata = await parseFile(file)
      parsedData.push(metadata)
    }

    onSetData(parsedData)
  }

  return (
    <>
      <PageHeader
        title="Select tracks"
        text="Select the tracks you would like to search for on Spotify."
        actions={[
          <Tooltip
            key="browseFiles"
            title={
              <>
                <b>Step 1</b>: {'Select your audio files.'}
              </>
            }
            arrow
            disableInteractive
          >
            <Button
              onClick={() => inputFile.current?.click()}
              variant="contained"
              color="secondary"
              startIcon={<LibraryMusic />}
            >
              Browse audio files
            </Button>
          </Tooltip>,
          <Tooltip
            key="searchSpotify"
            title={
              <>
                <b>Step 2</b>:{' '}
                {'Search Spotify for your audio files.'}
              </>
            }
            arrow
            disableInteractive
          >
            <span>
              <Button
                disabled={!data.length}
                onClick={() => navigate(ROUTES.SEARCH_RESULTS)}
                variant="contained"
                startIcon={<ManageSearch />}
              >
                Search Spotify
              </Button>
            </span>
          </Tooltip>
        ]}
      />

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <TracksDataTable data={data} onReceiveFiles={handleInputFiles} />

      <input
        style={{ display: 'none' }}
        ref={inputFile}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange={(e) => handleInputFiles(e.target.files || [])}
        type="file"
        accept="audio/*"
        multiple
      />
    </>
  )
}
